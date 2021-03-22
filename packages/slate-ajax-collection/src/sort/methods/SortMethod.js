//Provides the basis for all sort methods. Do not export this as part of the
//list of sort methods!!
export const SortMethod = {
  isVisible: (template) => true,
  sort: (collection, variants) => variants,
  reverse: false
};

//Returns the index of the PRODUCT (not variant) within the collection
export const getCollectionPosition = (collection, variant) => {
  let handles = collection.data.productHandles || [];
  if(collection.data.pageData && collection.data.pageData[1]) {
    handles = collection.data.pageData[1].all_product_handles || handles;
  }
  let index = handles.indexOf(variant.product.handle);
  if(index === -1) return handles.length;
  return index;
}

//Returns the index of the variant within it's product
export const getVariantPosition = (variant) => {
  for(let i = 0; i < variant.product.variants.length; i++) {
    if(variant.product.variants[i].id !== variant.id) continue;
    return i;
  }
  return -1;
};
