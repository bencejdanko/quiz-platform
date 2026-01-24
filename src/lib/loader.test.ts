import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getQuizBySlug } from './loader';
import * as fs from 'node:fs/promises';

vi.mock('node:fs/promises');

describe('Loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should find a quiz by slug', async () => {
        const mockFiles = ['quiz1.md', 'quiz2.md'];
        const mockQuiz1 = `---
title: Quiz 1
slug: quiz-1
---
Q1`;
        const mockQuiz2 = `---
title: Quiz 2
slug: quiz-2
---
Q2`;

        vi.mocked(fs.readdir).mockResolvedValue(mockFiles as any);
        vi.mocked(fs.readFile)
            .mockResolvedValueOnce(mockQuiz1)
            .mockResolvedValueOnce(mockQuiz2);

        const quiz = await getQuizBySlug('quiz-2');
        expect(quiz).toBeDefined();
        expect(quiz?.title).toBe('Quiz 2');
        expect(quiz?.slug).toBe('quiz-2');
    });

    it('should return undefined if quiz is not found', async () => {
        vi.mocked(fs.readdir).mockResolvedValue(['quiz1.md'] as any);
        vi.mocked(fs.readFile).mockResolvedValue(`---
title: Quiz 1
slug: quiz-1
---
Q1`);

        const quiz = await getQuizBySlug('non-existent');
        expect(quiz).toBeUndefined();
    });
});
