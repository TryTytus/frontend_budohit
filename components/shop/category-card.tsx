"use client";

import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryCardProps {
    category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
    // Placeholder image if none provided or invalid
    const imageSrc = category.image
        ? (category.image.startsWith('http') || category.image.startsWith('/') ? category.image : `/${category.image}`)
        : "/placeholder.png";

    return (
        <Link href={`/categories/${category.slug}`} className="block h-full group">
            <Card className="h-full overflow-hidden transition-colors hover:bg-accent/50">
                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                    {category.image ? (
                        <Image
                            src={imageSrc}
                            alt={category.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/50">
                            No Image
                        </div>
                    )}
                </div>
                <CardHeader>
                    <CardTitle className="text-center group-hover:text-primary transition-colors">
                        {category.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="hidden">
                    {/* Optional description or count if needed later */}
                </CardContent>
            </Card>
        </Link>
    );
}
