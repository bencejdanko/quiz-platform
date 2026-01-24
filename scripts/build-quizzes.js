import { generateCorrectnessMap } from '../src/lib/pipeline';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

async function build() {
    const quizzesDir = path.join(process.cwd(), 'quizzes');
    const outDir = path.join(process.cwd(), 'src/data');
    
    await fs.mkdir(outDir, { recursive: true });
    
    const map = await generateCorrectnessMap(quizzesDir);
    await fs.writeFile(
        path.join(outDir, 'correctness.json'),
        JSON.stringify(map, null, 2)
    );
    
    console.log('Correctness map generated at src/data/correctness.json');
}

build().catch(console.error);
