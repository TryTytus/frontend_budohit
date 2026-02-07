"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product, Category } from "@/lib/types";
import { getCategories, getProducers, createProduct, updateProduct, createProductImage, updateProductImage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategorySelector } from "@/components/admin/category-selector";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Loader2, ArrowLeft, Save, Upload } from "lucide-react";
import Image from "next/image";
import { ProductImageManager, ProductImage } from "./product-image-manager";
import { useToast } from "@/components/ui/use-toast";

interface ProductFormProps {
    product?: Product;
    isEdit?: boolean;
}

export function ProductForm({ product, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [producers, setProducers] = useState<any[]>([]); // Using any for producer for now

    // Form Stats
    const [name, setName] = useState(product?.name || "");
    const [code, setCode] = useState(product?.code || "");
    const [description, setDescription] = useState(product?.description || "");
    const [priceNetto, setPriceNetto] = useState(product?.price_netto || "");
    const [vat, setVat] = useState(product?.vat_value?.toString() || "23");
    const [categoryId, setCategoryId] = useState<string>(product?.category?.id?.toString() || "");
    const [producerId, setProducerId] = useState<string>(product?.producer?.id?.toString() || "");
    const [images, setImages] = useState<ProductImage[]>(product?.images?.map(img => ({ ...img, is_active: true })) || []);
    const { toast } = useToast();

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, prods] = await Promise.all([
                    getCategories(),
                    getProducers()
                ]);
                setCategories(cats);
                setProducers(prods);
            } catch (err) {
                console.error("Failed to load form data", err);
                toast({
                    title: "Błąd",
                    description: "Nie udało się załadować danych formularza.",
                    variant: "destructive"
                });
            }
        };
        fetchData();
    }, []);

    // Sync form state when product changes
    useEffect(() => {
        if (product) {
            setName(product.name || "");
            setCode(product.code || "");
            setDescription(product.description || "");
            setPriceNetto(product.price_netto || "");
            setVat(product.vat_value?.toString() || "23");
            setCategoryId(product.category?.id?.toString() || "");
            // Handle producer object or ID if it were flattened (but types say object)
            // Safety check for producer existence
            setProducerId(product.producer?.id?.toString() || "");

            if (product.images) {
                setImages(product.images.map(img => ({ ...img, is_active: true })));
            }
        }
    }, [product]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Redundant with ProductImageManager, keeping for legacy single image if needed, or remove?
        // User wants Image Manager. Let's redirect basic image usage to new manager.
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        const price = parseFloat(priceNetto) || 0;
        const vatRate = parseFloat(vat) || 0;
        const brutto = (price * (1 + vatRate / 100)).toFixed(2);

        formData.append("name", name);
        formData.append("code", code);
        formData.append("description", description);
        formData.append("price_netto", priceNetto);
        formData.append("price_brutto", brutto);
        formData.append("vat_value", vat);
        if (categoryId) formData.append("category_id", categoryId);
        if (producerId) formData.append("producer_id", producerId);

        try {
            let savedProduct: Product;
            if (isEdit && product) {
                savedProduct = await updateProduct(product.id, formData);
            } else {
                savedProduct = await createProduct(formData);
            }

            // Handle Images via Promise.all
            const imagePromises = images.map(async (img) => {
                // New Image (negative ID)
                if (img.id < 0 && img.file) {
                    const imgFormData = new FormData();
                    imgFormData.append("product", savedProduct.id.toString());
                    imgFormData.append("uploaded_image", img.file);
                    imgFormData.append("order", img.order.toString());
                    imgFormData.append("is_active", "true");
                    return createProductImage(imgFormData);
                }
                // Existing Image (update or soft delete)
                else if (img.id > 0) {
                    // Check if changed? Optimisation: only update if order or active changed.
                    // For simplicity, update all metadata.
                    return updateProductImage(img.id, {
                        order: img.order,
                        is_active: img.is_active
                    });
                }
            });

            await Promise.all(imagePromises);

            toast({
                title: "Sukces",
                description: "Zapisano zmiany pomyślnie.",
            });

            // Reload to fetch updated state (IDs for new images etc)
            if (!isEdit) {
                router.push(`/admin-panel/products/${savedProduct.id}`);
            } else {
                router.refresh();
            }

        } catch (err) {
            console.error(err);
            toast({
                title: "Błąd",
                description: "Wystąpił błąd podczas zapisu.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        {isEdit ? `Edytuj: ${product?.name}` : "Nowy Produkt"}
                    </h1>
                </div>
                <Button type="submit" disabled={loading} className="bg-primary text-black hover:bg-primary/90">
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Zapisz
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-zinc-900 border-white/10 text-zinc-100">
                        <CardHeader>
                            <CardTitle>Podstawowe informacje</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nazwa Produktu</Label>
                                <Input
                                    value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    className="bg-black border-white/10" required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Kod Produktu</Label>
                                <Input
                                    value={code} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
                                    className="bg-black border-white/10" required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Opis</Label>
                                <SimpleEditor
                                    value={description} onChange={setDescription}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-white/10 text-zinc-100">
                        <CardHeader>
                            <CardTitle>Multimedia</CardTitle>
                            <CardDescription>Zarządzaj zdjęciami produktu</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProductImageManager images={images} setImages={setImages} />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <Card className="bg-zinc-900 border-white/10 text-zinc-100">
                        <CardHeader>
                            <CardTitle>Cena</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Cena Netto</Label>
                                <div className="relative">
                                    <Input
                                        type="number" step="0.01"
                                        value={priceNetto} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPriceNetto(e.target.value)}
                                        className="bg-black border-white/10 pl-8" required
                                    />
                                    <span className="absolute left-3 top-2.5 text-zinc-500 text-sm">PLN</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Stawka VAT (%)</Label>
                                <Input
                                    type="number"
                                    value={vat} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVat(e.target.value)}
                                    className="bg-black border-white/10" required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-white/10 text-zinc-100">
                        <CardHeader>
                            <CardTitle>Organizacja</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Kategoria</Label>
                                <CategorySelector
                                    value={categoryId}
                                    onChange={setCategoryId}
                                    placeholder="Wybierz kategorię"
                                    initialLabel={product?.category?.name}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Producent</Label>
                                <Select value={producerId} onValueChange={setProducerId}>
                                    <SelectTrigger className="bg-black border-white/10">
                                        <SelectValue placeholder="Wybierz producenta">
                                            {producers.find(p => p.id.toString() === producerId)?.name || "Wybierz producenta"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {producers.map((prod) => (
                                            <SelectItem key={prod.id} value={prod.id.toString()}>{prod.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
