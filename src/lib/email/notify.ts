import { sendEmail, type EmailResult } from "./resend";
import { requestDeepLink } from "@/lib/utils";

interface NotifyRequestCreatedParams {
    requestId: string;
    eventName: string;
    barName: string;
    requestLabel: string;
    recipients: Array<{ userId: string; email: string }>;
}

export async function notifyRequestCreated(
    params: NotifyRequestCreatedParams,
): Promise<EmailResult[]> {
    const { requestId, eventName, barName, requestLabel, recipients } = params;

    const deepLink = requestDeepLink(requestId);
    const subject = `${barName}: ${requestLabel}`;
    const html = `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
            <h2 style="margin:0 0 8px;color:#111;">📦 New Request</h2>
            <p style="margin:0 0 16px;color:#555;font-size:14px;">${eventName} · ${barName}</p>
            <div style="background:#f9f9f9;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
                <p style="margin:0;font-size:18px;font-weight:600;color:#111;">${requestLabel}</p>
            </div>
            <a href="${deepLink}"
               style="display:inline-block;background:#f59e0b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
                View Request →
            </a>
        </div>
    `;

    const results = await Promise.allSettled(
        recipients.map((r) => sendEmail(r.email, subject, html, r.userId)),
    );

    return results.map((result) => {
        if (result.status === "fulfilled") return result.value;
        return {
            success: false,
            recipientEmail: "unknown",
            recipientUserId: "unknown",
            error: result.reason?.message ?? "Promise rejected",
        };
    });
}
