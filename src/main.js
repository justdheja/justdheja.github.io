import './style.css';
import data from './data/data.json';

const app = document.querySelector('#app');

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

// JSON-LD structured data (Person schema) for rich snippets in search results.
const ld = document.createElement('script');
ld.type = 'application/ld+json';
ld.textContent = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: data.name,
  jobTitle: data.title,
  description: data.summary,
  email: `mailto:${data.email}`,
  address: { '@type': 'PostalAddress', addressLocality: data.location },
  sameAs: [data.socials.linkedin, data.socials.github, data.socials.instagram].filter(Boolean),
  knowsAbout: data.skills.flatMap((s) => s.items),
  alumniOf: data.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
});
document.head.appendChild(ld);

app.innerHTML = `
  <nav class="nav">
    <div class="wrap">
      <div class="nav-logo">${esc(data.name)}</div>
      <ul class="nav-links">
        <li><a href="#summary">About</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
    <ul class="nav-mobile">
      <li><a href="#summary">About</a></li>
      <li><a href="#skills">Skills</a></li>
      <li><a href="#experience">Experience</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>

  <header class="hero">
    <div class="parallax-layer" data-speed="0.25"></div>
    <div class="wrap">
      <div class="hero-eyebrow">${esc(data.title)}</div>
      <h1>${esc(data.name)}</h1>
      <p class="tagline">${esc(data.tagline)}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${esc(data.socials.resumeUrl)}">Download CV</a>
        <a class="btn btn-secondary" href="#contact">Get in touch</a>
      </div>
    </div>
  </header>

  <section id="highlights">
    <div class="parallax-layer" data-speed="0.12"></div>
    <div class="wrap">
      <div class="highlights reveal-group">
        ${data.highlights.map((h) => `
          <div class="highlight-card">
            <div class="value" data-count="${esc(h.value)}">0</div>
            <div class="label">${esc(h.label)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section id="summary">
    <div class="parallax-layer" data-speed="0.18"></div>
    <div class="wrap">
      <div class="section-head reveal">
        <div class="eyebrow">About</div>
        <h2>Summary</h2>
      </div>
      <p class="summary-text reveal">${esc(data.summary)}</p>
    </div>
  </section>

  <section id="skills">
    <div class="parallax-layer" data-speed="0.12"></div>
    <div class="wrap">
      <div class="section-head reveal">
        <div class="eyebrow">Capabilities</div>
        <h2>Skills</h2>
      </div>
      <div class="skills-grid reveal-group">
        ${data.skills.map((s) => `
          <div class="skill-card">
            <h3>${esc(s.category)}</h3>
            <div class="chip-row">
              ${s.items.map((i) => `<span class="chip">${esc(i)}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section id="experience">
    <div class="parallax-layer" data-speed="0.18"></div>
    <div class="wrap">
      <div class="section-head reveal">
        <div class="eyebrow">Career</div>
        <h2>Experience</h2>
      </div>
      <div class="timeline reveal-group">
        ${data.experience.map((job) => `
          <div class="job">
            <div class="job-meta">
              <span class="period">${esc(job.period)}</span>
              <span>${esc(job.location)}</span>
            </div>
            <div>
              <h3 class="job-title">${esc(job.role)}</h3>
              <p class="job-company">${esc(job.company)}</p>
              <ul class="job-bullets">
                ${job.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section id="projects">
    <div class="parallax-layer" data-speed="0.12"></div>
    <div class="wrap">
      <div class="section-head reveal">
        <div class="eyebrow">Work</div>
        <h2>Selected Projects</h2>
      </div>
      <div class="projects-grid reveal-group">
        ${data.projects.map((p) => `
          <div class="project-card">
            <h3>${esc(p.name)}</h3>
            <p>${esc(p.description)}</p>
            <div class="chip-row">
              ${p.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section id="education-certs">
    <div class="parallax-layer" data-speed="0.18"></div>
    <div class="wrap">
      <div class="two-col reveal">
        <div>
          <div class="section-head" style="text-align:left; margin-bottom:24px;">
            <div class="eyebrow">Education</div>
          </div>
          <ul class="list-plain">
            ${data.education.map((e) => `
              <li>
                ${esc(e.degree)}
                <div class="sub">${esc(e.school)} · ${esc(e.period)}</div>
              </li>
            `).join('')}
          </ul>
        </div>
        <div>
          <div class="section-head" style="text-align:left; margin-bottom:24px;">
            <div class="eyebrow">Certifications</div>
          </div>
          <ul class="list-plain">
            ${data.certifications.map((c) => `<li>${esc(c)}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="contact">
    <div class="parallax-layer" data-speed="0.14"></div>
    <div class="wrap reveal">
      <h2>Let's work together</h2>
      <p>${esc(data.location)} — open to QA / automation engineering roles and collaborations.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="mailto:${esc(data.email)}">Email Me</a>
        <a class="btn btn-secondary" href="${esc(data.socials.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
        <a class="btn btn-secondary" href="${esc(data.socials.github)}" target="_blank" rel="noopener">GitHub</a>
        <a class="btn btn-secondary" href="${esc(data.socials.instagram)}" target="_blank" rel="noopener">Instagram</a>
      </div>
    </div>
  </section>

  <footer>
    <div class="wrap footer-inner">
      <span>© ${new Date().getFullYear()} ${esc(data.name)}. All rights reserved.</span>
      <div class="footer-socials">
        <a href="${esc(data.socials.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="${esc(data.socials.github)}" target="_blank" rel="noopener">GitHub</a>
        <a href="${esc(data.socials.instagram)}" target="_blank" rel="noopener">Instagram</a>
      </div>
    </div>
  </footer>
`;

// Nav: solid background once page scrolls past hero
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav: hamburger toggle
const navToggle = document.querySelector('.nav-toggle');
const closeMobileNav = () => {
  nav.classList.remove('menu-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
};
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('menu-open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
document.querySelectorAll('.nav-mobile a').forEach((a) => a.addEventListener('click', closeMobileNav));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileNav(); });

// Scroll reveal via IntersectionObserver
const revealTargets = document.querySelectorAll('.reveal, .reveal-group');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);
revealTargets.forEach((el) => revealObserver.observe(el));

// Count-up animation for highlight numbers (e.g. "4+", "100+")
const countEls = document.querySelectorAll('[data-count]');
const animateCount = (el) => {
  const raw = el.getAttribute('data-count');
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) { el.textContent = raw; return; }
  const [, numStr, suffix] = match;
  const target = parseInt(numStr, 10);
  const duration = 1200;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
countEls.forEach((el) => countObserver.observe(el));

// Parallax: each section's background layer drifts at its own speed while
// scrolling. Applied to a dedicated absolutely-positioned layer (not content)
// so it never fights the scroll-reveal transforms above.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
  const parallaxLayers = Array.from(document.querySelectorAll('.parallax-layer')).map((el) => ({
    el,
    speed: parseFloat(el.getAttribute('data-speed')) || 0.15,
  }));

  let ticking = false;
  const updateParallax = () => {
    const vh = window.innerHeight;
    parallaxLayers.forEach(({ el, speed }) => {
      const rect = el.parentElement.getBoundingClientRect();
      const centerDelta = rect.top + rect.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(centerDelta * speed).toFixed(2)}px, 0)`;
    });
    ticking = false;
  };
  const onParallaxScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };
  window.addEventListener('scroll', onParallaxScroll, { passive: true });
  window.addEventListener('resize', onParallaxScroll, { passive: true });
  updateParallax();
}
