/* ═══════════════════════════════════════════
   FFINN — main.js
   Accordion only. No dependencies.
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // Wrap each accordion body's children in .accordion-inner
  // (required for the CSS grid-template-rows animation trick)
  document.querySelectorAll('.accordion-body').forEach(body => {
    const inner = document.createElement('div');
    inner.className = 'accordion-inner';
    while (body.firstChild) inner.appendChild(body.firstChild);
    body.appendChild(inner);
  });

  // Accordion toggle
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item    = header.closest('.accordion-item');
      const body    = item.querySelector('.accordion-body');
      const toggle  = header.querySelector('.acc-toggle');
      const isOpen  = header.getAttribute('aria-expanded') === 'true';

      // Close all open items
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        const otherHeader = otherItem.querySelector('.accordion-header');
        const otherBody   = otherItem.querySelector('.accordion-body');
        const otherToggle = otherItem.querySelector('.acc-toggle');

        otherHeader.setAttribute('aria-expanded', 'false');
        otherBody.classList.remove('open');
        otherToggle.textContent = '+';
      });

      // If this one was closed, open it
      if (!isOpen) {
        header.setAttribute('aria-expanded', 'true');
        body.classList.add('open');
        toggle.textContent = '−';
      }
    });
  });

})();
