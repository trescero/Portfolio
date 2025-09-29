export default class Bars {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    const bars = this.element.querySelectorAll('.bar');

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const fill = bar.querySelector('.bar-fill');
            const skill = bar.dataset.skill;

            fill.style.width = skill + '%';
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.5 }
    );

    bars.forEach((bar) => {
      bar.querySelector('.bar-fill').style.width = '0%';
      observer.observe(bar);
    });
  }
}
