import * as Consts from './../constant/Constants';

export class Content {
  constructor(template) {
    this.template = template;
    this.contentBlocks = [];
  }

  load() {
    this.contentBlocks = this.template.productsContainer.find(Consts.CONTENT_BLOCK_SELECTOR)
    this.contentBlocks = this.contentBlocks ? this.contentBlocks.toArray() : [];
    this.contentBlocks = this.contentBlocks.map(cb => $(cb));

    this.contentBlocks.forEach( cb => cb.attr('data-original-index', cb.index()) );

    $(window).on('resize', () => {
      if(this.resizeTimeout) return;
      this.resizeTimeout = setTimeout(() => this.redraw(), 200);
    });

    //Redraw now, but due to how blocks shift pagination we also queueDraw
    this.redraw();
    if(this.contentBlocks.length) this.template.draw.queueDraw();
  }

  addContentBlock(x) {
    if(typeof x === typeof '') x = $(x);
    this.contentBlocks.push(x);
    this.redraw();
  }

  removeContentBlock(x) {
    let remove = [];
    this.contentBlocks = this.contentBlocks.filter(cb => {
      let is = cb.is(x);
      if(is) remove.push(x);
      return !is;
    });
    remove.forEach(x => x.remove());
    this.redraw();
  }

  getContentBlocksForPage(params) {
    if(typeof this.template.getContentBlocksForPage === typeof undefined) return -1;
    return this.template.getContentBlocksForPage({
      ...params, contentBlocks: this.contentBlocks
    });
  }

  redraw() {
    //Stop the resize timeout
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = null;

    //Detach all content blocks;
    let detach = [];

    let thumbnailElements = this.template.productsContainer.find(Consts.PRODUCT_THUMBNAILS_SELECTOR);
    let x = {};//What is X? X is a passable variable that will be persistant between each iteration.

    this.contentBlocks.forEach(cb => {
      //Get the position of this content block
      let i = this.template.getContentBlockPosition(cb, thumbnailElements, this.template.draw.drawnProducts, x);
      if(i === -1) return detach.push(cb);

      //Now get the DOM Node this needs to go before.
      let element = thumbnailElements[i];
      if(element) return cb.insertBefore($(element));

      //That DOM Node doesn't exist, try the last one after.
      element = thumbnailElements[thumbnailElements.length-1];
      if(element) return cb.insertAfter($(element));

      //That one doesn't exist (likely we're the only thing rendering)
      this.template.productsContainer.append(cb);
    });

    detach.forEach(d => d.detach());
  }
}
