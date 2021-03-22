import { PriceFacet } from '../logic/PriceFacet';
import { decorateRangeFacet, decorateSlideFacet, decorateCheckboxFacet } from './../decorators';

export const PriceRangeFacet = decorateRangeFacet(PriceFacet);
export const PriceRangeCheckboxFacet = decorateCheckboxFacet(PriceRangeFacet);

export const PriceSlideFacet = decorateSlideFacet(PriceFacet);