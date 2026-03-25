/* ─── Role & Status Enums ─── */

export type UserRole = "manager" | "bartender" | "barback";

export type RequestStatus = "open" | "claimed" | "completed" | "cancelled";

export type NotificationProvider = "twilio";

export type NotificationStatus = "sent" | "failed" | "queued";

/* ─── Core Entities ─── */

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface Event {
    id: string;
    name: string;
    description: string | null;
    date: string;
    location: string | null;
    is_active: boolean;
    created_by: string;
    created_at: string;
    updated_at: string;
}

export interface Bar {
    id: string;
    event_id: string;
    name: string;
    location_note: string | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface EventUser {
    id: string;
    event_id: string;
    user_id: string;
    bar_id: string | null;
    role: UserRole;
    is_active: boolean;
    created_at: string;
}

export interface RequestNode {
    id: string;
    event_id: string;
    parent_id: string | null;
    label: string;
    is_terminal: boolean;
    default_priority: number;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface Request {
    id: string;
    event_id: string;
    bar_id: string;
    node_id: string;
    request_label: string;
    status: RequestStatus;
    priority: number;
    created_by: string;
    assigned_to_user_id: string | null;
    completed_at: string | null;
    cancelled_at: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface RequestActivity {
    id: string;
    request_id: string;
    user_id: string;
    action: string;
    details: string | null;
    created_at: string;
}

export interface NotificationLog {
    id: string;
    request_id: string;
    recipient_phone: string;
    recipient_user_id: string;
    provider: NotificationProvider;
    status: NotificationStatus;
    provider_message_id: string | null;
    error_message: string | null;
    created_at: string;
}

/* ─── Joined / Extended Types ─── */

export interface BarWithDetails extends Bar {
    bartender?: Profile | null;
    open_request_count: number;
    oldest_open_request_at: string | null;
}

export interface RequestWithDetails extends Request {
    bar?: Bar;
    created_by_profile?: Profile;
    assigned_to_profile?: Profile;
    node?: RequestNode;
}

export interface RequestNodeWithChildren extends RequestNode {
    children: RequestNodeWithChildren[];
}

export interface EventUserWithProfile extends EventUser {
    profile?: Profile;
}
