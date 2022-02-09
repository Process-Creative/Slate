import { Maybe, Variant, WithCollection, WithOptions, WithProduct } from "..";
import { collectionGetUrl } from "./collection";

export const OPTIONS_COLOR = [ 'Color', 'Colour' ];
export const OPTIONS_SIZE = [ 'Size' ];

/**
 * Returns the option index of a given array of option (matched by options that
 * fist match the set). Can be used to, say for example, find which option index
 * is "Color" or "Colours".
 * 
 * @param params Product and array of options to search for.
 * @returns The index that the option matched is at, or -1 for no match.
 */
export const productGetOptionIndex = (params:WithProduct & WithOptions) => {
  return params.product.options.findIndex(o => {
    return params.options.some(po => po.toLowerCase() == o.toLowerCase());
  });
};

/**
 * Returns the URL to view a product, can optionally take in a collection to 
 * also return the URL within that collection.
 * 
 * @param p Params containing product and possible collection.
 * @returns The URL to view that product and, possibly, within that collection.
 */
export const productGetUrl = (p:WithProduct & Maybe<WithCollection>) => {
  return [
    p.collection ? collectionGetUrl({ collection: p.collection! }) : '',
    productGetUrlFromHandle(p.product)
  ].join('')
}

/**
 * Returns the URL to access a product by its handle alone.
 * 
 * @param p Product or params containing handle.
 * @returns The URL to view that product.
 */
export const productGetUrlFromHandle = (p:{ handle:string }) => {
  return `/products/${p.handle}`
};

/**
 * Extrapolate the set of options and their possible values from a product.
 * This will check the options that exist within the variant(s) on the product
 * and return a key value pair where the key is the option name, and the value
 * is an array of option values that exist on the product.
 * 
 * @param p Product to get the option values for.
 * @returns Options and their values.
 */
export const productGetOptionsWithValues = (p:{
  variants:Variant[], options:string[]
}) => {
  const optionsWithValues:{[key:string]:string[]} = {};

  p.variants.forEach(variant => {
    p.options.forEach((option, optionIndex) => {
      const value = variant.options[optionIndex];
      const set = (optionsWithValues[option] = optionsWithValues[option] || []);
      if(set.indexOf(value) === -1) return;
      set.push(value);
    });
  });

  return optionsWithValues;
}