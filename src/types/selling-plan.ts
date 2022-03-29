export type SellingPlanOption = {
  name: string;
  position: number;
  value: string;
}

export type SellingPlan = {
  description: string;
  group_id: number;
  id: number;
  name: string;
  options: SellingPlanOption[];
  price_adjustments: SellingPlanPriceAdjustment[];
  recurring_deliveries: boolean;
  selected: boolean;
}

export type SellingPlanPriceAdjustment = {
  order_count: number|null;
  position: number;
  value: number;
  value_type: string;
}

export type SellingPlanAllocationPriceAdjustment = {
  position: number;
  price: number;
}

export type SellingPlanAllocation = {
  compare_at_price: number;
  per_delivery_price: number;
  price: number;
  price_adjustments: SellingPlanAllocationPriceAdjustment[];
  selling_plan: SellingPlan;
  selling_plan_group_id: number;
  unit_price: number|null;
}

export type SellingPlanGroup = {
  id: string;
  name: string;
  options: SellingPlanOption[];
  selling_plan_selected: boolean;
  selling_plans: SellingPlan[];
  app_id?: string;
}