import{ OperativeFilter } from './OperativeFilter';

export const VO_MODE_PRODUCT = 'check-product';
export const VO_MODE_VARIANT = 'check-variant';

export class VariantOptionFilter extends OperativeFilter {
  constructor(template, handle, operation, optionNames, defaultMode) {
    super(template, handle, operation);

    this.optionNames = optionNames || [];
    this.mode = defaultMode || VO_MODE_PRODUCT;
    this.options = [];
    this.shouldCheckVariant = (p,v) => true;
  }

  getSetting(name) {
    if(!name) return this.options;
    return this.options.indexOf(name.toLowerCase()) !== -1;
  }

  getSettings() {
    return this.options;
  }

  getOptionValue(opt) {
    if(!opt) return null;
    return opt.toLowerCase();
  }

  setSetting(option, value) {
    if(value) return this.addOption(option);
    this.removeOption(option);
  }

  setSettings(options) {
    if(!Array.isArray(options)) options = [ options ];
    this.options = options.filter(f => f).map(o => `${o||''}`.toLowerCase());
    this.options = this.options.filter((o,i) => this.options.indexOf(o) === i);
    this.filters.onFilterUpdate();
  }

  setMode(mode) {
    this.mode = mode;
    this.filters.onFilterUpdate();
  }
  
  addOption(o) {
    o = o.toLowerCase();
    if(this.getSetting(o)) return;
    this.options.push(o.toLowerCase());
    this.filters.onFilterUpdate();
  }

  removeOption(o) {
    o = o.toLowerCase();
    let index = this.options.indexOf(o);
    if(index === -1) return;
    this.options.splice(index, 1);
    this.filters.onFilterUpdate();
  }

  filterAnd(p,v) {
    if(!this.options.length) return true;
    let oi = this.template.getOptionIndex(p, this.optionNames);
    if(oi === -1) return false;
    if(this.mode == VO_MODE_VARIANT) return this.filterAndVariant(p,v,oi);
    return this.filterAndProduct(p,v,oi);
  }

  filterOr(p,v) {
    if(!this.options.length) return true;
    let ci = this.template.getOptionIndex(p, this.optionNames);
    if(ci === -1) return false;
    if(this.mode == VO_MODE_VARIANT) return this.filterOrVariant(p,v,ci);
    return this.filterOrProduct(p,v,ci);
  }

  filterAndProduct(p,v,ci) {
    return this.options.every(c => {
      let swatch = this.getOptionValue(c);
      return p.variants.some(v => {
        if(!this.shouldCheckVariant(p,v)) return false;
        return this.getOptionValue(v.options[ci]) === swatch;
      });
    })
  }

  filterAndVariant(p,v,ci) {
    return this.options.every(c => {
      let swatch = this.getOptionValue(c);
      return p.variants.every(v => {
        if(!this.shouldCheckVariant(p,v)) return false;
        return this.getOptionValue(v.options[ci]) === swatch
      });
    })
  }

  filterOrProduct(p,v,ci) {
    return this.options.some(c => {
      let swatch = this.getOptionValue(c);
      return p.variants.some(v => {
        if(!this.shouldCheckVariant(p,v)) return false;
        return this.getOptionValue(v.options[ci]) === swatch;
      });
    });
  }

  filterOrVariant(p,v,ci) {
    if(!this.shouldCheckVariant(p,v)) return false;
    return this.options.some(c => {
      let swatch = this.getOptionValue(c);
      return this.getOptionValue(v.options[ci]) === swatch;
    })
  }
}