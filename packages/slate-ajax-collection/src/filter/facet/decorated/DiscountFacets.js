import { decorateCheckboxFacet, decorateSlideFacet, decorateRangeFacet } from './../decorators/';
import { DiscountFacet } from './../logic/DiscountFacet';

export const DiscountRangeCheckboxFacet = decorateCheckboxFacet(decorateRangeFacet(DiscountFacet));
export const DiscountSlideFacet = decorateSlideFacet(DiscountFacet);