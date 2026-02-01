import { AdminSidebar } from "@/components/admin/admin-sidebar";
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
        <div className="flex min-h-screen bg-black text-zinc-100">
            <AdminSidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
