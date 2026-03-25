# CB Events — Mobile-First Event Bar Operations

A real-time, mobile-first bar operations platform for premium event management. Built for luxury hospitality teams who need speed, clarity, and elegance.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| UI Primitives | shadcn/ui (ready to add) |
| Database & Auth | Supabase |
| Realtime | Supabase Realtime (postgres_changes) |
| SMS | Twilio |
| State | Zustand |
| Validation | Zod + React Hook Form |
| Icons | Lucide |
| Deployment | Vercel |

## Local Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd cbevents
npm install
```

### 2. Environment variables

Copy the example and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_FROM_NUMBER` | Twilio phone number (E.164 format) |
| `NEXT_PUBLIC_APP_URL` | App URL (e.g., `http://localhost:3000`) |

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migration files in order:
   - `supabase/migrations/00001_initial_schema.sql`
   - `supabase/migrations/00002_rls_policies.sql`
3. Create auth users in the Supabase dashboard (see `supabase/seed.sql` for accounts)
4. Update the UUIDs in `supabase/seed.sql` with the real auth user IDs
5. Run the seed SQL
6. Enable Realtime on the `requests` and `request_activity` tables (already in migration)

### 4. Twilio Setup

1. Sign up at [twilio.com](https://www.twilio.com)
2. Get a phone number
3. Copy Account SID, Auth Token, and phone number to `.env.local`

### 5. Run

```bash
npm run dev
```

Visit `http://localhost:3000`

## Demo Pages (Work Without Supabase)

The app ships with mock data so you can browse all views immediately:

- `/` — Marketing landing page
- `/login` — Login page (mock redirect by email)
- `/manager` — Manager dashboard
- `/bartender` — Bartender request view
- `/barback` — Barback queue view
- `/events/demo/builder` — Request tree builder

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/        # Landing page
│   ├── (auth)/             # Login
│   ├── (dashboard)/        # Manager, Bartender, Barback, Builder
│   └── api/                # API routes (Twilio webhook)
├── components/             # React components by domain
│   ├── layout/             # DashboardShell
│   ├── branding/           # Logo
│   ├── manager/            # BarsOverviewGrid, ActivityFeed, RequestsTable
│   ├── shared/             # StatusBadge, ElapsedTimer
│   └── builder/            # (placeholder)
├── hooks/                  # useRealtimeRequests
├── stores/                 # Zustand stores
├── lib/
│   ├── supabase/           # Browser client, server client, middleware, actions
│   ├── auth/               # Login/logout server actions
│   ├── sms/                # Twilio client, notification service
│   ├── types/              # TypeScript domain types
│   ├── validators/         # Zod schemas
│   ├── utils/              # cn, timeAgo, elapsedTime, deepLink
│   └── constants/          # Roles, statuses, routes
└── styles/                 # (placeholder)
```

## What's Implemented

- ✅ Full repository structure with App Router
- ✅ Dark design token system (amber/orange luxury palette)
- ✅ 8 TypeScript domain types with strict typing
- ✅ SQL migrations for all 8 tables with indexes and FK constraints
- ✅ RLS policies (starter, documented)
- ✅ Seed SQL with realistic demo data
- ✅ Manager dashboard (bars grid, activity feed, requests table)
- ✅ Bartender view (quick actions, category grid, tree drill-down, confirmation modal)
- ✅ Barback view (filter tabs, queue cards, claim/complete CTAs)
- ✅ Event request tree builder
- ✅ Marketing landing page
- ✅ Login page (scaffolding)
- ✅ Supabase clients (browser, server, admin, middleware)
- ✅ Server actions (createRequest, claimRequest, completeRequest, cancelRequest)
- ✅ Request label generation (path walking)
- ✅ Realtime hook (useRealtimeRequests)
- ✅ SMS notification service (Twilio)
- ✅ API route for SMS on request creation
- ✅ Notification logging
- ✅ Zustand stores
- ✅ Zod validators
- ✅ PWA manifest
- ✅ Security headers

## What's Deferred to v2

- ❌ Push notifications (repo is PWA-ready)
- ❌ Offline support
- ❌ Node reordering (drag-and-drop in builder)
- ❌ Role-based middleware guards
- ❌ User profile management
- ❌ Event CRUD (only viewing/building for now)
- ❌ Polished auth UX (password reset, invite flow)
- ❌ Rate limiting on RLS policies
- ❌ Analytics / reporting

## Vercel Deployment

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Add all environment variables from `.env.local.example`
3. Deploy — no special build config needed
4. Update `NEXT_PUBLIC_APP_URL` to your production URL
5. Set up Supabase URL allowlist if needed

## License

Private — CB Events
