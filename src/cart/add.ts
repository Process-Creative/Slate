import { cartQueue, cartQueueNext, cartQueueError, ON_ITEM_ADDED } from "cart";
import { LineItem, LineItemProperties } from "types/cart";

export type CartAdd = {
  items:{
    id:number;
    quantity:number;
    selling_plan?:number;
    properties?:LineItemProperties;
  }[]
}

class EventCartAdded extends Event {
  public readonly items:LineItem[];
  
  constructor(items:LineItem[]) {
    super(ON_ITEM_ADDED);
    this.items = items;
  }
}

export const cartAdd = (params:CartAdd) => cartQueue((async () => {
  try {
    const response:{ items:LineItem[] } = await fetch('/cart.js', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(e => e.json());

    return cartQueueNext({
      fetched: false,
      response,
      strEvent: ON_ITEM_ADDED,
      event: new EventCartAdded(response.items)
    });
  } catch(e:any) {
    cartQueueError(e);
    throw e;
  }
}));