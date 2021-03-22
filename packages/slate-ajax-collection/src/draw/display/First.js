//Returns the first variant in the product, regardless of anything
export const FirstVariant = (product, template) => {
  return [ product.variants[0] ];
};

//Returns the first available variant (if any), otherwise the first variant.
export const FirstAvailableVariant = (product, template) => {
  let v = product.variants.find(v => template.isVariantAvailable(v)) || product.variants[0];
  return [ v ];
};

//Returns the first available variant if any variant is in stock.
export const FirstAvailableVariantOnly = (product, template) => {
  let v = product.variants.find(v => template.isVariantAvailable(v));
  return v ? [ v ] : [];
};

//Returns the first variant on sale
export const FirstSaleVariant = (product, template) => {
  return [ product.variants.find(v => template.isVariantOnSale(v)) ];
};

//First available sale variant, otherwise first sale variant.
export const FirstAvailableSaleVariant = (product,t) => {
  let v = product.variants.find(v => {
    return t.isVariantOnSale(v) && t.isVariantAvailable(v)
  });
  return v ? [ v ] : FirstSaleVariant(product,t);
};
