import { describe, it, expect } from 'vitest';
import { validateSubmission } from './api';
import type { CorrectnessMap } from './pipeline';

const mockMap: CorrectnessMap = {
    'math-quiz': {
        'q1-id': [1], // Only 2nd option correct
        'q2-id': [0, 2] // 1st and 3rd options correct
    },
    'text-quiz': {
        'q3-id': ['paris']
    }
};

describe('API Validation', () => {
    it('should validate text answers case-insensitively', () => {
        const submission = {
            quizSlug: 'text-quiz',
            answers: [
                { questionId: 'q3-id', textAnswer: 'Paris' }
            ]
        };
        const result = validateSubmission(mockMap, submission);
        expect(result.score).toBe(1);
        expect(result.results['q3-id']).toBe(true);
    });

    it('should fail wrong text answers', () => {
        const submission = {
            quizSlug: 'text-quiz',
            answers: [
                { questionId: 'q3-id', textAnswer: 'London' }
            ]
        };
        const result = validateSubmission(mockMap, submission);
        expect(result.score).toBe(0);
        expect(result.results['q3-id']).toBe(false);
    });
    it('should calculate score correctly for perfect submission', () => {
        const submission = {
            quizSlug: 'math-quiz',
            answers: [
                { questionId: 'q1-id', selectedIndices: [1] },
                { questionId: 'q2-id', selectedIndices: [0, 2] }
            ]
        };
        const result = validateSubmission(mockMap, submission);
        expect(result.score).toBe(2);
        expect(result.total).toBe(2);
        expect(result.results['q1-id']).toBe(true);
        expect(result.results['q2-id']).toBe(true);
    });

    it('should calculate score correctly for partial submission', () => {
        const submission = {
            quizSlug: 'math-quiz',
            answers: [
                { questionId: 'q1-id', selectedIndices: [0] }, // Wrong
                { questionId: 'q2-id', selectedIndices: [0, 2] } // Right
            ]
        };
        const result = validateSubmission(mockMap, submission);
        expect(result.score).toBe(1);
        expect(result.total).toBe(2);
        expect(result.results['q1-id']).toBe(false);
        expect(result.results['q2-id']).toBe(true);
    });

    it('should handle multi-choice partially correct as false', () => {
        const submission = {
            quizSlug: 'math-quiz',
            answers: [
                { questionId: 'q2-id', selectedIndices: [0] } // Missing one
            ]
        };
        const result = validateSubmission(mockMap, submission);
        expect(result.results['q2-id']).toBe(false);
    });

    it('should throw error for unknown quiz', () => {
        const submission = {
            quizSlug: 'ghost-quiz',
            answers: []
        };
        expect(() => validateSubmission(mockMap, submission)).toThrow(/unknown quiz/i);
    });

    it('should handle missing questions in submission', () => {
        const submission = {
            quizSlug: 'math-quiz',
            answers: [
                { questionId: 'q1-id', selectedIndices: [1] }
                // q2-id is missing
            ]
        };
        const result = validateSubmission(mockMap, submission);
        expect(result.score).toBe(1);
        expect(result.total).toBe(2);
        expect(result.results['q2-id']).toBe(false);
    });
});
