import { ON_ITEM_ADDED, cartQueue, cartQueueNext, cartQueueError } from ".";
import { LineItemProperties, LineItem } from "..";
import { SlateCustomEvent } from "../support";
import { CartSectionsResponse } from "../types";
import { cartBundledSectionGetQueryParams } from "./section";

export type CartAdd = {
  items:{
    id:number;
    quantity:number;
    selling_plan?:number;
    properties?:LineItemProperties;
  }[]
}

class EventCartAdded extends SlateCustomEvent<{ items:LineItem[] }> {
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
    const response:{ items:LineItem[] } = await fetch(cartBundledSectionGetQueryParams('/cart/add.js'), {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(e => e.json());

    return cartQueueNext({
      fetched: false,
      sections: true,
      response,
      strEvent: ON_ITEM_ADDED,
      event: new EventCartAdded(response.items)
    });
  } catch(e:any) {
    cartQueueError(e);
    throw e;
  }
}));