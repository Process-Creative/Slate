import * as Consts from './../constant/Constants';
import * as DisplayModes from './display/';
import * as Errors from './../error/Errors';

import * as $ from 'jquery';

export class Draw {
  constructor(template) {
    this.template = template;

    //Initialze our defaults.
    this.displayMode = DisplayModes.FirstAvailableVariant;
    this.drawnProducts = [];
    this.unpaginatedProducts = [];
    this.unpaginatedProductCount = 0;
  }

  getUnpaginatedVariantCount() {
    //Update count
    this.getUnpaginatedVariantsToDraw();
    return this.unpaginatedProductCount;
  }

  setDisplayMode(displayMode) {
    if(typeof displayMode === 'string' && !DisplayModes[displayMode]) throw new Error(Errors.DISPLAY_MODE_INVALID);
    this.displayMode = displayMode;
    this.queueDraw();
  }

  isVariantPrinted(variant) {
    //Was the supplied argument a variant, or a variant id?
    if(typeof variant.id !== typeof undefined) variant = variant.id;

    let thumbnail = this.template.productsContainer.find(`${Consts.PRODUCT_THUMBNAILS_SELECTOR}[data-variant-id="${variant}"]`);
    if(!thumbnail || !thumbnail.length) return false;
    return thumbnail;
  }

  getUnpaginatedVariantsToDraw() {
    //Return an array of variants to draw. You may opt to draw each kind
    //of variant, or may opt to draw only one kind (e.g. a product thumb)
    let draw = [];

    //Get all products...
    this.template.data.products.forEach(p => {
      //Is this product in this collection?
      if (!this.template.data.isProductInCollection(p)) return;

      //Is this a hidden product?
      if (p.isHidden === true) return;

      let variants = this.getVariantsToDrawForProduct(p);
      variants.forEach(v => {
        //Duplicate the product (so the data can safely be modified)
        v = { ...v };

        //Check our filters
        if (!this.template.filters.filters.every(filter => filter.filter(p, v))) return;

        //Assign product (since it's cyclic this isn't stored, only modified)
        v.product = p;
        draw.push(v);
      });
    });

    //Now apply sorting
    draw = this.template.sort.sortVariants(draw);

    //Now store the unpaginated values..
    this.unpaginatedProducts = draw;
    this.unpaginatedProductCount = draw.length;
    
    return draw;
  }

  getVariantsToDraw() {
    let draw = this.getUnpaginatedVariantsToDraw();
    //Now Paginate.
    this.drawnProducts = draw = this.template.pagination.paginateVariants(draw);
    return draw;
  }

  getVariantsToDrawForProduct(product, modeOverride) {
    //Returns an array of variants to draw for a given product.
    //Use either all variants, only one variant (related to most relevant?)
    //or specific subset of variants (say.. colour?)

    //I've provided a few common examples here, you can chose to add your own
    let mode = modeOverride || this.displayMode || 'FirstAvailableVariant';

    //Check the modes, otherwise use the default and show an error.
    let modeFunction;
    if(typeof mode === 'function') {
      modeFunction = mode;
    } else {
      modeFunction = DisplayModes[mode] || ((product, template) => {
        console.error(Errors.DISPLAY_MODE_INVALID);
        return DisplayModes.FirstAvailableVariant(product, template);
      });
    }

    return modeFunction(product, this.template).filter(f => f);
  }

  queueDraw() {
    //Due to high document writes, reads, iteration etc, particularly on small devices
    //We have this nice render timeout to make sure that rendering happens when
    //needed (Every 500ms or so)
    if(this.template.onDrawQueued) this.template.onDrawQueued();

    if(typeof this.renderTimeout !== typeof undefined) return;
    this.renderTimeout = setTimeout(() => this.draw(), 500);
  }

  draw() {
    //Clear render timeout function
    if(typeof this.renderTimeout !== typeof undefined) clearTimeout(this.renderTimeout);
    delete this.renderTimeout;

    //Get the array of array of variants to draw.
    let draw = this.getVariantsToDraw();
    let { container, productsContainer } = this.template;

    //Clear thumbs that no longer need to be printed...
    let thumbs = productsContainer.find(Consts.PRODUCT_THUMBNAILS_SELECTOR);
    let thumbArray = thumbs.toArray();

    for(let i = 0; i < thumbArray.length; i++) {
      var willBePrinted = false;//If true, stay printed, else remove
      var e = $(thumbArray[i]);//Element
      for(var x = 0; x < draw.length; x++) {
        var v = draw[x];
        if(v.id != e.attr('data-variant-id')) continue;
        willBePrinted = true;//Stay printed.
        break;
      }
      if(willBePrinted) continue;
      //Remove
      e.remove();
    }

    if(container.find(Consts.PRODUCT_THUMBNAILS_SELECTOR).length > 2000) {
      return console.error('Attempted to print more than 2000 products on a single page...');
    }

    //Now we should only have the variants that are printed left
    let previous = null;//Used to track the "previously printed element"
    for(let i = 0; i < draw.length; i++) {
      let variant = draw[i];
      let element = this.isVariantPrinted(variant); //Returns false, or the jQuery element

      if(!element) {
        //Product is not printed... generate the HTML
        element = this.template.generatePrint(variant, i);

        //Is there a previous element?
        if(previous && previous.length) {
          //This becomes the new previous
          previous = $(element).insertAfter(previous);
          continue;
        }

        //No previous element, this must be the first, let's put it first.
        let firstElement = productsContainer.children(Consts.PRODUCT_THUMBNAILS_SELECTOR).first();//Is there any other element?
        if(firstElement && firstElement.length) {//Yes, insert before that
          previous = $(element).insertBefore(firstElement);
          continue;
        }

        //There is no previous element (this is the first), Inject HTML and get element.
        element = $(element);
        productsContainer.append(element);
        previous = element;
        continue;
      }

      //This is already printed, it will become the new previous, but first
      if(!previous) {
        //There is no previous element (meaning this will be the first)
        previous = element;
        continue;
      }

      //There is a previous element, so we are going to move to be after it.
      let prev = element.prev();
      if(previous && !prev.is(previous)) element.insertAfter(previous);
      previous = element;//Now I am the new previous, the next item will go after me.
      if(previous.length > 1) previous = $(previous[0]);
    }

    //Update the internal list of drawn products.
    this.drawnProducts = draw;

    //Fire our event
    this.template.filters.onProductsDrawn();
    this.template.pagination.onProductsDrawn();
    this.template.content.redraw();
    this.template.onVariantsDrawn(draw);
  }
}
