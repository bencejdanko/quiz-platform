import { describe, it, expect } from 'vitest';
import { parseQuiz } from './parser';
import { filterQuizzesByTags } from './loader';
import type { Quiz } from './parser';

describe('Quiz Tags Parsing', () => {
    it('should parse tags from frontmatter', async () => {
        const taggedQuiz = `---
title: Tagged Quiz
slug: tagged-quiz
tags: [math, calculus]
---
Question?
- [x] Yes
`;
        const result = await parseQuiz(taggedQuiz);
        expect(result.tags).toEqual(['math', 'calculus']);
    });

    it('should handle single tag in frontmatter', async () => {
        const singleTagQuiz = `---
title: Single Tag
slug: single-tag
tags: math
---
Question?
- [x] Yes
`;
        const result = await parseQuiz(singleTagQuiz);
        expect(result.tags).toEqual(['math']);
    });

    it('should return empty array if no tags are present', async () => {
        const noTagQuiz = `---
title: No Tag
slug: no-tag
---
Question?
- [x] Yes
`;
        const result = await parseQuiz(noTagQuiz);
        expect(result.tags).toEqual([]);
    });
});

describe('Quiz Filtering', () => {
    const quizzes = [
        { slug: 'q1', tags: ['math', 'easy'] },
        { slug: 'q2', tags: ['science', 'hard'] },
        { slug: 'q3', tags: ['math', 'hard'] },
    ] as Quiz[];

    it('should filter quizzes by a single tag', () => {
        const result = filterQuizzesByTags(quizzes, ['math']);
        expect(result.map(q => q.slug)).toEqual(['q1', 'q3']);
    });

    it('should filter quizzes by multiple tags (match all)', () => {
        const result = filterQuizzesByTags(quizzes, ['math', 'hard']);
        expect(result.map(q => q.slug)).toEqual(['q3']);
    });

    it('should return all quizzes if no tags are selected', () => {
        const result = filterQuizzesByTags(quizzes, []);
        expect(result).toEqual(quizzes);
    });

    it('should return empty if no matches', () => {
        const result = filterQuizzesByTags(quizzes, ['history']);
        expect(result).toEqual([]);
    });
});
