import { queryEncodeString } from "string";
import { Product } from "types/product";

export const recommendedGetRelated = (
  product_id:number, limit:number=4
):Promise<{ products:Product[] }> => fetch(`/recommendations/products.json`, {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ product_id, limit })
}).then(e => e.json());

export const fetchRelatedSection = (
  section_id:string,
  product_recommendations_url:string,
  product_id:string,
  limit?:number
) => fetch(product_recommendations_url+'?'+queryEncodeString({
  product_id, section_id, limit
}), { method: 'GET' }).then(e => e.text());