import { sendSms, type SmsResult } from "./twilio";
import { requestDeepLink } from "@/lib/utils";

interface NotifyRequestCreatedParams {
    requestId: string;
    eventName: string;
    barName: string;
    requestLabel: string;
    recipients: Array<{ userId: string; phone: string }>;
}

/**
 * Notify all managers + barbacks when a request is created.
 * Returns results for each recipient — never blocks the caller.
 */
export async function notifyRequestCreated(
    params: NotifyRequestCreatedParams,
): Promise<SmsResult[]> {
    const { requestId, eventName, barName, requestLabel, recipients } = params;

    const deepLink = requestDeepLink(requestId);
    const body = `${eventName} ${barName}: ${requestLabel}. Open: ${deepLink}`;

    // Fire all SMS in parallel
    const results = await Promise.allSettled(
        recipients.map((r) => sendSms(r.phone, body, r.userId)),
    );

    return results.map((result) => {
        if (result.status === "fulfilled") return result.value;
        return {
            success: false,
            recipientPhone: "unknown",
            recipientUserId: "unknown",
            error: result.reason?.message ?? "Promise rejected",
        };
    });
}
