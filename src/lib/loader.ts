import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { parseQuiz } from './parser';

export async function getAllQuizzes() {
    const quizzesDir = path.join(process.cwd(), 'quizzes');
    const files = await fs.readdir(quizzesDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    const quizzes = [];
    for (const file of mdFiles) {
        const content = await fs.readFile(path.join(quizzesDir, file), 'utf-8');
        quizzes.push(await parseQuiz(content));
    }
    
    return quizzes;
}
