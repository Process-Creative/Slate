import { ON_CART_CLEARED, cartQueue, cartQueueNext, cartQueueError } from ".";
import { Cart } from "..";
import { SlateCustomEvent } from "../support";

class EventCartCleared extends SlateCustomEvent<{ cart:Cart }> {
  constructor(cart:Cart) {
    super(ON_CART_CLEARED, {
      bubbles: true,
      cancelable: false,
      detail: { cart }
    });
  }
}

export const cartClear = () => cartQueue((async () => {
  try {
    const response:Cart = await fetch('/cart/clear.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(e => e.json());

    return cartQueueNext({
      fetched: true,
      response,
      strEvent: ON_CART_CLEARED,
      event: new EventCartCleared(response)
    });
  } catch(e:any) {
    cartQueueError(e);
    throw e;
  }
}));