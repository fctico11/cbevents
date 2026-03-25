"use client";

import { Logo } from "@/components/branding/logo";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";
import { LayoutGrid, Wine, Package, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardShellProps {
    children: React.ReactNode;
    role: UserRole;
    eventName?: string;
    barName?: string;
    userName?: string;
}

const roleLabels: Record<UserRole, string> = {
    manager: "Manager",
    bartender: "Bartender",
    barback: "Barback",
};

const roleNav: Record<UserRole, Array<{ href: string; label: string; icon: React.ReactNode }>> = {
    manager: [
        { href: "/manager", label: "Dashboard", icon: <LayoutGrid className="h-5 w-5" /> },
        { href: "/events/demo/builder", label: "Builder", icon: <Settings className="h-5 w-5" /> },
    ],
    bartender: [
        { href: "/bartender", label: "Requests", icon: <Wine className="h-5 w-5" /> },
    ],
    barback: [
        { href: "/barback", label: "Queue", icon: <Package className="h-5 w-5" /> },
    ],
};

export function DashboardShell({ children, role, eventName, barName, userName }: DashboardShellProps) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-dvh flex-col">
            {/* Top Bar */}
            <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="flex h-14 items-center justify-between px-4">
                    <Logo />
                    <div className="flex items-center gap-3">
                        <span className="rounded-full bg-cb-accent/10 px-2.5 py-0.5 text-xs font-medium text-cb-accent-light">
                            {roleLabels[role]}
                        </span>
                        {userName && (
                            <span className="text-sm text-muted-foreground hidden sm:inline">
                                {userName}
                            </span>
                        )}
                        <button className="tap-target flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground">
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Event / Bar info strip */}
                {(eventName || barName) && (
                    <div className="flex items-center gap-2 border-t border-border/30 bg-card/50 px-4 py-1.5 text-xs text-muted-foreground">
                        {eventName && <span>{eventName}</span>}
                        {eventName && barName && <span className="text-border">•</span>}
                        {barName && <span className="text-cb-accent-light">{barName}</span>}
                        <div className="ml-auto flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cb-success opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-cb-success"></span>
                            </span>
                            <span className="text-cb-success">Live</span>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 py-4 pb-24 sm:px-6 sm:py-6">
                {children}
            </main>

            {/* Bottom Nav (mobile) */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/90 backdrop-blur-xl sm:hidden">
                <div className="flex items-center justify-around py-2">
                    {roleNav[role].map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "tap-target flex flex-col items-center gap-0.5 rounded-lg px-4 py-1 text-xs transition-colors",
                                    isActive ? "text-cb-accent-light" : "text-muted-foreground",
                                )}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
