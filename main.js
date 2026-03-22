/* ═══════════════════════════════════════════
   FFINN — main.js
   Accordion, back-to-top, drag-scroll reviews.
   No dependencies.
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Accordion ────────────────────────────
  document.querySelectorAll('.accordion-body').forEach(body => {
    const inner = document.createElement('div');
    inner.className = 'accordion-inner';
    while (body.firstChild) inner.appendChild(body.firstChild);
    body.appendChild(inner);
  });

  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item   = header.closest('.accordion-item');
      const body   = item.querySelector('.accordion-body');
      const toggle = header.querySelector('.acc-toggle');
      const isOpen = header.getAttribute('aria-expanded') === 'true';

      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.accordion-body').classList.remove('open');
        otherItem.querySelector('.acc-toggle').textContent = '+';
      });

      if (!isOpen) {
        header.setAttribute('aria-expanded', 'true');
        body.classList.add('open');
        toggle.textContent = '−';
      }
    });
  });

  // ── Back to top ──────────────────────────
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Reviews drag-scroll ──────────────────
  const reviewsOuter = document.querySelector('.reviews-scroll-outer');
  if (reviewsOuter) {
    let isDown = false, startX, scrollLeft;

    reviewsOuter.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX - reviewsOuter.offsetLeft;
      scrollLeft = reviewsOuter.scrollLeft;
    });
    reviewsOuter.addEventListener('mouseleave', () => { isDown = false; });
    reviewsOuter.addEventListener('mouseup',    () => { isDown = false; });
    reviewsOuter.addEventListener('mousemove',  e => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - reviewsOuter.offsetLeft;
      const walk = (x - startX) * 1.5;
      reviewsOuter.scrollLeft = scrollLeft - walk;
    });
  }

  // ── Review navigation arrows ─────────────
  const prevBtn = document.querySelector('.review-nav-prev');
  const nextBtn = document.querySelector('.review-nav-next');
  
  if (prevBtn && nextBtn && reviewsOuter) {
    const scrollAmount = 360; // card width + gap
    
    prevBtn.addEventListener('click', () => {
      reviewsOuter.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
      reviewsOuter.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

})();
