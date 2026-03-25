DO $$
DECLARE
    new_manager_id uuid;
    old_manager_id uuid;
BEGIN
    -- Get the ID of the new user you made
    SELECT id INTO new_manager_id FROM auth.users WHERE email = 'fac322@nyu.edu' LIMIT 1;
    
    -- Get the ID of the old dummy manager
    SELECT id INTO old_manager_id FROM auth.users WHERE email = 'manager@test.com' LIMIT 1;

    -- Update the events table so your new user is the creator
    UPDATE public.events SET created_by = new_manager_id WHERE created_by = old_manager_id;

    -- Update the event_users table so your new user is the manager
    UPDATE public.event_users SET user_id = new_manager_id WHERE user_id = old_manager_id;
    
    -- Ensure the role is manager
    UPDATE public.event_users SET role = 'manager' WHERE user_id = new_manager_id;

END $$;
