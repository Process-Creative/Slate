import { productGetUrl } from "./product"
import { handlize } from "../string";
import { Maybe, WithCollection, WithOptions, WithProduct, WithVariant, WithVariants } from "../types";

export const variantFirstAvailable = ({ variants }:WithVariants) => {
  return variants.find(v => v.available);
}

export const variantFirstAvailableOrDefault = (p:WithVariants) => {
  return variantFirstAvailable(p) || p.variants[0];
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