import { carouselQuery } from "../../tools/carousel";
import '../../settings/responsive';
import { responsiveQuery } from "../../settings/responsive";
import { carouselWidgetCreate } from "../../objects/widgets/carousel";


document.querySelectorAll<HTMLDivElement>('[data-featured-collections]').forEach(container => {
  carouselWidgetCreate({
    container,
    options: {
      loop: true,
      slidesPerView: 1.33,
      breakpoints: {
        [responsiveQuery('SMALL')]:   { slidesPerView: 2.5  },
        [responsiveQuery('MEDIUM')]:  { slidesPerView: 3    },
        [responsiveQuery('LARGE')]:   { slidesPerView: 3.5  },
        [responsiveQuery('XLARGE')]:  { slidesPerView: 4    }
      }
    }
  });
});