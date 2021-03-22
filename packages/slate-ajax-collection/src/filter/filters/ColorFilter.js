import { VariantOptionFilter } from './VariantOptionFilter';
import { COLOR_OPTIONS } from './../../constant/Constants';
import { handlize } from '@process-creative/slate-theme-tools';

export class ColorFilter extends VariantOptionFilter {
  constructor(template, handle, operation, defaultMode) {
    super(template, handle, operation, COLOR_OPTIONS, defaultMode);
    if(!Swatches) throw new Error("Cannot find Swatches, make sure this is setup.");
  }
  
  getSwatchByColor(color) {
    if(!color) return null;
    let colorHandle = handlize(color);
    return Swatches.find(s => {
      if(s.name && handlize(s.name) == colorHandle) return true;
      return (s.handles||[]).find(h => h && h == colorHandle);
    });
  }

  getOptionValue(opt) {
    return this.getSwatchByColor(opt) || opt;
  }
}