type jQueryPolyfill = (selector:any) => {
  trigger: (method:string, params?:any) => void;
  length:number;
  find:jQueryPolyfill;
  text:(str?:string)=>string;
  on:(...props:any[])=>any;
  attr:(s?:string)=>string;
  toggleClass:(str:string)=>void;
  click:()=>void;
};


export const jQuery:jQueryPolyfill|null = (
  //@ts-ignore
  window['$'] || window['jQuery'] || window['jquery'] || (
    //@ts-ignore
    window['Checkout'] ? window['Checkout']['jQuery'] || window['Checkout']['$'] || null : null
  )
);