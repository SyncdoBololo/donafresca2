'use strict';

(() => {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;
  const select = selector => document.querySelector(selector);
  const selectAll = selector => [...document.querySelectorAll(selector)];

  gsap.registerPlugin(ScrollTrigger);
  const preferenceKey = 'donafresca-motion';
  const savedPreference = localStorage.getItem(preferenceKey);
  const systemReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reducedMotion = savedPreference === 'reduce' || (savedPreference !== 'full' && systemReduced);
  const motionToggle = select('#motion-toggle');
  if (motionToggle) {
    motionToggle.textContent = reducedMotion ? 'Ativar movimento' : 'Reduzir movimento';
    motionToggle.setAttribute('aria-pressed', String(!reducedMotion));
    motionToggle.addEventListener('click', () => {
      localStorage.setItem(preferenceKey, reducedMotion ? 'full' : 'reduce');
      location.reload();
    });
  }
  if (reducedMotion) {
    document.documentElement.classList.add('motion-reduced');
    return;
  }

  document.documentElement.classList.add('motion-enabled');
  gsap.config({ force3D: true, nullTargetWarn: false });

  const reveal = (trigger, targets, options = {}) => {
    gsap.from(targets, {
      y: options.y ?? 30,
      x: options.x ?? 0,
      autoAlpha: options.opacity ?? 0,
      duration: options.duration ?? 0.72,
      stagger: options.stagger ?? 0.1,
      ease: options.ease ?? 'power3.out',
      clearProps: 'transform,opacity,visibility',
      scrollTrigger: {
        trigger,
        start: options.start ?? 'top 82%',
        once: true,
      },
    });
  };

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .from('.site-header .brand', { y: -18, autoAlpha: 0, duration: 0.55 })
    .from('.desktop-nav > *, .location, .menu-toggle', { y: -10, autoAlpha: 0, duration: 0.42, stagger: 0.045 }, '<0.06')
    .from('.hero-title-art', { y: 34, autoAlpha: 0, duration: 0.78 }, '<0.12')
    .from('#hero-description', { y: 18, autoAlpha: 0, duration: 0.58 }, '<0.34')
    .from('.hero-copy .button', { y: 14, autoAlpha: 0, duration: 0.48 }, '<0.22')
    .from('.hero-index > *', { scale: 0.78, autoAlpha: 0, duration: 0.38, stagger: 0.045, ease: 'back.out(1.8)' }, '<0.04')
    .from('.scroll-cue', { y: 10, autoAlpha: 0, duration: 0.4 }, '<');

  reveal('.quality', '.quality-copy > *', { y: 34, stagger: 0.11 });
  reveal('.species', '.species > *', { x: -20, y: 0, stagger: 0.065, start: 'top 84%' });
  reveal('.offer-copy', '.offer-copy > *', { x: 28, y: 0, stagger: 0.1 });
  reveal('.history', '.history-copy > *', { x: -38, y: 0, stagger: 0.12, start: 'top 76%' });
  reveal('footer', '.footer-grid > *', { y: 24, stagger: 0.09, start: 'top 92%' });

  gsap.from('.history-top', {
    scaleX: 0.72,
    transformOrigin: 'left center',
    duration: 1.05,
    ease: 'power2.out',
    clearProps: 'transform',
    scrollTrigger: { trigger: '.history', start: 'top 88%', once: true },
  });

  gsap.from('.callout', {
    y: 18,
    autoAlpha: 0,
    duration: 0.65,
    stagger: 0.11,
    ease: 'power2.out',
    clearProps: 'transform,opacity,visibility',
    scrollTrigger: { trigger: '.history', start: 'top 68%', once: true },
  });

  const media = gsap.matchMedia();
  media.add('(min-width: 801px)', () => {
    gsap.fromTo('.hero-picture',
      { scale: 1.035, yPercent: -1.5 },
      {
        scale: 1.11,
        yPercent: 4.5,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.7 },
      });

    gsap.fromTo('.history',
      { backgroundPosition: '50% 44%' },
      {
        backgroundPosition: '50% 58%',
        ease: 'none',
        scrollTrigger: { trigger: '.history', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      });

    gsap.to('.ghost-left', {
      x: 70,
      rotation: 40,
      ease: 'none',
      scrollTrigger: { trigger: '.quality', start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
    gsap.to('.ghost-right', {
      x: -65,
      rotation: -44,
      ease: 'none',
      scrollTrigger: { trigger: '.quality', start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  });

  window.addEventListener('donafresca:slidechange', () => {
    gsap.killTweensOf(['.hero-title-art', '#hero-description']);
    gsap.fromTo('.hero-title-art', { x: -18, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.48, ease: 'power3.out', clearProps: 'transform,opacity,visibility' });
    gsap.fromTo('#hero-description', { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42, delay: 0.08, ease: 'power2.out', clearProps: 'transform,opacity,visibility' });
  });

  window.addEventListener('donafresca:specieschange', () => {
    gsap.killTweensOf(['#species-title-art', '#species-intro', '#species-description']);
    gsap.fromTo('#species-title-art', { x: 18, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.42, ease: 'power3.out', clearProps: 'transform,opacity,visibility' });
    gsap.fromTo(['#species-intro', '#species-description'], { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.38, stagger: 0.06, ease: 'power2.out', clearProps: 'transform,opacity,visibility' });
    gsap.fromTo('.species-button.selected svg', { x: -9 }, { x: 0, duration: 0.5, ease: 'back.out(1.9)', clearProps: 'transform' });
  });

  window.addEventListener('donafresca:dialogopen', event => {
    const dialog = event.detail.dialog;
    gsap.fromTo(dialog, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.32, ease: 'power3.out', clearProps: 'transform,opacity,visibility' });
    const lead = dialog.querySelectorAll('.dialog-heading > *, .catalog-tools > *, .store-grid > *');
    gsap.fromTo(lead, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.38, stagger: 0.045, delay: 0.06, ease: 'power2.out', clearProps: 'transform,opacity,visibility' });
    if (dialog.id === 'catalog') animateProductCards();
  });

  function animateProductCards() {
    if (!select('#catalog')?.open) return;
    const cards = gsap.utils.toArray('#product-grid .product').slice(0, 12);
    gsap.killTweensOf(cards);
    gsap.fromTo(cards,
      { y: 16, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.34, stagger: 0.025, ease: 'power2.out', clearProps: 'transform,opacity,visibility' });
  }
  window.addEventListener('donafresca:productsrendered', animateProductCards);

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    selectAll('.button').forEach(button => {
      const arrow = button.querySelector('svg');
      if (!arrow) return;
      button.addEventListener('mouseenter', () => gsap.to(arrow, { x: 4, duration: 0.18, ease: 'power2.out' }));
      button.addEventListener('mouseleave', () => gsap.to(arrow, { x: 0, duration: 0.2, ease: 'power2.out' }));
    });
    selectAll('.species-button').forEach(button => {
      const fish = button.querySelector('svg');
      button.addEventListener('mouseenter', () => gsap.to(fish, { x: 6, duration: 0.24, ease: 'power2.out' }));
      button.addEventListener('mouseleave', () => gsap.to(fish, { x: 0, duration: 0.26, ease: 'power2.out' }));
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
})();
