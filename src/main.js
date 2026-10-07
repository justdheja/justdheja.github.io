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
const first = data.name.split(' ')[0];
const termLines = [data.skills[1].items[0], data.skills[1].items[1], data.skills[1].items[2], data.skills[2].items[0], data.skills[3].items[0]];
const stat = (h) => `<div class="stat"><div class="value" data-count="${esc(h.value)}">${esc(h.value)}</div><div class="label">${esc(h.label)}</div></div>`;

document.documentElement.classList.add('js');
app.innerHTML = `
  <a class="skip" href="#summary">Skip to content</a>
  <nav class="nav" aria-label="Primary">
    <div class="wrap">
      <a class="nav-logo" href="#top">${esc(first)} ${esc(data.name.split(' ').pop())}</a>
      <ul class="nav-links">${navItems}</ul>
      <a class="nav-cta" href="${esc(data.socials.resumeUrl)}" download="${esc(data.name)} - CV.pdf">Download CV ↗</a>
      <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-mobile">
        <span></span><span></span><span></span>
      </button>
    </div>
    <ul class="nav-mobile" id="nav-mobile">${navItems}</ul>
  </nav>

  <main id="top">
  <header class="hero">
    <div class="wrap hero-grid">
      <span class="side-label" aria-hidden="true">${esc(data.title)}</span>
      <div class="hero-main">
        <div class="status">Open to new roles</div>
        <div class="hero-stats">${data.highlights.slice(0, 2).map(stat).join('')}</div>
        <h1>Hello<span class="sr-only">, I'm ${esc(data.name)}</span></h1>
        <p class="who">— It's ${esc(first)}, a ${esc(data.title.toLowerCase())} in ${esc(data.location.split(',')[0])}.</p>
        <p class="tagline">${esc(data.tagline)}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#contact">Get in touch</a>
          <a class="btn btn-secondary" href="#experience">See my work</a>
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

  <section id="summary">
    <div class="wrap about">
      <div class="reveal">
        <h2>About Me</h2>
        <p class="summary-text">${esc(data.summary)}</p>
      </div>
      <div class="bento reveal-group">
        ${data.highlights.slice(2).map((h) => `<div class="card">${stat(h)}</div>`).join('')}
      </div>
    </div>
  </section>

  <section id="skills">
    <div class="wrap">
      <div class="section-head reveal"><h2>Skills</h2></div>
      <div class="skills-grid reveal-group">
        ${data.skills.map((s) => `
          <div class="card">
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
      <div class="section-head split reveal">
        <h2>Explore My Journey</h2>
        <p>${data.experience.length} roles, ${esc(data.experience.map((j) => j.company.split(' (')[0]).join(', '))}. Open a row for details.</p>
      </div>
      <div class="jobs reveal">
        ${data.experience.map((job, i) => `
          <details class="job"${i === 0 ? ' open' : ''}>
            <summary>
              <span class="job-main"><strong>${esc(job.company)}</strong><small>${esc(job.period)}</small></span>
              <span class="job-role">${esc(job.role)}<small>${esc(job.location)}</small></span>
              <span class="job-tags">${job.tags.map((t) => `<span class="pill">${esc(t)}</span>`).join('')}</span>
              <span class="plus" aria-hidden="true"></span>
            </summary>
            <ul class="job-bullets">${job.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
          </details>
        `).join('')}
      </div>
    </div>
  </section>

  <section id="projects">
    <div class="wrap">
      <div class="section-head reveal"><h2>Selected Work</h2></div>
      <div class="projects-grid reveal-group">
        ${data.projects.map((p, i) => `
          <article class="card project">
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
      <h2>Got a quality problem? Let's fix it.</h2>
      <p>Open to QA / automation engineering roles and collaborations.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="mailto:${esc(data.email)}">Email me</a>
        <a class="btn btn-secondary" href="${esc(data.socials.resumeUrl)}" download="${esc(data.name)} - CV.pdf">Download CV</a>
      </div>
    </div>
  </section>
  </main>

  <footer>
    <div class="wrap footer-inner">
      <div class="footer-links">
        <a href="${esc(data.socials.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="${esc(data.socials.github)}" target="_blank" rel="noopener">GitHub</a>
        <a href="${esc(data.socials.instagram)}" target="_blank" rel="noopener">Instagram</a>
      </div>
      <a class="footer-mail" href="mailto:${esc(data.email)}">${esc(data.email)}</a>
    </div>
    <div class="wrap copy">© ${new Date().getFullYear()} ${esc(data.name)}</div>
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
