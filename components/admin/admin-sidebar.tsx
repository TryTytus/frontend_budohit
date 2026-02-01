"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAdmin } from "@/lib/api";

const sidebarItems = [
    { name: "Dashboard", href: "/admin-panel", icon: LayoutDashboard },
    { name: "Produkty", href: "/admin-panel/products", icon: Package },
    { name: "Kategorie", href: "/admin-panel/categories", icon: Layers },
    { name: "Zamówienia", href: "/admin-panel/orders", icon: ShoppingCart },
    { name: "Ustawienia", href: "/admin-panel/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await logoutAdmin();
        router.push("/admin-panel/login");
    };

    return (
        <div className="flex flex-col h-screen w-64 bg-zinc-950 border-r border-white/10 text-zinc-300">
            <div className="p-6 border-b border-white/10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-black">
                    B
                </div>
                <span className="font-bold text-white text-lg tracking-tight">Budohit Admin</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
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
                                    : "hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 hover:bg-red-500/10 hover:text-red-400 text-zinc-400"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    Wyloguj się
                </Button>
            </div>
        </div>
    );
}
