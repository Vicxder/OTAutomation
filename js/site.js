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

/* ─── 5. Formulario de contacto → Azure Logic Apps ─────────── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const msg  = document.getElementById('formMsg');
  const btn  = document.getElementById('sendBtn');

  const FLOW_URL = 'https://prod-13.brazilsouth.logic.azure.com:443/workflows/349dbb5b199e45e9a58440b2abc4be60/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=QH-Q445szrj_EDvWcaPgqbsn1N8RVWZEZ-GYkS-f7ME';
  const API_KEY  = 'Dorel.,2025#.OTA';

  form.addEventListener('submit', async e => {
    e.preventDefault();
    msg.textContent = '';
    btn.disabled    = true;
    btn.textContent = 'Enviando…';

    const data  = Object.fromEntries(new FormData(form).entries());
    data.apiKey = API_KEY;

    try {
      const res = await fetch(FLOW_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });

      if (res.ok) {
        msg.style.color = '#34d399';
        msg.textContent = '¡Mensaje enviado! Te responderemos pronto.';
        form.reset();
      } else {
        throw new Error('Error al enviar. Intenta nuevamente.');
      }
    } catch (err) {
      msg.style.color = '#f87171';
      msg.textContent = err.message || 'No se pudo enviar el mensaje.';
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Enviar mensaje';
    }
  });
})();
