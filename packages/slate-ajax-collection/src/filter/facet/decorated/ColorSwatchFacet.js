import * as $ from 'jquery';
import { ColorFacet } from '../logic/ColorFacet';
import { handlize } from '@process-creative/slate-theme-tools';

export const SWATCH_FILTER = '[data-swatch-value]';

export class ColorSwatchFacet extends ColorFacet {
  constructor(params) {
    super(params);
    this.container.on('click', SWATCH_FILTER, e => this.onSwatchClick(e));
  }

  getPrint() {
    let options = this.getOptionsToDraw();

    let x = `<div class="c-collection-faceted-nav__swatch-group o-swatch__container is-color">`;
    options.forEach(o => {
      x += this.getSwatch(o);
    });
    x += `</div>`;

    return x;
  }

  getSwatch(o) {
    return `
      <button
        type="button" data-swatch-value="${handlize(o)}"
        class="o-swatch ${this.isSelected(o) ? `is-selected` : ``}"
      >
        <div class="o-swatch__inner o-swatch--color__inner s-swatch--${handlize(o)}">
        </div>
      </button>
    `;
  }

  isSelected(option) {
    return this.filter.getSetting(option);
  }

  onSwatchClick(e) {
    e.preventDefault();
    e.stopPropagation();

    let self = $(e.currentTarget);
    let color = self.attr('data-swatch-value');
    if(self.hasClass('is-selected')) {
      self.removeClass('is-selected');
      this.filter.setSetting(color, false);
    } else {
      self.addClass('is-selected');
      this.filter.setSetting(color, true);
    }
  }

  setOptions(options) {
    //Simply set the options
    this.options = options;
    this.print();
  }
}