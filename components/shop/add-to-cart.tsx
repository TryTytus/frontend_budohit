"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

interface AddToCartProps {
    product: Product;
    minQty?: number;
    maxQty?: number;
    uom?: string;
}

export function AddToCart({ product, minQty = 1, maxQty = 999, uom = "szt." }: AddToCartProps) {
    const [quantity, setQuantity] = useState<string | number>(minQty);
    const { addItem } = useCart();

    const handleIncrement = () => {
        setQuantity(prev => Number(prev) + 1)
    };

    const handleDecrement = () => {
        setQuantity(prev => {
            const val = Number(prev);
            if (val > minQty) return val - 1;
            return val;
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "") {
            setQuantity("");
            return;
        }
        const val = parseInt(value);
        if (!isNaN(val)) {
            setQuantity(val);
        }
    };

    const handleBlur = () => {
        let val = Number(quantity);
        if (isNaN(val) || val < minQty) val = minQty;
        if (maxQty > 0 && val > maxQty) val = maxQty;
        setQuantity(val);
    };

    const handleAddToCart = () => {
        addItem(product, Number(quantity));
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-md">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-r-none"
                        onClick={handleDecrement}
                        disabled={Number(quantity) <= minQty}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                        type="number"
                        value={quantity}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="h-10 w-16 border-0 text-center focus-visible:ring-0 rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-l-none"
                        onClick={handleIncrement}
                        disabled={maxQty > 0 && Number(quantity) >= maxQty}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <span className="text-sm text-muted-foreground">{uom}</span>
            </div>

            <Button size="lg" className="w-full gap-2" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" />
                Dodaj do koszyka
            </Button>
        </div>
    );
}
