import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function getDashboardData() {
    const supabase = await getSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
        console.error("[getDashboardData] No user:", authError);
        return null;
    }

    const { data: eventUser, error: euError } = await supabase
        .from("event_users")
        .select("event_id, bar_id, role, profiles(full_name)")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

    if (euError || !eventUser) {
        console.error("[getDashboardData] Event user fetch failed:", euError);
        return null;
    }

    const { data: event } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventUser.event_id)
        .single();

    const { data: bars } = await supabase
        .from("bars")
        .select("*")
        .eq("event_id", eventUser.event_id)
        .order("sort_order");

    const { data: requests } = await supabase
        .from("requests")
        .select("*, request_nodes(label, is_terminal), profiles!requests_created_by_fkey(full_name), assignee:profiles!requests_assigned_to_user_id_fkey(full_name), bars(name)")
        .eq("event_id", eventUser.event_id)
        .order("created_at", { ascending: false });

    const { data: activity } = await supabase
        .from("request_activity")
        .select("*, profiles(full_name)")
        .in("request_id", requests?.map(r => r.id) || [])
        .order("created_at", { ascending: false })
        .limit(50);

    return {
        user,
        eventUser,
        event,
        bars: bars || [],
        requests: requests || [],
        activity: activity || [],
    };
}

export async function getBartenderData() {
    const supabase = await getSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
        console.error("[getBartenderData] No user found", authError);
        return null;
    }

    const { data: eventUser, error: euError } = await supabase
        .from("event_users")
        .select("event_id, bar_id, role, profiles(full_name)")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

    if (euError || !eventUser) {
        console.error("[getBartenderData] eventUser error or missing:", euError, eventUser);
        return null;
    }
    if (!eventUser.bar_id) {
        console.error("[getBartenderData] eventUser missing bar_id for bartender:", eventUser);
        return null;
    }

    if (!eventUser || !eventUser.bar_id) return null;

    const { data: event } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventUser.event_id)
        .single();

    const { data: bar } = await supabase
        .from("bars")
        .select("*")
        .eq("id", eventUser.bar_id)
        .single();

    const { data: requests } = await supabase
        .from("requests")
        .select("*, request_nodes(label, is_terminal), profiles!requests_created_by_fkey(full_name)")
        .eq("bar_id", eventUser.bar_id)
        .order("created_at", { ascending: false })
        .limit(20);

    const { data: nodes } = await supabase
        .from("request_nodes")
        .select("*")
        .eq("event_id", eventUser.event_id)
        .order("sort_order");

    const nodeMap = new Map();
    const tree: any[] = [];
    
    if (nodes) {
        nodes.forEach(n => nodeMap.set(n.id, { ...n, children: [] }));
        nodes.forEach(n => {
            if (n.parent_id) {
                nodeMap.get(n.parent_id)?.children.push(nodeMap.get(n.id));
            } else {
                tree.push(nodeMap.get(n.id));
            }
        });
    }

    return {
        user,
        eventUser,
        event,
        bar,
        requests: requests || [],
        requestTree: tree,
    };
}
