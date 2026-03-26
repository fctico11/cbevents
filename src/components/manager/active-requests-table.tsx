"use client";

import { useState, useTransition } from "react";
import { StatusBadge, ElapsedTimer } from "@/components/shared";
import type { RequestWithDetails } from "@/lib/types";
import { claimRequest, completeRequest } from "@/lib/supabase/actions";
import { Clock, CheckCheck, HandMetal } from "lucide-react";
import { useRouter } from "next/navigation";

interface ActiveRequestsTableProps {
    requests: RequestWithDetails[];
}

export function ActiveRequestsTable({ requests }: ActiveRequestsTableProps) {
    const router = useRouter();
    const [pending, setPending] = useState<string | null>(null);
    const [, startTransition] = useTransition();

    const activeRequests = requests.filter(
        (r) => r.status === "open" || r.status === "claimed",
    );

    async function handleClaim(requestId: string) {
        setPending(requestId + "-claim");
        const result = await claimRequest(requestId);
        if (!result.error) startTransition(() => router.refresh());
        setPending(null);
    }

    async function handleComplete(requestId: string) {
        setPending(requestId + "-complete");
        const result = await completeRequest(requestId);
        if (!result.error) startTransition(() => router.refresh());
        setPending(null);
    }

    return (
        <div className="glass-card p-4">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Active Requests
                </h2>
                <span className="text-xs text-muted-foreground">
                    {activeRequests.length} active
                </span>
            </div>

            {activeRequests.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                    No active requests
                </p>
            ) : (
                <div className="space-y-2">
                    {activeRequests.map((request) => (
                        <div
                            key={request.id}
                            className="flex items-center gap-3 rounded-lg bg-card/50 p-3 transition-colors hover:bg-card"
                        >
                            {/* Info */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="truncate font-medium text-foreground">
                                        {request.request_label}
                                    </span>
                                    <StatusBadge status={request.status} />
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{request.bar?.name ?? "Unknown bar"}</span>
                                    <span className="text-border">·</span>
                                    <span>by {request.created_by_profile?.full_name ?? "Unknown"}</span>
                                    {request.assigned_to_profile && (
                                        <>
                                            <span className="text-border">·</span>
                                            <span className="text-cb-info">
                                                → {request.assigned_to_profile.full_name}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Timer */}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <ElapsedTimer since={request.created_at} className="font-mono" />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                {request.status === "open" && (
                                    <button
                                        onClick={() => handleClaim(request.id)}
                                        disabled={pending === request.id + "-claim"}
                                        title="Claim request"
                                        className="flex items-center gap-1 rounded-md bg-cb-info/10 px-2 py-1 text-xs font-medium text-cb-info transition-colors hover:bg-cb-info/20 disabled:opacity-50"
                                    >
                                        <HandMetal className="h-3 w-3" />
                                        {pending === request.id + "-claim" ? "…" : "Claim"}
                                    </button>
                                )}
                                {request.status === "claimed" && (
                                    <button
                                        onClick={() => handleComplete(request.id)}
                                        disabled={pending === request.id + "-complete"}
                                        title="Mark as complete"
                                        className="flex items-center gap-1 rounded-md bg-cb-success/10 px-2 py-1 text-xs font-medium text-cb-success transition-colors hover:bg-cb-success/20 disabled:opacity-50"
                                    >
                                        <CheckCheck className="h-3 w-3" />
                                        {pending === request.id + "-complete" ? "…" : "Done"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
