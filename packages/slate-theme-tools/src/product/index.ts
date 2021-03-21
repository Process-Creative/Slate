import { ajaxRequest } from "../ajax"

export const fetchRelated = (product_id:number, limit:number=4) => (
  ajaxRequest(`/recommendations/products.json`, 'GET', { product_id, limit })
);


export interface SectionParams {
  section_id:string;
  product_recommendations_url:string;
  product_id?:string;
  limit?:number;
}

export const fetchRelatedSection = (params:SectionParams) => {
  return ajaxRequest<SectionParams,string>(params.product_recommendations_url, 'GET', params);
}


interface GetOptionIndexParams {
  product:{ options_with_values:{name:string}[] },
  options:string[];
}
export const getOptionIndex = (params:GetOptionIndexParams) => (
  params.product.options_with_values.findIndex(o => (
    params.options.some(po => po.toLowerCase() == o.name.toLowerCase())
  ))
);