"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2, Truck, CreditCard } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState("dpd");

    const deliveryOptions = {
        dpd: { name: "Kurier DPD", price: 20.00 },
        inpost: { name: "Paczkomaty InPost", price: 15.00 },
        courier: { name: "Kurier Inny", price: 25.00 },
        pickup: { name: "Odbiór Osobisty", price: 0.00 },
    };

    const shippingCost = deliveryOptions[deliveryMethod as keyof typeof deliveryOptions]?.price || 0;
    const finalTotal = totalPrice + shippingCost;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        setIsSuccess(true);
        clearCart();
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex flex-col">
                <main className="container flex-1 flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <CheckCircle2 className="h-20 w-20 text-green-500" />
                    <h1 className="text-3xl font-bold">Dziękujemy za zamówienie!</h1>
                    <p className="text-muted-foreground max-w-md">
                        Twoje zamówienie zostało przyjęte do realizacji. Na podany adres email otrzymasz potwierdzenie wraz ze szczegółami.
                    </p>
                    <div className="flex gap-4 pt-4">
                        <Button asChild>
                            <Link href="/">Wróć do sklepu</Link>
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <main className="container flex-1 flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <h1 className="text-2xl font-bold"> Twój koszyk jest pusty</h1>
                    <p className="text-muted-foreground">Dodaj produkty do koszyka, aby przejść do kasy.</p>
                    <Button asChild>
                        <Link href="/">Przeglądaj produkty</Link>
                    </Button>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50/50">

            <main className="container py-8 lg:py-12">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Kasa / Zamówienie</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <form id="checkout-form" onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">

                            {/* Contact & Shipping */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Dane do wysyłki</CardTitle>
                                    <CardDescription>Wprowadź swoje dane kontaktowe i adres dostawy.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">Imię</Label>
                                            <Input id="firstName" required placeholder="Jan" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Nazwisko</Label>
                                            <Input id="lastName" required placeholder="Kowalski" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" required placeholder="jan@example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Telefon</Label>
                                            <Input id="phone" type="tel" required placeholder="+48 123 456 789" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Ulica i numer</Label>
                                        <Input id="address" required placeholder="ul. Przykładowa 1/2" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="zip">Kod pocztowy</Label>
                                            <Input id="zip" required placeholder="00-000" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="city">Miasto</Label>
                                            <Input id="city" required placeholder="Warszawa" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country">Kraj</Label>
                                        <Select defaultValue="PL">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Wybierz kraj" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PL">Polska</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Delivery Method */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        Sposób dostawy
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="grid gap-4">
                                        <Label className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value="dpd" id="dpd" />
                                                <span className="font-medium">Kurier DPD</span>
                                            </div>
                                            <span>20.00 PLN</span>
                                        </Label>
                                        <Label className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value="inpost" id="inpost" />
                                                <span className="font-medium">Paczkomaty InPost</span>
                                            </div>
                                            <span>15.00 PLN</span>
                                        </Label>
                                        <Label className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value="courier" id="courier" />
                                                <span className="font-medium">Inny Kurier</span>
                                            </div>
                                            <span>25.00 PLN</span>
                                        </Label>
                                        <Label className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value="pickup" id="pickup" />
                                                <span className="font-medium">Odbiór Osobisty</span>
                                            </div>
                                            <span>0.00 PLN</span>
                                        </Label>
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            {/* Payment Method - Visual Only */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Płatność
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="cardNumber">Numer karty</Label>
                                        <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>Miesiąc</Label>
                                            <Select>
                                                <SelectTrigger><SelectValue placeholder="MM" /></SelectTrigger>
                                                <SelectContent>
                                                    {Array.from({ length: 12 }, (_, i) => (
                                                        <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Rok</Label>
                                            <Select>
                                                <SelectTrigger><SelectValue placeholder="RR" /></SelectTrigger>
                                                <SelectContent>
                                                    {Array.from({ length: 10 }, (_, i) => (
                                                        <SelectItem key={i} value={String(new Date().getFullYear() + i)}>{new Date().getFullYear() + i}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvv">CVV</Label>
                                            <Input id="cvv" placeholder="123" maxLength={3} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        </form>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>Podsumowanie</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3 max-h-[300px] overflow-auto pr-2">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm gap-2">
                                                <div className="flex flex-col">
                                                    <span className="font-medium line-clamp-2">{item.name}</span>
                                                    <span className="text-muted-foreground text-xs">{item.quantity} x {Number(item.price_netto).toFixed(2)} {item.currency}</span>
                                                </div>
                                                <span className="font-semibold whitespace-nowrap">
                                                    {(item.quantity * Number(item.price_netto)).toFixed(2)} {item.currency}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Suma częściowa (netto)</span>
                                            <span>{totalPrice.toFixed(2)} PLN</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Dostawa</span>
                                            <span>{shippingCost.toFixed(2)} PLN</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">VAT (23%)</span>
                                            <span>{((totalPrice + shippingCost) * 0.23).toFixed(2)} PLN</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-end">
                                        <span className="font-bold text-lg">Do zapłaty</span>
                                        <div className="text-right">
                                            <span className="font-bold text-xl text-primary">{(finalTotal * 1.23).toFixed(2)} PLN</span>
                                            <p className="text-[10px] text-muted-foreground">w tym VAT</p>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        type="submit"
                                        form="checkout-form"
                                        disabled={loading}
                                    >
                                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Przetwarzanie...</> : "Zamawiam i płacę"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
