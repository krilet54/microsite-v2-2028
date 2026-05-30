document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  if (nav && nav.children.length === 0) {
    nav.innerHTML = `
      <div class="nav-inner">
        <a href="index.html" class="nav-logo"><span class="brand-wordmark">Microsite.</span><span class="brand-studio">Studio</span></a>
        <ul class="nav-links" aria-label="Primary navigation">
          <li><a href="work.html">Work</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html" class="nav-cta">Start a Project</a></li>
        </ul>
        <button class="nav-hamburger" id="hamburger" aria-label="Open menu"><span></span><span></span></button>
      </div>
    `;
  }

  const mobileOverlay = document.getElementById('mobileOverlay');
  if (mobileOverlay) {
    mobileOverlay.innerHTML = `
      <ul>
        <li><a href="work.html">Work</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Start a Project</a></li>
      </ul>
    `;
  }

  const footer = document.querySelector('footer');
  if (!footer) return;

  footer.classList.add('footer--editorial');
  footer.innerHTML = `
    <section class="footer__info">
      <div class="footer__ornament footer__ornament--cross" aria-hidden="true"></div>
      <div class="footer__ornament footer__ornament--ring" aria-hidden="true"></div>
      <div class="footer__ornament footer__ornament--stamp" aria-hidden="true">MICROSITE STUDIO · BUILDING SYSTEMS</div>
      <div class="footer__grid">
        <div class="footer__brand">
          <div class="footer__brand-mark"><span class="brand-wordmark">Microsite.</span><span class="brand-studio">Studio</span><sup>°</sup></div>
          <p class="footer__brand-copy">Launch &amp; growth infrastructure for ambitious early-stage founders.</p>
          <div class="footer__brand-city">NEW DELHI · INDIA</div>
        </div>
        <div class="footer__col">
          <div class="footer__label">ENGAGEMENTS</div>
          <nav class="footer__link-list" aria-label="Engagements">
            <a href="diagnose.html">Diagnose</a>
            <a href="launch.html">Launch</a>
            <a href="grow.html">Grow</a>
            <a href="advise.html">Advise</a>
            <a href="individual-services.html">Individual Services</a>
          </nav>
        </div>
        <div class="footer__col">
          <div class="footer__label">COMPANY</div>
          <nav class="footer__link-list" aria-label="Company">
            <a href="work.html">Work</a>
            <a href="blog.html">Blog</a>
            <a href="/admin/index.html">Admin</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
            <a href="contact.html">Start a Project</a>
          </nav>
        </div>
        <div class="footer__col">
          <div class="footer__label">GET IN TOUCH</div>
          <a class="footer__contact-link footer__contact-email" href="mailto:micro-site.studio">micro-site.studio</a>
          <div class="footer__contact-phone-list">
            <a class="footer__contact-link" href="tel:+919060868026">+91-9060868026</a>
            <a class="footer__contact-link" href="tel:+919873943222">+91-9873943222</a>
          </div>
          <div class="footer__contact-note">Response within 1 business day.</div>
          <div class="footer__socials" aria-label="Social links">
            <a class="footer__social-link" href="https://in.linkedin.com/company/microsite-studio" target="_blank" rel="noopener" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" opacity="0.16"></rect>
                <path d="M7.2 9.2H9.8V17H7.2V9.2ZM8.5 5.8C7.7 5.8 7.1 6.4 7.1 7.1C7.1 7.8 7.7 8.4 8.5 8.4C9.3 8.4 9.9 7.8 9.9 7.1C9.9 6.4 9.3 5.8 8.5 5.8ZM10.8 9.2H13.3V10.2H13.4C13.8 9.5 14.7 8.9 15.9 8.9C18.4 8.9 18.9 10.5 18.9 12.6V17H16.3V13.2C16.3 12.3 16.3 11.1 15 11.1C13.7 11.1 13.5 12.1 13.5 13.1V17H10.8V9.2Z" fill="currentColor"></path>
              </svg>
            </a>
            <a class="footer__social-link" href="https://www.instagram.com/microsite.studio/" target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor" opacity="0.16"></rect>
                <rect x="6.5" y="6.5" width="11" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"></rect>
                <circle cx="12" cy="12" r="2.7" fill="currentColor"></circle>
                <circle cx="16.6" cy="7.7" r="0.9" fill="currentColor"></circle>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
    <section class="footer__bottom-bar">
      <div class="footer__bottom-inner">
        <span>© 2026 Microsite Studio. All rights reserved.</span>
        <span>Built with intent. Delivered with speed.</span>
      </div>
    </section>
  `;
});
