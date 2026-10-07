export interface CommunicationPreference {
  marketing_email: boolean;
  marketing_sms: boolean;
  order_updates_email: boolean;
  updated_at?: string;
}

export interface CommunicationPreferenceInput {
  marketing_email?: boolean;
  marketing_sms?: boolean;
}

export type NotificationDeliveryStatus = "pending" | "sent" | "failed";

export interface CustomerNotification {
  public_id: string;
  event_type: string;
  channel: "email" | "sms";
  status: NotificationDeliveryStatus;
  subject: string;
  order_number?: string | null;
  created_at: string;
  sent_at?: string | null;
}

export interface PaginatedCustomerNotifications {
  count: number;
  next: string | null;
  previous: string | null;
  results: CustomerNotification[];
}
