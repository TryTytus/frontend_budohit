"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, checkAdminAuth } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Prime the CSRF cookie
        checkAdminAuth();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const success = await loginAdmin({ username, password });
            if (success) {
                router.push("/admin-panel");
            } else {
                setError("Błędne dane logowania");
            }
        } catch (err) {
            setError("Wystąpił błąd logowania");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            <div className="relative z-10 w-full max-w-md p-8 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                <div className="text-center mb-8 space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4 ring-1 ring-primary/50">
                        <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Panel Administratora
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        Zaloguj się, aby zarządzać sklepem Budohit
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-3 top-3 h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                            <Input
                                type="text"
                                placeholder="Login"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-primary/20 h-11"
                                required
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                            <Input
                                type="password"
                                placeholder="Hasło"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-primary/20 h-11"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <span className="flex items-center">Zaloguj się <ArrowRight className="ml-2 w-4 h-4" /></span>}
                    </Button>
                </form>

                <div className="mt-8 text-center text-xs text-zinc-600">
                    &copy; 2026 Budohit Admin System
                </div>
            </div>
        </div>
    );
}
