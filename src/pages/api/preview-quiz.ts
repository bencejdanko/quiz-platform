import type { APIRoute } from 'astro';
import { parseQuiz } from '../../lib/parser';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { markdown } = body;

        if (!markdown || markdown.trim() === '') {
            return new Response(JSON.stringify({
                success: false,
                errors: ['Markdown content is required']
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        try {
            const quiz = await parseQuiz(markdown, false);
            
            return new Response(JSON.stringify({
                success: true,
                quiz
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            return new Response(JSON.stringify({
                success: false,
                errors: [error instanceof Error ? error.message : 'Failed to parse quiz']
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error('Error processing preview:', error);
        return new Response(JSON.stringify({
            success: false,
            errors: ['An unexpected error occurred']
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
