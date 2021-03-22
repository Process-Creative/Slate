import { SortMethod } from './SortMethod';
import { liquidToDate } from '@process-creative/slate-theme-tools';
import { ManualSortVariants } from './Manual';

export const CreatedAscending = {
  ...SortMethod,
  name: 'Date, Oldest First',
  sort: (template, variantData, method) => {
    return variantData.sort((l,r) => {
      if(!l.product.published_at || !r.product.published_at) {
        return ManualSortVariants({ template, l, r, method });
      }
      
      if(!l.product.published_at) return 1;
      if(!l.published_at_date) l.published_at_date = liquidToDate(l.product.published_at);
      if(!r.published_at_date) r.published_at_date = liquidToDate(r.product.published_at);
      return l.published_at_date - r.published_at_date;
    });
  },
  handle: 'created-ascending'
}

export const CreatedDescending = {
  ...CreatedAscending,
  handle: 'created-descending',
  name: 'Date, Newest First',
  reverse: true
}