import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ComingSoonProps {
    title: string;
    description?: string;
}

export function ComingSoon({ title, description = "Ta sekcja jest w trakcie budowy. Zapraszamy wkrótce." }: ComingSoonProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center animate-pulse">
                <Construction className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
                <p className="text-zinc-400">{description}</p>
            </div>
        </div>
    );
}
