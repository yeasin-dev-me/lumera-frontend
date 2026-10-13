import { ApiErrorPayload, HealthCheckResponse, StorefrontConfig } from "@/types/api";
import { OrderDetail } from "@/types/order";

export class ApiError extends Error {
  code: string;
  details?: Record<string, string[]>;
  status: number;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message || "An API error occurred");
    this.name = "ApiError";
    this.status = status;
    this.code = payload.code || "unknown_error";
    this.details = payload.details;
  }
}

class StorefrontApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
      "http://localhost:8000/api/v1";
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorPayload: ApiErrorPayload = {
          code: "http_error",
          message: `Request failed with status ${response.status}`,
        };

        try {
          const data = await response.json();
          if (data && data.error) {
            errorPayload = data.error;
          }
        } catch {
          // Response body was not JSON
        }

        throw new ApiError(response.status, errorPayload);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(0, {
        code: "network_error",
        message: err instanceof Error ? err.message : "Failed to connect to backend",
      });
    }
  }

  // System endpoints
  async getHealth(): Promise<HealthCheckResponse> {
    return this.request<HealthCheckResponse>("/health/");
  }

  // Storefront endpoints
  async getConfig(): Promise<StorefrontConfig> {
    return this.request<StorefrontConfig>("/storefront/config/");
  }

  // Customer Authentication & Account
  async register(payload: import("@/types/api").RegisterPayload): Promise<import("@/types/api").AuthResponse> {
    return this.request<import("@/types/api").AuthResponse>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async login(payload: import("@/types/api").LoginPayload): Promise<import("@/types/api").AuthResponse> {
    return this.request<import("@/types/api").AuthResponse>("/auth/login/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async refresh(refreshToken: string): Promise<import("@/types/api").TokenRefreshResponse> {
    return this.request<import("@/types/api").TokenRefreshResponse>("/auth/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  async logout(refreshToken?: string): Promise<{ status: string }> {
    return this.request<{ status: string }>("/auth/logout/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken || "" }),
    });
  }

  async getMe(): Promise<import("@/types/api").UserProfile> {
    return this.request<import("@/types/api").UserProfile>("/customer/me/");
  }

  async updateMe(
    payload: Pick<import("@/types/api").UserProfile, "first_name" | "last_name" | "phone">
  ): Promise<import("@/types/api").UserProfile> {
    return this.request<import("@/types/api").UserProfile>("/customer/me/", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  async getAddresses(): Promise<import("@/types/api").CustomerAddress[]> {
    return this.request<import("@/types/api").CustomerAddress[]>("/customer/addresses/");
  }

  async createAddress(
    payload: import("@/types/api").CustomerAddressInput
  ): Promise<import("@/types/api").CustomerAddress> {
    return this.request<import("@/types/api").CustomerAddress>("/customer/addresses/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async updateAddress(
    id: string,
    payload: Partial<import("@/types/api").CustomerAddressInput>
  ): Promise<import("@/types/api").CustomerAddress> {
    return this.request<import("@/types/api").CustomerAddress>(
      `/customer/addresses/${encodeURIComponent(id)}/`,
      { method: "PATCH", body: JSON.stringify(payload) }
    );
  }

  async deleteAddress(id: string): Promise<void> {
    return this.request<void>(`/customer/addresses/${encodeURIComponent(id)}/`, {
      method: "DELETE",
    });
  }

  async getCustomerReturns(): Promise<import("@/types/api").CustomerReturn[]> {
    return this.request<import("@/types/api").CustomerReturn[]>("/customer/returns/");
  }

  async createCustomerReturn(payload: {
    order_public_id: string;
    reason: string;
    items: { order_item_id: number; quantity: number }[];
  }): Promise<import("@/types/api").CustomerReturn> {
    return this.request<import("@/types/api").CustomerReturn>("/customer/returns/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // Catalog endpoints
  async getCategories(): Promise<import("@/types/catalog").Category[]> {
    return this.request<import("@/types/catalog").Category[]>("/storefront/categories/");
  }

  async getCategory(slug: string): Promise<import("@/types/catalog").Category> {
    return this.request<import("@/types/catalog").Category>(`/storefront/categories/${encodeURIComponent(slug)}/`);
  }

  async getProducts(params?: import("@/types/catalog").ProductListParams): Promise<import("@/types/catalog").PaginatedProducts> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.ordering) searchParams.set("ordering", params.ordering);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.page_size) searchParams.set("page_size", params.page_size.toString());

    const qs = searchParams.toString();
    const endpoint = qs ? `/storefront/products/?${qs}` : "/storefront/products/";
    return this.request<import("@/types/catalog").PaginatedProducts>(endpoint);
  }

  async getProduct(slug: string): Promise<import("@/types/catalog").ProductDetail> {
    return this.request<import("@/types/catalog").ProductDetail>(`/storefront/products/${encodeURIComponent(slug)}/`);
  }

  // Cart endpoints (ADR-0012)
  async getCart(): Promise<import("@/types/cart").Cart> {
    return this.request<import("@/types/cart").Cart>("/customer/cart/");
  }

  async addToCart(productId: string, quantity: number = 1): Promise<import("@/types/cart").Cart> {
    return this.request<import("@/types/cart").Cart>("/customer/cart/items/", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async updateCartItem(productId: string, quantity: number): Promise<import("@/types/cart").Cart> {
    return this.request<import("@/types/cart").Cart>(`/customer/cart/items/${encodeURIComponent(productId)}/`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(productId: string): Promise<void> {
    return this.request<void>(`/customer/cart/items/${encodeURIComponent(productId)}/`, {
      method: "DELETE",
    });
  }

  async clearCart(): Promise<void> {
    return this.request<void>("/customer/cart/", {
      method: "DELETE",
    });
  }

  // Wishlist endpoints (ADR-0012)
  async getWishlist(): Promise<import("@/types/cart").Wishlist> {
    return this.request<import("@/types/cart").Wishlist>("/customer/wishlist/");
  }

  async addToWishlist(productId: string): Promise<import("@/types/cart").Wishlist> {
    return this.request<import("@/types/cart").Wishlist>("/customer/wishlist/items/", {
      method: "POST",
      body: JSON.stringify({ product_id: productId }),
    });
  }

  async removeFromWishlist(productId: string): Promise<void> {
    return this.request<void>(`/customer/wishlist/items/${encodeURIComponent(productId)}/`, {
      method: "DELETE",
    });
  }

  // Checkout & Orders (ADR-0013)
  async getCheckoutPreview(): Promise<import("@/types/order").CheckoutPreview> {
    return this.request<import("@/types/order").CheckoutPreview>("/customer/checkout/");
  }

  async createOrder(data: import("@/types/order").OrderCreateInput): Promise<import("@/types/order").OrderDetail> {
    return this.request<import("@/types/order").OrderDetail>("/customer/orders/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCustomerOrders(page: number = 1): Promise<import("@/types/api").PaginatedResponse<import("@/types/order").OrderListItem>> {
    return this.request<import("@/types/api").PaginatedResponse<import("@/types/order").OrderListItem>>(`/customer/orders/?page=${page}`);
  }

  async getCustomerOrder(publicId: string): Promise<import("@/types/order").OrderDetail> {
    return this.request<import("@/types/order").OrderDetail>(`/customer/orders/${encodeURIComponent(publicId)}/`);
  }

  // Payment APIs (ADR-0014)
  async initiatePayment(
    orderPublicId: string,
    gateway: string = "sslcommerz",
    returnUrl?: string
  ): Promise<import("@/types/payment").PaymentInitiateResponse> {
    return this.request<import("@/types/payment").PaymentInitiateResponse>(
      `/customer/orders/${encodeURIComponent(orderPublicId)}/payment/`,
      {
        method: "POST",
        body: JSON.stringify({ gateway, return_url: returnUrl }),
      }
    );
  }

  async getPaymentStatus(
    orderPublicId: string
  ): Promise<import("@/types/payment").PaymentStatusResponse> {
    return this.request<import("@/types/payment").PaymentStatusResponse>(
      `/customer/orders/${encodeURIComponent(orderPublicId)}/payment/`
    );
  }

  async cancelCustomerOrder(
    orderPublicId: string,
    reason?: string
  ): Promise<OrderDetail> {
    return this.request<OrderDetail>(
      `/customer/orders/${encodeURIComponent(orderPublicId)}/cancel/`,
      {
        method: "POST",
        body: JSON.stringify({ reason: reason || "Cancelled by customer" }),
      }
    );
  }

  async getOrderTimeline(
    orderPublicId: string
  ): Promise<import("@/types/order").OrderTimelineItem[]> {
    return this.request<import("@/types/order").OrderTimelineItem[]>(
      `/customer/orders/${encodeURIComponent(orderPublicId)}/timeline/`
    );
  }

  // Content & Editorial (Step 10, ADR-0017)
  async getHomeContent(): Promise<import("@/types/content").StorefrontHomeContent> {
    return this.request<import("@/types/content").StorefrontHomeContent>("/content/home/");
  }

  async getBanners(): Promise<import("@/types/content").ContentBlock[]> {
    return this.request<import("@/types/content").ContentBlock[]>("/content/banners/");
  }

  async getContentBySlug(slug: string): Promise<import("@/types/content").ContentBlock> {
    return this.request<import("@/types/content").ContentBlock>(
      `/content/${encodeURIComponent(slug)}/`
    );
  }

  // Customer Communication & Notifications (Step 11, ADR-0018)
  async getCommunicationPreferences(): Promise<import("@/types/notifications").CommunicationPreference> {
    return this.request<import("@/types/notifications").CommunicationPreference>(
      "/customer/communication-preferences/"
    );
  }

  async updateCommunicationPreferences(
    payload: import("@/types/notifications").CommunicationPreferenceInput
  ): Promise<import("@/types/notifications").CommunicationPreference> {
    return this.request<import("@/types/notifications").CommunicationPreference>(
      "/customer/communication-preferences/",
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
  }

  async getCustomerNotifications(
    params?: { page?: number; page_size?: number }
  ): Promise<import("@/types/notifications").PaginatedCustomerNotifications> {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", params.page.toString());
    if (params?.page_size) sp.set("page_size", params.page_size.toString());
    const qs = sp.toString();
    const endpoint = qs ? `/customer/notifications/?${qs}` : "/customer/notifications/";
    return this.request<import("@/types/notifications").PaginatedCustomerNotifications>(endpoint);
  }
}

export const api = new StorefrontApiClient();
