import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const createRequestSchema = z.object({
    event_id: z.string().uuid(),
    bar_id: z.string().uuid(),
    node_id: z.string().uuid(),
    priority: z.number().int().min(0).max(5).default(1),
    notes: z.string().max(500).optional(),
});

export type CreateRequestFormValues = z.infer<typeof createRequestSchema>;

export const requestNodeSchema = z.object({
    event_id: z.string().uuid(),
    parent_id: z.string().uuid().nullable().optional(),
    label: z.string().min(1, "Label is required").max(100),
    is_terminal: z.boolean().default(false),
    default_priority: z.number().int().min(0).max(5).default(1),
    sort_order: z.number().int().default(0),
});

export type RequestNodeFormValues = z.infer<typeof requestNodeSchema>;
