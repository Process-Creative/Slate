import { Carousel, carouselInit } from "../../objects/widgets/carousel";
import './topbar.scss';

const SELECTOR_CONTAINER = '[data-topbar]';
const SELECTOR_CAROUSEL = '[data-topbar-carousel]';

/**
 * Initializes the Top Bar component and its' carousel (if present).
 * 
 * @param initParams Params used for initialization.
 */
const topbarInit = (initParams:{ container:HTMLDivElement }) => {
  const { container } = initParams;

  // Carousel Init
  const carouselElement = container.querySelector<HTMLDivElement>(SELECTOR_CAROUSEL);
  let carousel:Carousel;
  if(carouselElement) {
    carousel = carouselInit({ container: carouselElement });
  }
  
};

// Initialize
document
  .querySelectorAll<HTMLDivElement>(SELECTOR_CONTAINER)
  .forEach(elementContainer => topbarInit({ container: elementContainer }))
;