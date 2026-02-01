"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCart } from "@/lib/cart-context";

export function Header() {
    const { totalItems, openCart } = useCart();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <div className="mr-4 hidden md:flex">
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
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Szukaj produktów..."
                                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                            />
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
