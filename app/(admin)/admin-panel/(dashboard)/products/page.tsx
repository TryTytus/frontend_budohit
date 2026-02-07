"use client";

import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "@/lib/api";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts({ search, page: page.toString() });
            setProducts(data.results);
            // Calculate total pages (assuming page size of 20 from backend settings)
            const count = data.count;
            setTotalPages(Math.ceil(count / 20));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [search, page]); // Simple debounce could be added

    const handleDelete = async (id: number) => {
        if (!confirm("Czy na pewno chcesz usunąć ten produkt?")) return;
        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (error) {
            alert("Nie udało się usunąć produktu.");
        }
    };

    // Helper url
    const processUrl = (url: string | undefined | null) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        if (url.startsWith('/')) return url;
        return `/${url}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-white">Produkty</h2>
                <Button asChild className="bg-primary text-black hover:bg-primary/90">
                    <Link href="/admin-panel/products/new">
                        <Plus className="w-4 h-4 mr-2" /> Dodaj Produkt
                    </Link>
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-lg border border-white/10">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Szukaj produktu..."
                        className="pl-9 bg-black border-white/10 text-white"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // Reset to page 1 on search
                        }}
                    />
                </div>
                <Button variant="outline" size="icon" onClick={fetchProducts}>
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>

            <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-900">
                        <TableRow className="hover:bg-zinc-900 border-white/10">
                            <TableHead className="w-[80px]">Obraz</TableHead>
                            <TableHead className="text-zinc-300">Nazwa</TableHead>
                            <TableHead className="text-zinc-300">Kategoria</TableHead>
                            <TableHead className="text-right text-zinc-300">Cena (Netto)</TableHead>
                            <TableHead className="text-right text-zinc-300">Akcje</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                                    Brak produktów.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id} className="hover:bg-zinc-900/50 border-white/10">
                                    <TableCell>
                                        <div className="relative w-10 h-10 rounded overflow-hidden bg-white border">
                                            {product.images?.[0] ? (
                                                <Image
                                                    src={processUrl(product.images[0].image_url)}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain p-0.5"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-800" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-zinc-200">
                                        {product.name}
                                        <div className="text-xs text-zinc-500">{product.code}</div>
                                    </TableCell>
                                    <TableCell className="text-zinc-400">{product.category?.name || '-'}</TableCell>
                                    <TableCell className="text-right text-zinc-300">{product.price_netto} PLN</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild className="hover:text-primary">
                                                <Link href={`/admin-panel/products/${product.id}`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:text-red-500"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between text-white">
                <div className="text-sm text-zinc-500">
                    Strona {page} z {totalPages}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                    >
                        Poprzednia
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading}
                    >
                        Następna
                    </Button>
                </div>
            </div>
        </div>
    );
}
