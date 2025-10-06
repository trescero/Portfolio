import { gsap } from 'gsap';

import { ScrollSmoother } from 'gsap/ScrollSmoother.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

export default class Scroller {
  constructor(element) {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    this.options = {
      hasSkew: false,
      hasPinItems: false,
    };

    this.element = element;

    this.setOptions();
    this.init();
  }

  init() {
    const scroller = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      smoothTouch: 0.1,
      onUpdate: this.onUpdateScroll.bind(this),
      onStop: this.onStopScroll.bind(this),
      ease: 'expo.out',
    });
  }

  //SKEW

  onUpdateScroll(self) {
    if ((this.options.hasSkew = true)) this.updateSkew(self);
  }

  onStopScroll(self) {
    if ((this.options.hasSkew = true)) this.stopSkew(self);
  }

  initSkew() {
    /* this.skewSetter = gsap.quickTo('img', 'skewY'); */
  }

  updateSkew(self) {
    const velocity = self.getVelocity();
    const force = 5;
    let skew = gsap.utils.mapRange(-1000, 1000, -force, force, velocity);
    skew = gsap.utils.clamp(-force, force, skew);

    /* this.skewSetter(skew); */
  }

  stopSkew(self) {
    /* this.skewSetter(0); */
  }

  //PIN
  initPins() {
    const pinnedItems = this.element.querySelectorAll('.js-pinned');
    for (let i = 0; i < pinnedItems.length; i++) {
      const pinnedItem = pinnedItems[i];

      ScrollTrigger.create({
        pin: pinnedItem,
        trigger: pinnedItem.parentElement,
        scrub: 2,
        start: 'center center',
        end: '+=500px',
        markers: true,
      });
    }
  }

  //HORIZ
  initHoriz() {
    const sectionHoriz = this.element.querySelector('.js-horiz');

    //QuerySelectrolAll Horiz
    //Boucler dans les section
    //CreateHoriz

    const panels = sectionHoriz.querySelectorAll('.js-panel');
    const nbPanels = panels.length - 1;
    const buffer = 200;

    gsap.to(panels, {
      xPercent: -100 * nbPanels,
      ease: 'none',
      scrollTrigger: {
        pin: true,
        trigger: sectionHoriz,
        scrub: 1,
        snap: 1 / nbPanels,
        end: () => '+=' + (sectionHoriz.offsetWidth + buffer),
      },
    });
  }

  setOptions() {
    if ('skew' in this.element.dataset) {
      this.options.hasSkew = true;
      this.initSkew();
    }

    if ('pinItems' in this.element.dataset) {
      this.options.hasPinItems = true;
      this.initPins();
    }

    if (this.element.querySelector('.js-horiz')) {
      this.initHoriz();
    }
  }
}
