import { Currency } from "currency";

export type ShippingRate = {
  accepts_instructions: boolean;
  api_client_id?: number;
  carrier_identifier: string;
  carrier_service_id: number;
  charge_items: null;
  code: string;
  compare_price: null;
  currency: Currency;
  delivery_category: null;
  delivery_date: null;
  delivery_days: [];
  delivery_range: [];
  description: null;
  has_restrictions: null;
  markup: string;
  name: string;
  phone_required: false;
  presentment_name: string;
  price: string;
  rating_classification: null;
  requested_fulfillment_service_id: null;
  shipment_options: null;
  source: string;
  using_merchant_account: null;
}