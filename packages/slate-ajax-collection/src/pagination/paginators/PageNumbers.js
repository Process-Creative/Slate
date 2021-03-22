import { Paginator } from './Paginator';
import { CLASS_HIDDEN } from './../../constant/Constants';

export class PageNumbers extends Paginator {
  constructor(template, container) {
    super(template);
    this.container = container;

    //Standard Shopify Pagination controls
    this.container.on('click touchstart', '.prev', e => this.onPrevClick(e));
    this.container.on('click touchstart', '.next', e => this.onNextClick(e));
    this.container.on('click touchstart', '.page', e => this.onPageClick(e));
  }

  cancelClickEvent(e) {
    //Simple method that cancels event propogation
    if(typeof e === typeof undefined) return;
    if(typeof e.preventDefault !== typeof undefined) e.preventDefault();
    if(typeof e.stopPropagation !== typeof undefined) e.stopPropagation();
  }

  redraw() {
    //Called anytime the filters are updated, products are loaded, pages are changed etc.
    let x = '';
    let page = this.pagination.getCurrentPage();//Short hand
    let totalPages = this.pagination.getTotalPages();

    //Prev Button
    if(page > 1) {
      let url = this.template.settings.getSettingsUrl({ page: (page - 1) });
      x += ` <span class="prev"><a href="${url}" title="">« Previous</a></span> `;
    }

    //First, let's generate an array of numbers we want to draw (we always draw 1 and totalPages())
    let numbers = [];
    if(totalPages > 1) numbers = [1,totalPages];

    //Now add numbers page-2,page-1,page,page+1,page+2
    for(let i = page-2; i <= page+2; i++) {
      if(numbers.indexOf(i) !== -1) continue;//Already in the list
      if(i < 1) continue;
      if(i > totalPages) continue;
      numbers.push(i);
    }
    numbers = numbers.sort((l,r) => l - r);

    //Now we have a list of numbers, we can try and find gaps
    numbers.forEach((n,i) => {
      if(n == 0) return;
      let isCurrent = n == page;

      x += ` <span class="page ${isCurrent?'current':''}">`;
      if(!isCurrent) {
        let url = this.template.settings.getSettingsUrl({ page: n });
        x += `<a href="${url}" title="">`;
      }

      x += `${n}`;

      if(!isCurrent) x += '</a>';
      x += '</span> ';

      //Is there a gap?
      let nextExpected = n + 1;
      if(typeof numbers[i+1] !== typeof undefined && numbers[i+1] != nextExpected) {
        x += ' <span class="deco">…</span> ';
      }
    });

    //Next Button
    if(page < totalPages) {
      let url = this.template.settings.getSettingsUrl({
        page: (page + 1)
      });

      x += ` <span class="next"><a href="${url}" title="">Next »</a></span> `;
    }

    this.container.html(x);
  }

  onPageChange() {
    this.redraw();
  }

  onPageReady() {
    this.redraw();
  }

  onProductsDrawn() {
    this.redraw();
  }

  onPerPageChange() {
    this.redraw();
  }

  //Pagination button functions
  onPrevClick(e) {
    this.cancelClickEvent(e);
    this.pagination.setPage(this.pagination.getCurrentPage() - 1);
  }

  onNextClick(e) {
    this.cancelClickEvent(e);
    this.pagination.setPage(this.pagination.getCurrentPage() + 1);
  }

  onPageClick(e) {
    this.cancelClickEvent(e);

    let self = $(e.currentTarget);
    if(self.hasClass('current')) return;

    let page = parseInt(self.text());
    this.pagination.setPage(page);
  }
}
