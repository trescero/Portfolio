import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin.js';

export default class Scroller {
  constructor(element) {
    // console.log('🚀 Scroller constructor called');
    // console.log('Element:', element);

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

    this.options = {
      hasSkew: false,
      hasPinItems: false,
    };

    this.element = element;
    this.scroller = null;

    this.setOptions();
    this.init();

    // Try initializing IMMEDIATELY first
    // console.log('⏰ Calling initHashNavigation immediately');
    this.initHashNavigation();

    // console.log('⏰ Setting timeout for handleInitialHash');
    // Handle initial hash after a delay
    setTimeout(() => {
      // console.log('⏰ Timeout fired, calling handleInitialHash');
      this.handleInitialHash();
    }, 500);
  }

  init() {
    // console.log('Scroller.init() start');
    this.scroller = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      smoothTouch: 0.1,
      normalizeScroll: true,
      onUpdate: this.onUpdateScroll.bind(this),
      onStop: this.onStopScroll.bind(this),
      ease: 'expo.out',
    });

    // console.log('ScrollSmoother created:', this.scroller);
  }

  initHashNavigation() {
    this.handleLinkClick = (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');

      if (href && href.includes('#')) {
        const hashIndex = href.lastIndexOf('#');
        const path = href.substring(0, hashIndex);
        const hash = href.substring(hashIndex + 1);

        if (!hash) return;

        const currentPath = window.location.pathname;
        let currentPage = currentPath.split('/').pop();

        if (!currentPage || currentPage === '' || currentPath.endsWith('/')) {
          currentPage = 'index.html';
        }

        const isCurrentPage =
          !path ||
          path === '' ||
          path === 'index.html' ||
          path === './index.html' ||
          path === '/index.html' ||
          path.endsWith('/' + currentPage) ||
          path.endsWith(currentPage);

        if (isCurrentPage) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          const targetElement = document.getElementById(hash);

          if (targetElement) {
            if (this.scroller) {
              this.scroller.scrollTo(targetElement, true, 'top 100px');

              document.documentElement.classList.remove('nav-is-active');

              window.history.pushState(null, null, `#${hash}`);
            } else {
              console.error('❌ Scroller not initialized!');
            }
          } else {
            console.warn('❌ Target element not found:', hash);
          }

          return false;
        } else {
        }
      }
    };

    document.addEventListener('click', this.handleLinkClick, true);

    window.addEventListener('popstate', () => {
      if (window.location.hash) {
        const hash = window.location.hash.slice(1);

        const targetElement = document.getElementById(hash);
        if (targetElement && this.scroller) {
          this.scroller.scrollTo(targetElement, true, 'top 100px');
        }
      }
    });
  }

  handleInitialHash() {
    if (window.location.hash) {
      const hash = window.location.hash.slice(1);

      const targetElement = document.getElementById(hash);

      if (targetElement && this.scroller) {
        setTimeout(() => {
          this.scroller.scrollTo(targetElement, false, 'top 100px');

          ScrollTrigger.refresh();
        }, 500);
      }
    }
  }

  //SKEW

  onUpdateScroll(self) {
    if (this.options.hasSkew === true) this.updateSkew(self);
  }

  onStopScroll(self) {
    if (this.options.hasSkew === true) this.stopSkew(self);
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
        start: 'top top',
        end: '+=500px',
      });
    }
  }

  //HORIZ
  initHoriz() {
    const sectionHoriz = this.element.querySelector('.js-horiz');

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
        start: 'center center',
        end: () => '+=' + (sectionHoriz.offsetWidth + buffer),
      },
    });
  }

  initStack() {
    const stackSection = this.element.querySelector('.js-stack');
    const cards = stackSection.querySelectorAll('.js-stack-card');
    const stackOffset = 40;

    cards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'center center',
        pin: true,
        pinSpacing: false,
        endTrigger: cards[cards.length - 1],
        end: 'center center',
        force3D: true,
      });

      const cardsBelow = cards.length - index - 1;
      if (cardsBelow > 0) {
        gsap.fromTo(
          card,
          { y: 0 },
          {
            y: -stackOffset * cardsBelow,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: cards[index + 1],
              start: 'center center',
              end: `center+=${stackOffset * cardsBelow} center`,
              scrub: true,
              onEnter: () => gsap.set(card, { opacity: 0 }),
              onLeaveBack: () => gsap.set(card, { opacity: 1 }),
            },
          }
        );
      }
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

    if (this.element.querySelector('.js-stack')) {
      this.initStack();
    }
  }
}
