/**
 * Query Encode String
 *    Encodes a key value pair into a URL Query string.
 *    Does not include the preceeding "?"
 * 
 * @param params Params to encode
 * @returns The encoded string.
 */
export const queryEncodeString = (params:{ [key:string]:any }) => {
  return Object.entries(params).reduce((x,y) => {
    if(y[1] === null || y[1] === undefined) return x;
    if(x.length) x += '&';
    x += encodeURIComponent(y[0]) + '=' + encodeURIComponent(y[1]);
    return x;
  }, '');
}

/**
 * Decodes a URL Query string, automatically strips the ? symbol.
 * 
 * @param s Optional string to parse, defaults to the current location search.
 * @returns The decoded query string.
 */
export const queryDecodeString = (s?:string) => {
  if(!s) s = location.search;
  if(s.startsWith('?')) s = s.substr(1);

  return s.split('&').map(n => {
    return n.split('=').map(n => decodeURIComponent(n));
  }).reduce((x,y) => {
    x[y[0]] = y.length > 1 ? y[1] : true;
    return x;
  }, {} as {[key:string]:string|true} )
}

/**
 * Replaces a query string param in the state. Updates the history state.
 * 
 * @param param The param to set.
 * @param value Value to set, or null to remove the param.
 */
export const queryReplaceParam = (param:string, value:string|null) => {
  const params = queryDecodeString();
  if(value === null) {
    delete params[param];
  } else {
    params[param] = value;
  }
  
  try {
    history.pushState(null, '', '?'+queryEncodeString(params));
  } catch(e) {
    console.error(e);
  }
}