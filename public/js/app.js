(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const rm = n => 'RM' + fmt(n);
const waUrl = t => `https://wa.me/${SITE.wa}?text=${encodeURIComponent(t)}`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ===== Asas: WhatsApp, socials, tahun ===== */
$$('[data-wa]').forEach(a => { a.href = waUrl(a.dataset.wa); });
const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

/* ===== Menu skrin penuh ===== */
const menu = $('#menu');
let menuOpener = null;
function openMenu(btn) {
  menuOpener = btn || null;
  menu.classList.add('open');
  menu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('.menu-close', menu).focus({ preventScroll: true }), 50);
}
function closeMenu() {
  if (!menu.classList.contains('open')) return;
  menu.classList.remove('open');
  menu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (menuOpener) menuOpener.focus({ preventScroll: true });
}
$$('[data-open-menu]').forEach(b => b.addEventListener('click', () => openMenu(b)));
$$('[data-close-menu]').forEach(b => b.addEventListener('click', closeMenu));
addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ===== Marquee ===== */
$$('[data-marquee]').forEach(t => { t.innerHTML += t.innerHTML; });

/* ===== Animasi masuk dari kiri / kanan ===== */
$$('[data-alt]').forEach(c => [...c.children].forEach((el, i) => {
  el.dataset.anim = i % 2 ? 'right' : 'left';
  el.style.setProperty('--d', (i * 0.09) + 's');
}));
const animEls = $$('[data-anim]');
function reveal(el) {
  el.classList.add('in');
  const d = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
  setTimeout(() => { el.removeAttribute('data-anim'); el.classList.remove('in'); }, d * 1000 + 1400);
}
if ('IntersectionObserver' in window && !reduce) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { io.unobserve(e.target); reveal(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  animEls.forEach(el => io.observe(el));
} else {
  animEls.forEach(el => el.removeAttribute('data-anim'));
}

/* ===== Skrol: header, progress ring, parallax, nav aktif ===== */
const topbar = $('.topbar');
const toTop = $('.to-top');
const ring = $('#ringP');
const px = $$('[data-px]');
const heroImg = $('[data-parallax-img]');
const navLinks = $$('.nav a');
const onHome = location.pathname === '/';
const navTargets = navLinks.map(a => (onHome && a.hash ? $(a.hash) : null));
let ticking = false;
function onScroll() {
  ticking = false;
  const y = scrollY, vh = innerHeight;
  topbar.classList.toggle('scrolled', y > 10);
  toTop.classList.toggle('show', y > 500);
  const max = document.documentElement.scrollHeight - vh;
  ring.style.strokeDashoffset = 131.95 * (1 - Math.min(1, y / (max || 1)));
  if (!reduce) {
    px.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      el.style.setProperty('--tx', ((p * 2 - 1) * -260 * Number(el.dataset.px)) + 'px');
    });
    if (heroImg && y < 1000 && innerWidth >= 900) heroImg.style.setProperty('--py', Math.min(36, y * 0.06) + 'px');
  }
  let cur = -1, best = -Infinity;
  navTargets.forEach((t, i) => {
    if (!t) return;
    const top = t.getBoundingClientRect().top;
    if (top <= 140 && top > best) { best = top; cur = i; }
  });
  navLinks.forEach((a, i) => a.classList.toggle('on', onHome ? i === cur : (a.pathname === '/artikel/' && location.pathname.startsWith('/artikel'))));
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);
onScroll();

/* ===== PWA ===== */
let deferred = null;
const installBtn = $('#installBtn');
addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; installBtn.hidden = false; });
addEventListener('appinstalled', () => { installBtn.hidden = true; deferred = null; });
installBtn.addEventListener('click', async () => {
  if (deferred) { deferred.prompt(); await deferred.userChoice; deferred = null; installBtn.hidden = true; }
  else alert('Di iPhone: tekan butang Share di Safari, kemudian pilih "Add to Home Screen".');
});
const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
if (/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone) { installBtn.hidden = false; installBtn.textContent = 'Cara pasang di iPhone'; }
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

})();
