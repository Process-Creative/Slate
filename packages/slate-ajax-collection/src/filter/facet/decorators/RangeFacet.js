export const decorateRangeFacet = (FacetType) => {
  return class extends FacetType {
    getOptionName(o) {
      let split = o.split('-');
      return this.formatRange(split[0], split[1]);
    }
  
    formatMin(v) {
      return super.formatMin ? super.formatMin(v) : v;
    }
  
    formatMax(v) {
      return super.formatMax ? super.formatMax(v) : v;
    }
  
    formatRange(min, max) {
      return super.formatRange ? super.formatRange(min, max) : (
        `${this.formatMin(min)} - ${this.formatMax(max)}`
      );
    }
  
    getVisibleOptions() {
      let options = this.getOptions();
  
      let rangeMin = this.filter.getRangeMin();
      let rangeMax = this.filter.getRangeMax();
  
      return options.filter(e => {
        let [ min, max ] = e.split('-');
  
        if(max != 'max' && max < rangeMin) return false;
        if(min != 'min' && min > rangeMax) return false;
  
        return true;
      })
    }
  }
}