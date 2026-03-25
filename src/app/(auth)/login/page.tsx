"use client";

import { useState, useTransition } from "react";
import { Logo } from "@/components/branding/logo";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/lib/auth/actions";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await loginAction(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    }

    return (
        <div className="flex min-h-dvh items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <div className="mb-6 flex justify-center">
                        <Logo />
                    </div>
                    <h1 className="text-xl font-bold text-foreground">Welcome back</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Sign in to your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            className="tap-target w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-cb-accent focus:ring-1 focus:ring-cb-accent"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                className="tap-target w-full rounded-xl border border-border bg-card px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-cb-accent focus:ring-1 focus:ring-cb-accent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-cb-error/10 px-3 py-2 text-sm text-cb-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="tap-target w-full rounded-xl gradient-accent px-4 py-3 text-sm font-bold text-black transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 glow-accent"
                    >
                        {isPending ? "Signing in…" : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 rounded-xl border border-border/50 bg-card/50 p-4 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground mb-2">Accounts Setup:</p>
                    <ul className="space-y-1">
                        <li><span className="text-cb-accent-light">Manager:</span> fac322@nyu.edu</li>
                        <li><span className="text-cb-accent-light">Bartender:</span> bartender1@cbevents.com</li>
                        <li><span className="text-cb-accent-light">Barback:</span> barback1@cbevents.com</li>
                    </ul>
                    <p className="mt-2">Password: <span className="font-mono text-foreground">demo1234</span></p>
                </div>
            </div>
        </div>
    );
}
