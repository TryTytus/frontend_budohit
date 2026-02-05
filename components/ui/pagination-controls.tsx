"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
    totalPages: number;
    className?: string;
}

export function Pagination({ totalPages, className }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentPage = Number(searchParams.get("page")) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        router.push(createPageURL(page));
    };

    if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                title="Pierwsza strona"
            >
                <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                title="Poprzednia strona"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1 mx-2 text-sm font-medium">
                Strona {currentPage} z {totalPages}
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Następna strona"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                title="Ostatnia strona"
            >
                <ChevronsRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
