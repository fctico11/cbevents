import { redirect } from "next/navigation";

export default function EventPage() {
    // For v1, redirect to builder
    redirect("builder");
}
