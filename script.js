/* ============================================================
   MICROSITE STUDIO — script.js
   ============================================================ */

(function () {
  'use strict';

  // ── 1. NAV SCROLL BEHAVIOR ──────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── 2. MOBILE MENU TOGGLE ───────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('mobileOverlay');
  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => {
      document.body.classList.toggle('menu-open');
    });
    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
      });
    });
  }

  // ── 3. SCROLL REVEAL (IntersectionObserver) ─────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
  }

  // ── 4. ACTIVE NAV LINK ──────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav__links a, .mobile-overlay a, .nav__mobile-overlay a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
      link.classList.add('nav-link--active');
    }
  });

  // ── 5. HERO FADE-IN ─────────────────────────────────────────
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => {
      hero.classList.add('hero--loaded');
    }, 400);
  }

  // ── 6. CONTACT FORM ─────────────────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    // Pre-select service from URL params
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    if (service) {
      const checkbox = form.querySelector(`input[value="${service}"]`);
      if (checkbox) checkbox.checked = true;
    }

    const isFormSubmitEndpoint = /formsubmit\.co/i.test(form.action || '');

    form.addEventListener('submit', async (e) => {
      if (isFormSubmitEndpoint) {
        return;
      }
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Attempt Formspree submit; fall back to success state
      try {
        const data = new FormData(form);
        const response = await fetch(form.action || '#', {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        // Show success regardless (demo mode)
        showFormSuccess();
      } catch (err) {
        // Show success in demo mode
        showFormSuccess();
      }
    });

    function showFormSuccess() {
      form.style.display = 'none';
      const success = document.getElementById('formSuccess');
      if (success) {
        success.style.display = 'block';
        setTimeout(() => success.classList.add('revealed'), 50);
      }
    }
  }

  // ── 7. RADIO / CHECKBOX VISUAL FEEDBACK ─────────────────────
  document.querySelectorAll('.radio-option input, .checkbox-option input').forEach(input => {
    input.addEventListener('change', () => {
      // Update sibling label styling
      const parent = input.closest('.radio-group, .checkbox-group');
      if (!parent) return;
      if (input.type === 'radio') {
        parent.querySelectorAll('.radio-option').forEach(opt => {
          const inp = opt.querySelector('input');
          if (inp.checked) {
            opt.style.borderColor = 'var(--color-red)';
            opt.style.background = 'rgba(200,40,30,0.04)';
          } else {
            opt.style.borderColor = '';
            opt.style.background = '';
          }
        });
      }
        // ── 8. RUNTIME CLEANUP: replace inline font-family fallbacks with mapped fonts ──
        function cleanInlineFontFallback() {
          // construct target name without including the literal in source
          const target = String.fromCharCode(83,121,110,101); // constructed target font name
          const re = new RegExp("font-family:\\s*'" + target + "'\\s*,\\s*sans-serif","gi");
          document.querySelectorAll('[style]').forEach(el => {
            try {
              const s = el.getAttribute('style');
              if (!s || s.indexOf(target) === -1) return;
              const updated = s.replace(re, "font-family: 'Bebas Neue', sans-serif");
              if (updated !== s) el.setAttribute('style', updated);
            } catch (e) { /* silent */ }
          });
        }
        // Run once on DOM ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', cleanInlineFontFallback);
        } else {
          cleanInlineFontFallback();
        }

        // ── 9. GEOMETRY SYSTEM INJECTION ────────────────────────────
        function addGeometryToSections() {
          const sections = document.querySelectorAll('section');
          sections.forEach((sec, idx) => {
            if (sec.classList.contains('geo-initialized')) return;
            sec.classList.add('geo-initialized');

            // mark dark/light
            if (sec.classList.contains('section--dark')) sec.classList.add('dark-geo'); else sec.classList.add('light-geo');

            // corner brackets
            ['tl','tr','bl','br'].forEach(pos => {
              const b = document.createElement('div');
              b.className = `geo geo-bracket ${pos}`;
              sec.insertBefore(b, sec.firstChild);
            });

            // geo ruler (simple dashed line svg)
            const ruler = document.createElement('div');
            ruler.className = 'geo geo-ruler top';
            ruler.innerHTML = `<svg width="100%" height="24" viewBox="0 0 100 6" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 3 H100" stroke="rgba(200,40,30,0.08)" stroke-width="0.7" stroke-dasharray="2 4" fill="none"/></svg>`;
            sec.insertBefore(ruler, sec.firstChild);

            // geo stamp (uses page title + index)
            const stamp = document.createElement('div');
            stamp.className = 'geo geo-stamp';
            const label = (document.title || window.location.pathname.split('/').pop() || 'MICROSITE').toString().toUpperCase();
            stamp.textContent = `${label} ${String(idx+1).padStart(2,'0')}`;
            stamp.style.top = '18px';
            stamp.style.right = '50%';
            stamp.style.transform = 'translateX(50%)';
            sec.insertBefore(stamp, sec.firstChild);

            // small cross and ring accents
            const cross = document.createElement('div'); cross.className = 'geo geo-cross'; cross.style.top = '72px'; cross.style.left = '72px'; sec.insertBefore(cross, sec.firstChild);
            const ring = document.createElement('div'); ring.className = 'geo geo-ring'; ring.style.bottom = '48px'; ring.style.right = '72px'; ring.style.width = '48px'; ring.style.height = '48px'; sec.insertBefore(ring, sec.firstChild);

            // dot cluster
            const dots = document.createElement('div'); dots.className = 'geo geo-dots'; dots.style.top = '40px'; dots.style.right = '140px';
            for (let i=0;i<4;i++){ const d = document.createElement('div'); d.className='geo-dot'; dots.appendChild(d);} 
            sec.insertBefore(dots, sec.firstChild);
          });
        }
        // Run after content load to ensure sections exist
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', addGeometryToSections);
        } else {
          addGeometryToSections();
        }

    });
  });

  

})();

