import { Currency, CurrencyFormat } from '.';
import { GLOBAL_SELF } from '../support';
import { getShopCurrency, getUserCurrency, convert, currencyConvert, currencyGetUser, currencyGetShop } from './convert';
import { MONEY_FORMATS } from './formats';

export const formatMoney = (cents:number|string, format:string):string => {
  if(GLOBAL_SELF['Shopify'] && GLOBAL_SELF['Shopify'].formatMoney) {
    return GLOBAL_SELF['Shopify'].formatMoney(cents, format);
  }

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

  const match = formatString.match(placeholderRegex);
  if(!match) return value;

  switch(match[1]) {
    case 'amount':
      value = formatWithDelimiters(cents.toString(), 2);
      break;

    case 'amount_no_decimals':
      value = formatWithDelimiters(cents.toString(), 0);
      break;

    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents.toString(), 2, '.', ',');
      break;

    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents.toString(), 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
}

export const getFormat = (currency?:Currency, format?:CurrencyFormat) => {
  let strCurrency = currency || currencyGetUser();

  //Default format
  if(!format) {
    //Get the currency settings
    let cs = GLOBAL_SELF['Currency'] ? GLOBAL_SELF['Currency'] : null;

    if(strCurrency != getShopCurrency()) {
      format = cs && cs.convertedFormat ? cs.convertedFormat : 'money_with_currency_format';
    } else if(cs && cs.shopFormat && strCurrency == currencyGetShop()) {
      return cs.shopFormat;
    } else if(cs && cs.format) {
      return cs.format;
    } else {
      format = 'money_format';
    }
  }

  let c = MONEY_FORMATS[strCurrency];
  if(c[format]) return c[format];
  return c['money_with_currency_format'];
}

export const printMoney = (money:number, format?:CurrencyFormat, currency?:Currency) => {
  return currencyPrintMoney({ money, format, currency });
};

export const currencyPrintMoney = (p:{
  money:number,
  format?:CurrencyFormat,
  currency?:Currency
}) => {
  let { currency, format, money } = p;
  currency = currency || currencyGetUser();
  let f = getFormat(currency, format);
  let v = currencyConvert({ money, to: currency });
  return formatMoney(v, f);
}