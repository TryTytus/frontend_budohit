import { CartProvider } from "@/lib/cart-context";
import { CartSheet } from "@/components/shop/cart-sheet";
import { Header } from "@/components/layout/header";
import { getCategories } from "@/lib/api";

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const categories = await getCategories();

    return (
        <>
            <Header categories={categories} />
            {children}
            <CartSheet />
        </>
    );
}
