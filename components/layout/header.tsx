"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/layout/search-bar";

interface HeaderProps {
    categories?: Category[];
}

export function Header({ categories = [] }: HeaderProps) {
    const { totalItems, openCart } = useCart();

    // Helper to find category by name (case insensitive matching if needed, but exact ok here)
    const findCategory = (name: string) => categories.find(c => c.name === name);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <div className="mr-8 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block text-xl">
                            BUDO<span className="text-primary">HIT</span>
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Produkty
                        </Link>
                        <Link href="/categories" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Kategorie
                        </Link>

                        <NavDropdown title="Maszyny budowlane" category={findCategory("Maszyny budowlane")} />
                        <NavDropdown title="Narzędzia" category={findCategory("Narzędzia")} />
                        <NavDropdown title="Osprzęt i akcesoria" category={findCategory("Osprzęt i akcesoria")} />

                        <Link href="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Kontakt
                        </Link>
                    </nav>
                </div>
                <Button variant="outline" size="icon" className="mr-2 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <div className="relative">
                            <SearchBar />
                        </div>
                    </div>
                    <nav className="flex items-center">
                        <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
                            <ShoppingCart className="h-5 w-5" />
                            <span className="sr-only">Koszyk</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Button>
                    </nav>
                </div>
            </div>
        </header >
    );
}

function NavDropdown({ title, category }: { title: string, category?: Category }) {
    const [open, setOpen] = useState(false);

    if (!category || !category.children || category.children.length === 0) {
        return (
            <Link href={category ? `/categories/${category.slug}` : '#'} className="transition-colors hover:text-foreground/80 text-foreground/60">
                {title}
            </Link>
        );
    }

    return (
        <div
            className="relative group"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <Link
                href={`/categories/${category.slug}`}
                className={cn(
                    "flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground/60 focus:outline-none py-4",
                    open && "text-foreground"
                )}
            >
                {title}
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")} />
            </Link>

            <div className={cn(
                "absolute left-0 top-full pt-2 w-[240px] opacity-0 translate-y-2 pointer-events-none transition-all duration-200 ease-in-out z-50",
                open && "opacity-100 translate-y-0 pointer-events-auto"
            )}>
                <div className="bg-popover border rounded-md shadow-md p-2 overflow-hidden">
                    <div className="flex flex-col gap-1">
                        {category.children.map((child) => (
                            <Link
                                key={child.id}
                                href={`/categories/${child.slug}`}
                                className="block px-4 py-2 text-sm text-popover-foreground hover:bg-muted hover:text-primary rounded-sm transition-colors"
                            >
                                {child.name}
                            </Link>
                        ))}
                        <div className="h-px bg-muted my-1" />
                        <Link
                            href={`/categories/${category.slug}`}
                            className="flex items-center justify-between px-4 py-2 text-sm font-medium text-primary hover:bg-muted/50 rounded-sm transition-colors"
                        >
                            Zobacz wszystko
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
