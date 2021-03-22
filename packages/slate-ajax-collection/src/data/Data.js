import * as Consts from './../constant/Constants';
import * as Errors from './../error/Errors';

import { jsonFromjQuery } from '@process-creative/slate-theme-tools'

export class Data {
  constructor(template) {
    this.template = template;

    //Setup Data Stores
    this.variants = [];
    this.products = [];
    this.facets = [];
    this.productHandles = [];
    this.allTags = [];
    this.allTypes = [];
    this.allVendors = [];
    this.productCount = 0;

    this.variantsById = {};
    this.productsById = {};
    this.pageData = {};

    //jQuery elements
    let { container } = template;

    this.jsonContainer = container.find(Consts.JSON_CONTAINER_SELECTOR);
    this.handlesContainer = container.find(Consts.HANDLES_CONTAINER_SELECTOR);

    //Confirm elements
    if(!this.jsonContainer.length) throw new Error(Errors.MISSING_JSON_CONTAINER);
  }

  /*** Data Manipulation ***/
  addProducts(products, inCollection) {
    //Adds the productArray of products to the data. No fancy updating of cache
    //or firing of events, raw adding to arrays and lists only.
    return products.map(p => this.addProduct(p, inCollection))
  }

  addProduct(p, inCollection) {
    if(typeof inCollection === typeof undefined) inCollection = false;
    let { id } = p;

    //Don't double up. Check if this product is already in the array, if in the array use supplied version, probably newer.
    let existing = this.productsById[id];
    if(existing && existing.id === id) {
      this.removeProduct(existing);
    }

    //Add child variants
    p.variants = p.variants.map(v => this.addVariant(v,p));

    //In collection?
    if(inCollection) {
      p.tags.forEach(t => {
        if(this.allTags.indexOf(t) !== -1) return;
        this.allTags.push(t);
      });

      this.productHandles.push(p.handle);
    }

    //Add to array, and map.
    this.products.push(p);
    this.productsById[id] = p;
    return p;
  }

  addVariant(v, p) {
    let { id } = v;

    //Same with products, don't double up on variants, remove the old version to
    //make way for this variant.
    let existing = this.variantsById[id];
    if(existing && existing.id === id) this.removeVariant(this.variantsById[id]);

    v.product = p;
    this.variants.push(v);
    this.variantsById[id] = v;

    return v;
  }

  removeProduct(p) {
    let oldIndex = this.products.indexOf(p);
    if(oldIndex !== -1) this.products.splice(oldIndex, 1);
    delete this.productsById[p.id];

    p.variants.forEach(v => this.removeVariant(v));
  }

  removeVariant(v) {
    var oldIndex = this.variants.indexOf(v);
    if(oldIndex !== -1) this.variants.splice(oldIndex, 1);
    delete this.variantsById[v.id];
  }

  loadCollectionJSON(data) {
    //Start by validating the JSON
    if(!data.products)  throw new Error(Errors.MISSING_PRODUCT_DATA);
    if(!data.page) throw new Error(Errors.MISSING_PAGE_DATA);
    if(!data.all_tags) throw new Error(Errors.MISSING_ALL_TAGS_DATA);

    //Get the default sort_by out of the data, pass it to the sort module
    if(data.default_sort_by) this.template.sort.setDefaultSort(data.default_sort_by);

    //Update collection values
    if(data.all_tags) this.allTags.push(...data.all_tags);
    this.allTags = this.allTags.filter((t,i) => this.allTags.indexOf(t) === i);

    this.allTypes = data.all_types || this.allTypes || [];
    this.allVendors = data.all_vendors || this.allVendors || [];
    this.productCount = data.all_products_count || undefined;

    //Add products (internally) and mark as part of this collection.
    this.addProducts(data.products, true);

    //To help fix an issue with pagination I was having, if the collection data
    //contains all the product handles for this collection, merge them.
    if(data.all_product_handles) this.productHandles.push(...data.all_product_handles);
    this.productHandles = this.productHandles.filter((e,i) => this.productHandles.indexOf(e) === i);

    //Map data to page
    this.pageData[`${data.page}`] = data;

    //Write data to cache
    this.template.cache.writeProductCache();
  }

  isProductInCollection(product) {
    if(this.template.isProductInCollection) {
      return this.template.isProductInCollection(product);
    }

    for(let x = 0; x < this.productHandles.length; x++) {
      if(product.handle != this.productHandles[x]) continue;
      return true;
    }
    return false;
  }

  load() {
    this.loadCollectionJSON(jsonFromjQuery(this.jsonContainer));
  }
}
