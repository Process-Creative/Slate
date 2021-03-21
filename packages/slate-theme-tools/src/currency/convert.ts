import * as Cookies from 'js-cookie';
export const CURRENCY_COOKIE_NAME = 'currency';

export const getShopCurrency = () => {
  let c = window['Currency'];
  if(!c || !c.currency) throw new Error('You have not defined your shops currency onto window.Currency.currency!');
  return c.currency;
}

export const getUserCurrency = () => {
  if(Cookies.get(CURRENCY_COOKIE_NAME)) return Cookies.get(CURRENCY_COOKIE_NAME);
  return getShopCurrency();
};

export const setUserCurrency = (currency:string) => {
  let current = getUserCurrency();
  if(current === currency) return;

  Cookies.set(CURRENCY_COOKIE_NAME, currency);
  $(document).trigger('onCurrencyChange', currency);
};

export const convert = (money:number, from?:string, to?:string):number => {
  let c = window['Currency'];
  
  from = from || getShopCurrency();
  to = to || getShopCurrency();
  if(from === to) return money;

  if(!c || !c.convert) throw new Error('You havent imported the Shopify currencies script in your header scripts!');
  return c.convert(money, from, to);
}
