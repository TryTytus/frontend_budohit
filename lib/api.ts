import { PaginatedResponse, Product, Category } from "./types";

const API_URL = "http://127.0.0.1:8000/api";

export async function getProducts(searchParams: Record<string, string> = {}): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams(searchParams);
  const res = await fetch(`${API_URL}/products/?${params.toString()}`, {
    cache: "no-store", // For now, no cache to see updates
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories/`, {
    next: { revalidate: 3600 }, // Cache categories for 1 hour
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  // The API returns a list of root categories which recursively contain children
  return res.json();
}

export async function getCategory(slug: string): Promise<Category> {
  const res = await fetch(`${API_URL}/categories/${slug}/`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Category not found");
    }
    throw new Error("Failed to fetch category");
  }

  return res.json();
}

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
        throw new Error("Product not found");
    }
    throw new Error("Failed to fetch product");
  }

  return res.json();
}
