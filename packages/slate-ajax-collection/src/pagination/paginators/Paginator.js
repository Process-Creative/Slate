export class Paginator {
  constructor(template,pagination) {
    this.template = template;
    this.pagination = pagination || template.pagination;
  }

  getOffsets(params) {
    const params = { paginator: this, ...params };
    return {
      start: this.pagination.getStartOffset(params),
      end: this.pagination.getEndOffset(params)
    };
  }

  getStart(params) {
    return (params.page - 1) * params.perPage;
  }

  getEnd(params) {
    return params.start + params.perPage;
  }

  paginate(variants) {
    const params = {
      perPage: this.pagination.getPerPage(),
      page: this.pagination.getCurrentPage(),
      paginator: this,
      variants
    }

    //Start & End Index in array
    params.start = this.getStart(params);
    params.end = this.getEnd(params);

    //Get Offsets
    params.offsets = this.getOffsets(params);
    params.start += params.offsets.start;
    params.end += params.offsets.end;

    //Paginated array
    return variants.slice(params.start, Math.min(params.variants.length, params.end));
  }

  onPageChange() {}
  onPageReady() {}
  onProductsDrawn() {}
  onPerPageChange() {}
}
