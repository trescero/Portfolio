import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin.js';

export default class Scroller {
  constructor(element) {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

    this.options = {
      hasSkew: false,
      hasPinItems: false,
    };

    this.element = element;
    this.scroller = null;

    this.setOptions();
    this.init();

    this.initHashNavigation();

    setTimeout(() => {
      this.handleInitialHash();
    }, 500);
  }

  init() {
    this.scroller = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      smoothTouch: 0.1,
      normalizeScroll: true,
      onUpdate: this.onUpdateScroll.bind(this),
      onStop: this.onStopScroll.bind(this),
      ease: 'expo.out',
    });
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
      const currentPage = currentPath.split('/').pop() || 'index.html';
      
      const linkPage = path.split('/').pop() || 'index.html';

      const isCurrentPage = 
        !path || 
        path === '' || 
        linkPage === currentPage ||
        linkPage === 'index.html' && currentPage === 'index.html';

      if (isCurrentPage) {
        e.preventDefault();
        e.stopPropagation();

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
      }
    }
  };

  document.addEventListener('click', this.handleLinkClick);

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

  //CARD STACK
  initStack() {
    const stackSection = this.element.querySelector('.js-stack');
    const cards = stackSection.querySelectorAll('.js-stack-card');
    const stackOffset = 40;
    const pagination = document.createElement('div');
    pagination.className = 'stack-pagination';
    document.body.appendChild(pagination);

    ScrollTrigger.create({
      trigger: stackSection,
      start: 'top 20%',
      end: 'bottom 80%',
      onEnter: () => (pagination.style.opacity = '1'),
      onLeave: () => (pagination.style.opacity = '0'),
      onEnterBack: () => (pagination.style.opacity = '1'),
      onLeaveBack: () => (pagination.style.opacity = '0'),
    });

    cards.forEach((card, index) => {
      const dot = document.createElement('div');
      dot.className = 'pagination-dot';
      if (index === 0) dot.classList.add('active');
      pagination.appendChild(dot);

      dot.addEventListener('click', () => {
        const smoother = ScrollSmoother.get();
        if (smoother) {
          smoother.scrollTo(card, true, 'center center');
        } else {
          gsap.to(window, {
            scrollTo: {
              y: card,
              offsetY: -window.innerHeight / 2 + card.offsetHeight / 2,
            },
            duration: 1,
            ease: 'power2.inOut',
          });
        }
      });

      ScrollTrigger.create({
        trigger: card,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          document
            .querySelectorAll('.pagination-dot')
            .forEach((d) => d.classList.remove('active'));
          dot.classList.add('active');
        },
        onEnterBack: () => {
          document
            .querySelectorAll('.pagination-dot')
            .forEach((d) => d.classList.remove('active'));
          dot.classList.add('active');
        },
      });

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
