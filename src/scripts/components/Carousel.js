import Swiper from 'swiper/bundle';
import { Mousewheel } from 'swiper/modules';

export default class Carousel {
  constructor(element) {
    this.element = element;
    this.options = {
      slidesPerView: 1.5,
      centeredSlides: false,
      spaceBetween: 40,
      slideToClickedSlide: true,
      grabCursor: true,
      watchSlidesProgress: true,
      watchOverflow: true,
      breakpoints: {},
      autoplay: false,
      loop: false,
      speed: 1200,

      /* effect: 'coverflow',
      coverflowEffect: {
        rotate: 0,
        slideShadows: false,
        scale: 0.8,
        depth: 0,
      }, */

      pagination: {
        el: this.element.querySelector('.swiper-pagination'),
      },
      navigation: {
        nextEl: this.element.querySelector('.swiper-button-next'),
        prevEl: this.element.querySelector('.swiper-button-prev'),
      },
      scrollbar: {
        el: this.element.querySelector('.swiper-scrollbar'),
      },
    };

    this.init();
  }

  setOptions() {
    if ('split1' in this.element.dataset) {
      this.options.breakpoints = {
        768: {
          slidesPerView: 1.5,
        },
        480: {
          slidesPerView: 1.2,
        },
        0: {
          slidesPerView: 1,
        },
      };
    }

    if ('autoplay' in this.element.dataset) {
      this.options.autoplay = {
        delay: 6000,
        pauseOnMouseEnter: false,
        disableOnInteraction: false,
      };
    }

    if ('loop' in this.element.dataset) {
      this.options.loop = true;
    }

    if ('slides' in this.element.dataset) {
      this.options.slidesPerView =
        parseFloat(this.element.dataset.slides) || this.options.slidesPerView;
    }

    if ('gap' in this.element.dataset) {
      this.options.spaceBetween =
        parseFloat(this.element.dataset.slides) || this.options.slidesPerView;
    }
  }

  init() {
    /* console.log('initialisation de ma composante Carousel'); */

    this.setOptions();

    const swiper = new Swiper(this.element, this.options);
    console.log(swiper);
  }
}
