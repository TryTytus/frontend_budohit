import { getProduct } from "@/lib/api";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductSpecifications } from "@/components/shop/product-specifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AddToCart } from "@/components/shop/add-to-cart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="container py-8">

                {/* Breadcrumbs */}
                <nav className="flex items-center text-sm text-muted-foreground mb-6 overflow-hidden">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    <ChevronRight className="h-4 w-4 mx-2" />

                    {product.category_path?.map((cat, index) => (
                        <div key={cat.id} className="flex items-center">
                            <Link href={`/?category=${cat.id}`} className="hover:text-primary whitespace-nowrap">
                                {cat.name}
                            </Link>
                            <ChevronRight className="h-4 w-4 mx-2" />
                        </div>
                    ))}
                    <span className="font-medium text-foreground truncate">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                    {/* Left Column: Gallery */}
                    <div>
                        <ProductGallery images={product.images} name={product.name} />
                    </div>

                    {/* Right Column: Info */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 tracking-tight">{product.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {product.producer && (
                                    <div className="flex items-center gap-1">
                                        <span>Producent:</span>
                                        <Link href={`/?producer=${product.producer.id}`} className="text-primary font-medium hover:underline">
                                            {product.producer.name}
                                        </Link>
                                    </div>
                                )}
                                <span className="text-muted-foreground/40">|</span>
                                <span>Kod: <span className="font-mono text-foreground">{product.code}</span></span>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-2 pb-4 border-b">
                            <span className="text-4xl font-bold tracking-tight text-primary">
                                {product.price_netto} <span className="text-xl font-semibold">{product.currency}</span>
                            </span>
                            <span className="text-sm font-medium text-muted-foreground">netto</span>
                            <span className="text-sm text-muted-foreground ml-2">
                                ({product.price_brutto} {product.currency} brutto)
                            </span>
                        </div>

                        {/* Availability Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-foreground">Dostępność magazynowa:</span>
                                <div className={`flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${Number(product.max_qty) > 5
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : Number(product.max_qty) > 0
                                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                    }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${Number(product.max_qty) > 5 ? "bg-green-600" : Number(product.max_qty) > 0 ? "bg-yellow-600" : "bg-red-600"
                                        }`} />
                                    {Number(product.max_qty) > 10
                                        ? "Duża ilość (>10 szt.)"
                                        : Number(product.max_qty) > 0
                                            ? `Ostatnie sztuki (${Number(product.max_qty)} szt.)`
                                            : "Wyprzedane"}
                                </div>
                            </div>

                            {product.execution_time && product.execution_time !== "0" && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Przewidywana dostawa:</span>
                                    <span className="text-muted-foreground">{product.execution_time}</span>
                                </div>
                            )}
                        </div>

                        {/* Add to Cart Section - Make it distinct */}
                        <div className="p-6 bg-muted/30 rounded-xl border space-y-4">
                            <AddToCart
                                product={product}
                                minQty={Number(product.min_qty)}
                                maxQty={Number(product.max_qty)}
                                uom={product.uom}
                            />
                        </div>

                        <div className="pt-2">
                            <Tabs defaultValue="description" className="w-full">
                                <TabsList className="mb-4 w-full justify-start">
                                    <TabsTrigger value="description">Opis Produktu</TabsTrigger>
                                    <TabsTrigger value="specifications">Dane Techniczne</TabsTrigger>
                                </TabsList>
                                <TabsContent value="description">
                                    <section>
                                        <div
                                            className="prose dark:prose-invert max-w-none p-6 border rounded-lg"
                                            dangerouslySetInnerHTML={{ __html: product.description || "<p>Brak opisu.</p>" }}
                                        />
                                    </section>
                                </TabsContent>
                                <TabsContent value="specifications">
                                    <section>
                                        <div className="border rounded-lg overflow-hidden">
                                            <ProductSpecifications product={product} />
                                        </div>
                                    </section>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}
