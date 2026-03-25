-- CB Events — Initial Schema
-- Migration: 00001_initial_schema.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles ───
-- Extends Supabase auth.users with app-specific fields
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_email on public.profiles(email);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Events ───
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  date date not null,
  location text,
  is_active boolean not null default true,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_events_date on public.events(date);
create index idx_events_is_active on public.events(is_active);

-- ─── Bars ───
create table public.bars (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  location_note text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_bars_event_id on public.bars(event_id);

-- ─── Event Users ───
-- Maps users to events with a role and optional bar assignment
create table public.event_users (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  bar_id uuid references public.bars(id) on delete set null,
  role text not null check (role in ('manager', 'bartender', 'barback')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(event_id, user_id)
);

create index idx_event_users_event_id on public.event_users(event_id);
create index idx_event_users_user_id on public.event_users(user_id);
create index idx_event_users_bar_id on public.event_users(bar_id);
create index idx_event_users_role on public.event_users(role);

-- ─── Request Nodes ───
-- Recursive tree structure for request categories
create table public.request_nodes (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  parent_id uuid references public.request_nodes(id) on delete cascade,
  label text not null,
  is_terminal boolean not null default false,
  default_priority integer not null default 1,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_request_nodes_event_id on public.request_nodes(event_id);
create index idx_request_nodes_parent_id on public.request_nodes(parent_id);

-- ─── Requests ───
create table public.requests (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  bar_id uuid not null references public.bars(id) on delete cascade,
  node_id uuid not null references public.request_nodes(id),
  request_label text not null, -- Denormalized: "Bottles → Beer → Asahi"
  status text not null default 'open' check (status in ('open', 'claimed', 'completed', 'cancelled')),
  priority integer not null default 1,
  created_by uuid not null references public.profiles(id),
  assigned_to_user_id uuid references public.profiles(id),
  completed_at timestamptz,
  cancelled_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_requests_event_id on public.requests(event_id);
create index idx_requests_bar_id on public.requests(bar_id);
create index idx_requests_status on public.requests(status);
create index idx_requests_assigned_to on public.requests(assigned_to_user_id);
create index idx_requests_created_by on public.requests(created_by);
create index idx_requests_event_status on public.requests(event_id, status);

-- ─── Request Activity ───
create table public.request_activity (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references public.requests(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  action text not null,
  details text,
  created_at timestamptz not null default now()
);

create index idx_request_activity_request_id on public.request_activity(request_id);

-- ─── Notification Logs ───
create table public.notification_logs (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references public.requests(id) on delete cascade,
  recipient_phone text not null,
  recipient_user_id uuid not null references public.profiles(id),
  provider text not null default 'twilio',
  status text not null check (status in ('sent', 'failed', 'queued')),
  provider_message_id text,
  error_message text,
  created_at timestamptz not null default now()
);

create index idx_notification_logs_request_id on public.notification_logs(request_id);

-- ─── Enable Realtime ───
alter publication supabase_realtime add table public.requests;
alter publication supabase_realtime add table public.request_activity;
