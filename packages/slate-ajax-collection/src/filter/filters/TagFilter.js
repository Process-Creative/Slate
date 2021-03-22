import { OperativeFilter, OPERATION_AND, OPERATION_OR } from './OperativeFilter';

export class TagFilter extends OperativeFilter {
  constructor(template, handle, operation, initialTags) {
    super(template, handle, operation);

    this.tags = (initialTags || []).map(tag => tag.toLowerCase());
  }

  getSettings() { return this.tags; }

  getSetting(tag) {
    if(!tag) return this.tags;
    return this.tags.indexOf(tag.toLowerCase()) !== -1;
  }

  setSetting(tag, value) {
    if(value) return this.addTag(tag);
    this.removeTag(tag);
  }

  setSettings(tags) {
    if(!Array.isArray(tags)) tags = [ tags ];
    this.tags = tags.filter(t => t).map(tag => tag.toLowerCase());
    this.filters.onFilterUpdate();
  }

  addTag(tag) {
    if(this.getSetting(tag)) return;
    this.tags.push(tag.toLowerCase());
    this.filters.onFilterUpdate();
  }

  removeTag(tag) {
    tag = tag.toLowerCase();
    let index = this.tags.indexOf(tag)
    if(index === -1) return;
    this.tags.splice(index, 1);
    this.filters.onFilterUpdate();
  }

  filterAnd(p,v) {
    if(!this.tags.length) return true;
    return this.tags.every(tag => {
      return p.tags.some(productTag => tag.toLowerCase() === productTag.toLowerCase());
    });
  }

  filterOr(p,v) {
    if(!this.tags.length) return true;
    return this.tags.some(tag => {
      return p.tags.some(productTag => tag.toLowerCase() === productTag.toLowerCase());
    });
  }
}
