import { Facet } from './../';

export class TagFacet extends Facet {
  constructor(params) {
    super(params);

    let { restrictByProducts, restrictByCollection } = params;

    this.restrictByProducts = typeof restrictByProducts === typeof undefined ? false : restrictByProducts;//If true, only tags that are in the currently filtered products will show
    this.restrictByCollection = typeof restrictByCollection === typeof undefined ? true : restrictByCollection;//If true only tags that are in the collection will show
  }

  getVisibleOptions() {
    let allOptions = super.getVisibleOptions ? super.getVisibleOptions() : null;

    let productTags;
    let collectionTags = [...this.template.data.allTags];
    if(!allOptions || !allOptions.length) allOptions = collectionTags;

    if(this.restrictByProducts && this.template.draw.unpaginatedProducts) {
      productTags = this.collection.draw.unpaginatedProducts.reduce((tags,v) => {
        let p = v.product;
        return [...tags,...p.tags];
      },[]);

      //Remove duplicates
      productTags = productTags.filter((t,i) => productTags.indexOf(t) === i);
    }

    return allOptions.filter(tag => {
      //Always show checked filters, so that they may be unchecked
      if(this.isSelected(tag)) return true;

      if(this.restrictByCollection && collectionTags.indexOf(tag) === -1) return false;
      if(this.restrictByProducts && productTags.indexOf(tag) === -1) return false;
      return true;
    });
  }

  getOptions() {
    //Add all tags for all products
    let options = this.template.data.products.reduce((x,product) => {
      if(!this.template.data.isProductInCollection(product)) return x;
      return x = [...x, ...product.tags];
    }, []);

    //Remove duplicates
    return options.filter((o,i) => options.indexOf(o) === i);
  }
}
