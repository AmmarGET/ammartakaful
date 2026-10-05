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
$('#yr').textContent = new Date().getFullYear();
$('#railSocials').innerHTML = SITE.socials.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.label)}">${esc(s.short || s.label[0])}</a>`).join('');
if (SITE.agentNo) { const el = $('#agentNo'); el.hidden = false; el.textContent = 'No. pendaftaran ejen: ' + SITE.agentNo; }

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
const navTargets = navLinks.map(a => $(a.getAttribute('href')));
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
  let cur = -1;
  navTargets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= 140) cur = i; });
  navLinks.forEach((a, i) => a.classList.toggle('on', i === cur));
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);
onScroll();

/* ===== Kalkulator ===== */
const CAT = {
  ind: { name: 'Individu (16-70 tahun)' },
  senior: { name: 'Warga Emas (71-80 tahun)' },
  spouse: { name: 'Pasangan (suami & isteri)' },
  family: { name: 'Keluarga (pasangan + anak)' }
};
const PLANS = [
  { id: 'silver', name: 'Silver', off: 1, idx: 1 },
  { id: 'gold', name: 'Gold', off: 4, idx: 2 },
  { id: 'platinum', name: 'Platinum', off: 7, idx: 3 }
];
const DOMESTIC = { id: 'domestic', name: 'Domestic', off: 0, idx: 0 };
const AREA_SHORT = { 1: 'Domestik', 2: 'Area 2', 3: 'Area 3', 4: 'Area 4' };

const form = $('#calcForm');
const depEl = $('#dep'), retEl = $('#ret');
const st = { mode: 'single', cat: 'ind', dests: [], addons: new Set() };

const pad = n => String(n).padStart(2, '0');
const now = new Date();
const todayISO = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
depEl.min = retEl.min = todayISO;

const utc = s => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
const fmtD = s => { const [y, m, d] = s.split('-'); return `${d}/${m}/${y}`; };
const round2 = v => Math.round(v * 100) / 100;

function price(rows, col, n, annual) {
  if (annual) { const v = rows[5][col]; return v == null ? null : round2(v); }
  const b = n <= 5 ? 0 : n <= 10 ? 1 : n <= 18 ? 2 : 3;
  let v = rows[b][col];
  if (v == null) return null;
  if (n > 30) {
    const w = rows[4][col];
    if (w == null) return null;
    v += Math.ceil((n - 30) / 7) * w;
  }
  return round2(v);
}
function addonPrice(id, cat, col, area, n, annual) {
  if (id === 'adv') return cat === 'senior' ? null : price(ADV[cat], col, n, annual);
  if (id === 'covid') return area < 2 ? null : price(COVID[cat], area - 2, n, annual);
  if (id === 'home') return area < 2 ? null : price(HOME, 0, n, annual);
  if (id === 'golf') return price(GOLF[cat === 'senior' ? 'ind' : cat], area === 1 ? 0 : 1, n, annual);
  return null;
}
const colOf = (p, area) => (area === 1 ? 0 : p.off + (area - 2));

/* --- destinasi --- */
const destInput = $('#dest'), sugEl = $('#sug'), chipsEl = $('#destChips');
let sugList = [], sugIdx = -1;
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
function areaOf(n) {
  if (EXCLUDED.has(n)) return 0;
  if (n === 'Malaysia') return 1;
  if (AREA2.has(n)) return 2;
  if (AREA4.has(n)) return 4;
  return 3;
}
const areaTag = a => (a === 0 ? 'Dikecualikan' : a === 1 ? 'Domestik' : 'Area ' + a);

