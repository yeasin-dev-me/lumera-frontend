export interface CartProduct {
  public_id: string;
  name: string;
  slug: string;
  primary_image: string | null;
  price: string;
  discount_price: string | null;
  effective_price: string;
  stock_quantity: number;
  is_in_stock: boolean;
}

export type CartAvailabilityStatus =
  | "available"
  | "insufficient_stock"
  | "out_of_stock"
  | "unavailable";

export interface CartItem {
  product: CartProduct;
  quantity: number;
  unit_price: string;
  line_total: string;
  availability_status: CartAvailabilityStatus;
  is_purchasable: boolean;
  added_at: string;
}

export interface Cart {
  items: CartItem[];
  item_count: number;
  subtotal: string;
  total: string;
  currency: string;
  has_unavailable_items: boolean;
  updated_at: string | null;
}

export interface WishlistItem {
  product: CartProduct;
  is_available: boolean;
  added_at: string;
}

export interface Wishlist {
  items: WishlistItem[];
  item_count: number;
}
