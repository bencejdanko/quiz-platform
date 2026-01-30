import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { processStudyGuide } from '../src/lib/study-guides.ts';

async function build() {
    const studyGuidesDir = path.join(process.cwd(), 'study_guides');
    const outDir = path.join(process.cwd(), 'public/study-guides');
    const cssFile = path.join(process.cwd(), 'study_guide.css');
    const templatePath = path.join(process.cwd(), 'scripts/pdf-template.html');
    
    await fs.mkdir(outDir, { recursive: true });
    
    const files = await fs.readdir(studyGuidesDir);
    const mdFiles = files.filter(f => f.endsWith('.md') && !f.startsWith('.'));
    
    for (const file of mdFiles) {
        console.log(`Processing ${file}...`);
        const filePath = path.join(studyGuidesDir, file);
        
        try {
            const pdfPath = await processStudyGuide(filePath, outDir, cssFile, templatePath);
            console.log(`Generated ${pdfPath}`);
        } catch (e) {
            console.error(`Failed to generate PDF for ${file}:`, e);
        }
    }
}

build().catch(console.error);
