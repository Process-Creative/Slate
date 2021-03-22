import { RangeFilter } from './RangeFilter';

export class PriceRangeFilter extends RangeFilter {
  getValue(p,v) {
    return v.price;
  }
}