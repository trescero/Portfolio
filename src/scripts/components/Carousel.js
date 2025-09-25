import Swiper from 'swiper/bundle';

export default class Carousel {
  constructor(element) {
    this.element = element;
    this.options = {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: this.element.querySelector('.swiper-pagination'),
      },
      navigation: {
        nextEl: this.element.querySelector('.swiper-button-next'),
        prevEl: this.element.querySelector('.swiper-button-prev'),
      },
      breakpoints: {},
      autoplay: false,
      loop: false,
    };

    this.init();
  }

  setOptions() {
    if ('split1' in this.element.dataset) {
      this.options.breakpoints = {
        1440: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 2.5,
        },
        768: {
          slidesPerView: 2,
        },
        0: {
          slidesPerView: 1,
        },
      };
    }

    if ('split2' in this.element.dataset) {
      this.options.breakpoints = {
        1440: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 2.5,
        },
        768: {
          slidesPerView: 2,
        },
        560: {
          slidesPerView: 1.3,
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
    console.log('initialisation de ma composante Carousel');

    this.setOptions();

    const swiper = new Swiper(this.element, this.options);
    console.log(swiper);
  }
}
