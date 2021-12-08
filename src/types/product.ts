import { SellingPlanGroup } from "./selling-plan"
import { Variant } from "./variant"

export type Collection = {
  id:number;
  handle:string;
  title:string;
}

export type Product = {
  available:boolean;
  image:string|null;
  compare_at_price:number|null;
  compare_at_price_max:number;
  compare_at_price_min:number;
  compare_at_price_varies:boolean;
  collections:string[];
  content:string;
  created_at:string;
  description:string;
  featured_image:string|null;
  handle:string;
  id:number;
  images:ProductImages[];
  options:string[];
  price:number;
  price_max:number;
  price_min:number;
  price_varies:boolean;
  published_at:string;
  tags:string[];
  title:string;
  type:string;
  variants:Variant[];
  vendor:string;
  first_available_variant:Variant;
  url:string;
  focusPoint:string;
  has_only_default_variant: boolean;
  selling_plan_groups: SellingPlanGroup[];
}

export type OptionWithValue = {
  name: string;
  value: string;
}

export type ProductImages = {
  alt?:string,
  id:number,
  src:string;
}
export interface SectionParams {
  section_id:string;
  product_recommendations_url:string;
  product_id?:string;
  limit?:number;
}

export type WithProduct = { product:Product };
export type WithVariant = { variant:Variant; };
export type WithVariants = { variants:Variant[] };
export type WithVariantId = { variantId:number; };
export type WithOptions = { options:string[] };
export type WithCollection = { collection:Collection };