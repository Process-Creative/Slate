import { Filter } from './Filter';

export class VendorFilter extends Filter {
  constructor(template, handle, vendors) {
    super(template,handle);
    this.vendors = vendors || [];
  }

  getSettings() { return this.vendors; }

  getSetting(vendor) {
    if(!vendor) return this.vendors;
    return this.vendors.indexOf(vendor) !== -1;
  }

  setSetting(vendor, value) {
    if(value) return this.addVendor(vendor);
    this.removeVendor(vendor);
  }

  setSettings(settings) {
    if(!Array.isArray(settings)) settings = [ settings ];
    this.vendors = settings.filter(v => v);
    this.filters.onFilterUpdate();
  }

  addVendor(vendor) {
    if(this.getSetting(vendor)) return;
    this.vendors.push(vendor);
    this.filters.onFilterUpdate();
  }

  removeVendor(vendor) {
    let index = this.vendors.indexOf(vendor);
    if(index === -1) return;
    this.vendors.splice(index, 1);
    this.filters.onFilterUpdate();
  }

  filter(p,v) {
    if(!this.vendors.length) return true;
    return this.vendors.some(type =>  p.vendor === type);
  }
}
