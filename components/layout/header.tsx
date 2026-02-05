"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, ChevronDown, ChevronRight, Home, Layers, ShoppingBag, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/layout/search-bar";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

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



                {/* Mobile Menu */}
                <div className="md:hidden mr-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
                            <SheetHeader className="p-6 border-b bg-muted/10">
                                <SheetTitle className="text-left font-bold text-2xl">
                                    <Link href="/" onClick={() => document.getElementById('close-sheet')?.click()} className="flex items-center gap-2">
                                        BUDO<span className="text-primary">HIT</span>
                                    </Link>
                                </SheetTitle>
                                <p className="text-sm text-muted-foreground text-left mt-1">
                                    Twoje centrum sprzętu budowlanego.
                                </p>
                            </SheetHeader>
                            <nav className="flex flex-col py-6 px-4 gap-2 overflow-y-auto max-h-[calc(100vh-100px)]">
                                <Link
                                    href="/"
                                    className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-md hover:bg-primary/5 hover:text-primary transition-colors"
                                >
                                    <Home className="h-5 w-5 text-muted-foreground" />
                                    Strona Główna
                                </Link>
                                <Link
                                    href="/categories"
                                    className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-md hover:bg-primary/5 hover:text-primary transition-colors"
                                >
                                    <Layers className="h-5 w-5 text-muted-foreground" />
                                    Wszystkie Kategorie
                                </Link>

                                <div className="px-4 mt-6 mb-2 flex items-center gap-2">
                                    <ShoppingBag className="h-4 w-4 text-primary" />
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Popularne Kategorie</h4>
                                </div>
                                <div className="flex flex-col gap-1 px-4 border-l-2 border-primary/10 ml-8 mb-4">
                                    {categories.slice(0, 6).map(cat => (
                                        <Link
                                            key={cat.id}
                                            href={`/categories/${cat.slug}`}
                                            className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between group"
                                        >
                                            {cat.name}
                                            <ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                        </Link>
                                    ))}
                                </div>

                                <div className="h-px bg-border my-2" />

                                <Link
                                    href="/contact"
                                    className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-md hover:bg-primary/5 hover:text-primary transition-colors"
                                >
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                    Kontakt z nami
                                </Link>

                                <div className="mt-8 px-4">
                                    <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                                        <h5 className="font-semibold text-sm mb-1">Potrzebujesz pomocy?</h5>
                                        <p className="text-xs text-muted-foreground mb-3">Nasi eksperci służą pomocą w doborze sprzętu.</p>
                                        <Button size="sm" className="w-full text-xs" asChild>
                                            <Link href="tel:+48123456789">Zadzwoń teraz</Link>
                                        </Button>
                                    </div>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
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
