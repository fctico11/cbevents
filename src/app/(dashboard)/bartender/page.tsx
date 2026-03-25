"use client";

import { useState, useCallback } from "react";
import { cn, timeAgo } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatusBadge } from "@/components/shared";
import { mockEvent, mockRequestTree, mockRequests } from "@/lib/mock-data";
import type { RequestNodeWithChildren, RequestWithDetails } from "@/lib/types";
import {
    IceCreamCone, Wine, GlassWater, Citrus, Scissors, AlertTriangle,
    ChevronRight, ChevronLeft, Check, X, Clock, Sparkles,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
    Ice: <IceCreamCone className="h-7 w-7" />,
    Bottles: <Wine className="h-7 w-7" />,
    Glassware: <GlassWater className="h-7 w-7" />,
    Mixers: <Citrus className="h-7 w-7" />,
    Garnish: <Citrus className="h-7 w-7" />,
    "Napkins/Straws": <Scissors className="h-7 w-7" />,
    Problems: <AlertTriangle className="h-7 w-7" />,
};

export default function BartenderPage() {
    const [path, setPath] = useState<RequestNodeWithChildren[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedNode, setSelectedNode] = useState<RequestNodeWithChildren | null>(null);

    const currentNodes = path.length === 0
        ? mockRequestTree
        : path[path.length - 1].children;

    const breadcrumb = path.map((n) => n.label);

    const handleNodeTap = useCallback((node: RequestNodeWithChildren) => {
        if (node.is_terminal) {
            setSelectedNode(node);
            setShowConfirm(true);
        } else {
            setPath((prev) => [...prev, node]);
        }
    }, []);

    const handleBack = useCallback(() => {
        setPath((prev) => prev.slice(0, -1));
    }, []);

    const handleConfirm = useCallback(() => {
        // In production this calls createRequest server action
        setShowConfirm(false);
        setSelectedNode(null);
        setPath([]);
    }, []);

    const bartenderRequests = mockRequests.filter((r) => r.bar_id === "bar-1").slice(0, 5);

    return (
        <DashboardShell
            role="bartender"
            eventName={mockEvent.name}
            barName="Main Bar"
            userName="Jordan Lee"
        >
            {/* Quick Actions */}
            <div className="mb-6">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Quick Actions
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
                    {mockRequestTree.filter((n) => n.is_terminal).slice(0, 4).map((node) => (
                        <button
                            key={node.id}
                            onClick={() => handleNodeTap(node)}
                            className="tap-target flex min-w-[100px] shrink-0 flex-col items-center gap-2 rounded-xl border border-border/50 bg-card p-4 text-sm font-medium text-foreground transition-all active:scale-95 hover:border-cb-accent/30 hover:shadow-glow"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cb-accent/10 text-cb-accent">
                                {categoryIcons[node.label] ?? <Sparkles className="h-7 w-7" />}
                            </div>
                            <span className="text-xs">{node.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Grid / Drill-Down */}
            <div className="mb-6">
                {/* Breadcrumb */}
                {path.length > 0 && (
                    <div className="mb-3 flex items-center gap-2">
                        <button
                            onClick={handleBack}
                            className="tap-target flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-cb-accent-light transition-colors hover:bg-card"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back
                        </button>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            {breadcrumb.map((label, i) => (
                                <span key={i} className="flex items-center gap-1">
                                    {i > 0 && <ChevronRight className="h-3 w-3" />}
                                    <span className={i === breadcrumb.length - 1 ? "text-foreground font-medium" : ""}>
                                        {label}
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {path.length === 0 ? "Categories" : path[path.length - 1].label}
                </h2>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {currentNodes.map((node) => (
                        <button
                            key={node.id}
                            onClick={() => handleNodeTap(node)}
                            className={cn(
                                "tap-target group flex flex-col items-center gap-2 rounded-xl border p-5 text-center transition-all active:scale-95",
                                node.is_terminal
                                    ? "border-cb-accent/30 bg-cb-accent/5 hover:bg-cb-accent/10 hover:shadow-glow"
                                    : "border-border/50 bg-card hover:border-cb-accent/30",
                            )}
                        >
                            <div className={cn(
                                "flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
                                node.is_terminal ? "bg-cb-accent/15 text-cb-accent" : "bg-secondary text-muted-foreground group-hover:text-cb-accent",
                            )}>
                                {categoryIcons[node.label] ?? (
                                    node.is_terminal
                                        ? <Check className="h-6 w-6" />
                                        : <ChevronRight className="h-6 w-6" />
                                )}
                            </div>
                            <span className="text-sm font-medium text-foreground">{node.label}</span>
                            {!node.is_terminal && (
                                <span className="text-xs text-muted-foreground">{node.children.length} items</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Requests */}
            <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Recent Requests
                </h2>
                <div className="space-y-2">
                    {bartenderRequests.map((req) => (
                        <RecentRequestCard key={req.id} request={req} />
                    ))}
                    {bartenderRequests.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">No recent requests</p>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && selectedNode && (
                <ConfirmationSheet
                    node={selectedNode}
                    path={[...breadcrumb, selectedNode.label]}
                    onConfirm={handleConfirm}
                    onCancel={() => { setShowConfirm(false); setSelectedNode(null); }}
                />
            )}
        </DashboardShell>
    );
}

function RecentRequestCard({ request }: { request: RequestWithDetails }) {
    return (
        <div className="flex items-center gap-3 rounded-lg bg-card/50 p-3">
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{request.request_label}</span>
                    <StatusBadge status={request.status} />
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {timeAgo(request.created_at)}
                </div>
            </div>
        </div>
    );
}

function ConfirmationSheet({
    node,
    path,
    onConfirm,
    onCancel,
}: {
    node: RequestNodeWithChildren;
    path: string[];
    onConfirm: () => void;
    onCancel: () => void;
}) {
    const label = path.join(" → ");

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

            {/* Sheet */}
            <div className="relative w-full max-w-lg rounded-t-2xl border border-border/50 bg-card p-6 sm:rounded-2xl animate-in slide-in-from-bottom duration-300">
                <div className="mb-1 flex justify-center sm:hidden">
                    <div className="h-1 w-10 rounded-full bg-border" />
                </div>

                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-accent shadow-lg">
                        <Check className="h-8 w-8 text-black" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Confirm Request</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        You are about to request:
                    </p>
                    <p className="mt-1 text-base font-semibold text-cb-accent-light">{label}</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="tap-target flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="tap-target flex-1 rounded-xl gradient-accent px-4 py-3 text-sm font-bold text-black transition-all hover:opacity-90 active:scale-95 glow-accent"
                    >
                        Send Request
                    </button>
                </div>
            </div>
        </div>
    );
}
