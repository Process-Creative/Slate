/*
 *  AjaxCollection Template
 *    Contains the basic functionality for the AjaxCollection Template.
 *
 *  Version:
 *    3.0.0 - 2019/01/09
 */

import * as Consts from './constant/Constants';
import * as Errors from './error/Errors';
import { generatePicture, escapeString } from '@process-creative/slate-theme-tools';

import { Cache } from './cache/Cache';
import { Data } from './data/Data';
import { Fetch } from './fetch/Fetch';
import { Sort } from './sort/Sort';
import { Draw } from './draw/Draw';
import { Pagination } from './pagination/Pagination';
import { CollectionFilters } from './filter/CollectionFilters';
import { Settings } from './settings/Settings';
import { Content } from './content/Content';

export class AjaxCollectionTemplate {
  constructor(container) {
    /*** SETUP CONTAINER ***/
    //Validate Container
    if(!container || !container.length) throw new Error(Errors.CONTAINER_INVALID);
    if(container.attr('data-initialized')) throw new Error(Errors.CONTAINER_INITIALZED);
    this.container = container;
    this.container.attr('data-intialized', 'true');

    //Attributes
    this.handle = container.attr(Consts.COLLECTION_HANDLE_ATTR);
    this.perPage = parseInt(container.attr(Consts.COLLECTION_HANDLE_PER_PAGE));

    //Validate Attributes
    if(!this.handle) throw new Error(Errors.MISSING_COLLECTION_HANDLE);
    if(!this.perPage || isNaN(this.perPage) || !isFinite(this.perPage)) throw new Error(Errors.MISSING_COLLECTION_PAGE_COUNT);


    this.productsContainer = container.find(Consts.PRODUCTS_CONTAINER_SELECTOR);
    if(!this.productsContainer.length) throw new Error(Errors.MISSING_PRODUCT_CONTAINER);

    //Variables
    this.started = false;

    /*** SETUP MODULES ***/
    this.data = new Data(this);                 // Module for storing and managing data, doesn't manipulate or get in any way
    this.fetch = new Fetch(this);               // Module for talking to Shopify to get data and manage what to do when it has fetched
    this.cache = new Cache(this);               // Module for reading and writing data to the cache to improve speed and load times
    this.settings = new Settings(this);         // Module for managing settings, reading from URL, writing to url etc, filters, sorting and pagination will manipulate the settings as they see fit
    this.sort = new Sort(this);                 // Module for sorting products and variants
    this.content = new Content(this);           // Module for content blocks
    this.filters = new CollectionFilters(this); // Module for filtering products from facets and settings
    this.pagination = new Pagination(this);     // Module for paginating products to be printed
    this.draw = new Draw(this);                 // Module for rendering data, uses all other modules to work

    /*
      A Note on overriding:
      While you are able to and welcome to override any method or module,
      it is generally good practice to leave as many of these methods alone
      or as close to their original function as expected.

      A note on module overriding is that while it's fine to customize modules
      to suit a specific need, keep all logic within the respective init()
      for that module.
    */
  }

  init() {
    //Begin by loading the data out of the cache, it's the oldest and is the least important to us.
    this.cache.load();

    //Now load the fresh data off the HTML
    this.data.load();

    //Load the settings
    this.settings.load();

    //Now set the fetch going.
    this.fetch.start();

    //Setup the filters
    this.filters.load();

    //Do the initial draw
    this.draw.draw();

    //Prepare the sorters
    this.sort.load();

    //Prepare content blocks
    this.content.load();

    //Prepare the paginators.
    this.pagination.load();

    //Mark that the AjaxCollection has started, good for knowing that things are working.
    this.started = true;

    this.onInitialized();
  }

  escape(str) { return escapeString(str); }

  generatePrint(v, index) {
    //This is a generic template, you should definitely override this template with your own HTML
    let p = v.product;

    return `
      <a href="${this.getVariantUrl(v)}" ${this.generateThumbnailAttributes(v)}>
        ${this.generateThumbnailMeta(v)}
        ${index} - ${ this.escape(p.title) } / ${ this.escape(v.title) }
      </a>
    `;
  }

  generateThumbnailAttributes(v) {
    //Generates the necessary attributes for product thumbnails
    let p = v.product;
    return (
      `data-product-thumbnail data-product-handle="${p.handle}" `+
      `data-product-id="${p.id}" data-variant-id="${v.id}" ` +
      `itemprop="itemListElement" itemscope itemtype="http://schema.org/Product"`
    );
  }

  generateThumbnailMeta(v) {
    //Generates the necessary meta info for the product thumbnails.
    let p = v.product;
    let x = (
      `<meta itemprop="name" content="${escape(this.getVariantTitle(v))}" />` +
      `<meta itemprop="url" content="${window.location.origin+v.url}" />`
    );
    if(p.vendor.length) x += `<meta itemprop="brand" content="${escape(p.vendor)}" />`;
    return x;
  }

  generateThumbnailPicture(v, clazz) {
    //Generates the HTML for a thumbnail picture
    let { featured_image, product } = v;
    let image = null;

    if(featured_image && featured_image.src) {
      image = featured_image.src;
    } else if(product && product.image && product.image) {
      image = product.image;
    }

    return generatePicture(
      image,
      500, [150,250,500], clazz,
      this.escape(v.featured_image ? v.featured_image.alt : this.getVariantTitle(v)),
      `itemprop="image"`
    )
  }

  //Utility Functions, you may override if the specific needs suit you.
  isVariantAvailable(variant) {
    if(!variant) return false;
    return variant.available && !variant.product.isHidden;
  }

  isVariantOnSale(variant) {
    if(variant.compare_at_price == null) return false;
    return variant.compare_at_price > 0 && variant.price < variant.compare_at_price;
  }

  getShopifyFetch(page) {
    return {
      url: this.getUrl(),
      params: { page, view: 'json' }
    };
  }

  getUrl() {
    return `/collections/${this.handle}`;
  }

  getVariantUrl(variant) {
    let product = variant.product;
    let url = `${this.getUrl()}/products/${product.handle}`;
    if(product.variants.length >= 2) url += `?variant=${variant.id}`;
    return url;
  }

  getVariantTitle(v) {
    let p = v.product;
    return p.title + (p.variants.length != 1 ? ` - ${v.title}` : '');
  }

  getOptionIndex(product, options) {
    if(!Array.isArray(options)) options = [ options ];
    for(let i = 0; i < product.options.length; i++) {
      let o = product.options[i].toLowerCase();
      if( options.some(match => o === match.toLowerCase()) ) return i;
    }
    return -1;
  }

  getContentBlockPosition(cb, drawnThumbs) {
    let oi = parseInt(cb.attr('data-original-index') || '');
    if(isNaN(oi) || !isFinite(oi)) return -1;
    if(drawnThumbs.length < oi) return -1;
    return oi;
  }

  getContentBlockSize(params) {
    //Returns the size (in product thumbnails) of the content block
    return 1;
  }

  //Some events, your collection may chose to use these
  onProductsFetched(products) {}//Gets called every time more products are fetched, but BEFORE they are printed.
  onVariantsDrawn(variants) {}//Gets called every time AFTER variants have been drawn.
  onPageChange(newPage) {}//Gets called every time the page is changed AFTER the queued draw
  onPerPageChange(perPage) {}//Gets called every time the per page count changes AFTER queued draw
  onInitialized() {}//Called after the ajax collection has finished intializing
}
