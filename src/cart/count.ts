import { cartGetCurrent } from "./get";

export const cartGetVariant = (variantId:number) => {
  return cartGetCurrent().items.filter(item => item.variant_id === variantId);
}

export const cartGetCountOfVariant = (variantId:number) => {
  return cartGetVariant(variantId).length;
}

export const cartGetQuantityOfVariant = (variantId:number) => {
  return cartGetVariant(variantId).reduce((x,item) => {
    return x += item.quantity;
  }, 0);
} 