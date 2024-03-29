import { SellingPlanGroup } from "./selling-plan"
import { Variant } from "./variant"

export type Collection = {
  id:number;
  handle:string;
  title:string;
}

export type Product = {
  // Useless fields that I'm disabling for now
  // available:boolean;
  // compare_at_price:number|null;
  // compare_at_price_max:number;
  // compare_at_price_min:number;
  // compare_at_price_varies:boolean;
  // collections:string[];
  // content:string;
  // price:number;
  // price_max:number;
  // price_min:number;
  // price_varies:boolean;
  // published_at:string;
  // first_available_variant:Variant;
  // url:string;
  // has_only_default_variant: boolean;
  
  image:string|null;
  created_at:string;
  description:string;
  featured_image:string|null;
  handle:string;
  id:number;
  images:ProductImages[];
  options:string[];
  tags:string[];
  title:string;
  type:string;
  variants:Variant[];
  vendor:string;
  selling_plan_groups: SellingPlanGroup[];
}

export type OptionWithValue = {
  name: string;
  value: string;
}

export type BackendProductOptions = {
  id:number;
  name:string;
  position:number;
  product_id:number;
  values:string[];
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