import { Filter, TagFilter, OPERATION_AND } from './filters/';

export class CollectionFilters {
  constructor(template) {
    this.template = template;

    this.filters = [];
    this.facets = [];
  }

  isFiltering() {
    return this.filters.some(f => {
      if(f.getSettings() && f.getSettings().length) return true;
      return false;
    });
  }

  addFilter(filter) {
    if(this.filters.indexOf(filter) !== -1) return;
    this.filters.push(filter);
  }

  addFacet(facet) {
    if(this.facets.indexOf(facet) !== -1) return;
    this.facets.push(facet);
    facet.print();
  }

  removeFilter(filter) {
    let index = this.filters.indexOf(filter);
    if(index === -1) return;
    this.filters.splice(index, 1);
  }

  removeFacet(facet) {
    let index = this.facets.indexOf(facet);
    if(index === -1) return;
    this.facets.splice(index, 1);
  }

  clearFilters() {
    this.filters.forEach(f => f.setSettings(null));
  }

  load() {
    let { settings } = this.template.settings;
    //Take the settinsg and give them to our filters
    Object.entries(settings).forEach(([key,value]) => {
      this.filters.some(filter => {
        if(!filter || filter.handle != key) return false;
        filter.setSettings(value);
        return true;
      });
    });

    if(settings.tags) {
      // let done = this.filters.some(filter => {
      //   if(!(filter instanceof TagFilter)) return false;
      //   if(settings.tags.length > 1 && filter.operation !== OPERATION_AND) return false;
      //   filter.setSettings(settings.tags);
      //   return true;
      // });
      //
      // if(!done) {
        this.urlTagFilter = new TagFilter(this.template, 'tags', OPERATION_AND, settings.tags)
        this.addFilter(this.urlTagFilter);
      // }
    }

    this.facets.forEach(facet => facet.print());
  }

  onFilterUpdate() {
    //Filters should call this when something causes them to change.
    //This function will trigger facets to be redrawn, followed by products, and then settings to be saved
    let settings = {};

    this.filters.forEach(filter => settings[filter.handle] = filter.getSettings());
    this.template.settings.setSettings(settings);

    this.facets.forEach(facet => facet.onFilterUpdate());

    //Fire pre-queue event
    if(this.template.onFilterChange) this.template.onFilterChange();

    //Queue a redraw of products
    this.template.draw.queueDraw();
  }

  onProductsFetched() {
    this.facets.forEach(facet => facet.onProductsFetched());
  }

  onProductsDrawn() {
    this.facets.forEach(facet => facet.onProductsDrawn());
  }
}
