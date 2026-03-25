DO $$
DECLARE
    v_event_id uuid;
    v_bottles_id uuid;
    v_mixers_id uuid;
    v_glassware_id uuid;
BEGIN
    -- Grab the current active event
    SELECT id INTO v_event_id FROM public.events LIMIT 1;

    -- Root level nodes
    INSERT INTO public.request_nodes (event_id, label, is_terminal, sort_order)
    VALUES (v_event_id, 'Ice', true, 1);
    
    INSERT INTO public.request_nodes (event_id, label, is_terminal, sort_order)
    VALUES (v_event_id, 'Bottles', false, 2) RETURNING id INTO v_bottles_id;
    
    INSERT INTO public.request_nodes (event_id, label, is_terminal, sort_order)
    VALUES (v_event_id, 'Mixers', false, 3) RETURNING id INTO v_mixers_id;
    
    INSERT INTO public.request_nodes (event_id, label, is_terminal, sort_order)
    VALUES (v_event_id, 'Glassware', false, 4) RETURNING id INTO v_glassware_id;
    
    INSERT INTO public.request_nodes (event_id, label, is_terminal, sort_order)
    VALUES (v_event_id, 'Problems', true, 5);

    -- Second level nodes (Children of Bottles)
    INSERT INTO public.request_nodes (event_id, parent_id, label, is_terminal, sort_order)
    VALUES 
        (v_event_id, v_bottles_id, 'Vodka', true, 1),
        (v_event_id, v_bottles_id, 'Tequila', true, 2),
        (v_event_id, v_bottles_id, 'Whiskey', true, 3);
        
    -- Second level nodes (Children of Mixers)
    INSERT INTO public.request_nodes (event_id, parent_id, label, is_terminal, sort_order)
    VALUES 
        (v_event_id, v_mixers_id, 'Coke', true, 1),
        (v_event_id, v_mixers_id, 'Sprite', true, 2),
        (v_event_id, v_mixers_id, 'Soda Water', true, 3);
        
    -- Second level nodes (Children of Glassware)
    INSERT INTO public.request_nodes (event_id, parent_id, label, is_terminal, sort_order)
    VALUES 
        (v_event_id, v_glassware_id, 'Rocks Glass', true, 1),
        (v_event_id, v_glassware_id, 'Highball', true, 2);

END $$;
