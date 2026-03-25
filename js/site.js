'use strict';

/* ─── 1. Navbar: transparente → sólido al hacer scroll ────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  const toggleNav = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', toggleNav, { passive: true });
  toggleNav(); // estado inicial
}

/* ─── 2. Smooth scroll + cierre de menú móvil ─────────────── */
document.querySelectorAll('a.scroll-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href?.startsWith('#')) return;
    e.preventDefault();

    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });

    const navCollapse = document.getElementById('mainNav');
    if (navCollapse?.classList.contains('show')) {
      bootstrap.Collapse.getInstance(navCollapse)?.hide();
    }
  });
});

/* ─── 3. Nav activo según sección visible ──────────────────── */
const sections = Array.from(document.querySelectorAll('section[id], footer[id]'));
const navLinks  = Array.from(document.querySelectorAll('#navList .scroll-link'));

if (sections.length && navLinks.length) {
  const spyObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.closest('.nav-item')
          ?.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { threshold: 0.3 });

  sections.forEach(s => spyObs.observe(s));
}

/* ─── 4. Animaciones de entrada (reemplaza WOW.js) ─────────── */
const revealObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    obs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── 5. Formulario de contacto → Formspree ────────────────── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data     = new FormData(form);
    const response = await fetch(form.action, {
      method:  'POST',
      body:    data,
      headers: { 'Accept': 'application/json' },
    });
    const msg = document.getElementById('formMsg');
    if (response.ok) {
      msg.classList.remove('d-none', 'text-danger');
      msg.classList.add('text-success');
      msg.textContent = '✅ ¡Mensaje enviado! Te contactaremos pronto.';
      form.reset();
    } else {
      msg.textContent = '❌ Error al enviar. Escríbenos a contacto@otautomation.cl';
      msg.classList.remove('d-none', 'text-success');
      msg.classList.add('text-danger');
    }
    msg.classList.remove('d-none');
  });
}
