import { getCategories } from "@/lib/api";
import { CategoryCard } from "@/components/shop/category-card";

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="container py-8 lg:py-12">
                <div className="flex flex-col gap-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Kategorie Produktów</h1>
                        <p className="text-muted-foreground">
                            Przeglądaj naszą szeroką ofertę narzędzi, maszyn i materiałów budowlanych.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>

                    {categories.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            Brak kategorii do wyświetlenia.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
