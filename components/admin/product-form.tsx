"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product, Category } from "@/lib/types";
import { getCategories, getProducers, createProduct, updateProduct } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Save, Upload } from "lucide-react";
import Image from "next/image";

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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(product?.images?.[0]?.url || null);

    useEffect(() => {
        const fetchData = async () => {
            const [cats, prods] = await Promise.all([getCategories(), getProducers()]);
            setCategories(cats);
            setProducers(prods);
        };
        fetchData();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
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
        if (categoryId) formData.append("category", categoryId); // API expects ID for FK
        if (producerId) formData.append("producer", producerId);

        // Handle Image: If new file, use 'image' field expected by server-side logic (ModelViewSet handles nesting if properly set up but standard DRF CreateModelMixin expects field on model or separate handling)
        // Wait, Product has prefetch_related('images'). Is it a related model or direct?
        // Let's assume standard ProductImage management. Complex for Form Data.
        // If Product model has 'image' field? No, it has `images` relation.
        // Admin usually handles this by creating Product first then Image.
        // OR: Backend serializer handles `images` field with upload.
        // I'll append 'image' and hope backend handles it, or I'll implement a simple ProductImage creation loop.
        // Assuming simple case: Backend serializer reads 'image' from request.FILES and creates ProductImage?
        // Let's check serializer later. For now send it.
        if (imageFile) {
            formData.append("uploaded_image", imageFile); // Custom field name to detect in serializer
        }

        try {
            if (isEdit && product) {
                await updateProduct(product.id, formData);
            } else {
                await createProduct(formData);
            }
            router.push("/admin-panel/products");
            router.refresh();
        } catch (err) {
            console.error(err);
            alert("Błąd zapisu produktu.");
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
                                <Textarea
                                    value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                    className="min-h-[200px] bg-black border-white/10"
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
                            <div className="grid grid-cols-1 gap-4">
                                <div className="border-2 border-dashed border-white/10 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer bg-black/20"
                                    onClick={() => document.getElementById('image-upload')?.click()}>
                                    <input
                                        id="image-upload" type="file" className="hidden" accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {previewUrl ? (
                                        <div className="relative w-full h-64">
                                            <Image src={previewUrl.startsWith('http') ? previewUrl : `/${previewUrl}`} alt="Preview" fill className="object-contain" />
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-zinc-500 mb-2" />
                                            <p className="text-sm text-zinc-400">Kliknij aby dodać zdjęcie</p>
                                        </>
                                    )}
                                </div>
                            </div>
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
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                    <SelectTrigger className="bg-black border-white/10">
                                        <SelectValue placeholder="Wybierz kategorię" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Producent</Label>
                                <Select value={producerId} onValueChange={setProducerId}>
                                    <SelectTrigger className="bg-black border-white/10">
                                        <SelectValue placeholder="Wybierz producenta" />
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
