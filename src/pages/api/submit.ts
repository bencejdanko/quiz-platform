import type { APIRoute } from 'astro';
import { validateSubmission } from '../../lib/api';
import correctnessMap from '../../data/correctness.json';
import { getSession } from 'auth-astro/server';
import { getDB } from '../../lib/db';
import { SubmissionService } from '../../lib/submission-service';

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const body = await request.json();
        const result = validateSubmission(correctnessMap, body);
        
        let stats = {};
        const session = await getSession(request);
        
        try {
            const db = getDB(locals);
            const submissionService = new SubmissionService(db);
            
            if (session?.user?.email) {
                // Use GitHub username as userId for D1
                const username = (session.user as any).username || session.user.email;
                await submissionService.createSubmission(username, body, result);
            }
            
            stats = await submissionService.getQuestionStats(body.quizSlug);
        } catch (dbErr) {
            console.error('Database error:', dbErr);
            // Non-fatal, we can still return the validation result
        }

        return new Response(JSON.stringify({
            ...result,
            stats
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
