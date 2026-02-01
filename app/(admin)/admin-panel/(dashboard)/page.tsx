"use client";

import { useEffect, useState } from "react";
import { checkAdminAuth } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, DollarSign, Activity } from "lucide-react";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAdminAuth().then(isAuth => {
            if (!isAuth) {
                router.push("/admin-panel/login");
            } else {
                setLoading(false);
            }
        });
    }, [router]);

    if (loading) return (
        <div className="flex items-center justify-center h-full text-zinc-500">
            Ładowanie...
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
                <div className="text-sm text-zinc-400">Witaj z powrotem, Admin</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Wszystkie Produkty" value="2,345" icon={Package} change="+12% od ost. mies." />
                <StatCard title="Użytkownicy" value="543" icon={Users} change="+4% od ost. mies." />
                <StatCard title="Sprzedaż" value="PLN 45,231" icon={DollarSign} change="+24% od ost. mies." />
                <StatCard title="Aktywność" value="+573" icon={Activity} change="+201 od ost. godz." />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-zinc-900 border-white/10 text-zinc-100">
                    <CardHeader>
                        <CardTitle>Ostatnie Zamówienia</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-zinc-500 text-sm">
                            (Wykres lub lista zamówień wkrótce)
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 bg-zinc-900 border-white/10 text-zinc-100">
                    <CardHeader>
                        <CardTitle>Ostatnie Produkty</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm text-zinc-400">
                            <div className="flex items-center justify-between">
                                <span>Wiertarka Udarowa</span>
                                <span className="text-primary">+12 min temu</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Młot pneumatyczny</span>
                                <span className="text-primary">+2 godz temu</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Zestaw wierteł</span>
                                <span className="text-primary">+5 godz temu</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, change }: any) {
    return (
        <Card className="bg-zinc-900 border-white/10 text-zinc-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-zinc-500">
                    {change}
                </p>
            </CardContent>
        </Card>
    );
}
