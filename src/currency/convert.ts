import * as Cookies from 'js-cookie';
import { Currency } from '.';
import { GLOBAL_SELF, jQuery, SlateCustomEvent } from '../support';

export const CURRENCY_COOKIE_NAME = 'currency';

const ON_CURRENCY_CHANGED = 'onCurrencyChange';

/**
 * Returns the currency of the current store, must be defined by your theme.
 * @returns The currency of the store.
 */
export const currencyGetShop = ():Currency => {
  let c = GLOBAL_SELF['Currency'];
  if(!c || !c.currency) {
    throw new Error('You have not defined your shops currency onto window.Currency.currency!');
  }
  return c.currency! as Currency;
}

/**
 * @returns Returns the users' current currency, if set, otherwise the shop's
 * default currency.
 */
export const currencyGetUser = ():Currency => {
  if(Cookies.get(CURRENCY_COOKIE_NAME)) {
    return Cookies.get(CURRENCY_COOKIE_NAME)! as Currency;
  }
  return currencyGetShop();
};

/**
 * Set the users' selected currency.
 * @param currency The currency to set.
 */
export const currencySetUser = (currency:Currency) => {
  let current = currencyGetUser();
  if(current === currency) return;
  Cookies.set(CURRENCY_COOKIE_NAME, currency);
  jQuery ? jQuery(document).trigger(ON_CURRENCY_CHANGED, currency) : null;
  const evt = new SlateCustomEvent(ON_CURRENCY_CHANGED);
  document.dispatchEvent(evt);
}

/**
 * Convert a raw number from one currency to another. This requires the
 * Shopify currency services script;
 * {{ '/services/javascripts/currencies.js' | script_tag }}
 * 
 * @param p Money, and to and from currencies.
 * @returns The converted format (number).
 */
export const currencyConvert = (p:{
  money:number,
  from?:string|null,
  to?:string|null
}):number => {
  let { money, from, to } = p;
  let c = GLOBAL_SELF['Currency'];
  
  from = from || currencyGetShop();
  to = to || currencyGetUser();
  if(from === to) return money;
  if(!c || !c.convert) throw new Error('You havent imported the Shopify currencies script in your header scripts!');
  return c.convert(money, from, to);
}

/** @deprecated */
export const getShopCurrency = () => currencyGetShop();

/** @deprecated */
export const getUserCurrency = () => currencyGetUser();

/** @deprecated */
export const setUserCurrency = (c:Currency) => currencySetUser(c);

/** @deprecated */
export const convert = (money:number, from?:string|null, to?:string):number => {
  return currencyConvert({ money, from, to });
}
