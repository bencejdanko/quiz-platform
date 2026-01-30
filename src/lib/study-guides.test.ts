import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { processStudyGuide } from './study-guides';

describe('Study Guides Library', () => {
    const studyGuidesDir = path.join(process.cwd(), 'study_guides');
    const publicDir = path.join(process.cwd(), 'public/study-guides');
    const testFile = path.join(studyGuidesDir, 'test-guide.md');
    const cssFile = path.join(process.cwd(), 'study_guide.css');
    const templatePath = path.join(process.cwd(), 'scripts/pdf-template.html');

    beforeAll(async () => {
        await fs.mkdir(publicDir, { recursive: true });
        await fs.writeFile(testFile, '---\ntitle: Test Guide\nauthors: [test]\ntags: [test]\n---\n\nQuestion 1\n\n> Answer 1\n');
    });

    afterAll(async () => {
        try {
            await fs.unlink(testFile);
            await fs.unlink(path.join(publicDir, 'test-guide.pdf'));
        } catch (e) {
            // ignore
        }
    });

    it('should generate a PDF from markdown content', async () => {
        const pdfPath = await processStudyGuide(testFile, publicDir, cssFile, templatePath);
        
        const exists = await fs.access(pdfPath).then(() => true).catch(() => false);
        expect(exists).toBe(true);
        
        const stats = await fs.stat(pdfPath);
        expect(stats.size).toBeGreaterThan(0);
    }, 30000); // 30s timeout
});

