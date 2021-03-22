import { RangeFilter } from './RangeFilter';

export class DiscountRangeFilter extends RangeFilter {
  getValue(p,v) {
    let ca = v.compare_at_price;
    if(!ca || ca < v.price) ca = v.price;
    return ((ca - v.price) / ca) * 100;
  }
}