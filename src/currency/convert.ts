import * as Cookies from 'js-cookie';
import { Currency } from '.';
import { jQuery } from '../support';

export const CURRENCY_COOKIE_NAME = 'currency';

export const getShopCurrency = ():Currency => {
  let c = window['Currency'];
  if(!c || !c.currency) {
    throw new Error('You have not defined your shops currency onto window.Currency.currency!');
  }
  return c.currency! as Currency;
}

export const getUserCurrency = ():Currency => {
  if(Cookies.get(CURRENCY_COOKIE_NAME)) {
    return Cookies.get(CURRENCY_COOKIE_NAME)! as Currency;
  }
  return getShopCurrency();
};

export const setUserCurrency = (currency:string) => {
  let current = getUserCurrency();
  if(current === currency) return;

  Cookies.set(CURRENCY_COOKIE_NAME, currency);
  jQuery ? jQuery(document).trigger('onCurrencyChange', currency) : null;
};

export const convert = (money:number, from?:string|null, to?:string):number => {
  let c = window['Currency'];
  
  from = from || getShopCurrency();
  to = to || getShopCurrency();
  if(from === to) return money;

  if(!c || !c.convert) throw new Error('You havent imported the Shopify currencies script in your header scripts!');
  return c.convert(money, from, to);
}
