import { describe, it, expect } from 'vitest';
import { parseQuiz } from './parser';

const simpleQuiz = `---
title: Sample Quiz
slug: sample-quiz
---

Sample Quiz

- [ ] Option A
- [x] Option B
- [ ] Option C

How many planets are in the solar system?
- [ ] 7
- [x] 8
- [ ] 9
`;

describe('Markdown Quiz Parser', () => {
    it('should parse frontmatter correctly', async () => {
        const result = await parseQuiz(simpleQuiz);
        expect(result.title).toBe('Sample Quiz');
        expect(result.slug).toBe('sample-quiz');
    });

    it('should extract questions and options', async () => {
        const result = await parseQuiz(simpleQuiz);
        expect(result.questions).toHaveLength(2);
        
        expect(result.questions[0].text).toBe('Sample Quiz');
        expect(result.questions[0].options).toHaveLength(3);
        expect(result.questions[0].options[1].isCorrect).toBe(true);
        expect(result.questions[0].options[1].text).toBe('Option B');

        expect(result.questions[1].text).toBe('How many planets are in the solar system?');
        expect(result.questions[1].options[1].isCorrect).toBe(true);
        expect(result.questions[1].options[1].text).toBe('8');
    });

    it('should generate deterministic question IDs', async () => {
        const result1 = await parseQuiz(simpleQuiz);
        const result2 = await parseQuiz(simpleQuiz);
        
        expect(result1.questions[0].id).toBe(result2.questions[0].id);
        expect(result1.questions[0].id).toBeDefined();
        expect(typeof result1.questions[0].id).toBe('string');
    });

    it('should handle multi-choice questions', async () => {
        const multiChoiceQuiz = `---
title: Multi Choice
slug: multi-choice
---

Which are fruits?
- [x] Apple
- [x] Banana
- [ ] Carrot
`;
        const result = await parseQuiz(multiChoiceQuiz);
        expect(result.questions[0].options.filter(o => o.isCorrect)).toHaveLength(2);
    });

    it('should fail if slug is missing', async () => {
        const invalidQuiz = `---
title: No Slug
---
Question?
- [x] Yes
`;
        await expect(parseQuiz(invalidQuiz)).rejects.toThrow(/slug/);
    });
    it('should handle text-input questions', async () => {
        const textInputQuiz = `---
title: Text Input
slug: text-input
---

What is the capital of France?
- Paris
`;
        const result = await parseQuiz(textInputQuiz);
        expect(result.questions[0].type).toBe('text');
        expect(result.questions[0].options[0].text).toBe('Paris');
    });

    it('should render math syntax in questions and options using KaTeX', async () => {
        const mathQuiz = `---
title: Math Quiz
slug: math-quiz
---

What is $x + y$ if $x=1$ and $y=2$?
- [x] $3$
- [ ] $4$

Solve for $x$:

$$
x^2 = 4
$$

- [x] $2$ or $-2$
- [ ] $4$
`;
        const result = await parseQuiz(mathQuiz);
        expect(result.questions[0].text).toContain('katex');
        expect(result.questions[0].text).toContain('x + y');
        expect(result.questions[0].options[0].text).toContain('katex');
        expect(result.questions[1].text).toContain('katex-display');
    });
    it('should parse authors correctly', async () => {
        const authoredQuiz = `---
title: Authored Quiz
slug: authored-quiz
authors: [alice, bob]
---
Question?
- [x] Yes
`;
        const result = await parseQuiz(authoredQuiz);
        expect(result.authors).toEqual(['alice', 'bob']);

        const singleAuthorQuiz = `---
title: Single Author
slug: single-author
authors: charlie
---
Question?
- [x] Yes
`;
        const singleResult = await parseQuiz(singleAuthorQuiz);
        expect(singleResult.authors).toEqual(['charlie']);
    });

    it('should parse single-line explanations from blockquotes', async () => {
        const quizWithExplanation = `---
title: Quiz with Explanation
slug: quiz-explanation
---

What is 2 + 2?
- [x] 4
- [ ] 5

> This is a simple arithmetic question.
`;
        const result = await parseQuiz(quizWithExplanation);
        expect(result.questions).toHaveLength(1);
        expect(result.questions[0].explanation).toBe('This is a simple arithmetic question.');
    });

    it('should parse multi-line explanations from blockquotes', async () => {
        const quizWithMultiLineExplanation = `---
title: Quiz with Multi-line Explanation
slug: quiz-multiline-explanation
---

What is the capital of France?
- [x] Paris
- [ ] London

> Paris is the capital and most populous city of France.
> It has been one of Europe's major centers of finance, diplomacy, commerce, and culture.
`;
        const result = await parseQuiz(quizWithMultiLineExplanation);
        expect(result.questions).toHaveLength(1);
        expect(result.questions[0].explanation).toContain('Paris is the capital');
        expect(result.questions[0].explanation).toContain('major centers of finance');
    });

    it('should handle questions without explanations', async () => {
        const quizWithoutExplanation = `---
title: Quiz without Explanation
slug: quiz-no-explanation
---

What is 1 + 1?
- [x] 2
- [ ] 3
`;
        const result = await parseQuiz(quizWithoutExplanation);
        expect(result.questions).toHaveLength(1);
        expect(result.questions[0].explanation).toBeUndefined();
    });

    it('should parse multiple questions with different explanations', async () => {
        const quizWithMultipleExplanations = `---
title: Multiple Explanations
slug: multiple-explanations
---

What is HTML?
- [x] HyperText Markup Language
- [ ] High Tech Modern Language

> HTML is the standard markup language for documents designed to be displayed in a web browser.

What is CSS?
- [x] Cascading Style Sheets
- [ ] Computer Style Sheets

> CSS is used to style and layout web pages.
> It can control colors, fonts, spacing, and more.
`;
        const result = await parseQuiz(quizWithMultipleExplanations);
        expect(result.questions).toHaveLength(2);
        expect(result.questions[0].explanation).toContain('standard markup language');
        expect(result.questions[1].explanation).toContain('style and layout');
        expect(result.questions[1].explanation).toContain('colors, fonts, spacing');
    });

    it('should render HTML in explanations', async () => {
        const quizWithHtmlExplanation = `---
title: Quiz with HTML Explanation
slug: quiz-html-explanation
---

What is **bold** text?
- [x] Emphasized text
- [ ] Normal text

> **Bold** text is used for *emphasis*.
`;
        const result = await parseQuiz(quizWithHtmlExplanation);
        expect(result.questions).toHaveLength(1);
        expect(result.questions[0].explanation).toContain('<strong>Bold</strong>');
        expect(result.questions[0].explanation).toContain('<em>emphasis</em>');
    });
});
