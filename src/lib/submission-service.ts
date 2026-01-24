import type { D1Database } from './db';
import type { SubmissionRequest, ValidationResult } from './api';

export interface QuestionStats {
    questionId: string;
    correctRate: number;
    totalSubmissions: number;
}

export class SubmissionService {
    constructor(private db: D1Database) {}

    async createSubmission(userId: string, request: SubmissionRequest, result: ValidationResult) {
        const submissionId = crypto.randomUUID();
        
        // Use a transaction/batch for atomicity
        const statements = [
            this.db.prepare(
                'INSERT INTO submissions (id, userId, quizSlug, score, total) VALUES (?, ?, ?, ?, ?)'
            ).bind(submissionId, userId, request.quizSlug, result.score, result.total)
        ];

        for (const answer of request.answers) {
            const questionId = answer.questionId;
            const isCorrect = result.results[questionId] || false;
            const selectedIndices = answer.selectedIndices ? JSON.stringify(answer.selectedIndices) : null;
            const textAnswer = answer.textAnswer || null;

            statements.push(
                this.db.prepare(
                    'INSERT INTO submission_answers (id, submissionId, questionId, selectedIndices, textAnswer, isCorrect) VALUES (?, ?, ?, ?, ?, ?)'
                ).bind(crypto.randomUUID(), submissionId, questionId, selectedIndices, textAnswer, isCorrect ? 1 : 0)
            );
        }

        await this.db.batch(statements);
        return submissionId;
    }

    async getQuestionStats(quizSlug: string): Promise<Record<string, QuestionStats>> {
        const results = await this.db.prepare(`
            SELECT 
                questionId,
                COUNT(*) as total,
                SUM(CASE WHEN isCorrect = 1 THEN 1 ELSE 0 END) as correctCount
            FROM submission_answers sa
            JOIN submissions s ON sa.submissionId = s.id
            WHERE s.quizSlug = ?
            GROUP BY questionId
        `).bind(quizSlug).all<{ questionId: string; total: number; correctCount: number }>();

        const stats: Record<string, QuestionStats> = {};
        
        if (results.results) {
            for (const row of results.results) {
                stats[row.questionId] = {
                    questionId: row.questionId,
                    totalSubmissions: row.total,
                    correctRate: row.total > 0 ? row.correctCount / row.total : 0
                };
            }
        }

        return stats;
    }

    async getPublicSubmissions(quizSlug: string) {
        const results = await this.db.prepare(`
            SELECT 
                s.id,
                s.userId,
                s.score,
                s.total,
                s.createdAt
            FROM submissions s
            WHERE s.quizSlug = ?
            ORDER BY s.createdAt DESC
            LIMIT 200
        `).bind(quizSlug).all<{ id: string; userId: string; score: number; total: number; createdAt: string }>();

        return results.results || [];
    }

    async getPublicSubmissionsWithAnswers(quizSlug: string) {
        const submissions = await this.getPublicSubmissions(quizSlug);
        if (submissions.length === 0) return [];

        const submissionIds = submissions.map(s => s.id);
        
        // SQLite doesn't support arrays directly in IN clause with bindings easily for many values,
        // but for 50 it's fine to construct the string or use a bunch of ?
        // However, a better way is to just fetch all incorrect answers for the quiz slug and filter them.
        const answersResults = await this.db.prepare(`
            SELECT 
                sa.submissionId,
                sa.questionId,
                sa.selectedIndices,
                sa.textAnswer
            FROM submission_answers sa
            JOIN submissions s ON sa.submissionId = s.id
            WHERE s.quizSlug = ? AND sa.isCorrect = 0
        `).bind(quizSlug).all<{ submissionId: string; questionId: string; selectedIndices: string | null; textAnswer: string | null }>();

        const answersBySubmission = (answersResults.results || []).reduce((acc, curr) => {
            if (!acc[curr.submissionId]) acc[curr.submissionId] = [];
            acc[curr.submissionId].push({
                questionId: curr.questionId,
                selectedIndices: curr.selectedIndices ? JSON.parse(curr.selectedIndices) : null,
                textAnswer: curr.textAnswer
            });
            return acc;
        }, {} as Record<string, any[]>);

        return submissions.map(s => ({
            ...s,
            incorrectAnswers: answersBySubmission[s.id] || []
        }));
    }

    async getAllSubmissionCounts(): Promise<Record<string, number>> {
        const results = await this.db.prepare(`
            SELECT quizSlug, COUNT(*) as count
            FROM submissions
            GROUP BY quizSlug
        `).all<{ quizSlug: string; count: number }>();

        const counts: Record<string, number> = {};
        if (results.results) {
            for (const row of results.results) {
                counts[row.quizSlug] = row.count;
            }
        }
        return counts;
    }
}
