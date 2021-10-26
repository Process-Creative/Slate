type jQueryPolyfill = (selector:any) => {
  trigger: (method:string, params?:any) => void;
};


export const jQuery:jQueryPolyfill|null = (
  //@ts-ignore
  window['$'] || window['jQuery'] || window['jquery'] || window['Checkout']['jQuery'] || window['Checkout']['$'] || null
);