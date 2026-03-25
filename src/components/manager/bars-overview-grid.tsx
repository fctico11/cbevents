"use client";

import { cn, timeAgo } from "@/lib/utils";
import type { BarWithDetails } from "@/lib/types";
import { MapPin, User, Clock, AlertCircle } from "lucide-react";

interface BarsOverviewGridProps {
    bars: BarWithDetails[];
}

export function BarsOverviewGrid({ bars }: BarsOverviewGridProps) {
    return (
        <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Bars Overview
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {bars.map((bar) => (
                    <BarCard key={bar.id} bar={bar} />
                ))}
            </div>
        </div>
    );
}

function BarCard({ bar }: { bar: BarWithDetails }) {
    const hasOpenRequests = bar.open_request_count > 0;

    return (
        <div
            className={cn(
                "glass-card p-4 transition-all duration-200 hover:border-cb-accent/30",
                hasOpenRequests && "border-cb-accent/20",
            )}
        >
            <div className="mb-3 flex items-start justify-between">
                <div>
                    <h3 className="font-semibold text-foreground">{bar.name}</h3>
                    {bar.location_note && (
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {bar.location_note}
                        </div>
                    )}
                </div>
                {hasOpenRequests && (
                    <div className="flex items-center gap-1 rounded-full bg-cb-accent/15 px-2 py-0.5">
                        <AlertCircle className="h-3 w-3 text-cb-accent" />
                        <span className="text-xs font-bold text-cb-accent-light">{bar.open_request_count}</span>
                    </div>
                )}
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    <span>{bar.bartender?.full_name ?? "Unassigned"}</span>
                </div>
                {bar.oldest_open_request_at && (
                    <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-cb-warning" />
                        <span className="text-cb-warning">
                            Oldest: {timeAgo(bar.oldest_open_request_at)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
