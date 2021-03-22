import { Sorter } from './Sorter';
import * as SortMethods from './../methods/';

import * as $ from 'jquery';

export class SelectSorter extends Sorter {
  constructor(template, sortElement) {
    super(template);
    this.sortElement = sortElement;
    sortElement.on('change', e => this.onChange(e));
  }

  onChange(e) {
    let element = $(e.currentTarget);
    this.template.sort.setSort(element.val());
  }

  onUpdate(selected) {
    window.test = SortMethods;
    let x = Object.entries(SortMethods).map(([key,value]) => {
      //Skip invalid elements
      if(!value || !value.isVisible) return '';
      if(!value.isVisible(this.template)) return '';

      //Is checked?
      let checked = selected === value;

      //Generate print.
      return `<option value="${value.handle}" ${checked?'selected':''}>${this.getOptionName(value, checked)}</option>`;
    }).join('');
    this.sortElement.html(x);
  }
}
