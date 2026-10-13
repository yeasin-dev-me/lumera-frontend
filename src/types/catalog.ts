export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  status: "draft" | "active" | "archived";
  sort_order: number;
  seo_title?: string;
  seo_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: number;
  image_url: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductListItem {
  id: number;
  public_id: string;
  name: string;
  slug: string;
  sku: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  price: string;
  discount_price: string | null;
  effective_price: string;
  stock_quantity: number;
  is_in_stock: boolean;
  status: "draft" | "active" | "archived";
  is_visible: boolean;
  is_featured: boolean;
  sort_order: number;
  primary_image: string | null;
  created_at: string;
}

export interface ProductDetail extends ProductListItem {
  description: string;
  seo_title?: string;
  seo_description?: string;
  images: ProductImage[];
  updated_at: string;
}

export interface PaginatedProducts {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductListItem[];
}

export interface ProductListParams {
  category?: string;
  ordering?: string;
  search?: string;
  page?: number;
  page_size?: number;
}
