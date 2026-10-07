export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface HealthCheckResponse {
  status: "ok";
}

export interface StorefrontConfig {
  site_name: string;
  currency: string;
  version: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  is_staff: boolean;
  created_at: string;
}

export interface CustomerAddress {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  area: string;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerAddressInput {
  label?: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  area?: string;
  city: string;
  postal_code?: string;
  country?: string;
  is_default?: boolean;
}

export interface CustomerReturnItem {
  order_item_id: string;
  product_name: string;
  quantity: number;
}

export interface CustomerReturn {
  public_id: string;
  order_public_id: string;
  reason: string;
  status: "requested" | "approved" | "rejected" | "received" | "cancelled";
  staff_note: string;
  items: CustomerReturnItem[];
  created_at: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: UserProfile;
}

export interface TokenRefreshResponse {
  access: string;
  refresh?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
