import Twilio from "twilio";
import { getEnvVar } from "@/lib/utils";

let twilioClient: Twilio.Twilio | null = null;

function getTwilioClient(): Twilio.Twilio {
    if (twilioClient) return twilioClient;

    const accountSid = getEnvVar("TWILIO_ACCOUNT_SID");
    const authToken = getEnvVar("TWILIO_AUTH_TOKEN");

    twilioClient = Twilio(accountSid, authToken);
    return twilioClient;
}

export interface SmsResult {
    success: boolean;
    recipientPhone: string;
    recipientUserId: string;
    providerMessageId?: string;
    error?: string;
}

/**
 * Send a single SMS via Twilio.
 * Never throws — returns a structured result.
 */
export async function sendSms(
    to: string,
    body: string,
    recipientUserId: string,
): Promise<SmsResult> {
    try {
        const client = getTwilioClient();
        const fromNumber = getEnvVar("TWILIO_FROM_NUMBER");

        const message = await client.messages.create({
            body,
            from: fromNumber,
            to,
        });

        return {
            success: true,
            recipientPhone: to,
            recipientUserId,
            providerMessageId: message.sid,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`[SMS] Failed to send to ${to}:`, errorMessage);

        return {
            success: false,
            recipientPhone: to,
            recipientUserId,
            error: errorMessage,
        };
    }
}
