import { Facet } from './../';

export class TypeFacet extends Facet {
  constructor(params) {
    super(params);

    let { multiple } = params;
    this.multiple = typeof multiple !== typeof undefined ? multiple : true;
  }

  getOptions() {
    return this.template.data.allTypes || [];
  }

  setOption(o,v) {
    if(this.multiple) {
      return super.setOption(o,v);
    } else {
      if(this.isOptionAll(o)) this.setOptions(null);
      this.setOptions(v ? [ o ] : null);
    }
  }
}
