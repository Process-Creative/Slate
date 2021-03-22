import { FACET_SELECT_SELECTOR } from './../../../constant/Constants';

export const decorateSelectFacet = FacetType => {
  return class extends FacetType {
    constructor(params) {
      super(params);

      this.container.on('change', FACET_SELECT_SELECTOR, e => this.onChange(e));
    }

    getPrint(e) {
      let options = this.getOptionsToDraw();
      return `<select data-facet-select class="c-collection-faceted-nav__select">
        ${options.reduce((x,o) => (
          `${x}<option value="${o}">${this.getOptionName(o)}</option>`
        ),'')}
      </select>`;
    }

    onChange(e) {
      this.setOptions([ $(e.currentTarget).val() ]);
    }
  }
}