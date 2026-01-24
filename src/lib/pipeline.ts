import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { parseQuiz } from './parser';

export type CorrectnessMap = {
    [quizSlug: string]: {
        [questionId: string]: number[] | string[];
    };
};

export async function generateCorrectnessMap(directory: string): Promise<CorrectnessMap> {
    const files = await fs.readdir(directory);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    const map: CorrectnessMap = {};

    for (const file of mdFiles) {
        const content = await fs.readFile(path.join(directory, file), 'utf-8');
        const quiz = await parseQuiz(content);

        if (map[quiz.slug]) {
            throw new Error(`Duplicate slug found: ${quiz.slug}`);
        }

        map[quiz.slug] = {};
        for (const question of quiz.questions) {
            if (question.type === 'choice') {
                const correctIndices = question.options
                    .map((opt, index) => opt.isCorrect ? index : -1)
                    .filter(index => index !== -1);
                map[quiz.slug][question.id] = correctIndices;
            } else {
                // Text question: store lowercase correct answers
                const correctAnswers = question.options
                    .filter(opt => opt.isCorrect)
                    .map(opt => opt.rawText.trim().toLowerCase());
                map[quiz.slug][question.id] = correctAnswers;
            }
        }
    }

    return map;
}
