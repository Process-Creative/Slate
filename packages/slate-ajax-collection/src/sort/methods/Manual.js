import { SortMethod, getCollectionPosition, getVariantPosition } from './SortMethod';

export const ManualSortVariants = ({ template, method, l, r }) => {
  if(l.product.id === r.product.id) {
    let indexL = getVariantPosition(l);
    let indexR = getVariantPosition(r);
    return indexL - indexR;
  }

  let posL = getCollectionPosition(template, l);
  let posR = getCollectionPosition(template, r);
  let side = posL > posR ? 1 : posL === posR ? 0 : -1;
  return method.reverse ? -side : side;
}

//Manual
export const ManualSort = {
  ...SortMethod,
  handle: 'manual',
  name: 'Featured',
  isVisible: (template) => template.sort.getDefaultSortMethod() === 'manual',
  sort: (template, variants, method) => {
    return variants.sort((l,r) => ManualSortVariants({
      template, l, r, method
    }));
  }
};

//Best Selling (Same as featured)
export const BestSelling = {
  ...ManualSort,
  handle: 'best-selling',
  name: 'Featured',
  isVisible: (template) => template.sort.getDefaultSortMethod() === 'best-selling',
};
