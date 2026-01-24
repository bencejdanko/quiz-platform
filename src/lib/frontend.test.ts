import { describe, it, expect, beforeEach } from 'vitest';

// Simple representation of how the frontend would manage state
class QuizStateManager {
    private selections: Record<string, Set<number>> = {};
    private textAnswers: Record<string, string> = {};

    toggleSelection(questionId: string, index: number, multi: boolean) {
        if (!this.selections[questionId]) {
            this.selections[questionId] = new Set();
        }

        const set = this.selections[questionId];
        if (set.has(index)) {
            set.delete(index);
        } else {
            if (!multi) {
                set.clear();
            }
            set.add(index);
        }
    }

    setTextAnswer(questionId: string, text: string) {
        this.textAnswers[questionId] = text;
    }

    getPayload(quizSlug: string) {
        const answers: any[] = [];
        
        // Add choice answers
        for (const [questionId, set] of Object.entries(this.selections)) {
            answers.push({
                questionId,
                selectedIndices: Array.from(set)
            });
        }

        // Add text answers
        for (const [questionId, text] of Object.entries(this.textAnswers)) {
            answers.push({
                questionId,
                textAnswer: text
            });
        }

        return {
            quizSlug,
            answers
        };
    }

    isSelected(questionId: string, index: number): boolean {
        return this.selections[questionId]?.has(index) ?? false;
    }
}

describe('Frontend Logic', () => {
    let manager: QuizStateManager;

    beforeEach(() => {
        manager = new QuizStateManager();
    });

    it('should handle text-input answers', () => {
        manager.setTextAnswer('q3', 'Paris');
        const payload = manager.getPayload('test-quiz');
        const q3 = payload.answers.find(a => a.questionId === 'q3');
        expect(q3?.textAnswer).toBe('Paris');
    });

    it('should handle single-choice selections', () => {
        manager.toggleSelection('q1', 0, false);
        manager.toggleSelection('q1', 1, false); // Should replace 0
        
        expect(manager.isSelected('q1', 0)).toBe(false);
        expect(manager.isSelected('q1', 1)).toBe(true);
    });

    it('should handle multi-choice selections', () => {
        manager.toggleSelection('q1', 0, true);
        manager.toggleSelection('q1', 1, true); // Should add to 0
        
        expect(manager.isSelected('q1', 0)).toBe(true);
        expect(manager.isSelected('q1', 1)).toBe(true);
    });

    it('should generate correct payload shape', () => {
        manager.toggleSelection('q1', 1, false);
        manager.toggleSelection('q2', 0, true);
        manager.toggleSelection('q2', 2, true);

        const payload = manager.getPayload('test-quiz');
        expect(payload.quizSlug).toBe('test-quiz');
        expect(payload.answers).toHaveLength(2);
        
        const q1 = payload.answers.find(a => a.questionId === 'q1');
        expect(q1?.selectedIndices).toEqual([1]);

        const q2 = payload.answers.find(a => a.questionId === 'q2');
        expect(q2?.selectedIndices).toContain(0);
        expect(q2?.selectedIndices).toContain(2);
    });
});
