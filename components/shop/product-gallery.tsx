"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/lib/types";

interface ProductGalleryProps {
    images: ProductImage[];
    name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    // Create placeholder if no images
    const displayImages = images.length > 0 ? images : [{ id: 0, image_url: "https://placehold.co/600x600?text=No+Image", order: 0 }];
    const mainImage = displayImages[selectedIndex];

    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                <img
                    src={mainImage.image_url}
                    alt={`${name} - Image ${selectedIndex + 1}`}
                    className="h-full w-full object-contain"
                />
            </div>
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                "relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted",
                                index === selectedIndex && "ring-2 ring-primary"
                            )}
                        >
                            <img
                                src={image.image_url}
                                alt={`${name} - Thumbnail ${index + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
