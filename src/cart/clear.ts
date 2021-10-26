import { ON_CART_CLEARED, cartQueue, cartQueueNext, cartQueueError } from ".";
import { Cart } from "..";

class EventCartCleared extends Event {
  public readonly cart:Cart;

  constructor(cart:Cart) {
    super(ON_CART_CLEARED);
    this.cart = cart;
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