import { Facet } from './../Facet';
import * as Consts from './../../../constant/Constants';
import * as $ from 'jquery';

export const decorateButtonFacet = (FacetType) => {
  return class extends FacetType {
    constructor(params) {
      super(params);

      this.container.on('click', '[data-button-facet]', e => this.onButtonClick(e));
    }

    getPrint(e) {
      let options = this.getOptionsToDraw();
      return options.reduce((x,option) => {
        let isSelected = this.isSelected(option);

        return x += `
          <button
            type="button" class="o-btn is-large ${isSelected?'is-active':''}"
            data-button-facet data-option="${option}"
          >
            ${this.getOptionName(option)}
          </button>
        `;
      },'');
      return x;
    }

    onButtonClick(e) {
      e.preventDefault();
      e.stopPropagation();
      let self = $(e.currentTarget);
      let option = self.attr('data-option');
      this.setOption(option, !this.filter.getSetting(option));
    }
  }
}
