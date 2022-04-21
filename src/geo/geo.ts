import * as Cookies from 'js-cookie';

const GEO_COOKIE_CACHE = 'GeoDataCache';

export type GeoData = {
  country_code: string;
};

export type GeoListener = (data:GeoData)=>void;

declare global {
  interface Window {
    Geo?:{
      requester?:()=>Promise<GeoData>;
      listeners?:GeoListener[];
      cache?:GeoData;
      isFetching?:boolean;
    }
  }
}

export const geoSetRequestFunction = (requester:()=>Promise<GeoData>) => {
  window.Geo = window.Geo || {};
  window.Geo.requester = requester;
}

export const geoFetchData = () => {
  return new Promise<GeoData>((resolve, reject) => {
    window.Geo = window.Geo || {};

    if(!window.Geo.requester) {
      reject('Missing a requester function, make sure you geoSetRequestFunction.');
      return;
    }

    // Already cached?
    if(window.Geo.cache) {
      resolve(window.Geo.cache);
      return;
    }

    // Check cookies
    try {
      let cache = Cookies.get(GEO_COOKIE_CACHE) as any;
      if(typeof cache === "string") cache = JSON.parse(cache);
      if(!cache || !cache.region_code) throw "Invalid cache";
      window.Geo.cache = cache;
      resolve(cache);
      return;
    } catch(e) {
      console.error('Failed to parse GeoData, not a huge issue', e);
    }

    // Are we already fetching?
    if(window.Geo.isFetching) {
      window.Geo.listeners = window.Geo.listeners || [];
      window.Geo.listeners!.push(reject);
      return;
    }

    window.Geo.isFetching = true;
    window.Geo.requester().then((data:GeoData) => {
      if(!data || !data.region_code) throw 'Invalid Geo Data';

      window.Geo = window.Geo || {};
      window.Geo.isFetching = false;
      try {
        Cookies.set(GEO_COOKIE_CACHE, JSON.stringify(data), { expires: 1 });
      } catch(e) {
        console.error('Failed to cache geo data, not a major issue', e);
      }
      window.Geo.listeners?.forEach(gl => gl(data));
      resolve(data);
    }).catch(e => {
      console.error('Geo fetch failed', e);
      reject(e);
    });
  });
}