import { describe, it, expect, vi } from 'vitest';
import { getQuizBySlug } from './loader';

vi.mock('../data/quizzes.json', () => ({
    default: [
        { title: 'Quiz 1', slug: 'quiz-1', questions: [], tags: [] },
        { title: 'Quiz 2', slug: 'quiz-2', questions: [], tags: [] }
    ]
}));

describe('Loader', () => {
    it('should find a quiz by slug', async () => {
        const quiz = await getQuizBySlug('quiz-2');
        expect(quiz).toBeDefined();
        expect(quiz?.title).toBe('Quiz 2');
        expect(quiz?.slug).toBe('quiz-2');
    });

    it('should return undefined if quiz is not found', async () => {
        const quiz = await getQuizBySlug('non-existent');
        expect(quiz).toBeUndefined();
    });
});
