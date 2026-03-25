import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/** Format a relative time string from a date */
export function timeAgo(date: string | Date): string {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return `${Math.floor(diffHour / 24)}d ago`;
}

/** Format elapsed time as MM:SS or HH:MM:SS */
export function elapsedTime(date: string | Date): string {
    const now = new Date();
    const then = new Date(date);
    const diffSec = Math.floor((now.getTime() - then.getTime()) / 1000);
    const hours = Math.floor(diffSec / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    return `${pad(minutes)}:${pad(seconds)}`;
}

/** Truncate a string to max length */
export function truncate(str: string, max: number): string {
    if (str.length <= max) return str;
    return str.slice(0, max - 1) + "…";
}

/** Generate a deep link URL for a request */
export function requestDeepLink(requestId: string): string {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return `${base}/barback?request=${requestId}`;
}

/** Safely get an environment variable, throw if missing in production */
export function getEnvVar(key: string, fallback?: string): string {
    const value = process.env[key] ?? fallback;
    if (!value && process.env.NODE_ENV === "production") {
        throw new Error(`Missing required env var: ${key}`);
    }
    return value ?? "";
}
