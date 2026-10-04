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
