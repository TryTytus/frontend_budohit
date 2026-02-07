"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronRight, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const Tree = AccordionPrimitive.Root

const TreeItem = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn("border-b", className)}
        {...props}
    />
))
TreeItem.displayName = "TreeItem"

const TreeTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                className
            )}
            {...props}
        >
            {children}
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
))
TreeTrigger.displayName = "TreeTrigger"

const TreeContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        {...props}
    >
        <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
))
TreeContent.displayName = "TreeContent"

// Simple Custom Tree for Lazy Loading
// The above accordion is good, but for a true directory tree with infinite nesting and lazy load,
// we might want a recursive component structure that manages open states.

interface TreeProps {
    data: TreeNode[]
    onExpand?: (node: TreeNode) => void
    onSelect?: (node: TreeNode) => void
    selectedId?: string
    className?: string
}

export interface TreeNode {
    id: string
    name: string
    children?: TreeNode[]
    parentId?: string | null // Added for hierarchy tracking
    hasChildren?: boolean // For lazy load indication
    expanded?: boolean // Controlled state
    icon?: LucideIcon
    image?: string | null // Added for category image
}

export function TreeView({ data, onExpand, onSelect, selectedId, className }: TreeProps) {
    return (
        <div className={cn("w-full space-y-1", className)}>
            {data.map((node) => (
                <TreeNodeItem
                    key={node.id}
                    node={node}
                    onExpand={onExpand}
                    onSelect={onSelect}
                    selectedId={selectedId}
                    level={0}
                />
            ))}
        </div>
    )
}

interface TreeNodeItemProps {
    node: TreeNode
    onExpand?: (node: TreeNode) => void
    onSelect?: (node: TreeNode) => void
    selectedId?: string
    level: number
}

function TreeNodeItem({ node, onExpand, onSelect, selectedId, level }: TreeNodeItemProps) {
    const isExpanded = node.children && node.children.length > 0;
    // Or if we want controlled lazy loading:
    // User passes updated data structure where children are populared.

    // Internal state for "loading" or expanded could be useful, 
    // but usually tree data is controlled from parent in complex apps.
    // Let's assume parent manages `expanded` logic by populating `children`.
    // Actually, `shadcn` tree usually uses `Collapsible`.

    const [isOpen, setIsOpen] = React.useState(false);

    const handleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
        if (!isOpen && onExpand) {
            onExpand(node);
        }
    }

    // Sync internal state with children presence if needed, 
    // but lazy load means we might expand empty node to trigger load.

    return (
        <div className="w-full">
            <div
                className={cn(
                    "flex items-center py-1 px-2 hover:bg-zinc-800/50 rounded-md cursor-pointer transition-colors",
                    selectedId === node.id ? "bg-white text-black hover:bg-white/90" : "text-zinc-300",
                )}
                style={{ paddingLeft: `${level * 1.5}rem` }}
                onClick={() => onSelect?.(node)}
            >
                <div
                    className={cn(
                        "p-1 rounded-sm hover:bg-zinc-700/50 mr-2 cursor-pointer",
                        (!node.children?.length && !node.hasChildren) && "opacity-0 pointer-events-none"
                    )}
                    onClick={handleExpand}
                >
                    <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
                </div>
                {node.icon && <node.icon className={cn("h-4 w-4 mr-2", selectedId === node.id ? "text-black" : "text-zinc-400")} />}
                <span className="text-sm font-medium truncate">{node.name}</span>
            </div>
            {isOpen && node.children && (
                <div className="w-full">
                    {node.children.map(child => (
                        <TreeNodeItem
                            key={child.id}
                            node={child}
                            onExpand={onExpand}
                            onSelect={onSelect}
                            selectedId={selectedId}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
