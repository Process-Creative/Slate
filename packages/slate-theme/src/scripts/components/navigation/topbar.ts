import { Carousel, carouselInit } from "../../objects/widgets/carousel";

const SELECTOR_CONTAINER = '[data-topbar]';
const SELECTOR_CAROUSEL = '[data-topbar-carousel]';
const SELECTOR_LEFT = '[data-topbar-left]';
const SELECTOR_RIGHT = '[data-topbar-right]';

/**
 * Initializes the Top Bar component and its' carousel (if present).
 * 
 * @param initParams Params used for initialization.
 */
const topbarInit = (initParams:{ container:HTMLDivElement }) => {
  const { container } = initParams;

  const carouselElement = container.querySelector<HTMLDivElement>(SELECTOR_CAROUSEL);
  const btnLeftElement = container.querySelector<HTMLButtonElement>(SELECTOR_LEFT);
  const btnRightElement = container.querySelector<HTMLButtonElement>(SELECTOR_RIGHT);

  let carousel:Carousel;
  if(carouselElement) {
    carousel = carouselInit({
      container: carouselElement,
      sliderOptions: { loop: true }
    });
  }
  btnLeftElement?.addEventListener('click', e => carousel?.prev());
  btnRightElement?.addEventListener('click', e => carousel?.next());
};

// Initialize
document
  .querySelectorAll<HTMLDivElement>(SELECTOR_CONTAINER)
  .forEach(elementContainer => topbarInit({ container: elementContainer }))
;