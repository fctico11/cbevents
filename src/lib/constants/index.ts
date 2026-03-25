export const APP_NAME = "CB Events";

export const ROLES = {
    MANAGER: "manager",
    BARTENDER: "bartender",
    BARBACK: "barback",
} as const;

export const REQUEST_STATUSES = {
    OPEN: "open",
    CLAIMED: "claimed",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
} as const;

export const STATUS_LABELS: Record<string, string> = {
    open: "Open",
    claimed: "Claimed",
    completed: "Completed",
    cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<string, string> = {
    open: "status-open",
    claimed: "status-claimed",
    completed: "status-completed",
    cancelled: "status-cancelled",
};

export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    MANAGER: "/manager",
    BARTENDER: "/bartender",
    BARBACK: "/barback",
    EVENT: (eventId: string) => `/events/${eventId}`,
    BUILDER: (eventId: string) => `/events/${eventId}/builder`,
} as const;
