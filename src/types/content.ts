export type ContentType =
  | "hero"
  | "banner"
  | "announcement"
  | "promotional_section"
  | "content_section";

export interface ContentBlock {
  public_id: string;
  title: string;
  slug: string;
  content_type: ContentType;
  body: string;
  image_url: string;
  alt_text: string;
  cta_label: string;
  cta_url: string;
  linked_product_id: string | null;
  linked_category_slug: string | null;
  campaign_id: string | null;
  status: "draft" | "scheduled" | "published" | "archived";
  start_at: string | null;
  end_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface StorefrontHomeContent {
  hero: ContentBlock | null;
  announcement: ContentBlock | null;
  banners: ContentBlock[];
  sections: ContentBlock[];
}

export interface StorefrontConfig {
  site_name: string;
  currency: string;
  version: string;
  announcement_text?: string;
  meta_pixel_id?: string;
  ga4_measurement_id?: string;
  default_seo_title?: string;
  default_seo_description?: string;
}
