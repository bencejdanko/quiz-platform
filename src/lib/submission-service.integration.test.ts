import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SubmissionService } from './submission-service';
import { getDB } from './db';
import fs from 'node:fs';
import path from 'node:path';

describe('SubmissionService Integration', () => {
    const testDbPath = 'test-integration.db';
    let service: SubmissionService;

    beforeEach(async () => {
        // We use the exported getDB function
        const db = getDB({ runtime: null }); // Forces local fallback
        
        // Clear tables to ensure clean state
        await db.exec('DELETE FROM submission_answers');
        await db.exec('DELETE FROM submissions');
        
        service = new SubmissionService(db);
    });

    afterEach(() => {
        // Cleanup is tricky because getDB caches the instance.
        // In a real project, we'd have a factory or reset method.
    });

    it('should persist and retrieve submissions in the local database', async () => {
        const userId = 'integration-user@example.com';
        const request = {
            quizSlug: 'integration-quiz',
            answers: [
                { questionId: 'iq1', selectedIndices: [0] }
            ]
        };
        const result = {
            score: 1,
            total: 1,
            results: { 'iq1': true }
        };

        // 1. Create submission
        const id = await service.createSubmission(userId, request, result);
        expect(id).toBeDefined();

        // 2. Verify stats
        const stats = await service.getQuestionStats('integration-quiz');
        expect(stats['iq1']).toBeDefined();
        expect(stats['iq1'].totalSubmissions).toBe(1) ;
        expect(stats['iq1'].correctRate).toBe(1);

        // 3. Verify public listing
        const publicSubs = await service.getPublicSubmissions('integration-quiz');
        expect(publicSubs.length).toBe(1);
        expect(publicSubs[0].userId).toBe(userId);
    });
});
