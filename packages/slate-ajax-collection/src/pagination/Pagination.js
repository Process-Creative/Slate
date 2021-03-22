import { param } from 'jquery';
import { Paginator } from './paginators/';

export const VIEW_ALL_COUNT = 999999;

export class Pagination {
  constructor(template) {
    this.template = template;

    //Initialize a default paginator.
    this.paginator = new Paginator(template,this);

    //Content Aware Pagination, this will consider content blocks as taking up
    //a respective product thumbnail slot
    this.paginateContentAware = false;
  }

  getCurrentPage() {
    if(this.isViewAll()) return 1;

    let { page } = this.template.settings.settings;
    page = parseInt(page);
    if(isNaN(page) || !isFinite(page)) page = 1;
    return this.clampPage(page);
  }

  getTotalPagesWithoutOffset() {
    if(this.isViewAll()) return 1;
    let total = this.template.draw.getUnpaginatedVariantCount();
    if(!total) return 1;
    return Math.ceil(total / this.getPerPage());
  }

  getTotalPages() {
    if(this.isViewAll()) return 1;
    let total = this.template.draw.getUnpaginatedVariantCount();
    if(!total) return 1;

    let pagesWithoutOffset = this.getTotalPagesWithoutOffset();

    //What we're doing here is adding the page offsets.
    //e.g. if There are 10 products per page, and we're trying to print 19 but
    //the offset is -3 then we need to forcibly add page 3
    total -= this.getEndOffset({
      page: pagesWithoutOffset,
      perPage: this.getPerPage(),
      paginator: this.paginator
    });

    return Math.ceil(total / this.getPerPage());
  }

  getPerPage() {
    if(this.isViewAll()) return VIEW_ALL_COUNT;

    let { perPage } = this.template.settings.settings;
    perPage = parseInt(perPage||'');
    if(isNaN(perPage) || !isFinite(perPage)) perPage = this.template.perPage;
    perPage = Math.max(1, Math.min(250, perPage));//Clamp to 250 max.
    return perPage || 20;
  }


  isViewAll() {
    let { perPage } = this.template.settings.settings;
    if(perPage === 'all') return true;
    perPage = parseInt(perPage);
    return !isNaN(perPage) && isFinite(perPage) && perPage >= VIEW_ALL_COUNT;
  }


  setPaginator(paginator) {
    this.paginator = paginator;
    this.template.draw.queueDraw();
  }

  setPage(page) {
    this.template.settings.setSetting('page', this.clampPage(page));
    this.template.draw.draw();
    this.paginator.onPageChange();
    this.template.onPageChange(this.getCurrentPage());
  }

  setPerPage(perPage) {
    if(perPage == this.template.perPage) {
      this.template.settings.setSetting('perPage', null);
    } else if(this.isViewAll()) {
      this.template.settings.setSetting('perPage', 'all');
    } else {
      this.template.settings.setSetting('perPage', perPage);
    }
    
    this.template.draw.queueDraw();
    this.paginator.onPerPageChange();
    this.template.onPerPageChange(this.getPerPage());
  }

  getOffsetDueToContentBlocks(params) {
    //Count the offset based on the size of each content block
    let cb = this.template.content.getContentBlocksForPage(params);
    if(!cb || !cb.length) return 0;
    return cb.reduce((x,cb) =>  x + this.template.getContentBlockSize({
      ...params, contentBlock: cb
    }), 0);
  }

  getStartOffset(params) {
    if(this.isViewAll()) return 0;
    let offset = 0;

    //Add the previous pages' end offset (basically the "last index we rendered")
    if(params.page > 1) offset += this.getEndOffset({ ...params, page: params.page - 1 });

    return offset;
  }

  getEndOffset(params) {
    if(this.isViewAll()) return 0;

    //Start with the start offset of THIS page
    let offset = this.getStartOffset(params);

    //Offset this pages' content blocks
    if(this.paginateContentAware && this.template.content) {
      offset -= this.getOffsetDueToContentBlocks(params);
    }

    return offset;
  }

  viewAll() {
    this.setPerPage(VIEW_ALL_COUNT);
  }

  paginateVariants(variants) {
    if(this.isViewAll()) return variants;

    if(this.paginator) variants = this.paginator.paginate(variants);
    return variants;
  }

  clampPage(page) {
    if(this.isViewAll()) return 1;
    return Math.min(Math.max(page, 1), this.getTotalPages());
  }

  load() {
    this.paginator.onPageReady();
  }

  //Events
  onProductsDrawn() {
    this.paginator.onProductsDrawn();
  }

  onProductsFetched() {
    this.paginator.onProductsFetched ? this.paginator.onProductsFetched() : null;
  }
}
