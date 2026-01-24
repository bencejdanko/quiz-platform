import type { APIRoute } from 'astro';
import { validateSubmission } from '../../lib/api';
import correctnessMap from '../../data/correctness.json';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const result = validateSubmission(correctnessMap, body);
        
        return new Response(JSON.stringify(result), {
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
