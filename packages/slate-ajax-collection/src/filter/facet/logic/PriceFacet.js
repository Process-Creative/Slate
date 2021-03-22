import { Facet } from './../Facet';
import { printMoney } from '@process-creative/slate-theme-tools';

export class PriceFacet extends Facet {
  constructor(params) {
    super(params);

    $(document).on('onCurrencyChange', e => this.onPriceCurrencyChange(e));
  }

  getOptionName(o) {
    return printMoney(o);
  }

  //For range based facets
  formatMin(min) {
    if(min != 'min') min = printMoney(min);
    return min;
  }

  formatMax(max) {
    if(max != 'max') max = printMoney(max);
    return max;
  }

  onPriceCurrencyChange(e) {
    this.print();
  }
}
