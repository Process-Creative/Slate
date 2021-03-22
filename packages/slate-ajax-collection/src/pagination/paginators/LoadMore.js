import { Paginator } from './Paginator';
import { CLASS_HIDDEN } from './../../constant/Constants';

export class LoadMore extends Paginator {
  constructor(template, container) {
    super(template);
    this.container = container;
    this.container.on('click', e => this.onClick(e));
  }

  onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.pagination.setPage(this.pagination.getCurrentPage()+1);
  }

  getStart() { return 0; }
  getEnd(params) { return params.perPage * params.page; }

  updateVisibility() {
    if(this.pagination.getCurrentPage() >= this.pagination.getTotalPages()) {
      return this.container.addClass(CLASS_HIDDEN);
    }
    return this.container.removeClass(CLASS_HIDDEN);
  }

  onPageChange() {
    this.updateVisibility();
  }

  onPageReady() {
    this.updateVisibility();
  }

  onProductsDrawn() {
    this.updateVisibility();
  }

  onPerPageChange() {
    this.updateVisibility();  
  }
}
