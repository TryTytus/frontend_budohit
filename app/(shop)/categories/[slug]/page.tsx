import { getCategory, getProducts, getCategories } from "@/lib/api";
import { CategoryCard } from "@/components/shop/category-card";
import { ProductCard } from "@/components/shop/product-card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { CategoryTree } from "@/components/shop/category-tree";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { slug } = await params;
    const [category, categories] = await Promise.all([
        getCategory(slug),
        getCategories(),
    ]);

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
            <main className="container py-8 lg:py-12">
                <section className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0 space-y-8">
                        <div>
                            <h3 className="font-semibold mb-4 text-lg">Kategorie</h3>
                            <CategoryTree categories={categories} />
                        </div>
                        <Separator />
                        {/* Filters placeholder */}
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col gap-8">
                        {/* Breadcrumbs */}
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
                        </div>

                        {showSubcategories ? (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold">Podkategorie</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                </section>
            </main>
        </div>
    );
}

function getPageNumber(url: string | null): string {
    if (!url) return "1";
    const params = new URL(url).searchParams;
    return params.get("page") || "1";
}
