import * as Errors from './../../error/Errors';

export class Filter {
  constructor(template, handle) {
    if(!template) throw new Error(Errors.MISSING_FILTER_TEMPLATE);
    if(!handle || !handle.length) throw new Error(Errors.MISSING_FILTER_HANDLE);
    this.template = template;
    this.filters = this.template.filters;
    this.handle = handle;
  }

  getSettings() {
    //Return a list (either array or object) of all this filters' settings.
  }

  getSetting(key) {
    //Returns the setting specified by key (it's current value)
  }

  setSetting(key, value) {
    //Set the value at key with the value; value
  }

  setSettings(settings) {
    //Same as above but for all settings at once
  }

  clear() {
    this.setSettings(null);
  }

  filter(product, variant) {
    //Your custom filter may super this method.
    //Return true to keep this product, false to remove.
    return true;
  }

  init(settings) {
    //Init with the default settings, shouldn't be sub called, designed to use
    //whatever settings are defined at a collection level.
    if(typeof settings === typeof undefined || !settings) return;
    this.setSettings(settings);
  }
}
