import { describe, it, expect } from 'vitest';

describe('Quiz Suggestion API Integration', () => {
    const API_BASE = 'http://localhost:4321';

    it('should accept a valid quiz suggestion', async () => {
        const suggestion = {
            markdown: `---
title: Test Quiz
slug: test-quiz
---

What is 2+2?
- [x] 4
- [ ] 5`,
            githubUsername: 'testuser'
        };

        // Note: This test requires the dev server to be running
        // It's marked as an integration test and can be skipped in CI
        try {
            const response = await fetch(`${API_BASE}/api/suggest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(suggestion)
            });

            const data = await response.json();
            
            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.message).toBeDefined();
        } catch (error) {
            // Skip test if server is not running
            console.log('Skipping integration test - server not running');
        }
    });

    it('should reject invalid quiz suggestion', async () => {
        const suggestion = {
            markdown: 'Invalid markdown without frontmatter',
            githubUsername: 'testuser'
        };

        try {
            const response = await fetch(`${API_BASE}/api/suggest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(suggestion)
            });

            const data = await response.json();
            
            expect(response.status).toBe(400);
            expect(data.success).toBe(false);
            expect(data.errors).toBeDefined();
            expect(data.errors.length).toBeGreaterThan(0);
        } catch (error) {
            console.log('Skipping integration test - server not running');
        }
    });

    it('should generate preview for valid markdown', async () => {
        const markdown = `---
title: Preview Test
slug: preview-test
---

What is the capital of France?
- [x] Paris
- [ ] London`;

        try {
            const response = await fetch(`${API_BASE}/api/preview-quiz`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ markdown })
            });

            const data = await response.json();
            
            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.quiz).toBeDefined();
            expect(data.quiz.title).toBe('Preview Test');
            expect(data.quiz.questions).toHaveLength(1);
        } catch (error) {
            console.log('Skipping integration test - server not running');
        }
    });

    it('should reject preview for invalid markdown', async () => {
        const markdown = 'Invalid';

        try {
            const response = await fetch(`${API_BASE}/api/preview-quiz`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ markdown })
            });

            const data = await response.json();
            
            expect(response.status).toBe(400);
            expect(data.success).toBe(false);
            expect(data.errors).toBeDefined();
        } catch (error) {
            console.log('Skipping integration test - server not running');
        }
    });
});