function search(q) {
  q = norm(q);
  if (!q) return [];
  const taken = new Set(st.dests), out = [];
  for (const c of COUNTRIES) {
    if (taken.has(c.n)) continue;
    const name = norm(c.n);
    const alias = norm(c.k).split(',').map(x => x.trim()).slice(1);
    let sc = -1;
    if (name === q) sc = 0;
    else if (alias.includes(q)) sc = 1;
    else if (name.startsWith(q)) sc = 2;
    else if (alias.some(x => x.startsWith(q))) sc = 3;
    else if (name.includes(q) || alias.some(x => x.includes(q))) sc = 4;
    if (sc >= 0) out.push([sc, c]);
  }
  return out.sort((a, b) => a[0] - b[0]).map(x => x[1]).slice(0, 8);
}
function showSug() {
  sugList = search(destInput.value);
  sugIdx = sugList.length ? 0 : -1;
  if (!destInput.value.trim()) { hideSug(); return; }
  sugEl.innerHTML = sugList.length
    ? sugList.map((c, i) => `<li role="option" data-n="${esc(c.n)}" class="${i === 0 ? 'on' : ''}"><span>${esc(c.n)}</span><small>${areaTag(areaOf(c.n))}</small></li>`).join('')
    : '<li class="none">Tiada padanan. Cuba nama dalam bahasa Inggeris.</li>';
  sugEl.hidden = false;
  destInput.setAttribute('aria-expanded', 'true');
}
function hideSug() { sugEl.hidden = true; destInput.setAttribute('aria-expanded', 'false'); sugIdx = -1; }
function moveSug(d) {
  if (!sugList.length) return;
  sugIdx = (sugIdx + d + sugList.length) % sugList.length;
  $$('li', sugEl).forEach((li, i) => li.classList.toggle('on', i === sugIdx));
  const on = $('li.on', sugEl); if (on) on.scrollIntoView({ block: 'nearest' });
}
function addDest(n) {
  if (!st.dests.includes(n)) st.dests.push(n);
  destInput.value = '';
  hideSug();
  renderChips();
  update();
}
function renderChips() {
  chipsEl.innerHTML = st.dests.map(n => {
    const a = areaOf(n);
    return `<span class="chip ${a === 0 ? 'bad' : ''}">${esc(n)} <small>${areaTag(a)}</small><button type="button" data-rm="${esc(n)}" aria-label="Buang ${esc(n)}">×</button></span>`;
  }).join('');
}
destInput.addEventListener('input', showSug);
destInput.addEventListener('focus', () => { if (destInput.value.trim()) showSug(); });
destInput.addEventListener('blur', () => {
  const q = norm(destInput.value);
  const m = q && search(destInput.value)[0];
  if (m && norm(m.n) === q) addDest(m.n);
  else hideSug();
});
destInput.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); moveSug(1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); moveSug(-1); }
  else if (e.key === 'Enter') { e.preventDefault(); if (sugList[sugIdx]) addDest(sugList[sugIdx].n); }
  else if (e.key === 'Escape') hideSug();
  else if (e.key === 'Backspace' && !destInput.value && st.dests.length) { st.dests.pop(); renderChips(); update(); }
});
sugEl.addEventListener('pointerdown', e => e.preventDefault());
sugEl.addEventListener('click', e => { const li = e.target.closest('li[data-n]'); if (li) addDest(li.dataset.n); });
chipsEl.addEventListener('click', e => {
  const b = e.target.closest('[data-rm]');
  if (!b) return;
  st.dests = st.dests.filter(n => n !== b.dataset.rm);
  renderChips(); update();
});
$('#destBox').addEventListener('click', e => { if (e.target === e.currentTarget) destInput.focus(); });

/* --- add-on --- */
const addonsEl = $('#addons');
addonsEl.innerHTML = ADDONS.map(a => `<label class="addon" data-id="${a.id}"><input type="checkbox" value="${a.id}"><span class="addon-b"><span><b>${a.name}</b><small>${a.desc}</small><small class="why"></small></span></span></label>`).join('');
addonsEl.addEventListener('change', e => {
  const cb = e.target;
  cb.checked ? st.addons.add(cb.value) : st.addons.delete(cb.value);
  update();
});
function refreshAddons(area, annual) {
  const probeCol = area === 1 ? 0 : 1 + (area - 2);
  ADDONS.forEach(a => {
    const row = $(`.addon[data-id="${a.id}"]`, addonsEl);
    const cb = $('input', row);
    let why = '';
    if (!area) { why = 'Pilih destinasi dahulu.'; }
    else if (a.id === 'adv' && st.cat === 'senior') why = 'Tiada untuk warga emas.';
    else if ((a.id === 'covid' || a.id === 'home') && area < 2) why = 'Untuk perjalanan antarabangsa sahaja.';
    else if (addonPrice(a.id, st.cat, probeCol, area, 1, annual) == null) why = 'Tiada untuk plan ini.';
    const off = !!why;
    row.classList.toggle('off', off);
    cb.disabled = off;
    $('.why', row).textContent = why;
    if (off && st.addons.has(a.id)) { st.addons.delete(a.id); cb.checked = false; }
  });
}

/* --- mesej & render --- */
const msgEl = $('#msg'), plansEl = $('#plans'), fineEl = $('#fine');
function setMsg(html, kind) { msgEl.className = 'msg' + (kind ? ' ' + kind : ''); msgEl.innerHTML = html; }

