"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Upload, GripVertical, Trash2, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the shape of an image object as expected by the frontend
export interface ProductImage {
    id: number;
    image_url: string;
    order: number;
    is_active: boolean;
    file?: File; // Optional file object for new uploads
}

interface ProductImageManagerProps {
    images: ProductImage[];
    setImages: React.Dispatch<React.SetStateAction<ProductImage[]>>;
}

export function ProductImageManager({ images, setImages }: ProductImageManagerProps) {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const newImages: ProductImage[] = newFiles.map((file, index) => ({
                id: -1 * (Date.now() + index), // Temporary ID
                image_url: URL.createObjectURL(file), // Preview URL
                order: images.length + index,
                is_active: true,
                file: file
            }));
            setImages([...images, ...newImages]);
        }
    };

    const handleRemove = (id: number) => {
        setImages(images.map(img => {
            if (img.id === id) {
                // If it's a new upload (negative ID), just filter it out completely
                if (id < 0) return null;
                // If it's existing, mark as inactive (soft delete)
                return { ...img, is_active: false };
            }
            return img;
        }).filter(Boolean) as ProductImage[]);
    };

    const handleRestore = (id: number) => {
        setImages(images.map(img => img.id === id ? { ...img, is_active: true } : img));
    };

    const handleOrderChange = (id: number, newOrder: number) => {
        setImages(images.map(img => img.id === id ? { ...img, order: newOrder } : img)
            .sort((a, b) => a.order - b.order));
    };

    // Simple reorder by swapping or moving? For now just display order input or sort buttons.
    // Drag and drop is better but complex. Let's do simple input for order or Up/Down.

    // Sort logic for display: Active first, ordered by order.
    // Actually user wants to see all.
    const displayImages = [...images].sort((a, b) => a.order - b.order);

    const getImageUrl = (url: string) => {
        if (!url) return "/placeholder.png"; // Fallback
        if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("/")) return url;
        return `/${url}`;
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayImages.map((img, index) => (
                    <Card key={img.id} className={cn("relative group overflow-hidden border-zinc-800 bg-black/40", !img.is_active && "opacity-50 grayscale")}>
                        <CardContent className="p-2">
                            <div className="relative aspect-square w-full rounded-md overflow-hidden mb-2">
                                <Image
                                    src={getImageUrl(img.image_url)}
                                    alt="Product"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <div className="text-xs text-zinc-500">Ord: {img.order}</div>
                                {img.is_active ? (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-red-500 hover:text-red-400 hover:bg-red-900/20"
                                        onClick={() => handleRemove(img.id)}
                                        type="button"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-green-500 hover:text-green-400 hover:bg-green-900/20"
                                        onClick={() => handleRestore(img.id)}
                                        type="button"
                                    >
                                        <RefreshCcw className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                            {!img.is_active && <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-red-500 font-bold pointer-events-none">DELETED</div>}
                        </CardContent>
                    </Card>
                ))}

                {/* Upload Button */}
                <Card className="border-dashed border-zinc-700 bg-transparent hover:bg-zinc-900/50 transition-colors cursor-pointer" onClick={() => document.getElementById('multi-image-upload')?.click()}>
                    <CardContent className="flex flex-col items-center justify-center h-full min-h-[150px] p-6">
                        <Upload className="h-8 w-8 text-zinc-500 mb-2" />
                        <span className="text-sm text-zinc-500">Dodaj zdjęcia</span>
                        <input
                            id="multi-image-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
