"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, X } from "lucide-react";
import { searchAutocomplete } from "@/lib/api";
import { Product, Category } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ categories: Category[], products: Product[] }>({ categories: [], products: [] });
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                try {
                    const data = await searchAutocomplete(query);
                    setResults(data);
                    setIsOpen(true);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults({ categories: [], products: [] });
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Szukaj produktów, kategorii..."
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (query.length >= 2) setIsOpen(true);
                    }}
                />
                {query.length > 0 && (
                    <button
                        type="button"
                        onClick={() => { setQuery(""); setIsOpen(false); }}
                        className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                    </button>
                )}
            </form>

            <div className={cn(
                "absolute top-full left-0 w-full md:w-[400px] bg-popover text-popover-foreground border rounded-md shadow-lg mt-2 overflow-hidden z-50 transition-all duration-200 origin-top",
                isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            )}>
                {(results.categories.length > 0 || results.products.length > 0) ? (
                    <div className="max-h-[80vh] overflow-y-auto">
                        {results.categories.length > 0 && (
                            <div className="p-2">
                                <h4 className="text-xs font-semibold text-muted-foreground px-2 py-1 mb-1 uppercase">Kategorie</h4>
                                <div className="space-y-1">
                                    {results.categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/categories/${cat.slug}`}
                                            className="flex items-center gap-2 p-2 hover:bg-muted rounded-sm transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="w-8 h-8 relative rounded overflow-hidden bg-muted-foreground/10 shrink-0">
                                                {cat.image ? (
                                                    <Image
                                                        src={processUrl(cat.image)}
                                                        alt={cat.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="32px"
                                                    />
                                                ) : (
                                                    <Search className="w-4 h-4 m-auto text-muted-foreground" />
                                                )}
                                            </div>
                                            <span className="text-sm font-medium">{cat.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(results.categories.length > 0 && results.products.length > 0) && <div className="h-px bg-muted mx-2" />}

                        {results.products.length > 0 && (
                            <div className="p-2">
                                <h4 className="text-xs font-semibold text-muted-foreground px-2 py-1 mb-1 uppercase">Produkty</h4>
                                <div className="space-y-1">
                                    {results.products.map((prod) => (
                                        <Link
                                            key={prod.id}
                                            href={`/products/${prod.id}`}
                                            className="flex items-start gap-3 p-2 hover:bg-muted rounded-sm transition-colors group"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="w-10 h-10 relative rounded overflow-hidden bg-white border shrink-0">
                                                {prod.images && prod.images.length > 0 ? (
                                                    <Image
                                                        src={processUrl(prod.images[0].image_url)}
                                                        alt={prod.name}
                                                        fill
                                                        className="object-contain p-1"
                                                        sizes="40px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-[10px]">brak zdj.</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">{prod.name}</div>
                                                <div className="text-xs text-muted-foreground truncate">{prod.producer?.name}</div>
                                                <div className="text-xs font-semibold mt-0.5">{prod.price_netto} PLN (netto)</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="p-2 border-t bg-muted/30">
                            <Button variant="ghost" className="w-full text-xs h-8" onClick={handleSearch}>
                                Zobacz wszystkie wyniki dla "{query}"
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        {loading ? "Szukam..." : "Brak wyników."}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper to handle absolute urls or legacy paths

function processUrl(url: string | null | undefined) {
    console.log(url)
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return url;
    return `/${url}`;
}
