import { shopifyGet, getQueryParams } from '@process-creative/slate-theme-tools';
import * as Errors from './../error/Errors';

export class Fetch {
  constructor(template) {
    this.template = template;

    this.lastFetch = 0;
    this.isFetchRunning = false;
    this.isFetchPending = false;
  }

  getNextPageToFetch() {
    //Determines the next page that should be fetched
    let currentPage = 1;
    let expectedPages = Math.ceil(this.template.data.productCount / this.template.perPage);

    //Now check each pageData
    for(let i = currentPage; i <= expectedPages; i++) {
      let pd = this.template.data.pageData[i];
      if(!pd || !pd.products || !pd.products.length) return i;
    }

    //We've fetched future pages, fetch past pages
    for(let i = 1; i <= expectedPages; i++) {
      let pd = this.template.data.pageData[i];
      if(!pd || !pd.products || !pd.products.length) return i;
    }

    //We've fetched all pages?
    this.lastFetchedPage = (this.lastFetchedPage||0) + 1;
    if(this.lastFetchedPage > expectedPages+1) {
      this.forceStopFetching = true;
      this.lastFetchedPage = 1;
    }
    return this.lastFetchedPage;
  }


  //Returns true if ALL the data has been fetched and stored in the data
  isDataFetched() {
    if(this.forceStopFetching) return true;

    let { productCount, products } = this.template.data;
    if(!productCount && !products.length) return true;//Check incase there are no products to fetch at all.
    return products.filter(p => {
      return this.template.data.isProductInCollection(p);
    }).length >= productCount;
  }


  async fetch(page) {
    //2019/03/04 - Going to add a simple cooldown here to avoid fetching way too many products
    let now = new Date().getTime();
    let diff = now - this.lastFetch;
    if((now - diff) < 750) {
      //we haven't even passed 750ms since the last fetch.. let's wait a minute
      this.isFetchPending = true;
      console.log('Delaying 750ms...');
      await new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 750);
      });
      console.log('Delay over');
      this.isFetchPending = false;
      now = new Date().getTime();
    }

    this.isFetchRunning = true;
    try {
      let fetch = this.template.getShopifyFetch(page);//Allow the template to do some funky fetching.
      
      //This is for my own sanity, I want to make sure we're preserving the 
      //QS Params for theme previews.
      fetch.params = fetch.params || {};
      let qsp = getQueryParams();
      ['key','preview_theme_id'].forEach(k => fetch.params[k] = fetch.params[k] ? fetch.params[k] : qsp[k]);

      let data = await shopifyGet(fetch.url, fetch.params);//Fetch from Shopify
      this.template.data.loadCollectionJSON(data);//Load into our data store
      this.template.filters.onProductsFetched();
      this.template.pagination.onProductsFetched();
      this.template.onProductsFetched(data);//Fire event

      this.template.draw.queueDraw();//Queue a draw..

      this.lastFetch = now;
      this.isFetchRunning = false;
      return data;
    } catch(e) {
      console.error(Errors.FETCH_FAILED);
      console.error(e);

      this.lastFetch = now;

      setTimeout(() => this.fetchAndNext(), 1000);
      this.template.cache.clearProductCache();
      this.isFetchRunning = false;
    }
  }

  fetchAndNext(page) {
    if(this.isDataFetched()) {
      console.log('Finished fetching all data.');
      return;
    }
    page = page || this.getNextPageToFetch();
    this.fetch(page).then(e => this.fetchAndNext());
  }

  start() {
    //Start by fetching page 1.
    this.fetch(1).then(data => this.fetchAndNext());
  }
}
