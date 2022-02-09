import { productGetUrl } from "./product"
import { handlize } from "../string";
import { Maybe, Variant, WithCollection, WithOptions, WithProduct, WithVariant, WithVariants } from "../types";

export const variantFirstAvailable = ({ variants }:WithVariants) => {
  return variants.find(v => v.available);
}

export const variantFirstAvailableOrDefault = (p:WithVariants) => {
  return variantFirstAvailable(p) || p.variants[0];
}

/** Params used to select a variant */
export type VariantSelectedParams = { selected?:number|Variant };

/**
 * Returns the currently selected variant. If no or an invalid variant is 
 * selected then the first available or default variant will be returned.
 * 
 * @param p Array of variants, as well as the selected variant.
 * @returns The selected variant, first available variant, or default variant.
 */
export const variantSelectedOrFirstAvailable = (p:(
  WithVariants & VariantSelectedParams
)):Variant => {
  let variant:Variant|null|undefined = null;
  if(p.selected) {
    if((p.selected as Variant).id) {
      variant = p.variants.find(v => v.id === (p.selected as Variant).id);
    } else {
      variant = p.variants.find(v => v.id === p.selected as number);
    }
  }
  if(variant) return variant;
  return variantFirstAvailableOrDefault(p);
}

export const variantGetFromOptions = (params:WithOptions & WithProduct) => (
  params.product.variants.find(variant => (
    variantDoesHaveOption({ ...params, variant })
  ))
);

export const variantDoesHaveOption = (params:WithVariant & WithOptions) => {
  return params.options.every((val,pos) => {
    return handlize(params.variant.options[pos]) === handlize(val);
  })
};

export const variantGetUrl = (params:(
  WithVariant & WithProduct & Maybe<WithCollection>
)) => `${productGetUrl(params)}?variant=${params.variant.id}`;