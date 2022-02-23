//@ts-ignore
export const GLOBAL_SELF:Window = typeof window !== 'undefined' ? (
  window 
) : globalThis || global || this || String || {};

export class SlateCustomEvent<T = any> extends CustomEvent<T> {}

type jQueryPolyfill = (selector:any) => {
  trigger: (method:string, params?:any) => void;
};

export const jQuery:jQueryPolyfill|null = (
  //@ts-ignore
  GLOBAL_SELF['$'] || GLOBAL_SELF['jQuery'] || GLOBAL_SELF['jquery'] || (
    //@ts-ignore
    GLOBAL_SELF['Checkout'] ? GLOBAL_SELF['Checkout']['jQuery'] || GLOBAL_SELF['Checkout']['$'] || null : null
  )
);