-- CB Events — Row Level Security Policies
-- Migration: 00002_rls_policies.sql
--
-- ⚠️  PLACEHOLDER POLICIES — These are suitable for local development
-- and basic multi-tenancy. They should be hardened before production use.
-- Key areas to harden:
--   - Add rate limiting on request creation
--   - Tighten profile access (currently any authenticated user can read)
--   - Add policies for notification_logs (currently admin-only via service role)
--   - Consider adding event ownership checks for managers

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.bars enable row level security;
alter table public.event_users enable row level security;
alter table public.request_nodes enable row level security;
alter table public.requests enable row level security;
alter table public.request_activity enable row level security;
alter table public.notification_logs enable row level security;

-- ─── Profiles ───
-- Any authenticated user can read profiles (needed for display names)
-- Users can only update their own profile
create policy "profiles_select" on public.profiles
  for select to authenticated using (true);

create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid());

-- ─── Events ───
-- Users can read events they belong to
create policy "events_select_member" on public.events
  for select to authenticated using (
    exists (
      select 1 from public.event_users
      where event_users.event_id = events.id
        and event_users.user_id = auth.uid()
        and event_users.is_active = true
    )
  );

-- Managers can update events they belong to
-- ⚠️ PLACEHOLDER: Should check created_by or explicit manager permission
create policy "events_update_manager" on public.events
  for update to authenticated using (
    exists (
      select 1 from public.event_users
      where event_users.event_id = events.id
        and event_users.user_id = auth.uid()
        and event_users.role = 'manager'
        and event_users.is_active = true
    )
  );

-- ─── Bars ───
-- Users can read bars for events they belong to
create policy "bars_select_member" on public.bars
  for select to authenticated using (
    exists (
      select 1 from public.event_users
      where event_users.event_id = bars.event_id
        and event_users.user_id = auth.uid()
        and event_users.is_active = true
    )
  );

-- ─── Event Users ───
-- Users can see other users in their events
create policy "event_users_select_member" on public.event_users
  for select to authenticated using (
    exists (
      select 1 from public.event_users eu
      where eu.event_id = event_users.event_id
        and eu.user_id = auth.uid()
        and eu.is_active = true
    )
  );

-- ─── Request Nodes ───
-- All event members can read the request tree
create policy "request_nodes_select_member" on public.request_nodes
  for select to authenticated using (
    exists (
      select 1 from public.event_users
      where event_users.event_id = request_nodes.event_id
        and event_users.user_id = auth.uid()
        and event_users.is_active = true
    )
  );

-- Managers can manage (insert/update/delete) request nodes
create policy "request_nodes_insert_manager" on public.request_nodes
  for insert to authenticated with check (
    exists (
      select 1 from public.event_users
      where event_users.event_id = request_nodes.event_id
        and event_users.user_id = auth.uid()
        and event_users.role = 'manager'
        and event_users.is_active = true
    )
  );

create policy "request_nodes_update_manager" on public.request_nodes
  for update to authenticated using (
    exists (
      select 1 from public.event_users
      where event_users.event_id = request_nodes.event_id
        and event_users.user_id = auth.uid()
        and event_users.role = 'manager'
        and event_users.is_active = true
    )
  );

create policy "request_nodes_delete_manager" on public.request_nodes
  for delete to authenticated using (
    exists (
      select 1 from public.event_users
      where event_users.event_id = request_nodes.event_id
        and event_users.user_id = auth.uid()
        and event_users.role = 'manager'
        and event_users.is_active = true
    )
  );

-- ─── Requests ───
-- All event members can read requests for their event
create policy "requests_select_member" on public.requests
  for select to authenticated using (
    exists (
      select 1 from public.event_users
      where event_users.event_id = requests.event_id
        and event_users.user_id = auth.uid()
        and event_users.is_active = true
    )
  );

-- Bartenders can create requests for their assigned event/bar
create policy "requests_insert_bartender" on public.requests
  for insert to authenticated with check (
    exists (
      select 1 from public.event_users
      where event_users.event_id = requests.event_id
        and event_users.user_id = auth.uid()
        and event_users.role = 'bartender'
        and event_users.is_active = true
    )
  );

-- Barbacks and managers can update requests in their event
-- ⚠️ PLACEHOLDER: Should restrict which fields can be updated per role
create policy "requests_update_barback_manager" on public.requests
  for update to authenticated using (
    exists (
      select 1 from public.event_users
      where event_users.event_id = requests.event_id
        and event_users.user_id = auth.uid()
        and event_users.role in ('barback', 'manager')
        and event_users.is_active = true
    )
  );

-- ─── Request Activity ───
-- Event members can read activity for their events
create policy "request_activity_select_member" on public.request_activity
  for select to authenticated using (
    exists (
      select 1 from public.requests r
      join public.event_users eu on eu.event_id = r.event_id
      where r.id = request_activity.request_id
        and eu.user_id = auth.uid()
        and eu.is_active = true
    )
  );

-- Any authenticated user in the event can write activity
create policy "request_activity_insert" on public.request_activity
  for insert to authenticated with check (
    exists (
      select 1 from public.requests r
      join public.event_users eu on eu.event_id = r.event_id
      where r.id = request_activity.request_id
        and eu.user_id = auth.uid()
        and eu.is_active = true
    )
  );

-- ─── Notification Logs ───
-- ⚠️ PLACEHOLDER: No user-facing policies — accessed via service role only
-- Managers can read notification logs for their events
create policy "notification_logs_select_manager" on public.notification_logs
  for select to authenticated using (
    exists (
      select 1 from public.requests r
      join public.event_users eu on eu.event_id = r.event_id
      where r.id = notification_logs.request_id
        and eu.user_id = auth.uid()
        and eu.role = 'manager'
        and eu.is_active = true
    )
  );
