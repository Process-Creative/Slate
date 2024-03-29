import { GLOBAL_SELF } from '../support';

export * from './url';

const TEXT_NODE = document.createTextNode("test");
const TEXT_CONTAINER = document.createElement("span");
const HTML_CONTAINER = document.createElement('span');
TEXT_CONTAINER.appendChild(TEXT_NODE);



/**
 *  Escape String
 *    Takes a given string and converts it to an escaped HTML string.
 *    Replaces items like "<" with "&lt;" and "&" with "&amp;"
 * 
 * @param {string} s HTML string
 * @returns {string} Escaped string
 */
export const escapeString = (s:string) => {
  TEXT_NODE.nodeValue = s;
  const html = TEXT_CONTAINER.innerHTML;
  return html.replace(/"/g, '&quot;');
};

/**
 * Unescapes a HTML Encoded string and returns the original text
 * Replaces items like "&lt;" with "<" and "&amp;" with "&"
 * 
 * @param s Encoded string.
 * @returns Unescaped string.
 */
export const unescapeString = (s:string) => {
  HTML_CONTAINER.innerHTML = s;
  return HTML_CONTAINER.textContent || '';
}

/**
 *  Handlize
 *    Takes in a string and converts it to a Shopify formatted handle
 *
 * @param {string} s String to handlize
 * @returns {string} Handle
 */
export const handlize = (s:string) => {
  let str = s.toLowerCase();
  ['"', "'", "\\", "(", ")", "[", "]"].forEach(e => str = str.replace(e, ''));

  str = str.replace(/\W+/g, "-");

  while(str.startsWith('-')) str = str.substr(1);
  while(str.endsWith('-')) str = str.slice(0, -1); 

  return str;
};

/**
 *  Liquid to Date
 *    Convert a Liquid string date to a Javascript Date Object
 * 
 * @param {string} strDate Liquid date string
 * @returns {Date} Javascript Date Object
 */
export const liquidToDate = (strDate:string) => {
  let [ date, time, timezone ] = strDate.split(' ')
  let [ year, month, day ] = date.split('-').map(e => parseInt(e));
  let [ hour, min, sec ] = time.split(':').map(e => parseInt(e));

  return new Date(year, month-1, day, hour, min, sec);
};

/**
 *  Liquid
 *    Takes in a string containing liquid-like variables e.g. {{ test }} and
 *    replaces them with the variables provided
 * 
 * @param {string} str The liquid string
 * @param {object} vars The variables to replace
 * @returns {string} The formatted string
 */
export const liquid = (str:string, vars:{[key:string]:string}={}) => {
  let keys = Object.keys(vars);
  let keysLower = keys.map(k => k.toLowerCase());

  return str.replace(/({)?{{[^{}]*}}(?!})/g, function($0, $1){
    let x = $0.replace(/[\{|\s|\}]/g, '');
    if(!x) return $0;
    
    //Lowercaseify
    x = x.toLowerCase();
    
    let keyIndex = keysLower.findIndex(k => k == x);
    if(keyIndex === -1) return $0;
    return vars[keys[keyIndex]];
  });
}

/**
 * Retreive a specific language key from the defined window language strings.
 * 
 * @param key Key to get
 * @param variables Variables to use during decoding.
 * @returns The unparsed language string.
 */
export const getLanguageKey = (
  key:string, variables:{ [key:string]:string }={ }
) => {
  let str:string|null|undefined = null;

  //Try find
  if(GLOBAL_SELF.Language && GLOBAL_SELF.Language.strings) {
    str = GLOBAL_SELF.Language.strings[key];
  }
  if(!str || !str.length) return `translation missing: ${key}`;
  return liquid(str, variables);
}

/**
 * Retreive a specific language key from the defined window language strings.
 * 
 * @param key Key to get
 * @param variables Variables to use during decoding.
 * @returns The unparsed language string.
 */
export const t = getLanguageKey;