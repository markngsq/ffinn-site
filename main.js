/* ═══════════════════════════════════════════
   FFINN — main.js
   Accordion, back-to-top, drag-scroll reviews.
   No dependencies.
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Scroll progress bar ──────────────────
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (scrolled / total * 100) + '%';
    }, { passive: true });
  }

  // ── Scroll reveal ─────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(el => observer.observe(el));
  }

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

  // ── Contact form (Cloudflare function) ───
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');
  const submittedAtField = document.getElementById('submittedAt');

  if (contactForm && contactStatus) {
    if (submittedAtField) submittedAtField.value = String(Date.now());

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const payload = {
        name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        subject: String(formData.get('subject') || '').trim(),
        message: String(formData.get('message') || '').trim(),
        submittedAt: Number(formData.get('submittedAt') || 0),
        company: String(formData.get('company') || '').trim(),
      };

      if (!payload.name || !payload.email || !payload.subject || !payload.message) {
        contactStatus.textContent = 'Please fill in all fields.';
        return;
      }

      const submitMs = Date.now() - (payload.submittedAt || Date.now());
      if (submitMs < 2500) {
        contactStatus.textContent = 'Please take a moment, then try again.';
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      contactStatus.textContent = 'Sending...';

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Request failed');

        contactForm.reset();
        if (submittedAtField) submittedAtField.value = String(Date.now());
        contactStatus.textContent = 'Thanks, your message was sent.';
      } catch {
        contactStatus.textContent = 'Sorry, send failed. Please try again in a minute.';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

})();
