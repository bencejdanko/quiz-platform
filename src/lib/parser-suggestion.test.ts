import { describe, it, expect } from 'vitest';
import { parseQuiz } from './parser';

describe('Quiz Suggestion Parser', () => {
    it('should parse quiz without frontmatter', async () => {
        const markdown = `What is 2+2?
- [x] 4
- [ ] 5

What is the capital of France?
- [x] Paris
- [ ] London`;

        const result = await parseQuiz(markdown, false);
        
        expect(result.title).toBe('Suggested Quiz');
        expect(result.slug).toMatch(/^suggested-quiz-\d+$/);
        expect(result.questions).toHaveLength(2);
        expect(result.questions[0].options[0].isCorrect).toBe(true);
    });

    it('should parse quiz with frontmatter', async () => {
        const markdown = `---
title: My Quiz
slug: my-quiz
authors: [testuser]
---

What is 2+2?
- [x] 4
- [ ] 5`;

        const result = await parseQuiz(markdown, false);
        
        expect(result.title).toBe('My Quiz');
        expect(result.slug).toBe('my-quiz');
        expect(result.authors).toEqual(['testuser']);
        expect(result.questions).toHaveLength(1);
    });

    it('should generate slug from title if slug is missing', async () => {
        const markdown = `---
title: Astronomy Basics
---

What is the closest planet?
- [x] Mercury
- [ ] Venus`;

        const result = await parseQuiz(markdown, false);
        
        expect(result.title).toBe('Astronomy Basics');
        expect(result.slug).toBe('astronomy-basics');
        expect(result.questions).toHaveLength(1);
    });

    it('should handle partial frontmatter', async () => {
        const markdown = `---
title: Test
---

Question?
- [x] Yes
- [ ] No`;

        const result = await parseQuiz(markdown, false);
        
        expect(result.title).toBe('Test');
        expect(result.slug).toBe('test');
        expect(result.questions).toHaveLength(1);
    });

    it('should handle multi-choice questions', async () => {
        const markdown = `Which are fruits?
- [x] Apple
- [x] Banana
- [ ] Carrot`;

        const result = await parseQuiz(markdown, false);
        
        expect(result.questions[0].options.filter((o: any) => o.isCorrect)).toHaveLength(2);
    });
});
