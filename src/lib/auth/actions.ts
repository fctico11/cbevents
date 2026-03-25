"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await getSupabaseServerClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    // Fetch user's role to redirect appropriately
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Authentication failed" };

    const { data: eventUser, error: roleError } = await supabase
        .from("event_users")
        .select("role")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .limit(1)
        .single();

    if (roleError) console.error("[loginAction] role fetch failed:", roleError);

    const role = eventUser?.role ?? "bartender";
    console.log(`[loginAction] retrieved role: ${role}`);

    switch (role) {
        case "manager":
            redirect(ROUTES.MANAGER);
        case "barback":
            redirect(ROUTES.BARBACK);
        default:
            redirect(ROUTES.BARTENDER);
    }
}

export async function logoutAction() {
    const supabase = await getSupabaseServerClient();
    await supabase.auth.signOut();
    redirect(ROUTES.LOGIN);
}

export async function getCurrentUser() {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
