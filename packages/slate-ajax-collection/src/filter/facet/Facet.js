import * as Errors from './../../error/Errors';

export class Facet {
  constructor(params) {
    //Get the options...
    let { template, filter, container, title, options, hasAll, allName } = params;
    this.params = params;

    if(!template) throw new Error(Errors.MISSING_FACET_TEMPLATE);
    if(!filter) throw new Error(Errors.MISSING_FACET_FILTER);
    if(!container) throw new Error(Errors.MISSING_FACET_CONTAINER);
    if(!title) throw new Error(Errors.MISSING_FACET_TITLE);

    //Was the passed container a string? If so it's a selector, find it.
    if(typeof container === "string") container = template.container.find(container);

    this.template = template;
    this.filter = filter;
    this.container = container;
    this.title = title;
    this.options = options || [];
    this.hasAll = hasAll || false;
    this.allName = allName || 'All';
  }

  isSelected(option) {
    if(this.hasOptionAll() && this.isOptionAll(option)) {
      let settings = this.filter.getSettings()
      return !settings || !settings.length;
    }
    return this.filter.getSetting(option);
  }

  isOptionAll(option) {
    return option === 'all'
  }


  hasOptionAll() {
    return this.hasAll || false;
  }


  getOptionName(option) {
    if(this.isOptionAll(option)) return this.template.escape(this.allName);
    return this.template.escape(option);
  }

  getPrint() {
    return ``;
  }

  getOptionsToDraw() {
    let options = this.getVisibleOptions();
    if(this.hasOptionAll()) options = [ 'all', ...options ];
    return options;
  }

  getVisibleOptions() {
    return this.getOptions().filter(f => f && f.replace(/\s/g, '').length);
  }

  getOptions() {
    return this.options;
  }


  setOption(o, v) {
    if(this.hasOptionAll() && this.isOptionAll(o)) {
      return this.filter.setSettings(null);
    }
    this.filter.setSetting(o, v);
  }

  setOptions(v) {
    if(this.hasOptionAll()) {
      let isAll = Array.isArray(v) ? v.some(o => this.isOptionAll(o)) : this.isOptionAll(v);
      if(isAll) return this.filter.setSettings(null);
    }
    this.filter.setSettings(v);
  }

  getTemplate(title, body) {
    return `
      ${this.params.showTitle === false ? '' : `<span class="c-collection-faceted-nav__title">${title}</span>`}
      ${body}
    `;
  }
  
  print() {
    let body = this.getPrint();
    let x = this.getTemplate(this.title, body);
    if(this.currentPrint && this.currentPrint == x) return;//Not worth re-rendering.

    this.currentPrint = x;
    this.container.html(x);

    if(this.getVisibleOptions() && this.getVisibleOptions().length) {
      this.container.addClass('has-options');
    } else {
      this.container.removeClass('has-options');
    }

    if(this.filter.getSettings() && this.filter.getSettings().length) {
      this.container.addClass('is-filtering');
    } else {
      this.container.removeClass('is-filtering');
    }
  }


  onFilterUpdate() {
    this.print();
  }

  onProductsFetched() {
    this.print();
  }

  onProductsDrawn() {
    this.print();
  }

}
