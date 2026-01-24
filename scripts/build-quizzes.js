import { generateCorrectnessMap } from '../src/lib/pipeline.js';
import { parseQuiz } from '../src/lib/parser.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

async function build() {
    const quizzesDir = path.join(process.cwd(), 'quizzes');
    const outDir = path.join(process.cwd(), 'src/data');
    
    await fs.mkdir(outDir, { recursive: true });
    
    // Generate correctness map
    const map = await generateCorrectnessMap(quizzesDir);
    await fs.writeFile(
        path.join(outDir, 'correctness.json'),
        JSON.stringify(map, null, 2)
    );
    
    // Generate quiz metadata for runtime
    const files = await fs.readdir(quizzesDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    const quizzes = [];
    
    for (const file of mdFiles) {
        const content = await fs.readFile(path.join(quizzesDir, file), 'utf-8');
        const quiz = await parseQuiz(content);
        quizzes.push(quiz);
    }
    
    await fs.writeFile(
        path.join(outDir, 'quizzes.json'),
        JSON.stringify(quizzes, null, 2)
    );
    
    console.log('Correctness map generated at src/data/correctness.json');
    console.log('Quiz metadata generated at src/data/quizzes.json');
}

build().catch(console.error);

