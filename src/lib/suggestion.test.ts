import { describe, it, expect } from 'vitest';
import { validateSuggestion, type QuizSuggestion } from './suggestion';

describe('Quiz Suggestion Validation', () => {
    it('should validate a valid suggestion with GitHub username', () => {
        const suggestion: QuizSuggestion = {
            markdown: `What is 2+2?
- [x] 4
- [ ] 5`,
            githubUsername: 'testuser'
        };

        const result = validateSuggestion(suggestion);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('should validate a valid suggestion without GitHub username', () => {
        const suggestion: QuizSuggestion = {
            markdown: `What is 2+2?
- [x] 4
- [ ] 5`,
            githubUsername: ''
        };

        const result = validateSuggestion(suggestion);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('should validate a suggestion with frontmatter', () => {
        const suggestion: QuizSuggestion = {
            markdown: `---
title: Test Quiz
slug: test-quiz
---

What is 2+2?
- [x] 4
- [ ] 5`,
            githubUsername: 'testuser'
        };

        const result = validateSuggestion(suggestion);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('should reject empty markdown', () => {
        const suggestion: QuizSuggestion = {
            markdown: '',
            githubUsername: 'testuser'
        };

        const result = validateSuggestion(suggestion);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Markdown content is required');
    });

    it('should reject markdown without questions', () => {
        const suggestion: QuizSuggestion = {
            markdown: `Just some text without questions.`,
            githubUsername: 'testuser'
        };

        const result = validateSuggestion(suggestion);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('question'))).toBe(true);
    });

    it('should sanitize GitHub username', () => {
        const suggestion: QuizSuggestion = {
            markdown: `Question?
- [x] Yes`,
            githubUsername: '  @testuser  '
        };

        const result = validateSuggestion(suggestion);
        expect(result.valid).toBe(true);
        expect(result.sanitizedUsername).toBe('testuser');
    });

    it('should reject invalid GitHub username characters', () => {
        const suggestion: QuizSuggestion = {
            markdown: `Question?
- [x] Yes`,
            githubUsername: 'test user!'
        };

        const result = validateSuggestion(suggestion);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('GitHub username'))).toBe(true);
    });
});
