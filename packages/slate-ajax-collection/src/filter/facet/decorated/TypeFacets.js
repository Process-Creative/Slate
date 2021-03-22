import { decorateCheckboxFacet, decorateSelectFacet } from './../decorators';
import { TypeFacet } from './../logic';

export const TypeCheckboxFacet = decorateCheckboxFacet(TypeFacet);
export const TypeSelectFacet = decorateSelectFacet(TypeFacet);