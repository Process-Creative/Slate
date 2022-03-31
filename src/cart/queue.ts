import { ON_CART_FINISHED, ON_CART_PENDING, ON_CART_FETCHED, EventCartFetched, cartGet } from ".";
import { Cart, CartSectionsResponse } from "..";
import { GLOBAL_SELF, jQuery, SlateCustomEvent } from "../support";
import { ON_CART_SECTION_FETCHED } from "./events";

export type CartQueueItem<T> = {
  callable:() => Promise<T>;
  resolver?:(data:T)=>void;
  rejecter?:(error:any)=>void;
}


export type CartError = {
  status:number;
  description:string;
  message:string;
}

// Queue.
GLOBAL_SELF.Cart = GLOBAL_SELF.Cart || { };
GLOBAL_SELF.Cart.queue = GLOBAL_SELF.Cart.queue || {};
GLOBAL_SELF.Cart.queue.items = GLOBAL_SELF.Cart.queue.items || [];

export class EventCartQueueFinished extends SlateCustomEvent<{ cart:Cart }> {
  constructor(cart:Cart) {
    super(ON_CART_FINISHED, {
      bubbles: true,
      cancelable: false,
      detail: { cart }
    });
  }
}

export class EventCartQueueStarted extends SlateCustomEvent<{}> {
  constructor() {
    super(ON_CART_PENDING, {
      bubbles: true,
      cancelable: false,
      detail: {}
    });
  }
}

export class EventCartSectionsFetched extends SlateCustomEvent<{ sections: { [key:string]:string } }> {
  constructor(sections:{ [key:string]:string }) {
    super(ON_CART_SECTION_FETCHED, {
      bubbles: true,
      cancelable: false,
      detail: { sections }
    });
  }
}

export const cartQueue = <T>(callable:()=>Promise<T>):Promise<T> => {
  // Create item
  const item:CartQueueItem<T> = {
    callable
  };

  // Queue the item
  GLOBAL_SELF.Cart.queue.items.push(item);

  // Prep the resolver.
  const promToReturn = new Promise<T>((resolve,reject) => {
    item.resolver = resolve;
    item.rejecter = reject;
  });

  // Reset needs fetching state on queue start
  if(GLOBAL_SELF.Cart.queue.items.length === 1) {
    GLOBAL_SELF.Cart.queue.needsFetching = false;
    const itm = GLOBAL_SELF.Cart.queue.items[0];
    itm.callable().then(itm.resolver!).catch(itm.rejecter!);// Begin queue

    // Start queue event
    jQuery ? jQuery(document).trigger(ON_CART_PENDING) : null;
    document.dispatchEvent(new EventCartQueueStarted());
  }

  // Return the resolver
  return promToReturn;
}


type CartQueueNextParams<J extends boolean, S extends boolean,T> = {
  fetched:J;
  sections:S;
  response:(
    (J extends true ? Cart : T) &
    (S extends true ? CartSectionsResponse : {})
  );
  strEvent:string|null;
  event:SlateCustomEvent<any>|null;
}

export const cartQueueNext = <J extends boolean, S extends boolean, T>(
  params:CartQueueNextParams<J,S,T>
) => {
  const { strEvent, response, event } = params;

  // Handle error responses correctly.
  const asCartError = response as any as CartError;
  if(asCartError && asCartError.status) {
    throw (asCartError.description || asCartError.message || asCartError);
  }

  // Remove item
  GLOBAL_SELF.Cart.queue.items.splice(0, 1);

  // Fire event
  if(strEvent) jQuery ? jQuery(document).trigger(strEvent, response) : null;
  if(event) document.dispatchEvent(event);

  // Does this include a section fetch?
  if(typeof (response as CartSectionsResponse).sections !== 'undefined') {
    const resAs = response as CartSectionsResponse;
    jQuery ? jQuery(document).trigger(ON_CART_SECTION_FETCHED, { sections: resAs.sections! }) : null;
    document.dispatchEvent(new EventCartSectionsFetched(resAs.sections!));
  }

  // Was this a fetch event?
  if(params.fetched) {
    jQuery ? jQuery(document).trigger(ON_CART_FETCHED, response) : null;
    document.dispatchEvent(new EventCartFetched(params.response as any));
    GLOBAL_SELF.Cart.data = params.response as any;
  } else {
    GLOBAL_SELF.Cart.queue.needsFetching = true;
  }

  // Not, end of queue, begin.
  if(GLOBAL_SELF.Cart.queue.items.length) {
    const item = GLOBAL_SELF.Cart.queue.items[0];
    item.callable().then(item.resolver!).catch(item.rejecter!);
    return response;
  }

  // Do we need to fetch cart? if so then just do that.
  if(GLOBAL_SELF.Cart.queue.needsFetching) {
    cartGet().catch(console.error);
    return response;
  }
  
  // Nothing more to do, fire event
  jQuery ? jQuery(document).trigger(ON_CART_FINISHED, GLOBAL_SELF.Cart.data) : null;
  document.dispatchEvent(new EventCartQueueFinished(GLOBAL_SELF.Cart.data));

  return response;
}


export const cartQueueError = (e:any) => {
  console.error(e);
  GLOBAL_SELF.Cart.queue.items.forEach(item => {
    if(item.rejecter) item.rejecter(e);
  });
  GLOBAL_SELF.Cart.queue.items = [];
  cartGet();
}