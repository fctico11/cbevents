"use client";

import { StatusBadge, ElapsedTimer } from "@/components/shared";
import type { RequestWithDetails } from "@/lib/types";
import { Clock } from "lucide-react";

interface ActiveRequestsTableProps {
    requests: RequestWithDetails[];
}

export function ActiveRequestsTable({ requests }: ActiveRequestsTableProps) {
    const activeRequests = requests.filter(
        (r) => r.status === "open" || r.status === "claimed",
    );

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
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <ElapsedTimer since={request.created_at} className="font-mono" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
