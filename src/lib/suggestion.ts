import { parseQuiz } from './parser';
import matter from 'gray-matter';

export interface QuizSuggestion {
    markdown: string;
    githubUsername?: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    sanitizedUsername?: string;
}

export function validateSuggestion(suggestion: QuizSuggestion): ValidationResult {
    const errors: string[] = [];

    // Validate markdown content
    if (!suggestion.markdown || suggestion.markdown.trim() === '') {
        errors.push('Markdown content is required');
        return { valid: false, errors };
    }

    // Validate that markdown can be parsed and has questions
    try {
        const { content } = matter(suggestion.markdown);
        
        // Check for task lists or plain lists (questions)
        const hasTaskList = /^[\s]*-\s*\[[\sx]\]/m.test(content);
        const hasPlainList = /^[\s]*-\s+[^\[]/.test(content);
        
        if (!hasTaskList && !hasPlainList) {
            errors.push('Quiz must contain at least one question with options');
        }
    } catch (error) {
        errors.push('Failed to parse quiz markdown');
    }

    // Validate and sanitize GitHub username
    let sanitizedUsername: string | undefined;
    if (suggestion.githubUsername && suggestion.githubUsername.trim() !== '') {
        const username = suggestion.githubUsername.trim().replace(/^@/, '');
        
        // GitHub username validation: alphanumeric and hyphens only, cannot start with hyphen
        const validUsernamePattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
        
        if (!validUsernamePattern.test(username)) {
            errors.push('GitHub username can only contain alphanumeric characters and hyphens, and cannot start or end with a hyphen');
        } else {
            sanitizedUsername = username;
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        sanitizedUsername
    };
}

export async function validateSuggestionAsync(suggestion: QuizSuggestion): Promise<ValidationResult> {
    const basicValidation = validateSuggestion(suggestion);
    
    if (!basicValidation.valid) {
        return basicValidation;
    }

    // Additional async validation - actually parse the quiz
    try {
        const quiz = await parseQuiz(suggestion.markdown, false);
        
        if (quiz.questions.length === 0) {
            return {
                valid: false,
                errors: ['Quiz must contain at least one question'],
                sanitizedUsername: basicValidation.sanitizedUsername
            };
        }
    } catch (error) {
        return {
            valid: false,
            errors: [`Failed to parse quiz: ${error instanceof Error ? error.message : 'Unknown error'}`],
            sanitizedUsername: basicValidation.sanitizedUsername
        };
    }

    return basicValidation;
}
