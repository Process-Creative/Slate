import KeenSlider, { TOptionsEvents } from 'keen-slider';
import { CLASS_ACTIVE, CLASS_INITIALIZED } from './../../tools/classes';
import { eventAdd } from './../../tools/events';

type CarouselSliderOptions = {
  autoplayEnabled?:boolean;
  autoplaySpeed?:number;
} & TOptionsEvents;

type CarouselInitParams = {
  container?:HTMLElement|null;
  slides?:HTMLElement[];

  sliderOptions?:CarouselSliderOptions

  classContainer?:string;
  classSlide?:string;
  classActiveSlide?:string;
  classInitialized?:string;
};

export type CarouselState = {
  destroyed:boolean;
  interval:NodeJS.Timeout|null;
  rect:DOMRect;
}

export type Carousel = {
  keenSlider:KeenSlider,
  slides:HTMLElement[],
  keenRefresh:()=>void,
  state:CarouselState;
  isDestroyed:()=>boolean;
  next:()=>void;
  prev:()=>void;
};

const CLASS_SLIDE = 'keen-slider__slide';
const CLASS_CONTAINER = 'keen-slider';

/**
 * Initializes a new Keen Carousel.
 * 
 * @param p Information about the carousel being initialized.
 * @returns The carousel's context, or null if not initialized.
 */
export const carouselInit = (p:CarouselInitParams):Carousel|null => {
  const { container } = p;

  // Confirm container is valid.
  if(!container) return null;

  let keenSlider:KeenSlider;
  let sliderOptions:CarouselSliderOptions = p.sliderOptions || {};

  // Init defaults
  let classSlide = p.classSlide || CLASS_SLIDE;
  let classActive = p.classActiveSlide || CLASS_ACTIVE;
  let classInitialized = p.classInitialized || CLASS_INITIALIZED;
  let classContainer = p.classContainer || CLASS_CONTAINER;
  let autoplaySpeed = sliderOptions.autoplaySpeed || 10;

  container.classList.add(classContainer);

  // Determine carousel slides
  let slides:HTMLElement[] = [];
  if(p.slides) {
    slides = p.slides;
  } else {
    slides = [];
    container.childNodes.forEach(containerChild => {
      const containerChildCast = containerChild as HTMLElement;
      if(typeof containerChildCast.classList === typeof undefined) return;
      slides.push(containerChildCast);
    });
  }
  if(slides.length < 2) return null;
  slides.forEach(s => s.classList.add(classSlide));

  // State system. Keen's state system is horrible so we use this as a patch
  let state:CarouselState = {
    destroyed: false,
    interval: null,
    rect: container.getBoundingClientRect()
  };

  // Autoplay
  let autoplayTimeout:NodeJS.Timeout;
  let autoplayState:boolean;
  const autoplayStateSet = (enabled?:boolean) => {
    autoplayState = !!enabled;
    if(!enabled) return clearTimeout(autoplayTimeout);
    autoplayTimeout = setTimeout(() => {
      if(!autoplayState) return;
      autoplayStateSet(autoplayState); 
      keenSlider.next();
    }, autoplaySpeed * 1000);
  }

  // Events for Autoplay
  const removeMouseOver = eventAdd({
    element: container, event: 'mouseover',
    callback: e => autoplayStateSet(false)
  })
  const removeMouseOut = eventAdd({
    element: container, event: 'mouseout',
    callback: e => autoplayStateSet(sliderOptions.autoplayEnabled)
  });

  autoplayStateSet(sliderOptions.autoplayEnabled);

  // Update active class
  const classUpdate = (slider:KeenSlider) => {
    const slideIdx = slider.details().relativeSlide;
    const slide = slides[slideIdx];
    if(!slide) return;

    // Manage slide classes
    slides.forEach(slide => slide.classList.remove(classActive));
    slide.classList.add(classActive);
  }

  // Refresh tool. Fixes some issues with keen.
  const keenRefresh = () => {
    if(state.destroyed) return;
    keenSlider.refresh();
    const resizeEvent = window.document.createEvent('UIEvents'); 
    resizeEvent.initEvent('resize', true, false); 
    window.dispatchEvent(resizeEvent);
  }

  // Construct the slider
  keenSlider = new KeenSlider(container, {
    ...sliderOptions, 
    dragStart: () => autoplayStateSet(false),
    dragEnd: () => autoplayStateSet(sliderOptions.autoplayEnabled),
    slideChanged: slider => classUpdate(slider),

    mounted: slider => {
      if(!state.destroyed) return;
      state.destroyed = false;
      container.classList.add(classInitialized);
      classUpdate(slider);

      // This is a hack I'm doing to fix issues with mounting and widths
      state.interval = setInterval(() => {
        let oldRect = state.rect;
        state.rect = container.getBoundingClientRect();
        const testResize = (l:number,r:number) => {
          return Math.abs(Math.floor(l - r)) < 10;
        };
        if((
          testResize(oldRect.width, state.rect.width) && 
          testResize(oldRect.height, state.rect.height)
        )) return;
        keenRefresh();
      }, 100);
    },

    
    destroyed: slider => {
      if(state.destroyed) return;

      if(state.interval) clearInterval(state.interval);
  
      container.classList.remove(classInitialized);
      slides.forEach(slide => {
        slide.classList.remove(classActive);
        slide.removeAttribute('style');
      });
  
      state.destroyed = true;
      requestAnimationFrame(() =>{
        if(!state.destroyed) return;
        container.classList.remove(classContainer);
        removeMouseOver();
        removeMouseOut();
        slider.destroy()
      });
    },

    created: slider => {
      // On created - refresh slider. Resolves some keen issues
      requestAnimationFrame(() => {
        if(state.destroyed) return;
        keenRefresh();
      });
  
      setTimeout(() => keenRefresh(), 100);
      setTimeout(() => keenRefresh(), 500);
    },
  });


  return {
    keenSlider, slides, keenRefresh, state,
    isDestroyed: () => state.destroyed,

    next: () => keenSlider.next(),
    prev: () => keenSlider.prev()
  }
}

