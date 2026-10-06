export type PaymentStatus =
  | "pending"
  | "initiated"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export interface PaymentAttemptDetail {
  public_id: string;
  attempt_number: number;
  gateway: string;
  status: string;
  amount: string;
  currency: string;
  provider_reference?: string;
  provider_transaction_id?: string;
  error_message?: string;
  created_at: string;
}

export interface PaymentStatusResponse {
  payment_public_id: string | null;
  order_public_id: string;
  order_number: string;
  status: PaymentStatus;
  amount: string;
  currency: string;
  gateway: string;
  method: string;
  provider_transaction_id: string;
  paid_at: string | null;
  attempts: PaymentAttemptDetail[];
  created_at?: string;
  updated_at?: string;
}

export interface PaymentInitiateResponse {
  payment_public_id: string;
  order_public_id: string;
  order_number: string;
  gateway: string;
  amount: string;
  currency: string;
  status: string;
  redirect_url: string;
  provider_reference: string;
}
