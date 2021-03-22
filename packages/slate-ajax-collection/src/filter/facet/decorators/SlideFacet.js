import { decorateRangeFacet} from './RangeFacet';

export const ATTR_NAV_SLIDER_RANGE = 'data-slider-range';
export const SELECTOR_FACETED_NAV_SLIDER = `[${ATTR_NAV_SLIDER_RANGE}]`;

export const decorateSlideFacet = (FacetType) => {
  return decorateRangeFacet(class extends FacetType {
    constructor(params) {
      super({ ...params, options: [ 'min-max' ] });

      this.noUiSlider = params.noUiSlider;
      if(!this.noUiSlider) {
        throw new Error(`Missing noUiSlider optional dependency, make sure you do 'yarn add nouislider' and pass it as a param of this constructor`);
      }

      this.drawSlider();
    }

    getRange() {
      let settings = this.filter.getSettings();
      settings = settings.length ? settings[0] : 'min-max';
      return settings.split('-');
    }

    getPrint() {
      let range = this.getRange();

      return `<div class="c-collection-faceted-nav__price-group">
        <div ${ATTR_NAV_SLIDER_RANGE}></div>
          <form>
            <input type="hidden" name="min-value" value="">
            <input type="hidden" name="max-value" value="">
          </form>

          <div class="noUi-results">
            ${ this.formatRange(range[0], range[1]) }
          </div>
      </div>`;
    }

    getRangeMin() {
      return this.filter.getRangeMin ? this.filter.getRangeMin() : 0;
    }

    getRangeMax() {
      return this.filter.getRangeMin ? this.filter.getRangeMax() : 100;
    }

    print() {
      super.print();
      this.drawSlider();
    }

    drawSlider() {
      let el = this.container.find(SELECTOR_FACETED_NAV_SLIDER);
      if(!el.length) return;

      if(typeof this.rangeSlider !== typeof undefined) this.rangeSlider.destroy();

      let [ min, max ] = this.getRange();
      if(!min || min == 'min') min = 0;
      if(!max || max == 'max') max = 0;

      let rangeMin = this.getRangeMin();
      let rangeMax = this.getRangeMax();

      this.rangeElement  = el[0];
      this.rangeSlider = this.noUiSlider.create(this.rangeElement, {
        start: [
          min ? min : rangeMin,
          max ? max : rangeMax
        ],
        step: 1,
        range: {
          'min': [ rangeMin ],
          'max': [ rangeMax ]
        },
        connect: true
      });

      this.rangeElement.noUiSlider.on('change', e => this.onSliderUpdate(e));
    }

    onSliderUpdate(e) {
      let [ min, max ] = e;

      min = parseFloat(min);
      max = parseFloat(max);
      let rangeMin = this.getRangeMin();
      let rangeMax = this.getRangeMax();

      //If within 5% of edge then snap
      if(isNaN(min) || !min || ((min - rangeMin) / (rangeMax - rangeMin)) < 0.05) min = 'min';
      if(isNaN(max) || !max || (rangeMax - max) / rangeMax < 0.05) max = 'max';


      this.setOptions([ `${min}-${max}` ]);
    }

    onProductsDrawn() {
      super.onProductsDrawn();
      this.print();
    }
  });
}
