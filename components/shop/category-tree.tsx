"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@/lib/types";

interface CategoryTreeProps {
    categories: Category[];
    level?: number;
}

export function CategoryTree({ categories, level = 0 }: CategoryTreeProps) {
    return (
        <div className={cn("space-y-1", level > 0 && "pl-4")}>
            {categories.map((category) => (
                <CategoryItem key={category.id} category={category} />
            ))}
        </div>
    );
}

function CategoryItem({ category }: { category: Category }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const hasChildren = category.children && category.children.length > 0;

    return (
        <div>
            <div className="flex items-center justify-between py-1 hover:text-primary">
                <Link
                    href={`/?category=${category.id}`}
                    className="text-sm font-medium flex-1 truncate"
                >
                    {category.name}
                </Link>
                {hasChildren && (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-1 hover:bg-muted rounded-full"
                    >
                        {isOpen ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                    </button>
                )}
            </div>
            {isOpen && hasChildren && (
                <CategoryTree categories={category.children} level={1} />
            )}
        </div>
    );
}
