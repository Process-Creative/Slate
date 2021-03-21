import { getShopCurrency, getUserCurrency, convert } from './convert';
import { MONEY_FORMATS } from './formats';

export const formatMoney = (cents:number|string, format:string) => {
  if(window['Shopify'] && window['Shopify'].formatMoney) return window['Shopify'].formatMoney(cents, format);

  if (typeof cents == 'string') cents = cents.replace('.','');

  let value = '';
  let placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  let formatString = format || '${{amount}}';

  let formatWithDelimiters = (number:string, precision=2, thousands:string=',', decimal:string='.'):string => {
    let n = parseFloat(number);
    if(isNaN(n) || number == null) return `0`;

    number = (n/100.0).toFixed(precision);
    let parts = number.split('.'),
    dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
    cents   = parts[1] ? (decimal + parts[1]) : '';
    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents as string, 2);
      break;

    case 'amount_no_decimals':
      value = formatWithDelimiters(cents as string, 0);
      break;

    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents as string, 2, '.', ',');
      break;

    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents as string, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
}

export const getFormat = (currency?:string, format?:string) => {
  currency = currency || getUserCurrency();

  //Default format
  if(!format) {
    //Get the currency settings
    let cs = window && window['Currency'] ? window['Currency'] : null;

    if(currency != getShopCurrency()) {
      format = cs && cs.convertedFormat ? cs.convertedFormat : 'money_with_currency_format';
    } else if(cs && cs.shopFormat && currency == getShopCurrency()) {
      return cs.shopFormat;
    } else if(cs && cs.format) {
      return cs.format;
    } else {
      format = 'money_format';
    }
  }

  let c = MONEY_FORMATS[currency];
  if(c[format]) return c[format];
  return c['money_with_currency_format'];
}

export const printMoney = (money:number, format?:string, currency?:string) => {
  currency = currency || getUserCurrency();
  let f = getFormat(currency, format);
  let v = convert(money, null, currency);
  return formatMoney(v, f);
};
