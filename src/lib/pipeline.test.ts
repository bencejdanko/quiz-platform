import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateCorrectnessMap } from './pipeline';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';

describe('Build Pipeline', () => {
    let tempDir: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quiz-test-'));
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    it('should discover all quizzes in a directory', async () => {
        await fs.writeFile(path.join(tempDir, 'quiz1.md'), `---
title: Quiz 1
slug: quiz-1
---
Q1?
- [x] A
`);
        await fs.writeFile(path.join(tempDir, 'quiz2.md'), `---
title: Quiz 2
slug: quiz-2
---
Q2?
- [ ] A
- [x] B
`);

        const map = await generateCorrectnessMap(tempDir);
        expect(Object.keys(map)).toHaveLength(2);
        expect(map['quiz-1']).toBeDefined();
        expect(map['quiz-2']).toBeDefined();
    });

    it('should generate correct answer indices', async () => {
        await fs.writeFile(path.join(tempDir, 'quiz1.md'), `---
title: Quiz 1
slug: quiz-1
---
Q1?
- [x] A
- [ ] B
- [x] C
`);
        const map = await generateCorrectnessMap(tempDir);
        const quizMap = map['quiz-1'];
        const questionId = Object.keys(quizMap)[0];
        expect(quizMap[questionId]).toEqual([0, 2]);
    });

    it('should fail if duplicate slugs are found', async () => {
        await fs.writeFile(path.join(tempDir, 'quiz1.md'), `---
slug: same
---`);
        await fs.writeFile(path.join(tempDir, 'quiz2.md'), `---
slug: same
---`);
        
        await expect(generateCorrectnessMap(tempDir)).rejects.toThrow(/duplicate slug/i);
    });

    it('should generate correct answer strings for text questions', async () => {
        await fs.writeFile(path.join(tempDir, 'quiz.md'), `---
title: Text Quiz
slug: text-quiz
---
What is the capital of France?
- Paris
`);
        const map = await generateCorrectnessMap(tempDir);
        const quizMap = map['text-quiz'];
        const questionId = Object.keys(quizMap)[0];
        expect(quizMap[questionId]).toEqual(['paris']);
    });
});
