-- The original policy "event_users_select_member" causes an infinite loop
-- because it queries the event_users table inside its own security rule!
-- We must drop it completely. The "event_users_select_own" policy you just 
-- ran handles the read access perfectly without looping.

DROP POLICY IF EXISTS "event_users_select_member" ON public.event_users;
