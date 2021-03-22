import { Filter } from './Filter';

export class TypeFilter extends Filter {
  constructor(template, handle, types) {
    super(template,handle);

    this.types = types || [];
  }

  getSettings() {return this.types;}

  getSetting(type) {
    if(!type) return this.types;
    return this.types.indexOf(type) !== -1;
  }

  setSetting(type, value) {
    if(value) return this.addType(type);
    this.removeType(type);
  }

  setSettings(types) {
    if(!Array.isArray(types)) types = [ types ];
    this.types = [ ...types ].filter(t => t);
    this.filters.onFilterUpdate();
  }

  addType(type) {
    if(this.getSetting(type)) return;
    this.types.push(type);
    this.filters.onFilterUpdate();
  }

  removeType(type) {
    let index = this.types.indexOf(type);
    if(type === -1) return;
    this.types.splice(index, 1);
    this.filters.onFilterUpdate();
  }

  filter(p,v) {
    if(!this.types.length) return true;
    return this.types.some(type =>  p.type === type);
  }
}
