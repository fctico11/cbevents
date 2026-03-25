import { DashboardShell } from "@/components/layout/dashboard-shell";
import { BarsOverviewGrid, LiveActivityFeed, ActiveRequestsTable } from "@/components/manager";
import { getDashboardData } from "@/lib/supabase/queries";
import { Calendar, MapPin } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ManagerPage() {
    const data = await getDashboardData();
    
    if (!data || !data.user || !data.event || !data.eventUser) {
        redirect("/login");
    }

    const { event, bars, requests, activity, eventUser, user } = data;

    const userName = Array.isArray(eventUser.profiles) ? eventUser.profiles[0]?.full_name : (eventUser.profiles as any)?.full_name;

    return (
        <DashboardShell role="manager" eventName={event.name} userName={userName || user.email}>
            {/* Event Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">{event.name}</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                    {event.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {/* Bars Grid */}
                <BarsOverviewGrid bars={bars as any} />

                {/* Two-column layout on desktop */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <LiveActivityFeed activities={activity as any} />
                    <ActiveRequestsTable requests={requests as any} />
                </div>
            </div>
        </DashboardShell>
    );
}

