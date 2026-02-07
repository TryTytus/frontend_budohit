"use client";

import { useEffect, useState } from "react";
import { checkAdminAuth } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ComingSoon } from "@/components/admin/coming-soon";

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
        <ComingSoon title="Dashboard" description="Panel główny jest w trakcie przebudowy. Skorzystaj z menu bocznego, aby zarządzać produktami." />
    );
}
