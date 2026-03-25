"use client";

import { timeAgo } from "@/lib/utils";
import { Activity, Plus, Hand, CheckCircle2, XCircle } from "lucide-react";

interface ActivityItem {
    id: string;
    action: string;
    details: string;
    user: string;
    bar: string;
    created_at: string;
}

interface LiveActivityFeedProps {
    activities: ActivityItem[];
}

const actionIcons: Record<string, React.ReactNode> = {
    created: <Plus className="h-3.5 w-3.5 text-cb-warning" />,
    claimed: <Hand className="h-3.5 w-3.5 text-cb-info" />,
    completed: <CheckCircle2 className="h-3.5 w-3.5 text-cb-success" />,
    cancelled: <XCircle className="h-3.5 w-3.5 text-muted-foreground" />,
};

const actionLabels: Record<string, string> = {
    created: "created",
    claimed: "claimed",
    completed: "completed",
    cancelled: "cancelled",
};

export function LiveActivityFeed({ activities }: LiveActivityFeedProps) {
    return (
        <div className="glass-card p-4">
            <div className="mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-cb-accent" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Activity Feed
                </h2>
                <span className="relative ml-1 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cb-success opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cb-success"></span>
                </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 text-sm">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-card">
                            {actionIcons[activity.action] ?? <Activity className="h-3.5 w-3.5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-foreground">
                                <span className="font-medium">{activity.user}</span>
                                {" "}
                                <span className="text-muted-foreground">{actionLabels[activity.action]}</span>
                                {" "}
                                <span className="font-medium text-cb-accent-light">{activity.details}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {activity.bar} · {timeAgo(activity.created_at)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
