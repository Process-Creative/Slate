import { ON_CART_FINISHED, ON_CART_PENDING, ON_CART_FETCHED, EventCartFetched, cartGet } from ".";
import { Cart } from "..";
import { jQuery } from "../support";

export type CartQueueItem<T> = {
  callable:() => Promise<T>;
  resolver?:(data:T)=>void;
  rejecter?:(error:any)=>void;
}

// Queue.
window.Cart = window.Cart || { };
window.Cart.queue = window.Cart.queue || {};
window.Cart.queue.items = window.Cart.queue.items || [];

export class EventCartQueueFinished extends Event {
  public readonly cart:Cart;

  constructor(cart:Cart) {
    super(ON_CART_FINISHED);
    this.cart = cart;
  }
}

export class EventCartQueueStarted extends Event {
  constructor() {
    super(ON_CART_PENDING);
  }
}

export const cartQueue = <T>(callable:()=>Promise<T>):Promise<T> => {
  // Create item
  const item:CartQueueItem<T> = {
    callable
  };

  // Queue the item
  window.Cart.queue.items.push(item);

  // Prep the resolver.
  const promToReturn = new Promise<T>((resolve,reject) => {
    item.resolver = resolve;
    item.rejecter = reject;
  });

  // Reset needs fetching state on queue start
  if(!window.Cart.queue.items.length) {
    window.Cart.queue.needsFetching = false;
    window.Cart.queue.items[0].callable();// Begin queue

    // Start queue event
    jQuery ? jQuery(document).trigger(ON_CART_PENDING) : null;
    document.dispatchEvent(new EventCartQueueStarted());
  }

  // Return the resolver
  return promToReturn;
}


type CartQueueNextParams<T,J extends boolean> = (
  J extends true ? { response:Cart; } : { response:T }
) & {
  fetched:J;
  strEvent:string|null;
  event:Event|null;
}

export const cartQueueNext = <T,J extends boolean>(
  params:CartQueueNextParams<T,J>
) => {
  const { strEvent, response, event, fetched } = params;

  // Remove item
  window.Cart.queue.items.splice(0, 1);

  // Fire event
  if(strEvent) jQuery ? jQuery(document).trigger(strEvent, response) : null;
  if(event) document.dispatchEvent(event);

  // Was this a fetch event?
  if(fetched) {
    jQuery ? jQuery(document).trigger(ON_CART_FETCHED, response) : null;
    document.dispatchEvent(new EventCartFetched(response as Cart));
  }

  // Not, end of queue, begin.
  if(window.Cart.queue.items.length) {
    window.Cart.queue.items[0].callable();
    return response;
  }

  // End of queue, now decide if we need to refresh cart or not
  if(!fetched) window.Cart.queue.needsFetching = true;

  // Do we need to fetch cart? if so then just do that.
  if(window.Cart.queue.needsFetching) {
    cartGet();
    return response;
  }
  
  // Nothing more to do, fire event
  jQuery ? jQuery(document).trigger(ON_CART_FINISHED, window.Cart.data) : null;
  document.dispatchEvent(new EventCartQueueFinished(window.Cart.data));

  return response;
}


export const cartQueueError = (e:any) => {
  console.error(e);
  window.Cart.queue.items.forEach(item => {
    if(item.rejecter) item.rejecter(e);
  });
  window.Cart.queue.items = [];
  cartGet();
}