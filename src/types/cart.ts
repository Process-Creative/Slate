import { OptionWithValue } from "./product";
import { SellingPlanAllocation } from "./selling-plan";

export type CartAttributes = {
  [key:string]:string
};

export type FeaturedImage = {
  url: string;
  alt: string;
  height: number;
  width: number;
  aspect_ratio: number;
}

export type CartSectionsResponse = {
  sections?:{ [key:string]:string }
};

export type Cart = {
  attributes:CartAttributes;
  cart_level_discount_applications: [];
  currency: string;
  item_count: number;
  items: LineItem[];
  items_subtotal_price: number;
  note: string|null;
  original_total_price: number;
  requires_shipping: boolean;
  total_discount: number;
  total_price: number;
  total_weight: number;
}

export type LineItem = {
  discounted_price: number;
  discounts: [];
  featured_image: FeaturedImage;
  final_line_price: number;
  final_price: number;
  gift_card: boolean;
  grams: number;
  handle: string;
  id: number;
  image: string;
  key: number;
  line_level_discount_allocations: [];
  line_level_total_discount: number;
  line_price: number;
  options_with_values: OptionWithValue[];
  original_line_price: number;
  original_price: number;
  price: number;
  product_description: string;
  product_has_only_default_variant: boolean;
  product_id: number;
  product_title: string;
  product_type: string;
  properties: LineItemProperties;
  quantity: number;
  requires_shipping: boolean;
  selling_plan_allocation: SellingPlanAllocation|null;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: number;
  url: string;
  variant_id: number;
  variant_options: string[];
  variant_title: string;
  vendor: string;
}

export interface LineItemProperties {
  [key:string]:string
};
