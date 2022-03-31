import { ON_CART_FETCHED, cartQueue, cartQueueNext, cartQueueError } from ".";
import { Cart } from "..";
import { GLOBAL_SELF, SlateCustomEvent } from "../support";


export class EventCartFetched extends SlateCustomEvent<{ cart:Cart}> {
  constructor(cart:Cart) {
    super(ON_CART_FETCHED, {
      bubbles: true,
      cancelable: false,
      detail: { cart }
    });
  }
}

export const cartGet = () => cartQueue((async () => {
  try {
    const response:Cart = await fetch('/cart.js', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(e => e.json());

    return cartQueueNext({
      fetched: true,
      sections: false,
      response,
      strEvent: null,
      event: null
    });
  } catch(e:any) {
    cartQueueError(e);
    throw e;
  }
}));

export const cartGetCurrent = () => GLOBAL_SELF.Cart.data;