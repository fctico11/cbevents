"use client";

import { create } from "zustand";
import type { Request, RequestWithDetails, UserRole } from "@/lib/types";

/* ─── Request Store ─── */

interface RequestStore {
    requests: RequestWithDetails[];
    setRequests: (requests: RequestWithDetails[]) => void;
    addRequest: (request: RequestWithDetails) => void;
    updateRequest: (id: string, updates: Partial<Request>) => void;
    removeRequest: (id: string) => void;
}

export const useRequestStore = create<RequestStore>((set) => ({
    requests: [],
    setRequests: (requests) => set({ requests }),
    addRequest: (request) =>
        set((state) => ({ requests: [request, ...state.requests] })),
    updateRequest: (id, updates) =>
        set((state) => ({
            requests: state.requests.map((r) =>
                r.id === id ? { ...r, ...updates } : r,
            ),
        })),
    removeRequest: (id) =>
        set((state) => ({
            requests: state.requests.filter((r) => r.id !== id),
        })),
}));

/* ─── UI Store ─── */

interface UiStore {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
    currentRole: UserRole | null;
    setCurrentRole: (role: UserRole) => void;
}

export const useUiStore = create<UiStore>((set) => ({
    sidebarOpen: false,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    activeFilter: "all",
    setActiveFilter: (filter) => set({ activeFilter: filter }),
    currentRole: null,
    setCurrentRole: (role) => set({ currentRole: role }),
}));