function resolveArea() {
  if (st.mode === 'annual') return { area: +form.elements.area.value, bad: [], mixed: false };
  const bad = st.dests.filter(d => EXCLUDED.has(d));
  if (bad.length) return { area: null, bad };
  if (!st.dests.length) return { area: null, bad: [] };
  const intl = st.dests.filter(d => d !== 'Malaysia').map(areaOf);
  return { area: intl.length ? Math.max(...intl) : 1, bad: [], mixed: intl.length > 0 && st.dests.includes('Malaysia') };
}

function update() {
  const annual = st.mode === 'annual';
  const { area, bad, mixed } = resolveArea();
  refreshAddons(area, annual);
  plansEl.innerHTML = '';
  fineEl.hidden = true;

  let n = null;
  if (!annual) {
    if (bad.length) { setMsg(`<b>${esc(bad.join(', '))}</b> dikecualikan dan tidak dilindungi TripCare 360. Buang negara ini untuk teruskan.`, 'err'); return; }
    if (depEl.value && retEl.value) {
      n = (utc(retEl.value) - utc(depEl.value)) / 864e5 + 1;
      if (n < 1) { setMsg('Tarikh balik mesti sama atau selepas tarikh pergi.', 'err'); return; }
      if (area === 1 && n > 30) { setMsg('Plan domestik maksimum 30 hari setiap trip.', 'err'); return; }
      if (area > 1 && n > 180) { setMsg('Plan antarabangsa maksimum 180 hari setiap trip. Pilih plan Annual jika anda kerap bermusafir.', 'err'); return; }
    }
    if (!depEl.value || !retEl.value || !area) {
      const miss = [];
      if (!depEl.value || !retEl.value) miss.push('tarikh pergi dan balik');
      if (!area) miss.push('destinasi');
      setMsg(`Lengkapkan ${miss.join(' dan ')} dahulu. Plan akan keluar automatik di sini.`);
      return;
    }
  }

  const plans = area === 1 ? [DOMESTIC] : PLANS;
  const sel = ADDONS.filter(a => st.addons.has(a.id));
  const cards = plans.map((p, i) => {
    const col = colOf(p, area);
    const base = price(RATES[st.cat], col, n, annual);
    if (base == null) return null;
    let total = base;
    const lines = [];
    sel.forEach(a => {
      const v = addonPrice(a.id, st.cat, col, area, n, annual);
      if (v != null) { lines.push([a.name, v]); total += v; }
    });
    total = round2(total);
    const msg = waMessage(p, total, area, n, lines);
    return `<article class="plan ${p.id}" style="--d:${i * 0.1}s">
      <span class="plan-tag">${p.name}</span>
      <div class="price"><small>RM</small>${fmt(total)}</div>
      <p class="plan-meta">${AREA_SHORT[area]} · ${annual ? 'Annual (12 bulan)' : n + ' hari'} · ${CAT[st.cat].name.split(' (')[0]}</p>
      ${lines.length ? `<div class="plan-lines"><div><span>Caruman asas</span><b>${rm(base)}</b></div>${lines.map(l => `<div><span>${esc(l[0])}</span><b>+${rm(l[1])}</b></div>`).join('')}</div>` : ''}
      <dl>${HEAD.map(h => { const v = h[1][p.idx]; return `<div><dt>${h[0]}</dt><dd class="${/Tiada/.test(v) ? 'no' : ''}">${v}</dd></div>`; }).join('')}</dl>
      <button type="button" class="btn btn-line" data-detail="${p.id}">Lihat semua coverage</button>
      <a class="btn btn-k" href="${waUrl(msg)}" target="_blank" rel="noopener"><svg class="ic fill"><use href="#i-wa"/></svg>Pilih ${p.name}</a>
    </article>`;
  });

  if (cards.every(c => c === null)) {
    setMsg(annual && st.cat === 'senior' ? 'Plan Annual domestik tidak tersedia untuk warga emas. Pilih Single Trip atau kawasan antarabangsa.' : 'Kombinasi ini tidak tersedia. Cuba tukar pilihan anda.', 'err');
    return;
  }

  const bits = [`<b>${annual ? AREA_LABEL[area] : AREA_SHORT[area]}</b>`, annual ? 'Annual · 12 bulan' : `${n} hari`, CAT[st.cat].name];
  setMsg(bits.map(b => `<span>${b}</span>`).join('') + (mixed ? '<span>Malaysia diabaikan, caruman ikut Area antarabangsa tertinggi.</span>' : ''), 'ok');
  plansEl.innerHTML = cards.filter(Boolean).join('');
  fineEl.hidden = false;
  fineEl.textContent = 'Harga indikatif berdasarkan brosur TripCare 360 Takaful (Etiqa), belum termasuk cukai kerajaan dan duti setem RM10 bagi setiap sijil. Caruman akhir disahkan semasa pendaftaran.';
}

