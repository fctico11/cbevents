"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * A headless component that listens to database changes and invalidates
 * the router cache, allowing Server Components to seamlessly update.
 */
export function RealtimeRefresh() {
    const router = useRouter();

    useEffect(() => {
        const supabase = getSupabaseBrowserClient();

        // Listen for any mutations on the requests table
        const channel = supabase
            .channel("realtime-refresh")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "requests" },
                () => {
                    console.log("[Realtime] Request change detected, refreshing route...");
                    router.refresh();
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "request_activity" },
                () => {
                    console.log("[Realtime] Activity change detected, refreshing route...");
                    router.refresh();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [router]);

    return null;
}
