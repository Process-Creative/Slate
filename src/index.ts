import { GLOBAL_SELF } from './support';

export * from './cart/';
export * from './checkout';
export * from './currency/';
export * from './customer/';
export * from './image/';
export * from './product/';
export * from './shipping/';
export * from './string/';
export * from './url';
export * from './types';

//@ts-ignore
GLOBAL_SELF['pcSlateTools'] = module.exports;