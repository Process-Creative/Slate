import { Facet } from './../';

export class VariantOptionFacet extends Facet {
  constructor(params) {
    super(params);
    this.optionNames = params.optionNames || [];
  }

  getOptionValue(opt) {
    if(!opt) return null;
    return opt.toLowerCase();
  }
  
  getOptions() {
    //This function can be used to determine what to show and what to hide.
    let allOptions = super.getOptions();

    //Fetch from the products in the collection
    let allCurrentOptions = [];
    let allOptions = [];

    //Foreach variant
    for(let i = 0; i < this.template.data.variants.length; i++) {
      let v = this.template.data.variants[i];
      let p = v.product;

      //Skip Product Rules
      if(!this.template.data.isProductInCollection(p)) continue;//Not in coll

      //DisplayMode
      let dm = this.template.draw.displayMode;
      if(typeof dm === 'function') dm = dm.name;
      if(dm.indexOf('Available') !== -1 && !this.template.isVariantAvailable(v)) continue;

      //Find color option index
      let optionIndex = this.template.getOptionIndex(p, this.optionNames);
      if(optionIndex === -1) continue;

      let option = this.getOptionValue(v.options[optionIndex]);

      if(allOptions.indexOf(option) === -1) {
        allOptions.push(option);
      }

      //We have to use this as our variant v is being lost if we were to use forEach.
      //TODO: Create another array of variants that are in unpaginatedProducts
      //and use that as a lookup.
      // if(this.template.draw.unpaginatedProducts.find(fv => v.id == fv.id)) continue;

      if(allCurrentOptions.indexOf(option) === -1) {
        allCurrentOptions.push(option);
      }
    }

    if(!allOptions.length) allOptions = allCurrentOptions;

    let options = [];
    for(let i = 0; i < allOptions.length; i++) {
      let o = allOptions[i];
      options.push(o);
    }
    
    return options;
  }
}