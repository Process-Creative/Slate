import { ON_ITEM_ADDED, cartQueue, cartQueueNext, cartQueueError } from ".";
import { LineItemProperties, LineItem } from "..";

export type CartAdd = {
  items:{
    id:number;
    quantity:number;
    selling_plan?:number;
    properties?:LineItemProperties;
  }[]
}

class EventCartAdded extends CustomEvent<{ items:LineItem[] }> {
  constructor(items:LineItem[]) {
    super(ON_ITEM_ADDED, {
      bubbles: true,
      cancelable: false,
      detail: { items }
    });
  }
}

export const cartAdd = (params:CartAdd) => cartQueue((async () => {
  try {
    const response:{ items:LineItem[] } = await fetch('/cart/add.js', {
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