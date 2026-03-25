-- CB Events — Seed Data
-- Run this after creating auth users in Supabase dashboard or via API.
--
-- INSTRUCTIONS:
-- 1. Create these auth users in Supabase Auth dashboard first:
--    - manager@cbevents.com  (password: demo1234)
--    - bartender1@cbevents.com (password: demo1234)
--    - bartender2@cbevents.com (password: demo1234)
--    - barback1@cbevents.com (password: demo1234)
--    - barback2@cbevents.com (password: demo1234)
-- 2. Copy the UUIDs assigned by Supabase Auth
-- 3. Replace the placeholder UUIDs below
-- 4. Run this file against your Supabase database

-- ═══════════════════════════════════════════════
-- REPLACE THESE WITH REAL AUTH USER IDs
-- ═══════════════════════════════════════════════
-- Manager:    11111111-1111-1111-1111-111111111111
-- Bartender1: 22222222-2222-2222-2222-222222222222
-- Bartender2: 33333333-3333-3333-3333-333333333333
-- Barback1:   44444444-4444-4444-4444-444444444444
-- Barback2:   55555555-5555-5555-5555-555555555555

-- ─── Update Profiles with names and phones ───
update public.profiles set full_name = 'Alex Rivera', phone = '+15551000001' where id = '11111111-1111-1111-1111-111111111111';
update public.profiles set full_name = 'Jordan Lee', phone = '+15551000002' where id = '22222222-2222-2222-2222-222222222222';
update public.profiles set full_name = 'Taylor Kim', phone = '+15551000003' where id = '33333333-3333-3333-3333-333333333333';
update public.profiles set full_name = 'Casey Morgan', phone = '+15551000004' where id = '44444444-4444-4444-4444-444444444444';
update public.profiles set full_name = 'Drew Santos', phone = '+15551000005' where id = '55555555-5555-5555-5555-555555555555';

-- ─── Event ───
insert into public.events (id, name, description, date, location, is_active, created_by)
values (
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'Grand Luxe Gala 2026',
  'Annual luxury charity gala at The Grand Ballroom',
  '2026-04-15',
  'The Grand Ballroom, 550 Park Avenue, NY',
  true,
  '11111111-1111-1111-1111-111111111111'
);

