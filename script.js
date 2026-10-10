const body = document.body;
const progressBar = document.getElementById('progressBar');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('siteNav');
const readingMode = document.getElementById('readingMode');
const themeToggle = document.getElementById('themeToggle');

function updateReadingProgress() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${scrollable > 0 ? (scrollTop / scrollable) * 100 : 0}%`;
}
window.addEventListener('scroll', updateReadingProgress, { passive: true });
updateReadingProgress();

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');
    });
  });
}

if (readingMode) {
  readingMode.addEventListener('click', () => {
    const active = body.classList.toggle('reading-mode');
    readingMode.setAttribute('aria-pressed', String(active));
    readingMode.textContent = active ? 'Modo normal' : 'Modo lectura';
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const active = body.classList.toggle('high-contrast');
    themeToggle.setAttribute('aria-pressed', String(active));
    themeToggle.setAttribute('aria-label', active ? 'Restaurar contraste de la página' : 'Cambiar contraste de la página');
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Mantiene el enlace de navegación activo según la sección visible.
const navigationLinks = [...document.querySelectorAll('.site-nav a')];
const sections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) => link.removeAttribute('aria-current'));
      const activeLink = navigationLinks.find((link) => link.getAttribute('href') === `#${entry.target.id}`);
      if (activeLink) activeLink.setAttribute('aria-current', 'page');
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  sections.forEach((section) => activeObserver.observe(section));
}

// Evita que los enlaces externos se abran sin aviso para lectores de teclado.
document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  link.addEventListener('click', () => {
    link.setAttribute('aria-label', `${link.textContent.trim()} (abre en una nueva pestaña)`);
  }, { once: true });
});
