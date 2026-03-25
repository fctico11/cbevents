-- RUN THIS ONLY AFTER CREATING manager@test.com AND bartender@test.com IN THE AUTHENTICATION TAB

DO $$
DECLARE
    manager_id uuid;
    bartender_id uuid;
    new_event_id uuid;
    new_bar_id uuid;
BEGIN
    -- 1. Get the generated User IDs from auth.users
    SELECT id INTO manager_id FROM auth.users WHERE email = 'manager@test.com' LIMIT 1;
    SELECT id INTO bartender_id FROM auth.users WHERE email = 'bartender@test.com' LIMIT 1;

    -- Ensure we found them
    IF manager_id IS NULL OR bartender_id IS NULL THEN
        RAISE EXCEPTION 'Could not find the dummy users. Did you create them in the Authentication tab?';
    END IF;

    -- 2. Update their profiles with names
    UPDATE public.profiles SET full_name = 'Alex Rivera (Manager)' WHERE id = manager_id;
    UPDATE public.profiles SET full_name = 'Sam Bartender' WHERE id = bartender_id;

    -- 3. Create a Dummy Event
    INSERT INTO public.events (name, description, date, location, created_by)
    VALUES ('Neon Nights Festival', 'The biggest cyberpunk music festival of the year', '2026-07-15', 'Neo-Tokyo Arena', manager_id)
    RETURNING id INTO new_event_id;

    -- 4. Create a Dummy Bar for the Event
    INSERT INTO public.bars (event_id, name, location_note, sort_order)
    VALUES (new_event_id, 'Main Stage Bar', 'Right side of the main stage', 1)
    RETURNING id INTO new_bar_id;

    -- 5. Assign Users to the Event with specific roles
    INSERT INTO public.event_users (event_id, user_id, role)
    VALUES (new_event_id, manager_id, 'manager');

    INSERT INTO public.event_users (event_id, user_id, bar_id, role)
    VALUES (new_event_id, bartender_id, new_bar_id, 'bartender');

END $$;
