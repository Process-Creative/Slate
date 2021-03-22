import { VariantOptionFacet } from "./VariantOptionFacet";
import { COLOR_OPTIONS } from './../../../constant/Constants';
import { handlize } from '@process-creative/slate-theme-tools';

export class ColorFacet extends VariantOptionFacet {
  constructor(params) {
    super({
      ...params,
      optionNames: COLOR_OPTIONS
    });
  }

  getSwatch(opt) {
    if(!opt) return null;
    if(!this.filter.getSwatchByColor) return null;
    return this.filter.getSwatchByColor(opt);
  }

  getOptionValue(opt) {
    if(!opt) return null;
    let swatch = this.getSwatch(opt);
    if(swatch && swatch.name) return handlize(opt.name);
    return handlize(opt);
  }

  getOptionName(opt) {
    if(!opt) return null;
    let swatch = this.getSwatch(opt);
    if(swatch && swatch.name) return this.template.escape(swatch.name);
    return super.getOptionName(opt);
  }
}