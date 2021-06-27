import { carouselQuery, CarouselSliderOptions } from "../../tools/carousel";
import { CLASS_VISIBLE } from "../../tools/classes";

export const SELECTOR_SLIDES = '[data-carousel-slides]';
export const SELECTOR_PROGRESS = '[data-carousel-progress]';
export const PROPERTY_PROGRESS = '--o-carousel-progress';
export const SELECTOR_PREV = '[data-carousel-left]';
export const SELECTOR_NEXT = '[data-carousel-right]';

type CarouselWidgetParams = {
  container:HTMLElement;
  options?:CarouselSliderOptions;
};

/**
 * Initializes a standard carousel widget.
 * 
 * @param p Information about the widget to initialize.
 * @returns The initialized carousel widget.
 */
export const carouselWidgetCreate = (p:CarouselWidgetParams) => {
  const { container } = p;

  // Query elements
  const progress = container.querySelector<HTMLDivElement>(SELECTOR_PROGRESS);

  const carousel = carouselQuery({
    element: container,
    selectorCarousel: SELECTOR_SLIDES,

    selectorPrev: SELECTOR_PREV,
    selectorNext: SELECTOR_NEXT,
    sliderOptions: {
      ...p.options,
      move: instance => {
        
        // On move update the progress bar.
        if(progress) {
          const details = instance.details();
          const percPerSlide = 1/details.size;
          const progPerc = (details.progressTrack + percPerSlide) * 100 % 100.01;
          progress.style.setProperty(PROPERTY_PROGRESS,`${progPerc.toFixed(2)}%`);
        }

        // This code gets the fade effect to work properly.
        if(carousel) {
          const bound = carousel.carousel.container.getBoundingClientRect();
          
          carousel.carousel.slides.forEach(slide => {
            const rect = slide.getBoundingClientRect();
            const halfWidth = rect.width/2;//Not half-wit.
            const diff = rect.left - bound.left;

            const halfInView = (
              diff > -halfWidth &&
              diff < (bound.width-halfWidth)
            );

            if(!halfInView) {
              slide.classList.remove(CLASS_VISIBLE);
            } else {
              slide.classList.add(CLASS_VISIBLE);
            }
          })
        }


        if(p.options?.move) p.options?.move(instance);
      }
    }
  });

  return carousel;
}