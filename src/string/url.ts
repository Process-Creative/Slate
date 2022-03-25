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
    if(Array.isArray(y[1])) {
      x += y[1].map(value => {
        return encodeURIComponent(y[0]) + '=' + encodeURIComponent(value);
      }).join('&');
    } else {
      x += encodeURIComponent(y[0]) + '=' + encodeURIComponent(y[1]);
    }
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

  const out:{ [key:string]:string[]|string|boolean } = {};
  const values = s.split('&').map(n => {
    const bits = n.split('=').map(n => decodeURIComponent(n));
    const key = bits[0];
    const value = bits[1] || '';
    return { key, value };
  });

  values.forEach((v,i) => {
    const { key, value } = v;
    const hasMultiple = values.some((v2, i2) => v2.key === key && i2 !== i);
    if(hasMultiple) {
      out[key] = out[key] || [];
      (out[key] as string[]).push(value);
    } else {
      out[key] = value.length ? value : true;
    }
  });

  return out;
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