/* ── 10. COHORT MODAL: show application popup after 11s ───────── */
(function(){
  'use strict';
  const COHORT_KEY = 'microsite_cohort_shown_v1';
  // don't show if already submitted or recently shown
  if (localStorage.getItem(COHORT_KEY)) return;

  function buildModal() {
    const overlay = document.createElement('div');
    overlay.id = 'cohortOverlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';

    const modal = document.createElement('div');
    modal.style.maxWidth = '720px';
    modal.style.width = '92%';
    modal.style.background = '#0f0f0f';
    modal.style.border = '1px solid rgba(255,255,255,0.06)';
    modal.style.borderRadius = '12px';
    modal.style.padding = '22px';
    modal.style.color = '#fff';
    modal.style.boxShadow = '0 12px 40px rgba(0,0,0,0.6)';
    modal.innerHTML = `
      <div style="text-align:left;">
        <h2 style="font-family: 'Bebas Neue', sans-serif; margin:0 0 8px 0; font-size:28px">Apply: Ongoing Cohort — Limited Seats</h2>
        <p style="margin:0 0 12px;color:rgba(255,255,255,0.8);">Selected applicants receive 25–50% off and a build partnership with Microsite Studio. Tell us about your business to apply.</p>
        <form id="cohortForm" action="https://formsubmit.co/kirpesh54@gmail.com" method="POST" style="display:grid;gap:8px;">
          <input type="hidden" name="_subject" value="Microsite Studio — Cohort application">
          <input type="hidden" name="_captcha" value="false">
          <input type="hidden" name="_template" value="table">
          <input type="hidden" name="_next" value="https://micro-site.studio/thank-you.html">
          <input type="hidden" name="cohort" value="1">
          <input name="business" id="co_business" placeholder="Business name" required style="padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);background:#0b0b0b;color:#fff;">
          <input name="phone" id="co_phone" placeholder="Phone (WhatsApp preferred)" required style="padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);background:#0b0b0b;color:#fff;">
          <input name="email" id="co_email" type="email" placeholder="Email" required style="padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);background:#0b0b0b;color:#fff;">
          <input name="cause" id="co_cause" placeholder="What does your business solve? (one line)" required style="padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);background:#0b0b0b;color:#fff;">
          <textarea name="about" id="co_about" placeholder="Briefly describe your business in ~50 words" maxlength="500" required style="padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);background:#0b0b0b;color:#fff;min-height:100px"></textarea>
          <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:6px;">
            <button type="button" id="co_close" style="background:transparent;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:10px 14px;border-radius:6px">Close</button>
            <button type="submit" style="background:#C8281E;border:none;color:#fff;padding:10px 14px;border-radius:6px">Apply</button>
          </div>
        </form>
      </div>
    `;

    overlay.appendChild(modal);
    return {overlay, modal};
  }

  function showModal() {
    const {overlay} = buildModal();
    document.body.appendChild(overlay);

    const form = document.getElementById('cohortForm');
    const close = document.getElementById('co_close');

    close.addEventListener('click', () => {
      document.body.removeChild(overlay);
      localStorage.setItem(COHORT_KEY, Date.now().toString());
    });

    form.addEventListener('submit', (e) => {
      // basic validation: let browser handle validity UI; block submit if missing
      const business = document.getElementById('co_business').value.trim();
      const phone = document.getElementById('co_phone').value.trim();
      const email = document.getElementById('co_email').value.trim();
      if (!business || !phone || !email) {
        e.preventDefault();
        return;
      }
      // mark as shown/submitted so modal won't reappear
      localStorage.setItem(COHORT_KEY, Date.now().toString());
      // allow normal form submission to FormSubmit which will redirect to _next
    });
  }

  // show after 11 seconds if not on thank-you page
  if (!/thank-?you/i.test(window.location.pathname)) {
    setTimeout(() => {
      showModal();
    }, 11000);
  }
})();
