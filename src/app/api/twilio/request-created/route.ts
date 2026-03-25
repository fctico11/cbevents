import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { notifyRequestCreated } from "@/lib/sms";

/**
 * POST /api/twilio/request-created
 * Called internally after a request is created.
 * Sends SMS to all managers and barbacks for the event.
 */
export async function POST(req: globalThis.Request) {
    try {
        const { request_id, event_id } = await req.json();

        if (!request_id || !event_id) {
            return NextResponse.json(
                { error: "Missing request_id or event_id" },
                { status: 400 },
            );
        }

        // Use service role client for cross-user data access
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        // Fetch request details
        const { data: request } = await supabase
            .from("requests")
            .select("id, request_label, bar_id")
            .eq("id", request_id)
            .single();

        if (!request) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        // Fetch event name
        const { data: event } = await supabase
            .from("events")
            .select("name")
            .eq("id", event_id)
            .single();

        // Fetch bar name
        const { data: bar } = await supabase
            .from("bars")
            .select("name")
            .eq("id", request.bar_id)
            .single();

        // Fetch all managers + barbacks for this event who have a phone number
        const { data: recipients } = await supabase
            .from("event_users")
            .select(`
        user_id,
        role,
        profiles:user_id (phone)
      `)
            .eq("event_id", event_id)
            .eq("is_active", true)
            .in("role", ["manager", "barback"]);

        const validRecipients = (recipients ?? [])
            .filter((r) => {
                const profile = r.profiles as unknown as { phone: string | null };
                return profile?.phone;
            })
            .map((r) => {
                const profile = r.profiles as unknown as { phone: string };
                return {
                    userId: r.user_id,
                    phone: profile.phone,
                };
            });

        if (validRecipients.length === 0) {
            return NextResponse.json({
                message: "No recipients with phone numbers",
                sent: 0,
            });
        }

        // Send notifications
        const results = await notifyRequestCreated({
            requestId: request_id,
            eventName: event?.name ?? "Event",
            barName: bar?.name ?? "Bar",
            requestLabel: request.request_label,
            recipients: validRecipients,
        });

        // Log each attempt to notification_logs
        for (const result of results) {
            await supabase.from("notification_logs").insert({
                request_id,
                recipient_phone: result.recipientPhone,
                recipient_user_id: result.recipientUserId,
                provider: "twilio",
                status: result.success ? "sent" : "failed",
                provider_message_id: result.providerMessageId ?? null,
                error_message: result.error ?? null,
            });
        }

        const successCount = results.filter((r) => r.success).length;

        return NextResponse.json({
            message: `Sent ${successCount}/${results.length} notifications`,
            sent: successCount,
            total: results.length,
        });
    } catch (error) {
        console.error("[API] twilio/request-created error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
