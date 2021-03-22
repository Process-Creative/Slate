export class Sorter {
  constructor(template) {
    this.template = template;
  }

  onUpdate() {}

  getOptionName(value, checked) {
    return this.template.escape(value.name);
  }
}
