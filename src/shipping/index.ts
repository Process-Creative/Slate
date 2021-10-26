import { CartAdd, cartAdd, cartClear, cartGetCurrent } from "index";
import { ShippingRate } from "types/shipping";

/**
 * Returns the shipping rates for the current cart object.
 * 
 * @param zip Destination zip code
 * @param country Destination country
 * @param province Destination province code (exact match only)
 * @returns A promise that resolves to the estimated rates.
 */
export const getCurrentShippingCosts = (
  zip:string, country:string, province:string
):Promise<{ shipping_rates:ShippingRate[] }> => {
  return fetch('/cart/shipping_rates.json', {
    method: 'GET',
    body: JSON.stringify({ shipping_address: { zip, country, province } })
  }).then(e => e.json());
}

/**
 * Estimate the shipping cost for a specific set of line items. This process is
 * a bit janky as it requires the cart to emptied prior to estimating.
 * 
 * @param add Cart Line items to estimate for.
 * @param zip Destination zip code
 * @param country Destination country
 * @param province Destination province code (exact match only)
 * @returns A promise that resolves to the estimated rates.
 */
export const estimateShippingCostsForLines = async (
  add:CartAdd, zip:string, country:string, province:string
) => {
  //Get current line items
  const oldCart = cartGetCurrent();

  //Clear cart
  if(oldCart.items.length) {
    await cartClear();
  }

  //Add to cart, estimate
  await cartAdd({
    ...add,
    items: add.items.map(line => {
      return {
        ...line,
        properties: {
          ...(line.properties||{}),
          _shipping_calc: 'Y'
        }
      }
    })
  });

  const rates = await getCurrentShippingCosts(zip, country, province);
  await cartClear();
  await cartAdd(oldCart);
  return rates;
}

/**
 * Retreive the shipping estimated for a single item. This process is
 * a bit janky as it requires the cart to emptied prior to estimating.
 * 
 * @param id Variant ID of item to estimate the costs for.
 * @param quantity Count of items to use in estimating
 * @param add Cart Line items to estimate for.
 * @param zip Destination zip code
 * @param country Destination country
 * @param province Destination province code (exact match only)
 * @returns A promise that resolves to the estimated rates.
 */
export const estimateShippingCosts = (
  id:number, quantity:number, zip:string, country:string, province:string
) => {
  return estimateShippingCostsForLines({
    items: [{ id, quantity }]
  }, zip, country, province);
}