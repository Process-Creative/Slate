import { MONEY_FORMATS } from './formats';

export * from './convert';
export * from './formats';
export * from './format';

export type Currency = keyof typeof MONEY_FORMATS;
export type CurrencyFormat = keyof (typeof MONEY_FORMATS)[Currency];

declare global {
  interface Window {
    Currency?:{
      currency?:string;
      format?:string;
      convertedFormat?:CurrencyFormat;
      convert?:(money:number, from?:string, to?:string)=>number;
      shopFormat?:string|null;
    }
  }
}