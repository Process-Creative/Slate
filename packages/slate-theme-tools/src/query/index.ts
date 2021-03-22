export const getQueryParams = (url?:string) => {
  url = url || window.location.href;

  let [ origin, searchAndHash ] = url.split('?');
  searchAndHash = searchAndHash || "";

  let [ search ] = searchAndHash.split('#');

  return (search||'').split('&').reduce((o,e) => {
    let [ key, value ] = e.split('=').map(x => decodeURIComponent(x));
    if(!key || !value) return o;
    o[key] = value;
    return o;
  },{});
};

export const setQueryParams = (params:object, url?:string) => {
  params = params || {};

  url = url || window.location.href;
  let qp = { ...getQueryParams(url), ...params };

  //Remove undefined
  Object.keys(qp).forEach(key => {
    if(typeof qp[key] !== typeof undefined) return;
    delete qp[key];
  });

  let [ origin, searchAndHash ] = url.split('?');
  searchAndHash = searchAndHash || "";

  let [ search, hash ]  = searchAndHash.split('#');
  let qs = Object.keys(qp).reduce((x,key,i) => {
    let value = qp[key];
    if(i != 0) x += '&';
    return x += encodeURIComponent(key)+'='+encodeURIComponent(value);
  }, '')+(hash?'#'+hash:'');

  return `${origin||''}${qs?`?${qs}`:''}`;
};
