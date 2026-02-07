import { AdminLayoutClient } from "@/components/admin/admin-layout-client";
import { checkAdminAuth } from "@/lib/api";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Quick server-side check (e.g. cookies) - ideally we verify session with backend
    // Since we use httpOnly cookies from backend, Next.js server component can't easily read them 
    // without proxying the request headers.
    // For now, allow render, and Client Components will handle 401s or use a client-side layout auth check.
    // Ideally: middleware.ts checks auth token.

    // Simplest: Just render layout. Page components fetch data and catch 401s.

    return (
        <AdminLayoutClient>
            {children}
        </AdminLayoutClient>
    );
}
