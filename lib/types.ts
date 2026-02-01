export interface Producer {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  image?: string;
  children: Category[];
}

export interface ProductImage {
  id: number;
  url: string;
  image_url: string; // Restored for compatibility
  order: number;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  producer: Producer | null;
  category: {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
  } | null;
  category_path: {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
  }[];
  images: ProductImage[];
  active: boolean;
  description: string;
  short_description: string;
  currency: string;
  vat: string; // Added field
  vat_value: string;
  price_netto: string; // Decimal comes as string from DRF usually unless coerced
  price_brutto: string;
  weight: string;
  width: string;
  height: string;
  depth: string;
  delivery_price: string;
  execution_time: string;
  min_qty: string;
  max_qty: string;
  uom: string;
  man_code: string;
  mpn_code: string;
  is_stock_validated: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
