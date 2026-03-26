"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { RequestNode } from "@/lib/types";

/**
 * Build the full label path for a request node by walking up the tree.
 * e.g., "Bottles → Beer → Asahi"
 */
async function buildRequestLabel(nodeId: string): Promise<string> {
    const supabase = await getSupabaseServerClient();
    const path: string[] = [];
    let currentId: string | null = nodeId;

    // Walk up the tree (max 10 levels to prevent infinite loops)
    for (let i = 0; i < 10 && currentId; i++) {
        const { data } = await supabase
            .from("request_nodes")
            .select("id, label, parent_id")
            .eq("id", currentId)
            .single();

        const node = data as { id: string; label: string; parent_id: string | null } | null;
        if (!node) break;
        path.unshift(node.label);
        currentId = node.parent_id;
    }

    return path.join(" → ");
}

export async function createRequest(params: {
    event_id: string;
    bar_id: string;
    node_id: string;
    priority?: number;
    notes?: string;
}) {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    // Build denormalized label
    const requestLabel = await buildRequestLabel(params.node_id);

    // Insert request
    const { data: request, error: requestError } = await supabase
        .from("requests")
        .insert({
            event_id: params.event_id,
            bar_id: params.bar_id,
            node_id: params.node_id,
            request_label: requestLabel,
            status: "open",
            priority: params.priority ?? 1,
            notes: params.notes ?? null,
            created_by: user.id,
        })
        .select()
        .single();

    if (requestError || !request) {
        return { error: requestError?.message ?? "Failed to create request" };
    }

    // Insert activity row
    await supabase.from("request_activity").insert({
        request_id: request.id,
        user_id: user.id,
        action: "created",
        details: `Created request: ${requestLabel}`,
    });

    // Fire SMS notification asynchronously (don't block)
    triggerSmsNotification(request.id, params.event_id).catch(console.error);

    revalidatePath("/bartender");
    revalidatePath("/manager");

    return { data: request };
}

/** Fire-and-forget email notification via internal API route */
async function triggerSmsNotification(requestId: string, eventId: string) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    try {
        await fetch(`${appUrl}/api/notify/request-created`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ request_id: requestId, event_id: eventId }),
        });
    } catch (error) {
        console.error("[Email] Failed to trigger notification:", error);
    }
}

export async function claimRequest(requestId: string) {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { data: request, error } = await supabase
        .from("requests")
        .update({
            status: "claimed",
            assigned_to_user_id: user.id,
            updated_at: new Date().toISOString(),
        })
        .eq("id", requestId)
        .eq("status", "open") // Only claim if still open
        .select()
        .single();

    if (error || !request) {
        return { error: error?.message ?? "Request already claimed or not found" };
    }

    await supabase.from("request_activity").insert({
        request_id: requestId,
        user_id: user.id,
        action: "claimed",
        details: "Claimed this request",
    });

    return { data: request };
}

export async function completeRequest(requestId: string) {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { data: request, error } = await supabase
        .from("requests")
        .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq("id", requestId)
        .in("status", ["open", "claimed"])
        .select()
        .single();

    if (error || !request) {
        return { error: error?.message ?? "Cannot complete this request" };
    }

    await supabase.from("request_activity").insert({
        request_id: requestId,
        user_id: user.id,
        action: "completed",
        details: "Marked request as completed",
    });

    return { data: request };
}

export async function cancelRequest(requestId: string) {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { data: request, error } = await supabase
        .from("requests")
        .update({
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq("id", requestId)
        .in("status", ["open", "claimed"])
        .select()
        .single();

    if (error || !request) {
        return { error: error?.message ?? "Cannot cancel this request" };
    }

    await supabase.from("request_activity").insert({
        request_id: requestId,
        user_id: user.id,
        action: "cancelled",
        details: "Cancelled this request",
    });

    return { data: request };
}

/* ─── Request Node CRUD (for builder) ─── */

export async function getRequestNodes(eventId: string): Promise<RequestNode[]> {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
        .from("request_nodes")
        .select("*")
        .eq("event_id", eventId)
        .order("sort_order");

    if (error) {
        console.error("Failed to fetch request nodes:", error);
        return [];
    }

    return data ?? [];
}

export async function createRequestNode(params: {
    event_id: string;
    parent_id: string | null;
    label: string;
    is_terminal: boolean;
    default_priority?: number;
    sort_order?: number;
}) {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from("request_nodes")
        .insert({
            event_id: params.event_id,
            parent_id: params.parent_id,
            label: params.label,
            is_terminal: params.is_terminal,
            default_priority: params.default_priority ?? 1,
            sort_order: params.sort_order ?? 0,
        })
        .select()
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function updateRequestNode(
    nodeId: string,
    updates: Partial<Pick<RequestNode, "label" | "is_terminal" | "default_priority" | "sort_order">>,
) {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from("request_nodes")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", nodeId)
        .select()
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function deleteRequestNode(nodeId: string) {
    const supabase = await getSupabaseServerClient();

    const { error } = await supabase
        .from("request_nodes")
        .delete()
        .eq("id", nodeId);

    if (error) return { error: error.message };
    return { success: true };
}
