-- Fix the RLS infinite recursion issue on event_users
-- This allows users to read their own assignment record

CREATE POLICY "event_users_select_own" ON public.event_users
  FOR SELECT TO authenticated USING (user_id = auth.uid());
