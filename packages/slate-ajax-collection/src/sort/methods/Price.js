import { ManualSort, ManualSortVariants } from './Manual';
import { SortMethod } from './SortMethod';

export const PriceAscending = {
  ...SortMethod,
  handle: "price-ascending",
  name: "Price, Low to High",
  sort: (template, variantData, method) => {
    return variantData.sort((l,r) => {
      if(l.price > r.price) return 1;
      if(l.price < r.price) return -1;
      return ManualSortVariants({ template, method, l, r });
    });
  }
};

export const PriceDescending = {
  ...PriceAscending,
  handle: 'price-descending',
  name: 'Price, High to Low',
  reverse: true
};
