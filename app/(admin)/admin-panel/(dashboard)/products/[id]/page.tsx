"use client";

import { useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/product-form";
import { getProduct } from "@/lib/api";
import { Product } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function EditProductPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            getProduct(params.id as string)
                .then(p => setProduct(p))
                .catch(e => console.error(e))
                .finally(() => setLoading(false));
        }
    }, [params.id]);

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;
    if (!product) return <div>Produkt nie znaleziony</div>;

    return <ProductForm product={product} isEdit />;
}
