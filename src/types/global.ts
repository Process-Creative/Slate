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