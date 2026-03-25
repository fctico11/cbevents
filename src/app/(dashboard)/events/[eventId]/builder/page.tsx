"use client";

import { useState, useCallback } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { mockEvent, mockRequestTree } from "@/lib/mock-data";
import type { RequestNodeWithChildren } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
    ChevronRight, ChevronDown, Plus, Trash2, Save,
    FolderOpen, FileText, GripVertical,
} from "lucide-react";

export default function BuilderPage() {
    const [nodes, setNodes] = useState(mockRequestTree);
    const [selectedNode, setSelectedNode] = useState<RequestNodeWithChildren | null>(null);
    const [editLabel, setEditLabel] = useState("");
    const [editTerminal, setEditTerminal] = useState(false);
    const [editPriority, setEditPriority] = useState(1);

    const selectNode = useCallback((node: RequestNodeWithChildren) => {
        setSelectedNode(node);
        setEditLabel(node.label);
        setEditTerminal(node.is_terminal);
        setEditPriority(node.default_priority);
    }, []);

    const handleSave = useCallback(() => {
        if (!selectedNode) return;
        // In production: calls updateRequestNode server action
        console.log("Save node:", selectedNode.id, { label: editLabel, is_terminal: editTerminal, default_priority: editPriority });
    }, [selectedNode, editLabel, editTerminal, editPriority]);

    const handleAddChild = useCallback(() => {
        if (!selectedNode) return;
        // In production: calls createRequestNode server action
        console.log("Add child to:", selectedNode.id);
    }, [selectedNode]);

    const handleDelete = useCallback(() => {
        if (!selectedNode) return;
        // In production: calls deleteRequestNode server action
        console.log("Delete node:", selectedNode.id);
        setSelectedNode(null);
    }, [selectedNode]);

    return (
        <DashboardShell role="manager" eventName={mockEvent.name} userName="Alex Rivera">
            <div className="mb-4">
                <h1 className="text-xl font-bold text-foreground">Request Tree Builder</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Configure the request categories for this event
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                {/* Tree Pane */}
                <div className="glass-card p-4 lg:col-span-2">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Tree
                        </h2>
                        <button className="flex items-center gap-1 rounded-lg bg-cb-accent/10 px-2.5 py-1.5 text-xs font-medium text-cb-accent-light transition-colors hover:bg-cb-accent/20">
                            <Plus className="h-3 w-3" />
                            Root Node
                        </button>
                    </div>

                    <div className="space-y-0.5">
                        {nodes.map((node) => (
                            <TreeNode
                                key={node.id}
                                node={node}
                                depth={0}
                                selectedId={selectedNode?.id}
                                onSelect={selectNode}
                            />
                        ))}
                    </div>
                </div>

                {/* Editor Pane */}
                <div className="glass-card p-4 lg:col-span-3">
                    {selectedNode ? (
                        <div className="space-y-5">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Edit Node
                            </h2>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Label</label>
                                <input
                                    value={editLabel}
                                    onChange={(e) => setEditLabel(e.target.value)}
                                    className="tap-target w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-cb-accent focus:ring-1 focus:ring-cb-accent"
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-border bg-card/50 px-4 py-3">
                                <div>
                                    <span className="text-sm font-medium text-foreground">Terminal Node</span>
                                    <p className="text-xs text-muted-foreground">Can create requests directly</p>
                                </div>
                                <button
                                    onClick={() => setEditTerminal(!editTerminal)}
                                    className={cn(
                                        "relative h-6 w-11 rounded-full transition-colors",
                                        editTerminal ? "bg-cb-accent" : "bg-border",
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                                            editTerminal && "translate-x-5",
                                        )}
                                    />
                                </button>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">
                                    Default Priority
                                </label>
                                <select
                                    value={editPriority}
                                    onChange={(e) => setEditPriority(Number(e.target.value))}
                                    className="tap-target w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-cb-accent"
                                >
                                    {[1, 2, 3, 4, 5].map((p) => (
                                        <option key={p} value={p}>
                                            {p} — {p === 1 ? "Normal" : p === 2 ? "Medium" : p === 3 ? "High" : p === 4 ? "Urgent" : "Critical"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2 border-t border-border pt-4">
                                <button
                                    onClick={handleAddChild}
                                    className="tap-target flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-cb-accent/30"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Child
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="tap-target flex items-center gap-1.5 rounded-xl gradient-accent px-4 py-2.5 text-sm font-bold text-black transition-all hover:opacity-90"
                                >
                                    <Save className="h-4 w-4" />
                                    Save
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="tap-target ml-auto flex items-center gap-1.5 rounded-xl bg-cb-error/10 px-4 py-2.5 text-sm font-medium text-cb-error transition-colors hover:bg-cb-error/20"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center py-20">
                            <p className="text-sm text-muted-foreground">Select a node to edit</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardShell>
    );
}

function TreeNode({
    node,
    depth,
    selectedId,
    onSelect,
}: {
    node: RequestNodeWithChildren;
    depth: number;
    selectedId: string | undefined;
    onSelect: (node: RequestNodeWithChildren) => void;
}) {
    const [expanded, setExpanded] = useState(depth < 2);
    const hasChildren = node.children.length > 0;
    const isSelected = node.id === selectedId;

    return (
        <div>
            <button
                onClick={() => {
                    onSelect(node);
                    if (hasChildren) setExpanded(!expanded);
                }}
                className={cn(
                    "tap-target flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm transition-colors",
                    isSelected ? "bg-cb-accent/15 text-cb-accent-light" : "text-foreground hover:bg-card",
                )}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
            >
                {hasChildren ? (
                    expanded ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                ) : (
                    <span className="w-3.5" />
                )}
                {node.is_terminal ? (
                    <FileText className="h-3.5 w-3.5 shrink-0 text-cb-accent" />
                ) : (
                    <FolderOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                )}
                <span className="truncate">{node.label}</span>
            </button>

            {expanded && hasChildren && (
                <div>
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            selectedId={selectedId}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
