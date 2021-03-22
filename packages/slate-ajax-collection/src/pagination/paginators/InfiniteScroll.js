import { Paginator } from './Paginator';
import { getQueryParams } from '@process-creative/slate-theme-tools';

export class InfiniteScroll extends Paginator {
  constructor(template, params) {
    super(template);

    this.onPageLoad(getQueryParams());
    $(window).on('scroll', e => this.onWindowScroll(e));
  }
  
  getStart() { return 0; }

  onWindowScroll(e) {
    if(this.timeout) return;
    this.timeout = setTimeout(e => {
      this.updateScrollPagination();
    }, 150);
  }

  onPageLoad(params) {
    this.pageOnLoad = params && params.page ? params.page : null;
  }
  
  onProductsFetched() {
    if(!this.pageOnLoad) return;
    
    let total = this.pagination.getTotalPages();
    let curr = this.pagination.getCurrentPage();

    if(this.pageOnLoad > total) return;
    if(curr > this.pageOnLoad) return;
    if(curr == this.pageOnLoad) return;
    this.pagination.setPage(this.pageOnLoad);
  }

  updateScrollPagination() {
    //Tells the scroll event(s) that we are allowed to request another
    //frame.
    this.timeout = null;

    //Page count check.
    if(this.pagination.getCurrentPage() >= this.pagination.getTotalPages()) return;

    //We're trying to calculate the percentage down the products conatiner we're
    //at. This involves determining the window size and position, as well as the
    //products container size and position, and extrapolate a percentage.
    let w = $(window);
    let wScroll = w.scrollTop();//Y Position of the screen
    let wHeight = w.height();
    let pcOff = this.template.productsContainer.offset();//Get the Product Container Offset
    let pcHeight = this.template.productsContainer.outerHeight();

    let relativePosition = (pcOff.top+pcHeight) - (wScroll+wHeight);

    //Do we have more than the height of a full set of products remaining?
    if(relativePosition >= pcHeight / this.pagination.getCurrentPage()) return;

    //Now increase page
    this.pagination.setPage(this.pagination.getCurrentPage() + 1);
  }
}
