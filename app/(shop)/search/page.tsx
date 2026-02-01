import { getProducts, getCategories } from "@/lib/api";
import { ProductCard } from "@/components/shop/product-card";
import { CategoryCard } from "@/components/shop/category-card";
import { Header } from "@/components/layout/header";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const query = resolvedSearchParams.q || "";

    // We reuse existing API but they might need specific search capability
    // Currently getProducts takes exact params, but we want broad search
    // So we pass 'search' param if our backend supports it (ProductViewSet uses SearchFilter which looks at 'search' param)
    // Let's ensure strict typing allows it or just cast it
    const productResults = await getProducts({ search: query });

    // For categories, we might need a similar search if we want to show category results on this page too.
    // Our current 'getCategories' only returns roots. 
    // We can add a specialized search or just use autocomplete results if we want quick jump.
    // But typically a "Search Results" page shows Products primarily.
    // Exception: if the query matches a category name exactly, maybe show it?

    // Let's stick to Products for the robust "Results Page" first.
    // If user wants mixed, we can call searchAutocomplete logic or a dedicated endpoint.
    // Given time constraints, showing Products is the core requirement "page with results of products we searched".

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header is in layout */}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {productResults.results.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
