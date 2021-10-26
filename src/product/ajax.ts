import { Product } from "../types/product";

export const productFetch = (handle:string):Promise<Product> => {
  return fetch(`/products/${handle}.js`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(e => e.json());
}