/**
 * Set's up button(s) to listen for prev and or next click events.
 * 
 * @param p The information about the buttons and carousel.
 * @returns The button listener context.
 */
export const carouselAddButtons = (p:{
  carousel?:Carousel|null, elementPrev?:HTMLElement|null,
  elementNext?:HTMLElement|null
}) => {
  const { elementPrev, elementNext, carousel } = p;
  if(!carousel) return null;
  
  const removePrev = elementPrev ? eventAdd({
    element: elementPrev, event: 'click', callback: e => carousel.prev()
  }) : null;

  const removeNext = elementNext ? eventAdd({
    element: elementNext, event: 'click', callback: e => carousel.next()
  }) : null;
  
  return { removePrev, removeNext, carousel };
}

/**
 * Attempts to initialize a carousel and all the child components from a set of
 * selectors and a wrapping container. Especially useful for single sections.
 * 
 * @param p Information to query the carousel on
 * @returns The initialized carousel (if any)
 */
export const carouselQuery = (p:{
  element:HTMLElement,
  selectorCarousel:string;
  selectorNext?:string;
  selectorPrev?:string;
  sliderOptions?:CarouselSliderOptions
}) => {
  // Query children
  const [
    elementCarousel, elementPrev, elementNext
  ] = [
    p.selectorCarousel, p.selectorPrev, p.selectorNext
  ].map(selector => {
    return selector ? p.element.querySelector<HTMLElement>(selector) : null;
  });

  // Init carousel
  return carouselAddButtons({
    elementPrev, elementNext,
    carousel: carouselInit({
      container: elementCarousel,
      sliderOptions: p.sliderOptions || { loop: true }
    })
  });
}