import { ON_CART_UPDATED, cartQueue, cartQueueNext, cartQueueError } from ".";
import { Cart, CartAttributes } from "../types/cart";

export type CartUpdateItem = { [key:number]:number }
export type CartUpdateItemArray = number[];

export type CartUpdate = {
  updates:CartUpdateItem|CartUpdateItemArray;
  note?:string;
  attributes?:CartAttributes;
}

class EventCartUpdated extends CustomEvent<{ cart:Cart }> {
  constructor(cart:Cart) {
    super(ON_CART_UPDATED, {
      bubbles: true,
      cancelable: false,
      detail: { cart }
    });
  }
}

export const cartUpdate = (update:CartUpdate) => cartQueue((async () => {
  try {
    const response:Cart = await fetch('/cart/changeupdate.js', {
      method: 'POST',
      body: JSON.stringify(update),
      headers: { 'Content-Type': 'application/json' }
    }).then(e => e.json());
    
    return cartQueueNext({
      fetched: true,
      response,
      strEvent: ON_CART_UPDATED,
      event: new EventCartUpdated(response)
    });
  } catch(e:any) {
    cartQueueError(e);
    throw e;
  }
}));