import { productGetUrl } from "./product"
import { handlize } from "../string";
import { BackendVariant, Maybe, Variant, WithCollection, WithOptions, WithProduct, WithVariant, WithVariants } from "../types";

const BACKEND_VARIANT_OPTION_KEYS = <const>[ 'option1', 'option2', 'option3' ];

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

/**
 * Convert a backend variant format to a frontend variant format.
 * 
 * @param variant Backend variant to convert.
 * @returns A frontend variant formatted object.
 */
export const variantBackendToFrontend = (variant:BackendVariant):Variant => {
  const available = (
    variant.inventory_management === 'shopify' && variant.inventory_policy === 'deny' ?
    variant.inventory_quantity > 0 : true
  );
  const options = BACKEND_VARIANT_OPTION_KEYS.map(k => variant[k]!).filter(k=>k);

  const compare_at_price = (
    variant.compare_at_price === null ? null : Math.round(parseFloat(variant.compare_at_price) * 100)
  );

  const price = Math.round(parseFloat(variant.price) * 100);

  return {
    ...variant, available, options, compare_at_price, price,
    featured_image: null,
    featured_media: null,
    location_data: null,
    selling_plan_allocations: [],
    name: variant.title
  }
}