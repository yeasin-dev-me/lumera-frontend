import { Cart } from "./cart";

export interface ShippingAddressInput {
  full_name: string;
  phone: string;
  address: string;
  address_line2?: string;
  city: string;
  area?: string;
  postal_code?: string;
  country?: string;
}

export interface OrderCreateInput {
  shipping_address: ShippingAddressInput;
  customer_notes?: string;
}

export interface CheckoutCustomerSummary {
  email: string;
  full_name: string;
  phone: string;
}

export interface CheckoutPreview {
  cart: Cart;
  subtotal: string;
  shipping_cost: string;
  discount_total: string;
  total: string;
  currency: string;
  is_ready_for_checkout: boolean;
  customer: CheckoutCustomerSummary;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export interface OrderItemDetail {
  id: number;
  product_public_id: string | null;
  product_name: string;
  product_sku: string;
  product_image: string | null;
  unit_price: string;
  quantity: number;
  line_total: string;
}

export interface OrderStatusHistoryItem {
  from_status: string;
  to_status: string;
  actor_type?: "system" | "staff" | "customer";
  reason: string;
  created_at: string;
}

export interface OrderTimelineItem {
  from_status?: string;
  to_status: string;
  actor_type?: "system" | "staff" | "customer";
  reason?: string;
  created_at: string;
}

export interface OrderListItem {
  public_id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  item_count: number;
  total: string;
  currency: string;
  created_at: string;
}

export interface OrderDetail {
  public_id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  currency: string;
  subtotal: string;
  shipping_cost: string;
  discount_total: string;
  total: string;
  shipping_address: ShippingAddressInput;
  customer_notes: string;
  items: OrderItemDetail[];
  status_history: OrderStatusHistoryItem[];
  courier?: string | null;
  tracking_number?: string | null;
  tracking_url?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  payment?: import("./payment").PaymentStatusResponse | null;
  created_at: string;
  updated_at: string;
}

