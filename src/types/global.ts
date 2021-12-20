import { Cart, Customer } from ".";
import { CartQueueItem } from "..";

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
    
    ShopifyXR?:{
      setupXRElements:()=>any;
      setModels:(...a:any[])=>any;
      launchXR:(...a:any[])=>any;
      addModels:(...a:any[])=>any;
      getEnabledElements:()=>any;
    },

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