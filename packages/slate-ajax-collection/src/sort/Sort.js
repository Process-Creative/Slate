import * as SortMethods from './methods/';

export class Sort {
  constructor(template) {
    this.template = template;
    this.sorters = [];
    this.sortMethods = { ...SortMethods };

    //Setup the default method for sort by
    //Starts empty so that the read collection data will set this and start
    //using this sorting method. By using the default sortby it won't appear in
    //the url.
    this.defaultSortBy = '';
  }

  getSortMethods() {
    return this.sortMethods;
  }

  //Internal method only, don't use front facing.
  getSortSetting() {
    return this.template.settings.settings.sort_by;
  }

  getSortMethodByHandle(handle) {
    return Object.values(this.getSortMethods()).find( method => method && method.handle === handle );
  }

  getSortMethod() {
    let method = this.getSortMethodByHandle(this.getSortSetting() || this.defaultSortBy || 'manual');
    return method && method.isVisible(this.template) ? method : null || this.sortMethods.ManualSort || SortMethods.ManualSort;
  }

  getDefaultSortMethod() {
    return this.defaultSortBy || 'manual';
  }

  setDefaultSort(defaultSort) {
    let current = this.defaultSortBy || 'manual';
    this.defaultSortBy = defaultSort;
    if(current != defaultSort) this.template.draw.queueDraw();
    this.sorters.forEach(sorter => sorter.onUpdate(this.getSortMethod()));
  }

  setSort(sort) {
    let value = sort;
    if(sort == (this.defaultSortBy || 'manual')) value = null;
    if(value && !this.getSortMethodByHandle(value)) value = null;
    this.template.settings.setSetting('sort_by', value);
    this.template.draw.draw();//Immediate redraw
    this.sorters.forEach(sorter => sorter.onUpdate(this.getSortMethod()));
  }

  sortVariants(variants) {
    let method = this.getSortMethod();
    if(!method) return variants;
    let sorted = method.sort(this.template, variants, method);
    if(method.reverse) sorted.reverse();
    if(this.template.onSort) return this.template.onSort({ method, variants, sorted });
    return sorted;
  }


  addSorter(sorter) {
    this.sorters.push(sorter);
    sorter.onUpdate(this.getSortMethod());
  }

  load() {
    this.redraw();
  }

  redraw() {
    let sort = this.getSortMethod();
    this.sorters.forEach(sorter => sorter.onUpdate(sort));
  }
}