function waMessage(p, total, area, n, lines) {
  const annual = st.mode === 'annual';
  const L = ['Hi Ammar, saya nak buat TripCare 360 Takaful.', ''];
  L.push(`Plan: ${p.name}`);
  L.push(`Jenis: ${annual ? 'Annual' : 'Single Trip'}`);
  if (annual) L.push(`Kawasan: ${AREA_LABEL[area]}`);
  else {
    L.push(`Destinasi: ${st.dests.join(', ')} (${AREA_SHORT[area]})`);
    L.push(`Tarikh: ${fmtD(depEl.value)} hingga ${fmtD(retEl.value)} (${n} hari)`);
  }
  L.push(`Traveller: ${CAT[st.cat].name}`);
  if (lines.length) L.push(`Tambahan: ${lines.map(l => l[0]).join(', ')}`);
  L.push(`Caruman (belum termasuk cukai & duti setem): ${rm(total)}`, '', 'Boleh Ammar bantu proses seterusnya?');
  return L.join('\n');
}

form.addEventListener('input', e => {
  const t = e.target;
  if (t === depEl) { retEl.min = depEl.value || todayISO; }
  if (t.name === 'mode') {
    st.mode = t.value;
    $('#singleFields').hidden = st.mode !== 'single';
    $('#annualFields').hidden = st.mode !== 'annual';
  }
  if (t.name === 'cat') st.cat = t.value;
  if (t.type !== 'checkbox' && t !== destInput) update();
});
form.addEventListener('submit', e => e.preventDefault());

/* ===== Modal plan ===== */
const modal = $('#planModal');
const cellHtml = v => {
  if (v === 'NC') return '<b class="nc">Tiada cover</b>';
  if (v === 'n/a') return '<b class="nc">Tiada</b>';
  return '<b>' + v.replace(/\d[\d,]*/g, m => 'RM' + m) + '</b>';
};
function openPlan(id) {
  const p = id === 'domestic' ? DOMESTIC : PLANS.find(x => x.id === id);
  $('#pmTitle').textContent = `${p.name} · TripCare 360 Takaful`;
  $('#pmBody').innerHTML = BEN.map(s => `<div class="m-sec">${s.sec}</div>` + s.rows.map(r => {
    const fam = r[2] && r[2][p.idx] && r[2][p.idx] !== 'NC' ? `<small>Maks. keluarga: ${r[2][p.idx].replace(/\d[\d,]*/g, m => 'RM' + m)}</small>` : '';
    return `<div class="m-row"><span>${r[0]}${fam}</span>${cellHtml(r[1][p.idx])}</div>`;
  }).join('')).join('') + '<p class="fine">Lebihan RM100 terpakai bagi manfaat Seksyen B dan D. Senarai ini tidak lengkap. Sila rujuk Sijil Takaful atau Product Disclosure Sheet.</p>';
  modal.showModal();
}
plansEl.addEventListener('click', e => { const b = e.target.closest('[data-detail]'); if (b) openPlan(b.dataset.detail); });
$$('[data-close-modal]').forEach(b => b.addEventListener('click', () => modal.close()));
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

/* ===== Jadual coverage ===== */
$('#covTbl').innerHTML = '<thead><tr><th>Benefit (per orang, RM)</th><th>Domestik</th><th>Silver</th><th class="g">Gold</th><th class="p">Platinum</th></tr></thead><tbody>' +
  BEN.map(s => `<tr class="secrow"><td colspan="5">${s.sec}${s.note ? `<small>${s.note}</small>` : ''}</td></tr>` +
    s.rows.map(r => `<tr><td>${r[0]}</td>${r[1].map((v, i) => {
      const f = r[2] && r[2][i] && r[2][i] !== 'NC' ? `<span class="fam">Keluarga: ${r[2][i].replace(/\d[\d,]*/g, m => 'RM' + m)}</span>` : '';
      return `<td>${cellHtml(v)}${f}</td>`;
    }).join('')}</tr>`).join('')).join('') + '</tbody>';

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
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

renderChips();
update();
})();
