import Link from "next/link";
import { Sparkles, ArrowRight, Shield, Zap, Bell } from "lucide-react";

export default function MarketingPage() {
    return (
        <div className="min-h-dvh bg-background">
            {/* Hero */}
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cb-accent/5 via-transparent to-transparent" />
                <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-16 sm:pt-24">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-accent">
                            <Sparkles className="h-5 w-5 text-black" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            <span className="text-gradient-accent">CB</span> Events
                        </span>
                    </div>

                    <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
                        Bar operations,{" "}
                        <span className="text-gradient-accent">elevated.</span>
                    </h1>
                    <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
                        Real-time request management for premium events.
                        Built for managers, bartenders, and barbacks who demand speed and elegance.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link
                            href="/login"
                            className="tap-target inline-flex items-center gap-2 rounded-xl gradient-accent px-6 py-3 text-sm font-bold text-black transition-all hover:opacity-90 active:scale-95 glow-accent"
                        >
                            Get Started <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/manager"
                            className="tap-target inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-cb-accent/30"
                        >
                            View Demo
                        </Link>
                    </div>
                </div>
            </header>

            {/* Features */}
            <section className="border-t border-border/50 bg-card/30 px-6 py-20">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-cb-accent">
                        Built for the Floor
                    </h2>
                    <p className="mt-3 text-center text-2xl font-bold text-foreground sm:text-3xl">
                        Everything your team needs, nothing they don&apos;t.
                    </p>

                    <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
                        <FeatureCard
                            icon={<Zap className="h-6 w-6" />}
                            title="Instant Requests"
                            description="Bartenders tap through a configurable tree. No typing, no delays. Requests reach the team in seconds."
                        />
                        <FeatureCard
                            icon={<Bell className="h-6 w-6" />}
                            title="SMS Alerts"
                            description="Every manager and barback gets notified via SMS the moment a request is created. Never miss a beat."
                        />
                        <FeatureCard
                            icon={<Shield className="h-6 w-6" />}
                            title="Live Dashboard"
                            description="Managers see every bar, every request, every status — all updating in real time. No refresh needed."
                        />
                    </div>
                </div>
            </section>

            {/* Role Cards */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <RoleCard
                            role="Manager"
                            href="/manager"
                            description="Bird&apos;s-eye view of all bars, live activity, and active requests."
                        />
                        <RoleCard
                            role="Bartender"
                            href="/bartender"
                            description="Tap-through request tree. Fast, thumb-friendly, zero friction."
                        />
                        <RoleCard
                            role="Barback"
                            href="/barback"
                            description="Live queue with claim/complete. See what&apos;s open, act fast."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/50 px-6 py-8">
                <div className="mx-auto max-w-5xl text-center text-xs text-muted-foreground">
                    © 2026 CB Events. Built for luxury hospitality operations.
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="glass-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cb-accent/10 text-cb-accent">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
    );
}

function RoleCard({ role, href, description }: { role: string; href: string; description: string }) {
    return (
        <Link
            href={href}
            className="glass-card group flex flex-col p-6 transition-all hover:border-cb-accent/30 hover:shadow-glow"
        >
            <h3 className="text-lg font-bold text-foreground group-hover:text-cb-accent-light transition-colors">
                {role}
            </h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{description}</p>
            <div className="mt-4 flex items-center gap-1 text-sm text-cb-accent">
                Try Demo <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
}
