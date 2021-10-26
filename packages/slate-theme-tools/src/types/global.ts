import { CartQueueItem } from "cart";
import { Cart } from "types";

declare global {
  interface Window {
    Shopify?:{
      country?:string;
      currency?:{ active:string, rate:number };
      locale?:string;
      shop?:string;
      formatMoney?:(cents:number|string, format:string)=>string;
      theme?:{ name:string, id:number };
    },
    
    Language?:{
      strings?:{[key:string]:string}
    },

    Asset?:string;
    
    Cart:{
      data:Cart;
      queue:{
        needsFetching:boolean;
        items: CartQueueItem<any>[];
      }
    }
  }
}