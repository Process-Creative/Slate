//Returns all the variants for the product
export const AllVariants = (product,template) => {
  return product.variants;
};

// Returns all variants for the product that are available
export const AllAvailableVariants = (product,template) => {
  return product.variants.filter(variant => template.isVariantAvailable(variant));
};

//Returns all the variants for the product that are on sale
export const AllSaleVariants = (product,template) => {
  return product.variants.filter(variant => template.isVariantOnSale(variant));
}

//Returns all the variants for the product that are not on sale
export const AllNonSaleVariants = (product,template) => {
  return product.variants.filter(variant => !template.isVariantOnSale(variant));
};

//Returns all the variants for the product that are both available and on sale
export const AllAvailableSaleVariants = (product,template) => {
  return product.variants.filter(v => {
    return template.isVariantOnSale(v) && template.isVariantAvailable(v)
  });
};

//Returns all the variants that are both available and NOT on sale
export const AllAvailableNonSaleVariants = (product,template) => {
  return product.variants.filter(v => {
    return !template.isVariantOnSale(v) && template.isVariantAvailable(v);
  });
};
