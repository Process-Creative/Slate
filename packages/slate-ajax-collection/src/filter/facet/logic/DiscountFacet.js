import { Facet } from './../Facet';

export class DiscountFacet extends Facet {
  constructor(params) {
    super(params);
  }
  
  formatMin(min) {
    if(min != 'min') min = `${min}%`;
    return min;
  }

  formatMax(max) {
    if(max != 'max') max = `${max}%`;
    return max;
  }

  formatRange(min, max) {
    if(min == 'min' && max == 'max') return super.formatRange(min, max);
    
    if(min == 'min') return `Up to ${this.formatMin(max)} off`;
    if(max == 'max') return `From ${this.formatMax(min)} off`;
    
    return super.formatRange ? super.formatRange(min, max) : `${this.formatMin(min)} - ${this.formatMax(max)}`;
  }
}