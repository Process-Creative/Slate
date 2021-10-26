import { cartQueue, cartQueueError, cartQueueNext, ON_ITEM_CHANGED } from 'cart';
import { LineItemProperties, Cart } from 'types';

export type CartChange = {
  quantity?:number;
  properties?:LineItemProperties;
} & (
  { line:number; } | { id:number; }
);
export class EventCartChanged extends Event {
  public readonly cart:Cart;

  constructor(cart:Cart) {
    super(ON_ITEM_CHANGED);
    this.cart = cart;
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