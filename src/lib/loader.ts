import quizzesData from '../data/quizzes.json';
import type { Quiz } from './parser';

// Pre-built quiz data from build step
const quizzes = quizzesData as Quiz[];

export async function getAllQuizzes(): Promise<Quiz[]> {
    return quizzes;
}

export async function getQuizBySlug(slug: string): Promise<Quiz | undefined> {
    return quizzes.find(q => q.slug === slug);
}

export function filterQuizzesByTags(quizzes: Quiz[], selectedTags: string[]): Quiz[] {
    if (selectedTags.length === 0) return quizzes;
    return quizzes.filter(quiz => 
        selectedTags.every(tag => quiz.tags.includes(tag))
    );
}

