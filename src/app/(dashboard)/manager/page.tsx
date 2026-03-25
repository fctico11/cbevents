"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { BarsOverviewGrid, LiveActivityFeed, ActiveRequestsTable } from "@/components/manager";
import { mockEvent, mockBars, mockRequests, mockActivity } from "@/lib/mock-data";
import { Calendar, MapPin } from "lucide-react";

export default function ManagerPage() {
    return (
        <DashboardShell role="manager" eventName={mockEvent.name} userName="Alex Rivera">
            {/* Event Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">{mockEvent.name}</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(mockEvent.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                    {mockEvent.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            <span>{mockEvent.location}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {/* Bars Grid */}
                <BarsOverviewGrid bars={mockBars} />

                {/* Two-column layout on desktop */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <LiveActivityFeed activities={mockActivity} />
                    <ActiveRequestsTable requests={mockRequests} />
                </div>
            </div>
        </DashboardShell>
    );
}
