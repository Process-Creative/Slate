import { SortMethod, getVariantPosition } from './SortMethod';

export const TitleAscending = {
  ...SortMethod,
  handle: 'title-ascending',
  name: 'A-z',
  sort: (collection,variants) => {
    return variants.sort((l,r) => {
      if(l.product.id === r.product.id) {
        let indexL = getVariantPosition(l);
        let indexR = getVariantPosition(r);
        return indexL - indexR;
      }

      return l.product.title.localeCompare(r.product.title);
    });
  }
}

export const TitleDescending = {
  ...TitleAscending,
  reverse: true,
  handle: 'title-descending',
  name: 'Z-a'
}
