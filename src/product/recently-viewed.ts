import * as Cookies from 'js-cookie';
import { Product } from '../types/product';
import { productFetch } from './ajax';

type RecentlyViewedProduct = { handle:string; };

/** Maximum number of products to store in the recently viewed. */
const RV_MAX_COUNT = 12;

/** Cookie to store the recently viewed products in. */
const RV_COOKIE = 'recently-viewed';

/**
 * Gets the users' recently viewed product information.
 * 
 * @returns The array of recently viewed product handles.
 */
export const recentlyViewedGet = ():RecentlyViewedProduct[] => {
  // Attempt parse cookie
  try {
    const stored = (Cookies.get(RV_COOKIE) || '').toString();
    let bits = stored.split(',').map(t => t.trim()).filter(t => t.length);

    bits = bits.filter((b,i) => bits.indexOf(b) === i);

    return bits.map(handle => {
      return { handle };
    });
  } catch(e) {
    console.error(e);
  }
  return [];
}

/**
 * Clear a users' recently viewed products
 */
export const recentlyViewedClear = () => {
  try {
    Cookies.set(RV_COOKIE, '');
    Cookies.remove(RV_COOKIE);
  } catch(e) {
    console.error(e);
  }
}

/**
 * Set the list of recently viewed products.
 * 
 * @param products Array of recently viewed products.
 */
export const recentlyViewedSet = (products:RecentlyViewedProduct[]) => {
  let sub = products.filter(bits => {
    return bits && bits.handle && bits.handle.length
  });
  sub = sub.filter((n,i) => sub.indexOf(n) === i);
  sub = sub.slice(0, RV_MAX_COUNT);
  if(!sub.length) return recentlyViewedClear();
  
  try {
    Cookies.set(RV_COOKIE, sub.map(n => n.handle).join(','));
  } catch(e) {
    console.error(e);
  }
}

/**
 * Add a product handle to the users list of recently viewed products.
 * 
 * @param handle Product handle to add.
 */
export const recentlyViewedAdd = (handle:string) => {
  const curr = recentlyViewedGet();
  curr.reverse();
  curr.push({ handle });
  curr.reverse();
  return recentlyViewedSet(curr);
}

/**
 * Fetch the product data for each of the recently viewed products. Results are
 * automatically sorted from most recently to least recent.
 * 
 * @param fetcher Custom fetcher you can use for fetching these products.
 * @returns NULL if there are no recently viewed products, otherwise a promise
 *          that resolves to the product information that was fetched.
 */
export const recentlyViewedFetch = async (
  fetcher?:(handles:string[])=>Promise<Product[]>
):Promise<Product[]|null> => {
  const handles = recentlyViewedGet();
  if(!handles.length) return null;

  if(!fetcher) fetcher = recentlyViewedFetcher;

  const strHandles = handles.map(h => h.handle);
  const products = await fetcher(strHandles);
  if(!products.length) return null;

  products.sort((l,r) => {
    return strHandles.indexOf(l.handle) - strHandles.indexOf(r.handle);
  });

  return products;
}

/**
 * Recently viewed default fetcher.
 * 
 * @param handles handles to fetch.
 * @returns A promise that resolves to the retreived products.
 */
const recentlyViewedFetcher = async (handles:string[]):Promise<Product[]> => {
  const products:Product[] = [];

  await Promise.all(handles.map(async handle => {
    try {
      const prod = await productFetch(handle);
      if(!prod) return null;
      products.push(prod);
    } catch(e) {
      console.error(e);
    }
  }));

  return products;
}