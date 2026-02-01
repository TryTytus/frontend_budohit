"use client";

import { useCart } from "@/lib/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CartSheet() {
    const { items, removeItem, updateQuantity, totalPrice, isCartOpen, closeCart } = useCart();

    return (
        <Sheet open={isCartOpen} onOpenChange={closeCart}>
            <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-4">
                <SheetHeader className="space-y-2.5 pb-6 border-b">
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Twój Koszyk
                    </SheetTitle>
                    <SheetDescription>
                        {items.length === 0
                            ? "Twój koszyk jest pusty."
                            : `Masz ${items.length} ${items.length === 1 ? 'produkt' : items.length > 1 && items.length < 5 ? 'produkty' : 'produktów'} w koszyku.`
                        }
                    </SheetDescription>
                </SheetHeader>

                {items.length > 0 ? (
                    <>
                        <div className="flex-1 overflow-y-auto py-6 -mx-6 px-8">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
                                            <img
                                                src={item.images.length > 0 ? item.images[0].image_url : "/placeholder.jpg"}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="space-y-1">
                                                <h3 className="font-medium text-sm leading-tight line-clamp-2">
                                                    <Link href={`/products/${item.id}`} onClick={closeCart} className="hover:underline">
                                                        {item.name}
                                                    </Link>
                                                </h3>
                                                <p className="text-xs text-muted-foreground">Unit: {item.uom}</p>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center border rounded-md h-8">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-r-none"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <div className="w-8 text-center text-sm font-medium">
                                                        {item.quantity}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-l-none"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm">
                                                        {(Number(item.price_netto) * item.quantity).toFixed(2)} {item.currency}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                        onClick={() => removeItem(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t mt-auto space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-base font-medium">
                                    <span>Suma (netto)</span>
                                    <span>{totalPrice.toFixed(2)} {items[0]?.currency}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Podatki i koszty dostawy obliczane przy finalizacji.
                                </p>
                            </div>
                            <Button className="w-full" size="lg" asChild onClick={closeCart}>
                                <Link href="/checkout">
                                    Przejdź do kasy
                                </Link>
                            </Button>
                            <SheetClose asChild>
                                <Button variant="outline" className="w-full">
                                    Kontynuuj zakupy
                                </Button>
                            </SheetClose>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="relative h-40 w-40 text-muted-foreground/20">
                            <ShoppingBag className="h-full w-full" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Twój koszyk jest pusty</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                Wygląda na to, że nie dodałeś jeszcze żadnych produktów do koszyka.
                            </p>
                        </div>
                        <SheetClose asChild>
                            <Button className="mt-4">
                                Wróć do sklepu
                            </Button>
                        </SheetClose>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
