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

const links = [['summary', 'About'], ['skills', 'Skills'], ['experience', 'Experience'], ['projects', 'Projects'], ['contact', 'Contact']];
const navItems = links.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join('');
const head = (eyebrow, title) => `
  <div class="section-head reveal">
    <div class="eyebrow">${eyebrow}</div>
    <h2>${title}</h2>
  </div>`;
const termLines = [data.skills[1].items[0], data.skills[1].items[1], data.skills[1].items[2], data.skills[2].items[0], data.skills[3].items[0]];

document.documentElement.classList.add('js');
app.innerHTML = `
  <a class="skip" href="#summary">Skip to content</a>
  <nav class="nav" aria-label="Primary">
    <div class="wrap">
      <a class="nav-logo" href="#top">${esc(data.name.split(' ')[0])} ${esc(data.name.split(' ').pop())}</a>
      <ul class="nav-links">${navItems}</ul>
      <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-mobile">
        <span></span><span></span><span></span>
      </button>
    </div>
    <ul class="nav-mobile" id="nav-mobile">${navItems}</ul>
  </nav>

  <main id="top">
  <header class="hero">
    <div class="wrap">
      <div>
        <div class="status">Open to new roles</div>
        <h1>${esc(data.name)}</h1>
        <p class="role">${esc(data.title)} · ${esc(data.location)}</p>
        <p class="tagline">${esc(data.tagline)}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${esc(data.socials.resumeUrl)}" download="${esc(data.name)} - CV.pdf">Download CV</a>
          <a class="btn btn-secondary" href="#contact">Get in touch</a>
        </div>
      </div>
      <div class="term" aria-hidden="true">
        <div class="term-bar"><i></i><i></i><i></i></div>
        <div class="term-body">
          <div class="cmd">$ qa run --all</div>
          ${termLines.map((t) => `<div><span class="ok">✓</span> ${esc(t.toLowerCase())}</div>`).join('')}
          <div class="sum">all checks passed</div>
        </div>
      </div>
    </div>
  </header>

  <section id="highlights" aria-label="Highlights">
    <div class="wrap">
      <div class="highlights reveal-group">
        ${data.highlights.map((h) => `
          <div class="highlight-card">
            <div class="value" data-count="${esc(h.value)}">${esc(h.value)}</div>
            <div class="label">${esc(h.label)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section id="summary">
    <div class="wrap">
      ${head('About', 'Summary')}
      <p class="summary-text reveal">${esc(data.summary)}</p>
    </div>
  </section>

  <section id="skills">
    <div class="wrap">
      ${head('Capabilities', 'Skills')}
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
    <div class="wrap">
      ${head('Career', 'Experience')}
      <div class="timeline">
        ${data.experience.map((job) => `
          <div class="job reveal">
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
    <div class="wrap">
      ${head('Work', 'Selected Projects')}
      <div class="projects-grid reveal-group">
        ${data.projects.map((p, i) => `
          <article class="project-card">
            <div class="num">${String(i + 1).padStart(2, '0')}</div>
            <h3>${esc(p.name)}</h3>
            <p>${esc(p.description)}</p>
            <div class="chip-row">
              ${p.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  </section>

  <section id="education-certs">
    <div class="wrap">
      <div class="two-col reveal">
        <div>
          <h2>Education</h2>
          <ul class="list-plain">
            ${data.education.map((e) => `
              <li>
                ${esc(e.degree)}
                <div class="sub">${esc(e.school)} · ${esc(e.period)}${e.note ? ` · ${esc(e.note)}` : ''}</div>
              </li>
            `).join('')}
          </ul>
        </div>
        <div>
          <h2>Certifications</h2>
          <ul class="list-plain">
            ${data.certifications.map((c) => `<li>${esc(c)}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="contact">
    <div class="wrap reveal">
      <h2>Let's work together</h2>
      <p>Open to QA / automation engineering roles and collaborations.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="mailto:${esc(data.email)}">${esc(data.email)}</a>
        <a class="btn btn-secondary" href="${esc(data.socials.resumeUrl)}" download="${esc(data.name)} - CV.pdf">Download CV</a>
      </div>
      <div class="contact-links">
        <a href="${esc(data.socials.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="${esc(data.socials.github)}" target="_blank" rel="noopener">GitHub</a>
        <a href="${esc(data.socials.instagram)}" target="_blank" rel="noopener">Instagram</a>
      </div>
    </div>
  </section>
  </main>

  <footer>
    <div class="wrap">© ${new Date().getFullYear()} ${esc(data.name)}</div>
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

// Active nav link follows the section in view
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
  }),
  { rootMargin: '-40% 0px -55% 0px' }
);
links.forEach(([id]) => sectionObserver.observe(document.getElementById(id)));
