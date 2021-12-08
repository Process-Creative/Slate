import { Maybe, WithCollection, WithOptions, WithProduct } from "..";
import { collectionGetUrl } from "./collection";

export const productGetOptionIndex = (params:WithProduct & WithOptions) => {
  return params.product.options.findIndex(o => {
    return params.options.some(po => po.toLowerCase() == o.toLowerCase());
  });
};

export const productGetUrl = (p:WithProduct & Maybe<WithCollection>) => {
  return [
    p.collection ? collectionGetUrl({ collection: p.collection! }) : '',
    productGetUrlFromHandle(p.product)
  ].join('')
}

export const productGetUrlFromHandle = (p:{ handle:string }) => {
  return `/products/${p.handle}`
};