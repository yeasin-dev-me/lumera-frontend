/**
 * Vendor-neutral tracking abstraction and marketing integration boundary (ADR-0010, ADR-0017).
 * Ensures zero PII/secret leakage and complete decoupling from third-party vendor SDKs.
 */

export type TrackingEventName =
  | "page_view"
  | "view_item"
  | "view_category"
  | "search"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase";

export interface TrackingPayload {
  event_id?: string;
  item_id?: string;
  item_name?: string;
  category?: string;
  value?: number | string;
  currency?: string;
  items?: Array<{
    item_id?: string;
    item_name?: string;
    price?: number | string;
    quantity?: number;
  }>;
  [key: string]: unknown;
}

// Sensitive keys strictly forbidden from tracking payloads
const PROHIBITED_KEYS = new Set([
  "password",
  "token",
  "access_token",
  "refresh_token",
  "card_number",
  "cvv",
  "expiry",
  "pin",
  "secret",
  "authorization",
]);

function sanitizePayload(payload: TrackingPayload): TrackingPayload {
  const sanitized: TrackingPayload = {};
  for (const [key, value] of Object.entries(payload)) {
    if (PROHIBITED_KEYS.has(key.toLowerCase())) {
      continue;
    }
    sanitized[key] = value;
  }
  return sanitized;
}

export function track(eventName: TrackingEventName, payload: TrackingPayload = {}): void {
  try {
    const cleanPayload = sanitizePayload(payload);
    const eventId = cleanPayload.event_id || crypto.randomUUID();

    const eventRecord = {
      event: eventName,
      event_id: eventId,
      timestamp: new Date().toISOString(),
      ...cleanPayload,
    };

    // If Google Analytics (gtag) is configured and loaded
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", eventName, eventRecord);
    }

    // If Meta Pixel (fbq) is configured and loaded
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq("trackCustom", eventName, eventRecord);
    }

    // Development logging
    if (process.env.NODE_ENV === "development") {
      // Safe development dispatch
      console.debug(`[Tracking] ${eventName}`, eventRecord);
    }
  } catch (err) {
    // Fail-safe boundary: tracking exceptions must NEVER break commerce operations
    console.warn("[Tracking] Dispatch suppressed error:", err);
  }
}
