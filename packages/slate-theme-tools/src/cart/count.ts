import { cartGetCurrent } from 'cart';

export const cartGetVariant = (variantId:number) => {
  return cartGetCurrent().items.filter(item => item.variant_id === variantId);
}

export const cartGetCountOfVariant = (variantId:number) => {
  return cartGetVariant(variantId).length;
}