import { Cart, Customer } from ".";
import { CartQueueItem } from "..";
import { ARListener, ShopifyXR } from "../image/ar";

declare global {
  interface Window {
    Shopify?:{
      country?:string;
      currency?:{ active:string, rate:number };
      locale?:string;
      shop?:string;
      formatMoney?:(cents:number|string, format:string)=>string;
      theme?:{ name:string, id:number };
      loadFeatures?:(i:any[])=>any;
    },
    
    arLoaded?:boolean;
    arLoadRequested?:boolean;
    arListeners?:ARListener[];
    ShopifyXR?:ShopifyXR,

    Language?:{
      strings?:{[key:string]:string}
    },

    Asset?:string;

    Customer:Customer|null;
    
    Cart:{
      data:Cart;
      queue:{
        needsFetching:boolean;
        items: CartQueueItem<any>[];
      }
    }
  }
}