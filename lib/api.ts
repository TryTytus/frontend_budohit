import { PaginatedResponse, Product, Category } from "./types";

const API_URL = "http://localhost:8000/api";

// --- Auth API ---
export async function loginAdmin(credentials: { username: string, password: string }): Promise<boolean> {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
    }

    const res = await fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: headers,
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

// Helper for authorized requests
async function authorizedFetch(url: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers || {});
    
    // Add CSRF token
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
        headers.set('X-CSRFToken', csrfToken);
    }

    return fetch(url, {
        ...options,
        headers,
        credentials: "include", // Always include cookies for session auth
    });
}

export async function createProduct(formData: FormData): Promise<Product> {
    const res = await authorizedFetch(`${API_URL}/products/`, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) throw new Error("Failed to create product");
    return res.json();
}

export async function updateProduct(id: number, formData: FormData): Promise<Product> {
    const res = await authorizedFetch(`${API_URL}/products/${id}/`, {
        method: "PUT",
        body: formData,
    });
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
    const res = await authorizedFetch(`${API_URL}/products/${id}/`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete product");
}

export async function createProductImage(formData: FormData): Promise<any> {
    const res = await authorizedFetch(`${API_URL}/product-images/`, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload image");
    return res.json();
}

export async function updateProductImage(id: number, data: any): Promise<any> {
    const res = await authorizedFetch(`${API_URL}/product-images/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update image");
    return res.json();
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

export async function getAdminCategories(parentId: string | null = null): Promise<Category[]> {
    const url = parentId 
        ? `${API_URL}/admin-categories/?parent=${parentId}`
        : `${API_URL}/admin-categories/`; // Default to roots
    
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
}

export async function createCategory(data: any): Promise<Category> {
    const isFormData = data instanceof FormData;
    const headers: HeadersInit = isFormData ? {} : { "Content-Type": "application/json" };
    const body = isFormData ? data : JSON.stringify(data);

    const res = await authorizedFetch(`${API_URL}/admin-categories/`, {
        method: "POST",
        headers,
        body,
    });
    if (!res.ok) throw new Error("Failed to create category");
    return res.json();
}

export async function updateCategory(id: number, data: any): Promise<Category> {
    const isFormData = data instanceof FormData;
    const headers: HeadersInit = isFormData ? {} : { "Content-Type": "application/json" };
    const body = isFormData ? data : JSON.stringify(data);

    const res = await authorizedFetch(`${API_URL}/admin-categories/${id}/`, {
        method: "PATCH",
        headers,
        body,
    });
    if (!res.ok) throw new Error("Failed to update category");
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
