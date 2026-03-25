"use client";

import { useEffect, useState } from "react";

interface ElapsedTimerProps {
    since: string;
    className?: string;
}

/** Live-updating elapsed time display */
export function ElapsedTimer({ since, className }: ElapsedTimerProps) {
    const [elapsed, setElapsed] = useState("");

    useEffect(() => {
        function update() {
            const now = Date.now();
            const then = new Date(since).getTime();
            const diffSec = Math.floor((now - then) / 1000);
            const hours = Math.floor(diffSec / 3600);
            const minutes = Math.floor((diffSec % 3600) / 60);
            const seconds = diffSec % 60;
            const pad = (n: number) => n.toString().padStart(2, "0");

            setElapsed(
                hours > 0
                    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
                    : `${pad(minutes)}:${pad(seconds)}`,
            );
        }

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [since]);

    return <span className={className}>{elapsed}</span>;
}
