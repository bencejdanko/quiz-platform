import type { APIRoute } from 'astro';
import { validateSuggestionAsync } from '../../lib/suggestion';
import { sendQuizSuggestionEmail } from '../../lib/email';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { markdown, githubUsername } = body;

        // Validate the suggestion
        const validation = await validateSuggestionAsync({
            markdown,
            githubUsername
        });

        if (!validation.valid) {
            return new Response(JSON.stringify({
                success: false,
                errors: validation.errors
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Send email notification
        const suggestionEmail = import.meta.env.SUGGESTION_EMAIL || 'admin@example.com';
        const submitter = validation.sanitizedUsername || 'Anonymous';
        
        const emailResult = await sendQuizSuggestionEmail({
            to: suggestionEmail,
            subject: `New Quiz Suggestion from ${submitter}`,
            markdown,
            githubUsername: validation.sanitizedUsername
        });

        if (!emailResult.success) {
            console.warn('Failed to send email notification:', emailResult.error);
            // Don't fail the request if email fails - just log it
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Quiz suggestion submitted successfully! We\'ll review it soon.'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error processing suggestion:', error);
        return new Response(JSON.stringify({
            success: false,
            errors: ['An unexpected error occurred. Please try again.']
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
