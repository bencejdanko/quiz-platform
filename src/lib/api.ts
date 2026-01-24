import type { CorrectnessMap } from './pipeline';

export interface SubmissionRequest {
    quizSlug: string;
    answers: Array<{
        questionId: string;
        selectedIndices?: number[];
        textAnswer?: string;
    }>;
}

export interface ValidationResult {
    score: number;
    total: number;
    results: Record<string, boolean>;
}

export function validateSubmission(map: CorrectnessMap, submission: SubmissionRequest): ValidationResult {
    const quizMap = map[submission.quizSlug];
    if (!quizMap) {
        throw new Error(`Unknown quiz: ${submission.quizSlug}`);
    }

    const questionIds = Object.keys(quizMap);
    const total = questionIds.length;
    let score = 0;
    const results: Record<string, boolean> = {};

    for (const questionId of questionIds) {
        const solution = quizMap[questionId];
        const submissionAnswer = submission.answers.find(a => a.questionId === questionId);
        
        if (!submissionAnswer) {
            results[questionId] = false;
            continue;
        }

        let isCorrect = false;

        if (Array.isArray(solution) && typeof solution[0] === 'number') {
            // Choice question
            const correctIndices = (solution as number[]).sort();
            const selectedIndices = (submissionAnswer.selectedIndices || []).sort();
            
            isCorrect = correctIndices.length === selectedIndices.length &&
                correctIndices.every((val, index) => val === selectedIndices[index]);
        } else if (Array.isArray(solution) && typeof solution[0] === 'string') {
            // Text question
            const correctAnswers = solution as string[];
            const submittedText = (submissionAnswer.textAnswer || '').trim().toLowerCase();
            isCorrect = correctAnswers.includes(submittedText);
        }

        if (isCorrect) {
            score++;
            results[questionId] = true;
        } else {
            results[questionId] = false;
        }
    }

    return {
        score,
        total,
        results
    };
}
