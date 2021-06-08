import { carouselQuery } from "../../objects/widgets/carousel";

document.querySelectorAll<HTMLElement>('[data-topbar]').forEach(container => {
  // Init the carousel
  carouselQuery({
    element: container,
    selectorCarousel: '[data-topbar-carousel]',
    selectorPrev: '[data-topbar-left]',
    selectorNext: '[data-topbar-right]'
  });
});