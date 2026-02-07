"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { cn } from "@/lib/utils";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    // We need to hoist the state here to adjust main content margin
    // But AdminSidebar already has its own state. 
    // I should rewrite AdminSidebar to accept 'collapsed' prop or expose context.
    // For now, let's just make AdminSidebar handle its own Width, but we need to know it here.
    // Actually, AdminSidebar component IS the sidebar. 
    // Let's refactor AdminSidebar to be controlled or use a Context.

    // Easier: Copy the state logic here and pass it down?
    // AdminSidebar has logout logic etc.

    // Let's make this component the "frame".
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-black text-zinc-100">
            <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main
                className={cn(
                    "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
                    isCollapsed ? "ml-16" : "ml-64"
                )}
            >
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
