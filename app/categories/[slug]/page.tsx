import { getCategory, getProducts } from "@/lib/api";
import { CategoryCard } from "@/components/shop/category-card";
import { ProductCard } from "@/components/shop/product-card";
import { Header } from "@/components/layout/header";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import Link from "next/link";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { slug } = await params;
    const category = await getCategory(slug);

    // If category has children, we show them.
    // If not, we show products.
    const showSubcategories = category.children && category.children.length > 0;

    let products = null;
    if (!showSubcategories) {
        // Resolve search params for pagination/sorting if needed in future
        const resolvedSearchParams = await searchParams;
        const apiParams: Record<string, string> = { category: slug };

        // Pass through page/sort params
        if (resolvedSearchParams.page) apiParams.page = String(resolvedSearchParams.page);

        products = await getProducts(apiParams);
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="container py-8 lg:py-12">
                <div className="flex flex-col gap-8">

                    {/* Breadcrumbs (Simplified for now - assumes we can build path or just back to Categories) */}
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/">Home</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/categories">Kategorie</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{category.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
                        {/* Can add description here if available in model */}
                    </div>

                    {showSubcategories ? (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">Podkategorie</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {category.children.map((child) => (
                                    <CategoryCard key={child.id} category={child} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Produkty ({products?.count || 0})</h2>
                            </div>

                            {products?.results.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
                                    Brak produktów w tej kategorii.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products?.results.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            )}

                            {/* Pagination for products */}
                            {products && (products.previous || products.next) && (
                                <div className="flex justify-center gap-2 mt-8">
                                    {products.previous && (
                                        <Link href={`/categories/${slug}?page=${getPageNumber(products.previous)}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                            Poprzednia
                                        </Link>
                                    )}
                                    {products.next && (
                                        <Link href={`/categories/${slug}?page=${getPageNumber(products.next)}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                            Następna
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function getPageNumber(url: string | null): string {
    if (!url) return "1";
    const params = new URL(url).searchParams;
    return params.get("page") || "1";
}
