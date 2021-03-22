/*
 *  AjaxCollectionCache
 *    Caching module for the Ajax Collection
 *
 *  Version:
 *    1.0.0 - 2019/01/09
 */

import * as Errors from './../error/Errors';
import * as Consts from './../constant/Constants';

export const clearProductCache = () => {
  try {
    localStorage.removeItem(Consts.CACHE_DATA_KEY);
    localStorage.removeItem(Consts.CACHE_DATE_KEY);
  } catch(e) {
    console.error(Errors.CACHE_CLEAR_FAILED);
    console.error(e);
  }
};

export class Cache {
  constructor(template) {
    this.template = template;
  }

  readProductCache() {
    if(!this.isCacheAlive()) return [];

    //Now, let's attempt a read
    try {
      let dataRaw = localStorage.getItem(Consts.CACHE_DATA_KEY);
      let data = JSON.parse(dataRaw);

      if(!Array.isArray(data)) throw new Error(Errors.CACHE_NOT_ARRAY);

      //Good?
      return data;
    } catch(e) {
      console.error(Errors.CACHE_LOAD_FAILED);
      console.error(e);
    }

    return [];
  }

  writeProductCache() {
    if(!this.isCacheAvailable()) return;
    if(typeof this.canWriteProductCache !== typeof undefined && !this.canWriteProductCache) return;

    //Only update the date if it's not set yet
    if(!localStorage.getItem(Consts.CACHE_DATE_KEY)) {
      localStorage.setItem(Consts.CACHE_DATE_KEY, JSON.stringify( new Date().getTime() ));
    } else if(!this.isCacheAlive()) {
      this.canWriteProductCache = false;//Stop the ability to write to the cache further

      this.clearProductCache();//Sanitize

      //Did the clear succeed?
      this.canWriteProductCache = (
        typeof localStorage.getItem(Consts.CACHE_DATA_KEY) === typeof undefined ||
        localStorage.getItem(Consts.CACHE_DATA_KEY) == null
      );
      return;
    }

    //Now we need to create a storeable set of products...
    //The products in the data section contain circular structures and won't be
    //able to be JSONified
    try {

      //We need to reformat the data and make sure we're not holding onto anything we shouldn't.
      let products = this.template.data.products.map(product => {
        let p = {...product};//Duplicate
        p.variants = p.variants.map(variant => {
          let v = {...variant};//Duplicate
          delete v.product;//Remove circular reference
          return v;
        });
        return p;
      });

      //Write data.
      localStorage.setItem(Consts.CACHE_DATA_KEY, JSON.stringify(products));
    } catch(e) {
      console.error(Errors.CACHE_SAVE_FAILED);
      console.error(e);
    }
  }

  clearProductCache() {
    clearProductCache();
  }

  isCacheAvailable() {
    //Checks the availability of caching functions.
    if(typeof localStorage === typeof undefined) return false;
    if(typeof localStorage.getItem === typeof undefined) return false;
    if(typeof localStorage.setItem === typeof undefined) return false;

    return true;
  }

  isCacheAlive() {
    //Returns TRUE if the cache is still allowed to be use, false if it has
    //expired.
    if(!this.isCacheAvailable()) return false;
    if(!localStorage.getItem(Consts.CACHE_DATA_KEY)) return false;
    if(!localStorage.getItem(Consts.CACHE_DATE_KEY)) return false;

    //First, how old is this data?
    try {
      let dateRaw = localStorage.getItem(Consts.CACHE_DATE_KEY);
      let cacheAge = new Date(JSON.parse(dateRaw));
      let now = new Date();
      let diff = now - cacheAge;

      //Cache cannot be in the future
      if(diff < 0 || isNaN(diff) || !isFinite(diff)) throw new Error(Errors.CACHE_DATE_FUTURE);
      if(diff > 1000*60*10) return false;//Cache expired (1000ms * 60s * 10mins)

      //Cache is good to use
    } catch(e) {
      console.error(Errors.CACHE_DATE_FAILED);
      console.error(e);
      return false;
    }

    return true;
  }

  load() {
    let products = this.readProductCache();
    this.template.data.addProducts(products);
  }
}
