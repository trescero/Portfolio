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

  // Handle hash navigation - works for links ANYWHERE on the page (including header)
  initHashNavigation() {
    // console.log('Initializing hash navigation');

    // Store bound handler so we can debug it
    this.handleLinkClick = (e) => {
      // Find if click was on or inside a link
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      // console.log('Link clicked, href:', href);

      // Check if it's a hash link
      if (href && href.includes('#')) {
        // Split on the LAST # to handle edge cases
        const hashIndex = href.lastIndexOf('#');
        const path = href.substring(0, hashIndex);
        const hash = href.substring(hashIndex + 1);

        if (!hash) return; // No hash part, let it navigate normally

        // console.log('Path:', path, 'Hash:', hash);

        // Get current page filename
        const currentPath = window.location.pathname;
        let currentPage = currentPath.split('/').pop();

        // If we're at root or no file specified, assume index.html
        if (!currentPage || currentPage === '' || currentPath.endsWith('/')) {
          currentPage = 'index.html';
        }

        // console.log('Current page:', currentPage);

        // Check if link is for current page
        // Handle: #projects, index.html#projects, ./index.html#projects, /index.html#projects
        const isCurrentPage =
          !path ||
          path === '' ||
          path === 'index.html' ||
          path === './index.html' ||
          path === '/index.html' ||
          path.endsWith('/' + currentPage) ||
          path.endsWith(currentPage);

        // console.log('Is current page?', isCurrentPage);

        if (isCurrentPage) {
          // console.log('✓ Same page hash link - preventing default and scrolling');
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation(); // Stop ALL other handlers

          const targetElement = document.getElementById(hash);

          if (targetElement) {
            // console.log('Target element found, scrolling to:', hash);

            if (this.scroller) {
              // Smooth scroll with GSAP
              this.scroller.scrollTo(targetElement, true, 'top 100px');

              // Update URL
              window.history.pushState(null, null, `#${hash}`);
            } else {
              console.error('❌ Scroller not initialized!');
            }
          } else {
            console.warn('❌ Target element not found:', hash);
          }

          return false; // Extra prevention
        } else {
          // console.log('Different page - allowing normal navigation');
        }
      }
    };

    // Listen to ALL clicks on the entire document with CAPTURE phase
    // This ensures we catch the event before any other handlers
    document.addEventListener('click', this.handleLinkClick, true);

    // console.log('✓ Click listener attached to document');

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      if (window.location.hash) {
        const hash = window.location.hash.slice(1);
        // console.log('Popstate - navigating to:', hash);

        const targetElement = document.getElementById(hash);
        if (targetElement && this.scroller) {
          this.scroller.scrollTo(targetElement, true, 'top 100px');
        }
      }
    });
  }

  // Handle hash present on initial page load
  handleInitialHash() {
    if (window.location.hash) {
      const hash = window.location.hash.slice(1);
      // console.log('Initial hash detected:', hash);

      const targetElement = document.getElementById(hash);

      if (targetElement && this.scroller) {
        // Wait for page to fully load and render
        setTimeout(() => {
          // console.log('Scrolling to initial hash:', hash);
          this.scroller.scrollTo(targetElement, false, 'top 100px');

          // Refresh ScrollTrigger to recalculate positions
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
        start: 'center center',
        end: '+=500px',
        markers: true,
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
