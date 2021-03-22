import { Filter } from './Filter';

export class RangeFilter extends Filter {
  constructor(template, handle) {
    super(template, handle);

    this.ranges = [];//"10-20", "20-30", "50-max", etc.
  }

  getSettings() {
    if(this.ranges.length < 2 && this.ranges[0] == 'min-max') return [];
    return this.ranges;
  }

  getSetting(key) {
    return this.ranges.some(r => r == key);
  }

  getRangeMin() {
    this.updateMinMax();
    return this.rangeMin;
  }

  getRangeMax() {
    this.updateMinMax();
    return this.rangeMax;
  }

  getValue(p,v) {
    //Super this to return the numeric data point for the range.
    //In future I may do some function to handle the min and max calculations.
    return 0;
  }

  setSettings(settings) {
    settings = this.formatSettings(settings);
    this.ranges = settings;
    this.filters.onFilterUpdate();
  }

  setSetting(key, value) {
    let i = this.ranges.indexOf(key);
    if((value && i !== -1) || (!value && i === -1)) return;
    if(value) {
      this.ranges.push(key);
    } else {
      this.ranges.splice(i, 1);
    }
    this.ranges = this.formatSettings(this.ranges);
    this.filters.onFilterUpdate();
  }

  filter(p,v) {
    if(!this.ranges.length) return true;

    let value = this.getValue(p,v);

    return this.ranges.some(r => {
      let [ min, max ] = r.split('-').map(e => {
        if(e == 'min' || e == 'max') return e;
        return parseInt(e);
      });


      if(min != 'min' && value < min) return false;
      if(max != 'max' && value > max) return false;

      return true;
    });
  }

  formatSettings(s) {
    //Cleansing.
    if(!s) s = [];
    if(!Array.isArray(s)) s = [ s ];
    return s.filter(b => {
      if(typeof b !== 'string') return false;
      b = b.split('-');
      return b.length === 2;
    });
  }

  updateMinMax() {
    let rangeMin = Number.MAX_VALUE;
    let rangeMax = 0;

    this.template.data.variants.forEach(v => {
      let value = this.getValue(v.product, v);
      if(!this.template.data.isProductInCollection(v.product)) return;

      rangeMin =  Math.min(rangeMin, value)
      rangeMax =  Math.max(rangeMax, value)
    }, 0);

    this.rangeMin = rangeMin;
    this.rangeMax = rangeMax;
  }
}