"use client";

import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/lib/types";

const statusConfig: Record<RequestStatus, { label: string; className: string }> = {
    open: { label: "Open", className: "status-open" },
    claimed: { label: "Claimed", className: "status-claimed" },
    completed: { label: "Completed", className: "status-completed" },
    cancelled: { label: "Cancelled", className: "status-cancelled" },
};

interface StatusBadgeProps {
    status: RequestStatus;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                config.className,
                className,
            )}
        >
            {config.label}
        </span>
    );
}
