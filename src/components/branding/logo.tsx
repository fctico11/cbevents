"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function Logo({ className }: { className?: string }) {
    return (
        <Link href="/" className={cn("flex items-center gap-2", className)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-accent">
                <Sparkles className="h-4 w-4 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tight">
                <span className="text-gradient-accent">CB</span>
                <span className="text-foreground"> Events</span>
            </span>
        </Link>
    );
}
