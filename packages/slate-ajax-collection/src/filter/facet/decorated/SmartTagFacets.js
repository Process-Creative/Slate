import { decorateButtonFacet, decorateSelectFacet, decorateCheckboxFacet, decorateSwatchFacet } from './../decorators/';
import { SmartTagFacet } from './../logic/';

export const SmartTagCheckboxFacet = decorateCheckboxFacet(SmartTagFacet);
export const SmartTagButtonFacet = decorateButtonFacet(SmartTagFacet);
export const SmartTagSelectFacet = decorateSelectFacet(SmartTagFacet);
export const SmartTagSwatchFacet = decorateSwatchFacet(SmartTagFacet);