import { ON_ITEM_CHANGED, cartQueue, cartQueueNext, cartQueueError } from ".";
import { LineItemProperties, Cart } from "..";

export type CartChange = {
  quantity?:number;
  properties?:LineItemProperties;
} & (
  { line:number; } | { id:number; }
);
export class EventCartChanged extends CustomEvent<{ cart:Cart }> {
  constructor(cart:Cart) {
    super(ON_ITEM_CHANGED, {
      bubbles: true,
      cancelable: false,
      detail: { cart }
    });
  }
}

export const cartChange = (change:CartChange) => cartQueue((async () => {
  try {
    const response:Cart = await fetch('/cart/change.js', {
      method: 'POST',
      body: JSON.stringify(change),
      headers: { 'Content-Type': 'application/json' }
    }).then(e => e.json());
    
    return cartQueueNext({
      fetched: true,
      response,
      strEvent: ON_ITEM_CHANGED,
      event: new EventCartChanged(response)
    });
  } catch(e:any) {
    cartQueueError(e);
    throw e;
  }
}));