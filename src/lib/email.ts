import { Resend } from 'resend';

export interface EmailOptions {
    to: string;
    subject: string;
    markdown: string;
    githubUsername?: string;
}

export async function sendQuizSuggestionEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    try {
        // Get environment variables
        const resendApiKey = import.meta.env.RESEND_API_KEY;
        const fromEmail = import.meta.env.RESEND_FROM_EMAIL || 'Quiz Platform <noreply@example.com>';

        if (!resendApiKey) {
            console.warn('RESEND_API_KEY not configured. Email will not be sent.');
            return { success: false, error: 'Email service not configured' };
        }

        const resend = new Resend(resendApiKey);

        // Create email content
        const submitter = options.githubUsername 
            ? `GitHub: @${options.githubUsername}` 
            : 'Anonymous';

        const htmlContent = `
            <h2>New Quiz Suggestion</h2>
            <p><strong>Submitted by:</strong> ${submitter}</p>
            <hr />
            <h3>Quiz Content:</h3>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;">${escapeHtml(options.markdown)}</pre>
            <hr />
            <p style="color: #666; font-size: 12px;">
                This suggestion was submitted via the Quiz Platform suggestion form.
            </p>
        `;

        const textContent = `
New Quiz Suggestion

Submitted by: ${submitter}

Quiz Content:
${options.markdown}

---
This suggestion was submitted via the Quiz Platform suggestion form.
        `.trim();

        // Send email
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: options.to,
            subject: options.subject,
            html: htmlContent,
            text: textContent,
        });

        if (error) {
            console.error('Failed to send email:', error);
            return { success: false, error: error.message };
        }

        console.log('Email sent successfully:', data?.id);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        };
    }
}

function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}
