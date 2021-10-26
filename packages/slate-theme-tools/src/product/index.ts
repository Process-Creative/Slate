export * from './ajax';
export * from './recommendations';



interface GetOptionIndexParams {
  product:{ options_with_values:{name:string}[] },
  options:string[];
}
export const getOptionIndex = (params:GetOptionIndexParams) => (
  params.product.options_with_values.findIndex(o => (
    params.options.some(po => po.toLowerCase() == o.name.toLowerCase())
  ))
);