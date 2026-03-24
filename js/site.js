'use strict';

/* ─── 1. Sombra dinámica en el header al hacer scroll ─── */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* ─── 2. Smooth scroll + cierra el menú móvil ─────────── */
document.querySelectorAll('a.scroll-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();

    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });

    // Cierra el colapso de Bootstrap 5 si está abierto
    const navCollapse = document.getElementById('mainNav');
    if (navCollapse?.classList.contains('show')) {
      bootstrap.Collapse.getInstance(navCollapse)?.hide();
    }
  });
});

/* ─── 3. Nav activo según sección visible ──────────────── */
const sections  = Array.from(document.querySelectorAll('section[id], footer[id]'));
const navLinks  = Array.from(document.querySelectorAll('#navList .scroll-link'));

if (sections.length && navLinks.length) {
  const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const li = link.closest('.nav-item');
        if (!li) return;
        li.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { threshold: 0.35 });

  sections.forEach(s => spyObserver.observe(s));
}

/* ─── 4. El link Intranet nunca queda marcado como activo ─ */
const intranetLink = document.querySelector('#navList .intranet-link');
if (intranetLink) {
  intranetLink.addEventListener('click', () => {
    setTimeout(() => {
      intranetLink.closest('.nav-item')?.classList.remove('active');
    }, 0);
  });
}

/* ─── 5. Animaciones de scroll (reemplaza WOW.js) ─────── */
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    obs.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── 6. Formulario de contacto → Azure Logic Apps ─────── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const msg     = document.getElementById('formMsg');
  const btn     = document.getElementById('sendBtn');

  // Endpoint de Azure Logic Apps (incluye SAS en la URL)
  const FLOW_URL = 'https://prod-13.brazilsouth.logic.azure.com:443/workflows/349dbb5b199e45e9a58440b2abc4be60/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=QH-Q445szrj_EDvWcaPgqbsn1N8RVWZEZ-GYkS-f7ME';
  const API_KEY  = 'Dorel.,2025#.OTA';

  form.addEventListener('submit', async e => {
    e.preventDefault();
    msg.textContent = '';
    btn.disabled    = true;
    btn.textContent = 'Enviando…';

    const data    = Object.fromEntries(new FormData(form).entries());
    data.apiKey   = API_KEY;

    try {
      const res = await fetch(FLOW_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });

      if (res.ok) {
        msg.style.color = '#0a7d28';
        msg.textContent = '¡Gracias! Hemos recibido tu mensaje.';
        form.reset();
      } else {
        throw new Error('Error al enviar. Intenta nuevamente.');
      }
    } catch (err) {
      msg.style.color = '#b00020';
      msg.textContent = err.message || 'No se pudo enviar el mensaje.';
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Enviar mensaje';
    }
  });
})();
