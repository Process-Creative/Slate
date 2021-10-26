type jQueryPolyfill = (selector:any) => {
  trigger: (method:string, params?:any) => void;
};


export const jQuery:jQueryPolyfill|null = (
  //@ts-ignore
  window['$'] || window['jQuery'] || window['jquery'] || (
    //@ts-ignore
    window['Checkout'] ? window['Checkout']['jQuery'] || window['Checkout']['$'] || null : null
  )
);