"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatusBadge, ElapsedTimer } from "@/components/shared";
import { mockEvent, mockRequests } from "@/lib/mock-data";
import type { RequestWithDetails, RequestStatus } from "@/lib/types";
import { Hand, CheckCircle2, Clock, User, MapPin } from "lucide-react";

type FilterTab = "all" | "open" | "mine";

const filterTabs: { value: FilterTab; label: string }[] = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "mine", label: "Mine" },
];

export default function BarbackPage() {
    const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
    const currentUserId = "u-4"; // Casey Morgan (mock)

    const filteredRequests = mockRequests.filter((r) => {
        if (r.status === "cancelled") return false;
        switch (activeFilter) {
            case "open":
                return r.status === "open";
            case "mine":
                return r.assigned_to_user_id === currentUserId;
            default:
                return true;
        }
    });

    const handleClaim = useCallback((requestId: string) => {
        console.log("Claim request:", requestId);
        // In production: calls claimRequest server action
    }, []);

    const handleComplete = useCallback((requestId: string) => {
        console.log("Complete request:", requestId);
        // In production: calls completeRequest server action
    }, []);

    const openCount = mockRequests.filter((r) => r.status === "open").length;

    return (
        <DashboardShell
            role="barback"
            eventName={mockEvent.name}
            userName="Casey Morgan"
        >
            {/* Stats Bar */}
            <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-xl bg-cb-accent/10 px-3 py-2">
                    <span className="text-2xl font-bold text-cb-accent-light">{openCount}</span>
                    <span className="text-xs text-muted-foreground">Open</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-cb-info/10 px-3 py-2">
                    <span className="text-2xl font-bold text-cb-info">
                        {mockRequests.filter((r) => r.assigned_to_user_id === currentUserId && r.status === "claimed").length}
                    </span>
                    <span className="text-xs text-muted-foreground">My Claims</span>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-4 flex gap-1 rounded-xl bg-card p-1">
                {filterTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveFilter(tab.value)}
                        className={cn(
                            "tap-target flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                            activeFilter === tab.value
                                ? "bg-cb-accent text-black shadow-sm"
                                : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Request Queue */}
            <div className="space-y-3">
                {filteredRequests.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-sm text-muted-foreground">No requests match this filter</p>
                    </div>
                ) : (
                    filteredRequests.map((request) => (
                        <QueueCard
                            key={request.id}
                            request={request}
                            currentUserId={currentUserId}
                            onClaim={handleClaim}
                            onComplete={handleComplete}
                        />
                    ))
                )}
            </div>
        </DashboardShell>
    );
}

function QueueCard({
    request,
    currentUserId,
    onClaim,
    onComplete,
}: {
    request: RequestWithDetails;
    currentUserId: string;
    onClaim: (id: string) => void;
    onComplete: (id: string) => void;
}) {
    const isOpen = request.status === "open";
    const isClaimed = request.status === "claimed";
    const isMyRequest = request.assigned_to_user_id === currentUserId;
    const isCompleted = request.status === "completed";

    return (
        <div
            className={cn(
                "glass-card overflow-hidden transition-all",
                isOpen && "border-cb-warning/30",
                isClaimed && isMyRequest && "border-cb-info/30",
            )}
        >
            {/* Priority strip */}
            {request.priority >= 2 && (
                <div className="h-0.5 gradient-accent" />
            )}

            <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="truncate text-base font-semibold text-foreground">
                                {request.request_label}
                            </h3>
                            <StatusBadge status={request.status} />
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {request.bar?.name}
                            </div>
                            <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {request.created_by_profile?.full_name}
                            </div>
                        </div>
                    </div>

                    {/* Elapsed time */}
                    <div className="flex items-center gap-1 rounded-lg bg-card px-2 py-1 text-xs">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <ElapsedTimer
                            since={request.created_at}
                            className={cn(
                                "font-mono",
                                isOpen ? "text-cb-warning" : "text-muted-foreground",
                            )}
                        />
                    </div>
                </div>

                {/* Assigned info */}
                {isClaimed && request.assigned_to_profile && (
                    <div className="mb-3 flex items-center gap-1.5 text-xs text-cb-info">
                        <Hand className="h-3 w-3" />
                        Claimed by {request.assigned_to_profile.full_name}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    {isOpen && (
                        <button
                            onClick={() => onClaim(request.id)}
                            className="tap-target flex flex-1 items-center justify-center gap-2 rounded-xl bg-cb-info px-4 py-3 text-sm font-bold text-white transition-all active:scale-95 hover:opacity-90"
                        >
                            <Hand className="h-4 w-4" />
                            Claim
                        </button>
                    )}
                    {isClaimed && isMyRequest && (
                        <button
                            onClick={() => onComplete(request.id)}
                            className="tap-target flex flex-1 items-center justify-center gap-2 rounded-xl bg-cb-success px-4 py-3 text-sm font-bold text-white transition-all active:scale-95 hover:opacity-90"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Complete
                        </button>
                    )}
                    {isCompleted && (
                        <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cb-success/10 px-4 py-3 text-sm font-medium text-cb-success">
                            <CheckCircle2 className="h-4 w-4" />
                            Completed
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
