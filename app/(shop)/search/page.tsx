import { Pagination } from "@/components/ui/pagination-controls";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/shop/product-card";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const query = resolvedSearchParams.q || "";
    const page = resolvedSearchParams.page || "1";

    const productResults = await getProducts({ search: query, page });
    const totalPages = Math.ceil(productResults.count / 20); // Assuming page size 20 from API

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="container py-8 lg:py-12">
                <div className="flex flex-col gap-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Wyniki wyszukiwania</h1>
                        <p className="text-muted-foreground mt-2">
                            Dla zapytania: <span className="font-semibold text-foreground">"{query}"</span>
                        </p>
                    </div>

                    {productResults.results.length === 0 ? (
                        <div className="text-center py-16 border rounded-lg bg-muted/10">
                            <h2 className="text-xl font-semibold mb-2">Brak wyników</h2>
                            <p className="text-muted-foreground">Nie znaleźliśmy produktów pasujących do Twojego zapytania.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {productResults.results.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            <Pagination totalPages={totalPages} className="mt-8" />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