-- ─── Bars ───
insert into public.bars (id, event_id, name, location_note, sort_order) values
  ('bbbbbb01-0000-0000-0000-000000000001', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Main Bar', 'Center of ballroom', 1),
  ('bbbbbb01-0000-0000-0000-000000000002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'VIP Lounge', 'Second floor, east wing', 2),
  ('bbbbbb01-0000-0000-0000-000000000003', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Garden Bar', 'Outdoor terrace', 3),
  ('bbbbbb01-0000-0000-0000-000000000004', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Cocktail Station', 'Near entrance foyer', 4),
  ('bbbbbb01-0000-0000-0000-000000000005', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Service Bar', 'Kitchen pass-through', 5);

-- ─── Event Users ───
insert into public.event_users (event_id, user_id, bar_id, role) values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', null, 'manager'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'bbbbbb01-0000-0000-0000-000000000001', 'bartender'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'bbbbbb01-0000-0000-0000-000000000002', 'bartender'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', null, 'barback'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', null, 'barback');

-- ─── Request Tree ───
-- Top-level categories
insert into public.request_nodes (id, event_id, parent_id, label, is_terminal, sort_order) values
  ('aaaa0001-0000-0000-0000-000000000001', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', null, 'Ice', false, 1),
  ('aaaa0001-0000-0000-0000-000000000002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', null, 'Bottles', false, 2),
  ('aaaa0001-0000-0000-0000-000000000003', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', null, 'Glassware', false, 3),
  ('aaaa0001-0000-0000-0000-000000000004', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', null, 'Mixers', true, 4),
  ('aaaa0001-0000-0000-0000-000000000005', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', null, 'Garnish', true, 5),
  ('aaaa0001-0000-0000-0000-000000000006', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', null, 'Napkins/Straws', true, 6),
  ('aaaa0001-0000-0000-0000-000000000007', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', null, 'Problems', true, 7);

-- Ice children
insert into public.request_nodes (id, event_id, parent_id, label, is_terminal, sort_order) values
  ('aaaa0002-0000-0000-0000-000000000001', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaa0001-0000-0000-0000-000000000001', '2 Bags', true, 1),
  ('aaaa0002-0000-0000-0000-000000000002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaa0001-0000-0000-0000-000000000001', '4 Bags', true, 2),
  ('aaaa0002-0000-0000-0000-000000000003', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaa0001-0000-0000-0000-000000000001', '6 Bags', true, 3);

-- Bottles children
insert into public.request_nodes (id, event_id, parent_id, label, is_terminal, sort_order) values
  ('aaaa0003-0000-0000-0000-000000000001', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaa0001-0000-0000-0000-000000000002', 'Liquor', true, 1),
  ('aaaa0003-0000-0000-0000-000000000002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaa0001-0000-0000-0000-000000000002', 'Wine', true, 2),
  ('aaaa0003-0000-0000-0000-000000000003', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaa0001-0000-0000-0000-000000000002', 'Beer', false, 3);

-- Beer children
insert into public.request_nodes (id, event_id, parent_id, label, is_terminal, sort_order) values
  ('aaaa0004-0000-0000-0000-000000000001', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaa0003-0000-0000-0000-000000000003', 'Asahi', true, 1),
  ('aaaa0004-0000-0000-0000-000000000002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaa0003-0000-0000-0000-000000000003', 'Michelob Ultra', true, 2),
  ('aaaa0004-0000-0000-0000-000000000003', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaa0003-0000-0000-0000-000000000003', 'Corona', true, 3);

-- Glassware children
insert into public.request_nodes (id, event_id, parent_id, label, is_terminal, sort_order) values
  ('aaaa0005-0000-0000-0000-000000000001', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaa0001-0000-0000-0000-000000000003', 'Coupe Glasses', true, 1),
  ('aaaa0005-0000-0000-0000-000000000002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaa0001-0000-0000-0000-000000000003', 'Rocks Glasses', true, 2),
  ('aaaa0005-0000-0000-0000-000000000003', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaa0001-0000-0000-0000-000000000003', 'Beer Glasses', true, 3);

-- ─── Sample Requests ───
insert into public.requests (id, event_id, bar_id, node_id, request_label, status, priority, created_by, assigned_to_user_id, created_at) values
  ('rrrr0001-0000-0000-0000-000000000001', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbb01-0000-0000-0000-000000000001', 'aaaa0002-0000-0000-0000-000000000001', 'Ice → 2 Bags', 'open', 2, '22222222-2222-2222-2222-222222222222', null, now() - interval '12 minutes'),
  ('rrrr0001-0000-0000-0000-000000000002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbb01-0000-0000-0000-000000000001', 'aaaa0004-0000-0000-0000-000000000001', 'Bottles → Beer → Asahi', 'claimed', 1, '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', now() - interval '8 minutes'),
  ('rrrr0001-0000-0000-0000-000000000003', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbb01-0000-0000-0000-000000000002', 'aaaa0005-0000-0000-0000-000000000001', 'Glassware → Coupe Glasses', 'open', 1, '33333333-3333-3333-3333-333333333333', null, now() - interval '5 minutes'),
  ('rrrr0001-0000-0000-0000-000000000004', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbb01-0000-0000-0000-000000000002', 'aaaa0001-0000-0000-0000-000000000004', 'Mixers', 'completed', 1, '33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', now() - interval '25 minutes'),
  ('rrrr0001-0000-0000-0000-000000000005', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbb01-0000-0000-0000-000000000003', 'aaaa0001-0000-0000-0000-000000000006', 'Napkins/Straws', 'open', 1, '22222222-2222-2222-2222-222222222222', null, now() - interval '2 minutes');

-- ─── Sample Activity ───
insert into public.request_activity (request_id, user_id, action, details, created_at) values
  ('rrrr0001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'created', 'Created request: Ice → 2 Bags', now() - interval '12 minutes'),
  ('rrrr0001-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'created', 'Created request: Bottles → Beer → Asahi', now() - interval '8 minutes'),
  ('rrrr0001-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'claimed', 'Claimed this request', now() - interval '6 minutes'),
  ('rrrr0001-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'created', 'Created request: Glassware → Coupe Glasses', now() - interval '5 minutes'),
  ('rrrr0001-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'created', 'Created request: Mixers', now() - interval '25 minutes'),
  ('rrrr0001-0000-0000-0000-000000000004', '55555555-5555-5555-5555-555555555555', 'claimed', 'Claimed this request', now() - interval '22 minutes'),
  ('rrrr0001-0000-0000-0000-000000000004', '55555555-5555-5555-5555-555555555555', 'completed', 'Marked request as completed', now() - interval '18 minutes'),
  ('rrrr0001-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'created', 'Created request: Napkins/Straws', now() - interval '2 minutes');
