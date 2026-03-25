import type {
    BarWithDetails,
    RequestWithDetails,
    RequestNodeWithChildren,
    EventUserWithProfile,
} from "@/lib/types";

/* ─── Mock Event ─── */
export const mockEvent = {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    name: "Grand Luxe Gala 2026",
    description: "Annual luxury charity gala",
    date: "2026-04-15",
    location: "The Grand Ballroom, 550 Park Avenue, NY",
    is_active: true,
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

/* ─── Mock Bars ─── */
export const mockBars: BarWithDetails[] = [
    {
        id: "bar-1", event_id: mockEvent.id, name: "Main Bar",
        location_note: "Center of ballroom", sort_order: 1,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        bartender: { id: "u-2", email: "jordan@cb.com", full_name: "Jordan Lee", phone: null, avatar_url: null, created_at: "", updated_at: "" },
        open_request_count: 3, oldest_open_request_at: new Date(Date.now() - 12 * 60000).toISOString(),
    },
    {
        id: "bar-2", event_id: mockEvent.id, name: "VIP Lounge",
        location_note: "Second floor, east wing", sort_order: 2,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        bartender: { id: "u-3", email: "taylor@cb.com", full_name: "Taylor Kim", phone: null, avatar_url: null, created_at: "", updated_at: "" },
        open_request_count: 1, oldest_open_request_at: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    {
        id: "bar-3", event_id: mockEvent.id, name: "Garden Bar",
        location_note: "Outdoor terrace", sort_order: 3,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        bartender: null, open_request_count: 1, oldest_open_request_at: new Date(Date.now() - 2 * 60000).toISOString(),
    },
    {
        id: "bar-4", event_id: mockEvent.id, name: "Cocktail Station",
        location_note: "Near entrance foyer", sort_order: 4,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        bartender: null, open_request_count: 0, oldest_open_request_at: null,
    },
    {
        id: "bar-5", event_id: mockEvent.id, name: "Service Bar",
        location_note: "Kitchen pass-through", sort_order: 5,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        bartender: null, open_request_count: 0, oldest_open_request_at: null,
    },
];

/* ─── Mock Requests ─── */
export const mockRequests: RequestWithDetails[] = [
    {
        id: "req-1", event_id: mockEvent.id, bar_id: "bar-1",
        node_id: "n-1", request_label: "Ice → 2 Bags", status: "open",
        priority: 2, created_by: "u-2", assigned_to_user_id: null,
        completed_at: null, cancelled_at: null, notes: null,
        created_at: new Date(Date.now() - 12 * 60000).toISOString(),
        updated_at: new Date(Date.now() - 12 * 60000).toISOString(),
        bar: { id: "bar-1", event_id: mockEvent.id, name: "Main Bar", location_note: null, sort_order: 1, created_at: "", updated_at: "" },
        created_by_profile: { id: "u-2", email: "", full_name: "Jordan Lee", phone: null, avatar_url: null, created_at: "", updated_at: "" },
    },
    {
        id: "req-2", event_id: mockEvent.id, bar_id: "bar-1",
        node_id: "n-2", request_label: "Bottles → Beer → Asahi", status: "claimed",
        priority: 1, created_by: "u-2", assigned_to_user_id: "u-4",
        completed_at: null, cancelled_at: null, notes: null,
        created_at: new Date(Date.now() - 8 * 60000).toISOString(),
        updated_at: new Date(Date.now() - 6 * 60000).toISOString(),
        bar: { id: "bar-1", event_id: mockEvent.id, name: "Main Bar", location_note: null, sort_order: 1, created_at: "", updated_at: "" },
        created_by_profile: { id: "u-2", email: "", full_name: "Jordan Lee", phone: null, avatar_url: null, created_at: "", updated_at: "" },
        assigned_to_profile: { id: "u-4", email: "", full_name: "Casey Morgan", phone: null, avatar_url: null, created_at: "", updated_at: "" },
    },
    {
        id: "req-3", event_id: mockEvent.id, bar_id: "bar-2",
        node_id: "n-3", request_label: "Glassware → Coupe Glasses", status: "open",
        priority: 1, created_by: "u-3", assigned_to_user_id: null,
        completed_at: null, cancelled_at: null, notes: null,
        created_at: new Date(Date.now() - 5 * 60000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 60000).toISOString(),
        bar: { id: "bar-2", event_id: mockEvent.id, name: "VIP Lounge", location_note: null, sort_order: 2, created_at: "", updated_at: "" },
        created_by_profile: { id: "u-3", email: "", full_name: "Taylor Kim", phone: null, avatar_url: null, created_at: "", updated_at: "" },
    },
    {
        id: "req-4", event_id: mockEvent.id, bar_id: "bar-2",
        node_id: "n-4", request_label: "Mixers", status: "completed",
        priority: 1, created_by: "u-3", assigned_to_user_id: "u-5",
        completed_at: new Date(Date.now() - 18 * 60000).toISOString(), cancelled_at: null, notes: null,
        created_at: new Date(Date.now() - 25 * 60000).toISOString(),
        updated_at: new Date(Date.now() - 18 * 60000).toISOString(),
        bar: { id: "bar-2", event_id: mockEvent.id, name: "VIP Lounge", location_note: null, sort_order: 2, created_at: "", updated_at: "" },
        created_by_profile: { id: "u-3", email: "", full_name: "Taylor Kim", phone: null, avatar_url: null, created_at: "", updated_at: "" },
        assigned_to_profile: { id: "u-5", email: "", full_name: "Drew Santos", phone: null, avatar_url: null, created_at: "", updated_at: "" },
    },
    {
        id: "req-5", event_id: mockEvent.id, bar_id: "bar-3",
        node_id: "n-5", request_label: "Napkins/Straws", status: "open",
        priority: 1, created_by: "u-2", assigned_to_user_id: null,
        completed_at: null, cancelled_at: null, notes: null,
        created_at: new Date(Date.now() - 2 * 60000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60000).toISOString(),
        bar: { id: "bar-3", event_id: mockEvent.id, name: "Garden Bar", location_note: null, sort_order: 3, created_at: "", updated_at: "" },
        created_by_profile: { id: "u-2", email: "", full_name: "Jordan Lee", phone: null, avatar_url: null, created_at: "", updated_at: "" },
    },
];

/* ─── Mock Activity Feed ─── */
export const mockActivity = [
    { id: "a-1", action: "created", details: "Ice → 2 Bags", user: "Jordan Lee", bar: "Main Bar", created_at: new Date(Date.now() - 12 * 60000).toISOString() },
    { id: "a-2", action: "created", details: "Bottles → Beer → Asahi", user: "Jordan Lee", bar: "Main Bar", created_at: new Date(Date.now() - 8 * 60000).toISOString() },
    { id: "a-3", action: "claimed", details: "Bottles → Beer → Asahi", user: "Casey Morgan", bar: "Main Bar", created_at: new Date(Date.now() - 6 * 60000).toISOString() },
    { id: "a-4", action: "created", details: "Glassware → Coupe Glasses", user: "Taylor Kim", bar: "VIP Lounge", created_at: new Date(Date.now() - 5 * 60000).toISOString() },
    { id: "a-5", action: "completed", details: "Mixers", user: "Drew Santos", bar: "VIP Lounge", created_at: new Date(Date.now() - 18 * 60000).toISOString() },
    { id: "a-6", action: "created", details: "Napkins/Straws", user: "Jordan Lee", bar: "Garden Bar", created_at: new Date(Date.now() - 2 * 60000).toISOString() },
];

/* ─── Mock Request Tree ─── */
export const mockRequestTree: RequestNodeWithChildren[] = [
    {
        id: "n-ice", event_id: mockEvent.id, parent_id: null, label: "Ice", is_terminal: false, default_priority: 1, sort_order: 1, created_at: "", updated_at: "",
        children: [
            { id: "n-ice-2", event_id: mockEvent.id, parent_id: "n-ice", label: "2 Bags", is_terminal: true, default_priority: 2, sort_order: 1, created_at: "", updated_at: "", children: [] },
            { id: "n-ice-4", event_id: mockEvent.id, parent_id: "n-ice", label: "4 Bags", is_terminal: true, default_priority: 2, sort_order: 2, created_at: "", updated_at: "", children: [] },
            { id: "n-ice-6", event_id: mockEvent.id, parent_id: "n-ice", label: "6 Bags", is_terminal: true, default_priority: 3, sort_order: 3, created_at: "", updated_at: "", children: [] },
        ],
    },
    {
        id: "n-bottles", event_id: mockEvent.id, parent_id: null, label: "Bottles", is_terminal: false, default_priority: 1, sort_order: 2, created_at: "", updated_at: "",
        children: [
            { id: "n-liquor", event_id: mockEvent.id, parent_id: "n-bottles", label: "Liquor", is_terminal: true, default_priority: 1, sort_order: 1, created_at: "", updated_at: "", children: [] },
            { id: "n-wine", event_id: mockEvent.id, parent_id: "n-bottles", label: "Wine", is_terminal: true, default_priority: 1, sort_order: 2, created_at: "", updated_at: "", children: [] },
            {
                id: "n-beer", event_id: mockEvent.id, parent_id: "n-bottles", label: "Beer", is_terminal: false, default_priority: 1, sort_order: 3, created_at: "", updated_at: "",
                children: [
                    { id: "n-asahi", event_id: mockEvent.id, parent_id: "n-beer", label: "Asahi", is_terminal: true, default_priority: 1, sort_order: 1, created_at: "", updated_at: "", children: [] },
                    { id: "n-michelob", event_id: mockEvent.id, parent_id: "n-beer", label: "Michelob Ultra", is_terminal: true, default_priority: 1, sort_order: 2, created_at: "", updated_at: "", children: [] },
                    { id: "n-corona", event_id: mockEvent.id, parent_id: "n-beer", label: "Corona", is_terminal: true, default_priority: 1, sort_order: 3, created_at: "", updated_at: "", children: [] },
                ],
            },
        ],
    },
    {
        id: "n-glass", event_id: mockEvent.id, parent_id: null, label: "Glassware", is_terminal: false, default_priority: 1, sort_order: 3, created_at: "", updated_at: "",
        children: [
            { id: "n-coupe", event_id: mockEvent.id, parent_id: "n-glass", label: "Coupe Glasses", is_terminal: true, default_priority: 1, sort_order: 1, created_at: "", updated_at: "", children: [] },
            { id: "n-rocks", event_id: mockEvent.id, parent_id: "n-glass", label: "Rocks Glasses", is_terminal: true, default_priority: 1, sort_order: 2, created_at: "", updated_at: "", children: [] },
            { id: "n-beer-glass", event_id: mockEvent.id, parent_id: "n-glass", label: "Beer Glasses", is_terminal: true, default_priority: 1, sort_order: 3, created_at: "", updated_at: "", children: [] },
        ],
    },
    { id: "n-mixers", event_id: mockEvent.id, parent_id: null, label: "Mixers", is_terminal: true, default_priority: 1, sort_order: 4, created_at: "", updated_at: "", children: [] },
    { id: "n-garnish", event_id: mockEvent.id, parent_id: null, label: "Garnish", is_terminal: true, default_priority: 1, sort_order: 5, created_at: "", updated_at: "", children: [] },
    { id: "n-napkins", event_id: mockEvent.id, parent_id: null, label: "Napkins/Straws", is_terminal: true, default_priority: 1, sort_order: 6, created_at: "", updated_at: "", children: [] },
    { id: "n-problems", event_id: mockEvent.id, parent_id: null, label: "Problems", is_terminal: true, default_priority: 3, sort_order: 7, created_at: "", updated_at: "", children: [] },
];

/* ─── Mock Users ─── */
export const mockEventUsers: EventUserWithProfile[] = [
    { id: "eu-1", event_id: mockEvent.id, user_id: "u-1", bar_id: null, role: "manager", is_active: true, created_at: "", profile: { id: "u-1", email: "alex@cb.com", full_name: "Alex Rivera", phone: "+15551000001", avatar_url: null, created_at: "", updated_at: "" } },
    { id: "eu-2", event_id: mockEvent.id, user_id: "u-2", bar_id: "bar-1", role: "bartender", is_active: true, created_at: "", profile: { id: "u-2", email: "jordan@cb.com", full_name: "Jordan Lee", phone: "+15551000002", avatar_url: null, created_at: "", updated_at: "" } },
    { id: "eu-3", event_id: mockEvent.id, user_id: "u-3", bar_id: "bar-2", role: "bartender", is_active: true, created_at: "", profile: { id: "u-3", email: "taylor@cb.com", full_name: "Taylor Kim", phone: "+15551000003", avatar_url: null, created_at: "", updated_at: "" } },
    { id: "eu-4", event_id: mockEvent.id, user_id: "u-4", bar_id: null, role: "barback", is_active: true, created_at: "", profile: { id: "u-4", email: "casey@cb.com", full_name: "Casey Morgan", phone: "+15551000004", avatar_url: null, created_at: "", updated_at: "" } },
    { id: "eu-5", event_id: mockEvent.id, user_id: "u-5", bar_id: null, role: "barback", is_active: true, created_at: "", profile: { id: "u-5", email: "drew@cb.com", full_name: "Drew Santos", phone: "+15551000005", avatar_url: null, created_at: "", updated_at: "" } },
];
