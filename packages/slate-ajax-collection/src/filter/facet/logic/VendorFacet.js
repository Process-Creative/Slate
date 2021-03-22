import { Facet } from './../';

export class VendorFacet extends Facet {
  getOptions() {
    return [ ...this.template.data.allVendors ];
  }
}
