"use client";

import { useState, useEffect } from "react";
import { TreeView, TreeNode } from "@/components/ui/tree-view";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { getAdminCategories } from "@/lib/api";
import { Category } from "@/lib/types";
import { ChevronDown, Folder, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    initialLabel?: string;
}

export function CategorySelector({ value, onChange, placeholder = "Wybierz kategorię", initialLabel }: CategorySelectorProps) {
    const [open, setOpen] = useState(false);
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedName, setSelectedName] = useState<string>(initialLabel || "");

    // Helper to traverse and find name if needed, or just display ID? 
    // Ideally we want to display the name. 
    // But initially we might only have ID. We can fetch name or flattened list?
    // For now, if tree is loaded, we find name.

    const toTreeNode = (cat: Category): TreeNode => ({
        id: cat.id.toString(),
        name: cat.name,
        children: cat.children?.map(toTreeNode) || [],
        hasChildren: cat.has_children,
        icon: Folder
    });

    const fetchCategories = async (parentId: string | null = null): Promise<TreeNode[]> => {
        try {
            const data = await getAdminCategories(parentId);
            return data.map(toTreeNode);
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    useEffect(() => {
        if (open && treeData.length === 0) {
            setLoading(true);
            fetchCategories().then(nodes => {
                setTreeData(nodes);
                setLoading(false);
            });
        }
    }, [open]);

    // Handle Lazy Load
    const handleExpand = async (node: TreeNode) => {
        if (node.children && node.children.length > 0) return;

        const children = await fetchCategories(node.id);
        if (children) {
            setTreeData(prev => updateTreeNodes(prev, node.id, children));
        }
    };

    const updateTreeNodes = (nodes: TreeNode[], targetId: string, children: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
            if (node.id === targetId) {
                return { ...node, children: children };
            }
            if (node.children) {
                return { ...node, children: updateTreeNodes(node.children, targetId, children) };
            }
            return node;
        });
    };

    const handleSelect = (node: TreeNode) => {
        onChange(node.id);
        setSelectedName(node.name);
        setOpen(false);
    };

    // Try to find selected name from tree if available
    useEffect(() => {
        if (value && treeData.length > 0) {
            const findName = (nodes: TreeNode[]): string | undefined => {
                for (const node of nodes) {
                    if (node.id === value) return node.name;
                    if (node.children) {
                        const found = findName(node.children);
                        if (found) return found;
                    }
                }
            };
            const name = findName(treeData);
            if (name) setSelectedName(name);
        } else if (value && !selectedName) {
            // If value is set but no name, and tree not loaded, maybe we should define behaviour?
            // For now rely on initialLabel or waiting for tree load.
        }
    }, [value, treeData]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-black border-white/10 text-zinc-300 hover:text-white"
                >
                    {selectedName || value || placeholder}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-zinc-900 border-zinc-800" align="start">
                <div className="p-2 max-h-[300px] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                        </div>
                    ) : (
                        <TreeView
                            data={treeData}
                            onExpand={handleExpand}
                            onSelect={handleSelect}
                            selectedId={value}
                        />
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
