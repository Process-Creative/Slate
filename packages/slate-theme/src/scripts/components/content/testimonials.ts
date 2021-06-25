import { carouselQuery } from "../../objects/widgets/carousel";
import '../../settings/responsive';
import { responsiveQuery } from "../../settings/responsive";

const CSS_PROPERTY = '--c-testimonials-progress';

document.querySelectorAll<HTMLDivElement>('[data-testimonials]').forEach(container => {
  const progress = container.querySelector<HTMLDivElement>('[data-testimonials-carousel-progress]');
  carouselQuery({
    element: container,
    selectorCarousel: '[data-testimonials-carousel]',
    sliderOptions: {
      loop: true,
      slidesPerView: 1.33,
      breakpoints: {
        [responsiveQuery('SMALL')]:   { slidesPerView: 2.5  },
        [responsiveQuery('MEDIUM')]:  { slidesPerView: 3    },
        [responsiveQuery('LARGE')]:   { slidesPerView: 3.5  },
        [responsiveQuery('XLARGE')]:  { slidesPerView: 4    }
      },
      move: instance => {
        const d = instance.details();
        const prc = (d.progressTrack + (1 / d.positions.length)) * 100 % 100.01;
        progress?.style.setProperty(CSS_PROPERTY, prc.toFixed(0)+'%');
      }
    }
  });
});