import { SellingPlanAllocation } from "./selling-plan"

export type LocationData = {
  location: number;
  available: number;
}

export type Variant = {
  available:boolean;
  barcode:string;
  compare_at_price:number|null;
  featured_image:string|null;
  featured_media:{ id:string };
  id:number;
  inventory_management:'shopify'|null;
  inventory_policy:'continue'|'deny'|null;
  name:string;

  /** @deprecated */
  option1:string;
  /** @deprecated */
  option2:string|null;
  /** @deprecated */
  option3:string|null;

  options:string[];
  price:number;

  /** @deprecated */
  public_title:string;

  requires_shipping:boolean;
  sku:string|null;
  taxable:boolean;
  title:string;
  weight:number;
  inventory_quantity:number|null;
  selling_plan_allocations:SellingPlanAllocation[];

  location_data: LocationData[]|null;
}