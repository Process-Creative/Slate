import { getCurrentCart } from './get';

export const getCountOfVariantInCart = (variantId) => getCurrentCart().items.reduce((x,item) => {
  if(item.variant_id != variantId) return x;
  return x += item.quantity;
}, 0);
