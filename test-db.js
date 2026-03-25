const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    console.log("Fetching users from auth...");
    const { data: users, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
        console.error("Auth error:", authError.message);
        return;
    }
    
    users.users.forEach(u => console.log(`User: ${u.email} (${u.id})`));

    console.log("\nFetching events...");
    const { data: ev } = await supabase.from("events").select("*");
    console.log("events:", JSON.stringify(ev, null, 2));

    console.log("\nFetching event_users...");
    const { data: eu } = await supabase.from("event_users").select("*");
    console.log("event_users:", JSON.stringify(eu, null, 2));

    console.log("\nFetching profiles...");
    const { data: profiles } = await supabase.from("profiles").select("*");
    console.log("profiles:", JSON.stringify(profiles, null, 2));
}

run();
