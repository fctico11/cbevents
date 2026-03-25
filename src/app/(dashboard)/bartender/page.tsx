import { getBartenderData } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { BartenderClient } from "./bartender-client";

export default async function BartenderPage() {
    const data = await getBartenderData();

    if (!data || !data.user || !data.event || !data.bar) {
        redirect("/login");
    }

    const { event, bar, eventUser, user, requestTree, requests } = data;
    const userName = Array.isArray(eventUser.profiles) ? eventUser.profiles[0]?.full_name : (eventUser.profiles as any)?.full_name;

    return (
        <BartenderClient 
            event={event}
            bar={bar}
            userName={userName || user.email}
            requestTree={requestTree}
            requests={requests}
        />
    );
}

