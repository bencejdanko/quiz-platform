import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SubmissionService } from './submission-service';
import type { D1Database, D1Result } from './db';

describe('SubmissionService', () => {
    let mockDB: D1Database;
    let service: SubmissionService;

    beforeEach(() => {
        const mockPrepare = vi.fn().mockReturnValue({
            bind: vi.fn().mockReturnThis(),
            all: vi.fn().mockResolvedValue({ results: [], success: true }),
            run: vi.fn().mockResolvedValue({ success: true }),
            first: vi.fn().mockResolvedValue(null),
        });

        mockDB = {
            prepare: mockPrepare,
            batch: vi.fn().mockResolvedValue([]),
            exec: vi.fn().mockResolvedValue({ count: 0, duration: 0 }),
        } as unknown as D1Database;

        service = new SubmissionService(mockDB);
    });

    it('should create a submission with answers', async () => {
        const userId = 'user-1';
        const request = {
            quizSlug: 'test-quiz',
            answers: [
                { questionId: 'q1', selectedIndices: [1] },
                { questionId: 'q2', textAnswer: 'hello' }
            ]
        };
        const result = {
            score: 1,
            total: 2,
            results: { 'q1': true, 'q2': false }
        };

        const submissionId = await service.createSubmission(userId, request, result);

        expect(submissionId).toBeDefined();
        expect(mockDB.batch).toHaveBeenCalled();
        const batchArgs = (mockDB.batch as any).mock.calls[0][0];
        // 1 for submission + 2 for answers = 3 statements
        expect(batchArgs.length).toBe(3);
    });

    it('should calculate question stats', async () => {
        const mockResults: D1Result = {
            results: [
                { questionId: 'q1', total: 10, correctCount: 5 },
                { questionId: 'q2', total: 10, correctCount: 8 }
            ],
            success: true,
            meta: {} as any
        };

        (mockDB.prepare('mock').all as any).mockResolvedValue(mockResults);

        const stats = await service.getQuestionStats('test-quiz');

        expect(stats['q1'].correctRate).toBe(0.5);
        expect(stats['q1'].totalSubmissions).toBe(10);
        expect(stats['q2'].correctRate).toBe(0.8);
    });

    it('should fetch public submissions', async () => {
        const mockResults: D1Result = {
            results: [
                { id: 's1', userId: 'u1', score: 2, total: 3, createdAt: '2023-01-01' }
            ],
            success: true,
            meta: {} as any
        };

        (mockDB.prepare('mock').all as any).mockResolvedValue(mockResults);

        const submissions = await service.getPublicSubmissions('test-quiz');

        expect(submissions.length).toBe(1);
        expect(submissions[0].id).toBe('s1');
    });

    it('should handle adaptable schemas (e.g. missing question ids)', async () => {
        const mockResults: D1Result = {
            results: [
                { questionId: 'q1', total: 10, correctCount: 5 }
                // q2 is missing because it's a new question with no submissions yet
            ],
            success: true,
            meta: {} as any
        };

        (mockDB.prepare('mock').all as any).mockResolvedValue(mockResults);

        const stats = await service.getQuestionStats('test-quiz');

        expect(stats['q1']).toBeDefined();
        expect(stats['q2']).toBeUndefined();
    });
});
