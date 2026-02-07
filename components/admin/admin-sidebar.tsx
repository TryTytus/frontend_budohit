"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAdmin } from "@/lib/api";

const sidebarItems = [
    { name: "Dashboard", href: "/admin-panel", icon: LayoutDashboard },
    { name: "Produkty", href: "/admin-panel/products", icon: Package },
    { name: "Kategorie", href: "/admin-panel/categories", icon: Layers },
    { name: "Zamówienia", href: "/admin-panel/orders", icon: ShoppingCart },
    { name: "Ustawienia", href: "/admin-panel/settings", icon: Settings },
];

interface AdminSidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

export function AdminSidebar({ isCollapsed, setIsCollapsed }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    // const [isCollapsed, setIsCollapsed] = useState(false); // Hoisted to parent

    const handleLogout = async () => {
        await logoutAdmin();
        router.push("/admin-panel/login");
    };

    return (
        <div
            className={cn(
                "flex flex-col h-screen h-svh bg-zinc-950 border-r border-white/10 text-zinc-300 transition-all duration-300 ease-in-out fixed left-0 top-0 z-40",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className={cn("p-4 border-b border-white/10 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                {!isCollapsed && (
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-black shrink-0">
                            B
                        </div>
                        <span className="font-bold text-white text-lg tracking-tight truncate">Budohit Admin</span>
                    </div>
                )}
                {isCollapsed && (
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-black shrink-0">
                        B
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="ml-auto text-zinc-500 hover:text-white"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            <nav className="flex-1 p-2 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group text-sm font-medium",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-white/5 hover:text-white",
                                isCollapsed && "justify-center px-2"
                            )}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300")} />
                            {!isCollapsed && <span className="truncate">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <Button
                    variant="ghost"
                    className={cn("w-full justify-start gap-3 hover:bg-red-500/10 hover:text-red-400 text-zinc-400", isCollapsed && "justify-center px-2")}
                    onClick={handleLogout}
                    title={isCollapsed ? "Wyloguj się" : undefined}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span>Wyloguj się</span>}
                </Button>
            </div>
        </div>
    );
}
