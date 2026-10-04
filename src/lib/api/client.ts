import { ApiErrorPayload, HealthCheckResponse, StorefrontConfig } from "@/types/api";

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
}

export const api = new StorefrontApiClient();
