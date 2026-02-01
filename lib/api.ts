import { PaginatedResponse, Product, Category } from "./types";

const API_URL = "http://localhost:8000/api";

// --- Auth API ---
export async function loginAdmin(credentials: { username: string, password: string }): Promise<boolean> {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include", // Important for cookies
  });
  return res.ok;
}

export async function logoutAdmin(): Promise<void> {
  await fetch(`${API_URL}/auth/logout/`, { 
      method: "POST",
      credentials: "include" 
  });
}

export async function checkAdminAuth(): Promise<boolean> {
  try {
      const res = await fetch(`${API_URL}/auth/check/`, {
          credentials: "include"
      });
      return res.ok;
  } catch {
      return false;
  }
}

// --- Shop API ---

export async function getProducts(searchParams: Record<string, string> = {}): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams(searchParams);
  const res = await fetch(`${API_URL}/products/?${params.toString()}`, {
    cache: "no-store", // For now, no cache to see updates
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  
  return res.json();
  return res.json();
}

export async function searchAutocomplete(query: string): Promise<{ categories: Category[], products: Product[] }> {
    const res = await fetch(`${API_URL}/search/autocomplete/?q=${encodeURIComponent(query)}`);
    if (!res.ok) return { categories: [], products: [] };
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

// --- Admin CRUD ---

// Helper for CSRF if needed (Django session auth usually requires CSRF token for POST/PUT)
// Since we are using Session Auth, we need to ensure CSRF cookie is sent.
// Browsers handle cookies automatically with 'credentials: include' IF valid.
// But Django requires X-CSRFToken header.
// We can get it from document.cookie.

function getCookie(name: string) {
  let cookieValue = null;
  if (typeof document !== 'undefined' && document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

const authHeaders = () => {
    const headers: HeadersInit = {};
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
    }
    return headers;
}

export async function createProduct(formData: FormData): Promise<Product> {
    const res = await fetch(`${API_URL}/products/`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
    });
    if (!res.ok) throw new Error("Failed to create product");
    return res.json();
}

export async function updateProduct(id: number, formData: FormData): Promise<Product> {
    const res = await fetch(`${API_URL}/products/${id}/`, {
        method: "PUT", // or PATCH
        headers: authHeaders(),
        body: formData,
    });
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/products/${id}/`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete product");
}

// --- Producers ---
export async function getProducers(): Promise<any[]> { 
     const res = await fetch(`${API_URL}/producers/`);
     if (!res.ok) return [];
     const data = await res.json();
     // If backend forces pagination despite my setting, handle it
     if (Array.isArray(data)) return data;
     if (data.results && Array.isArray(data.results)) return data.results;
     return [];
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
