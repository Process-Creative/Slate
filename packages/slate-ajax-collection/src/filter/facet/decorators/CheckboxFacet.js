import { Facet } from './../Facet';
import * as Consts from './../../../constant/Constants';
import * as $ from 'jquery';

export const decorateCheckboxFacet = (FacetType) => {
  return class extends FacetType {
    constructor(params) {
      super(params);

      this.allowMultiple = typeof params.allowMultiple === typeof undefined ? true : params.allowMultiple;

      this.container.on('change', Consts.FACET_CHECKBOX_SELECTOR, e => this.onChange(e));
    }

    //Is Checked for checkboxes, not in sync with the filter due to DOM delays
    isChecked(option) {
      if(!this.getCheckboxElement(option).prop('checked')) return false;
      return true;
    }

    getCheckedOptions() {
      return this.getOptions().filter(o => this.isChecked(o));
    }

    getCheckboxElement(option) {
      return this.container.find(`${Consts.FACET_CHECKBOX_SELECTOR}[${Consts.FACET_CHECKBOX_OPTION}="${option}"]`);
    }

    getPrint(e) {
      let options = this.getOptionsToDraw();
      let x = `<ul class="c-collection-faceted-nav__check-group">`;
      options.forEach((option,i) => {
        x += `<li class="c-collection-faceted-nav__check-item">
          <div class="o-checkbox">
            <input
              type="checkbox" class="o-checkbox__checkbox"
              data-index="${i}" data-option="${this.template.escape(option)}"
              data-facet-checkbox ${this.isSelected(option)?'checked':''}
            />
            <label class="o-checkbox__label">${this.getOptionName(option)}</label>
          </div>
        </li>`;
      });
      x += `</ul>`
      return x;
    }

    onChange(e) {
      let option = $(e.target).attr(Consts.FACET_CHECKBOX_OPTION);
      if(this.allowMultiple) {
        this.setOption(option, this.isChecked(option));
      } else {
        this.setOptions(option);
      }
    }
  }
}
