import { shopifyGet } from "../ajax"
import { getCurrentCart, LineItemProperties } from "../cart";

/**
 * Returns the shipping rates for the current cart object.
 * 
 * @param zip Destination zip code
 * @param country Destination country
 * @param province Destination province code (exact match only)
 */
export const getCurrentShippingCosts = (zip:string, country:string, province:string) => {
  return shopifyGet('/cart/shipping_rates.json', { shipping_address: { zip, country, province } });
}

export type LineItem = {
  variantId:number;
  quantity:number;
  properties?:LineItemProperties;
}

export const estimateShippingCostsForLines = async (lines:LineItem[], zip:string, country:string, province:string) => {
  //Get current line items
  let oldCart = getCurrentCart();

  //Clear cart
  if(oldCart.items.length) {
    await shopifyGet('/cart/clear.js');
  }

  //Add to cart, estimate
  let adds = await Promise.all(lines.map(line => {
    return shopifyGet('/cart/add.js', {
      id: line.variantId, quantity: line.quantity,
      properties: { ...(line.properties||{}), _shipping_calc: 'Y' }
    });

    // return addToCart(line.variantId, line.quantity, {
    //   ...(line.properties||{}), _shipping_calc: 'Y'
    // });
  }));

  let rates = await getCurrentShippingCosts(zip, country, province);

  //Clear cart
  await shopifyGet('/cart/clear.js');
  
  //Add existing lines
  await Promise.all(oldCart.items.map(line => {
    return shopifyGet('/cart/add.js', {
      id: line.variant_id, quantity: line.quantity,
      properties: {
        ...(line.properties||{})
      }
    });
    // return addToCart(line.variant_id, line.quantity, line.properties);
  }));
  
  return rates;
}

export const estimateShippingCosts = (variantId:number, quantity:number, zip:string, country:string, province:string) => {
  return estimateShippingCostsForLines([{ variantId, quantity }], zip, country, province);
}