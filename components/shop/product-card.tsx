"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const mainImage = product.images.length > 0 ? product.images[0].image_url : "https://placehold.co/400x400?text=No+Image";

    return (
        <Card className="overflow-hidden flex flex-col h-full group">
            <div className="relative aspect-square overflow-hidden bg-muted">
                {/* We use standard img tag or unoptimized Next Image for external URLs provided as is */}
                <img
                    src={mainImage}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                {product.producer && (
                    <Badge className="absolute top-2 right-2 variant-secondary bg-white/80 text-black hover:bg-white">
                        {product.producer.name}
                    </Badge>
                )}
            </div>
            <CardContent className="p-3 flex-1 flex flex-col justify-between">
                <div>
                    <div className="text-xs text-muted-foreground mb-1">
                        {product.category?.name || "Bez kategorii"}
                    </div>
                    <Link href={`/products/${product.id}`} className="hover:underline">
                        <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] leading-tight mb-2">{product.name}</h3>
                    </Link>
                </div>

                {/* Price moved to Content */}
                <div className="flex items-baseline justify-between mt-1">
                    <span className="text-lg font-bold text-primary">
                        {product.price_netto} <span className="text-sm">{product.currency}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase">Netto</span>
                </div>
            </CardContent>
            <CardFooter className="p-3 pt-0">
                <Button
                    size="sm"
                    className="w-full text-xs h-8"
                    onClick={() => addItem(product)}
                >
                    Do koszyka
                </Button>
            </CardFooter>
        </Card>
    );
}
