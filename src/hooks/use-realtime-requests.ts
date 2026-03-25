"use client";

import { useEffect, useCallback } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRequestStore } from "@/stores";
import type { Request, RequestWithDetails } from "@/lib/types";

/**
 * Subscribe to realtime changes on requests for a given event.
 * Updates the Zustand store automatically.
 */
export function useRealtimeRequests(eventId: string | null) {
    const { addRequest, updateRequest, removeRequest } = useRequestStore();

    const handleInsert = useCallback(
        (payload: { new: Request }) => {
            const newRequest = payload.new as RequestWithDetails;
            addRequest(newRequest);
        },
        [addRequest],
    );

    const handleUpdate = useCallback(
        (payload: { new: Request }) => {
            const updated = payload.new;
            updateRequest(updated.id, updated);
        },
        [updateRequest],
    );

    const handleDelete = useCallback(
        (payload: { old: { id: string } }) => {
            removeRequest(payload.old.id);
        },
        [removeRequest],
    );

    useEffect(() => {
        if (!eventId) return;

        const supabase = getSupabaseBrowserClient();

        const channel = supabase
            .channel(`requests:event:${eventId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "requests",
                    filter: `event_id=eq.${eventId}`,
                },
                handleInsert,
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "requests",
                    filter: `event_id=eq.${eventId}`,
                },
                handleUpdate,
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "requests",
                    filter: `event_id=eq.${eventId}`,
                },
                handleDelete,
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [eventId, handleInsert, handleUpdate, handleDelete]);
}
