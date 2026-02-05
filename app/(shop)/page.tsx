import { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/api";
import { ProductCard } from "@/components/shop/product-card";
import { CategoryTree } from "@/components/shop/category-tree";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Pagination } from "@/components/ui/pagination-controls";

// Re-validate every hour or on-demand
export const revalidate = 3600;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;

  // Clean params for API (ensure string values)
  const apiParams: Record<string, string> = {};
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      apiParams[key] = value;
    } else if (Array.isArray(value)) {
      // Take last or join? Standard is often last for single value expectation
      apiParams[key] = value[value.length - 1];
    }
  });

  const [productsData, categories] = await Promise.all([
    getProducts(apiParams),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 container py-8">
        <section className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div>
              <h3 className="font-semibold mb-4 text-lg">Kategorie</h3>
              <CategoryTree categories={categories} />
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-4 text-lg">Filtry</h3>
              <div className="text-sm text-muted-foreground">
                Filtry wkrótce...
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Produkty ({productsData.count})</h1>
              {/* Sort/Filter options could go here */}
            </div>

            {productsData.results.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Brak produktów.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsData.results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <Pagination
              totalPages={Math.ceil(productsData.count / 20)}
              className="mt-8"
            />
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
