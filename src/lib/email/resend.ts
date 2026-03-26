import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResendClient(): Resend {
    if (resendClient) return resendClient;
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY is not set");
    resendClient = new Resend(apiKey);
    return resendClient;
}

export interface EmailResult {
    success: boolean;
    recipientEmail: string;
    recipientUserId: string;
    providerMessageId?: string;
    twilioStatus?: string;
    error?: string;
}

/**
 * Send a single email via Resend.
 * Never throws — returns a structured result.
 */
export async function sendEmail(
    to: string,
    subject: string,
    html: string,
    recipientUserId: string,
): Promise<EmailResult> {
    try {
        const client = getResendClient();

        const { data, error } = await client.emails.send({
            from: "CB Events <onboarding@resend.dev>",
            to,
            subject,
            html,
        });

        if (error) {
            console.error(`[Email] Resend error for ${to}:`, error);
            return { success: false, recipientEmail: to, recipientUserId, error: error.message };
        }

        return {
            success: true,
            recipientEmail: to,
            recipientUserId,
            providerMessageId: data?.id,
            twilioStatus: "sent",
        };
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error(`[Email] Failed to send to ${to}:`, errorMessage);
        return { success: false, recipientEmail: to, recipientUserId, error: errorMessage };
    }
}
