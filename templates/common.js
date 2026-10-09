const F = require('./features');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const digits = s => String(s || '').replace(/\D/g, '');
const wa = (n, msg) => {
  let d = digits(n);
  if (d.length === 8) d = '506' + d;
  return d ? `https://wa.me/${d}?text=${encodeURIComponent(msg || 'Hola, quisiera hacer una consulta')}` : '#';
};
const tel = n => 'tel:+' + (digits(n).length === 8 ? '506' : '') + digits(n);
const money = p => {
  const s = String(p ?? '').trim();
  if (!s) return '';
  if (/[₡$]/.test(s)) return s;
  const n = Number(s.replace(/[^\d.]/g, ''));
  return isNaN(n) ? s : '₡' + n.toLocaleString('es-CR');
};
const img = (d, p, small) => (p ? `/d/${d.slug}/img/${p.id}${d.aiPhotos && p.ai ? '-ai' : ''}${small ? '-s' : ''}.webp` : '');
const photo = (d, id) => d.photos.find(p => p.id === id);
const mapsLink = d => d.location.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.location.address)}`;
const mapsEmbed = d =>
  /maps\/embed|output=embed/.test(d.location.url || '')
    ? d.location.url
    : `https://maps.google.com/maps?q=${encodeURIComponent(d.location.address)}&z=16&output=embed`;
const menuByCat = d => {
  const m = new Map();
  for (const it of d.menu) {
    const c = it.cat || 'Menú';
    if (!m.has(c)) m.set(c, []);
    m.get(c).push(it);
  }
  return [...m];
};
const socials = d =>
  [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['website', 'Sitio web']]
    .filter(([k]) => d.social[k])
    .map(([k, l]) => ({
      k, l,
      u: /^https?:/.test(d.social[k]) ? d.social[k] : (k === 'website' ? 'https://' : `https://${k}.com/`) + d.social[k].replace(/^@/, ''),
    }));
const ICON = {
  wa: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.25 1z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2 5h20v14H2zm2 2v.5l8 5 8-5V7zm16 3-8 5-8-5v7h16z"/></svg>',
};
const SOC_ICON = { facebook: 'f', instagram: 'ig', tiktok: 'tt', website: '↗' };

// JS compartido: reveal on scroll, lightbox, filtro de categorías, header, menú móvil
const clientJS = `
(()=>{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
const rv=[...document.querySelectorAll('[data-r]')];rv.forEach(el=>io.observe(el));
const chk=()=>rv.forEach(el=>{if(!el.classList.contains('in')&&el.getBoundingClientRect().top<innerHeight*.95){el.classList.add('in');io.unobserve(el)}});
requestAnimationFrame(chk);addEventListener('scroll',chk,{passive:true});addEventListener('load',chk);
const lb=document.createElement('div');lb.className='lb';lb.innerHTML='<button class="lb-x" aria-label="Cerrar">×</button><button class="lb-p" aria-label="Anterior">‹</button><img alt=""><button class="lb-n" aria-label="Siguiente">›</button>';document.body.appendChild(lb);
const items=[...document.querySelectorAll('[data-lb]')];let cur=0;const im=lb.querySelector('img');
const show=i=>{cur=(i+items.length)%items.length;im.src=items[cur].dataset.lb;im.alt=items[cur].dataset.alt||'';lb.classList.add('on')};
items.forEach((el,i)=>el.addEventListener('click',()=>show(i)));
lb.querySelector('.lb-x').onclick=()=>lb.classList.remove('on');lb.querySelector('.lb-p').onclick=e=>{e.stopPropagation();show(cur-1)};lb.querySelector('.lb-n').onclick=e=>{e.stopPropagation();show(cur+1)};
lb.onclick=e=>{if(e.target===lb)lb.classList.remove('on')};
addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key==='Escape')lb.classList.remove('on');if(e.key==='ArrowRight')show(cur+1);if(e.key==='ArrowLeft')show(cur-1)});
const tabs=document.querySelectorAll('[data-tab]');tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.classList.toggle('on',x===t));document.querySelectorAll('[data-cat]').forEach(c=>{c.hidden=t.dataset.tab!=='all'&&c.dataset.cat!==t.dataset.tab})}));
const h=document.querySelector('[data-hdr]');if(h){const f=()=>h.classList.toggle('scrolled',scrollY>40);f();addEventListener('scroll',f,{passive:true})}
const nav=document.querySelector('[data-burger]');if(nav)nav.addEventListener('click',()=>document.body.classList.toggle('nav-open'));
document.querySelectorAll('[data-nav] a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('nav-open')));
})();`;

const baseCSS = `*{box-sizing:border-box;margin:0}html,body{overflow-x:clip}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}img{max-width:100%;display:block}a{color:inherit}button{font:inherit;cursor:pointer}
[data-r]{opacity:0;transform:translateY(28px);transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1);transition-delay:var(--d,0s)}[data-r].in{opacity:1;transform:none}
.lb{position:fixed;inset:0;background:rgba(0,0,0,.92);display:none;align-items:center;justify-content:center;z-index:999;padding:2rem}.lb.on{display:flex;animation:fi .25s}.lb img{max-height:88vh;max-width:92vw;border-radius:6px;box-shadow:0 20px 80px #000}
.lb button{position:absolute;background:none;border:0;color:#fff;font-size:2.6rem;line-height:1;padding:.6rem 1rem;opacity:.8}.lb button:hover{opacity:1}.lb-x{top:1rem;right:1rem}.lb-p{left:.5rem;top:50%}.lb-n{right:.5rem;top:50%}
@keyframes fi{from{opacity:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}[data-r]{opacity:1;transform:none}}
.wa-fab{position:fixed;right:16px;bottom:16px;z-index:90;width:58px;height:58px;border-radius:50%;background:#25d366;color:#fff;display:grid;place-items:center;box-shadow:0 8px 24px rgba(0,0,0,.35);transition:transform .2s}.wa-fab:hover{transform:scale(1.08)}.wa-fab svg{width:30px;height:30px}`;

// Texto legible sobre el color principal
function onColor(hex) {
  const m = /^#?([\da-f]{6})$/i.exec(hex || '');
  if (!m) return '#fff';
  const n = parseInt(m[1], 16), lin = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
  const L = .2126 * lin(n >> 16) + .7152 * lin((n >> 8) & 255) + .0722 * lin(n & 255);
  return L > .4 ? '#111' : '#fff';
}

const HIDE_IDS = { especialidades: ['especialidades', 'top'], menu: ['menu'], galeria: ['galeria'], nosotros: ['nosotros'], ubicacion: ['ubicacion', 'visita', 'contacto'] };
const customCSS = d => {
  const ids = (d.custom?.hide || []).flatMap(k => HIDE_IDS[k] || []);
  return ids.length ? ids.map(i => `#${i},a[href="#${i}"]`).join(',') + '{display:none!important}' : '';
};
// Banda de aviso/horario justo después del hero (marcador <!--NOTICE--> en cada plantilla)
const noticeHTML = d => {
  const { notice, hours, daily } = d.custom || {};
  if (!notice && !hours && !daily) return '';
  return `<div class="notice">${daily ? `<b>⭐ Plato del día: ${esc(daily)}</b>` : ''}${notice ? `<b>${esc(notice)}</b>` : ''}${hours ? `<span>🕒 ${esc(hours)}</span>` : ''}</div>`;
};
const noticeCSS = '.notice{position:relative;z-index:4;background:var(--c1);color:var(--on1);display:flex;flex-wrap:wrap;gap:.4rem 2rem;justify-content:center;align-items:center;text-align:center;padding:16px 20px;font-size:1.05rem;box-shadow:0 8px 24px rgba(0,0,0,.18)}.notice b{font-weight:700}.notice span{opacity:.95}';

function shell(d, { fonts, css, body, theme }) {
  body = body.replace('<!--NOTICE-->', noticeHTML(d)).replace('<!--RESERVA-->', F.reserveHTML(d));
  const title = `${d.biz.name} — ${d.slogan}`;
  const hero = photo(d, d.hero);
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(d.biz.desc || d.slogan)}"><meta name="theme-color" content="${esc(theme)}">
<meta property="og:title" content="${esc(title)}">${hero ? `<meta property="og:image" content="${img(d, hero)}">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${fonts}&display=swap" rel="stylesheet">
<style>:root{--c1:${esc(d.biz.color)};${d.biz.color2 ? `--c2:${esc(d.biz.color2)};` : ''}--on1:${onColor(d.biz.color)}}${baseCSS}${noticeCSS}${F.css}${css}${customCSS(d)}</style></head><body>${body}
${d.contact.whatsapp ? `<a class="wa-fab" href="${wa(d.contact.whatsapp, 'Hola ' + d.biz.name + ', quisiera hacer una consulta')}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICON.wa}</a>` : d.contact.phone ? `<a class="wa-fab" style="background:#111" href="${tel(d.contact.phone)}" aria-label="Llamar">${ICON.phone}</a>` : ''}
<script>${clientJS}${F.js(d)}</script></body></html>`;
}
// Botón de contacto principal: WhatsApp si hay; si no, llamada; si no hay ninguno, nada
const cta = (d, msg, cls, waLabel, telLabel, icon = true) => {
  if (d.custom?.cta && icon) waLabel = telLabel = esc(d.custom.cta);
  if (d.contact.whatsapp) return `<a class="${cls}" href="${wa(d.contact.whatsapp, msg)}" target="_blank" rel="noopener">${icon ? ICON.wa + ' ' : ''}${waLabel}</a>`;
  if (d.contact.phone) return `<a class="${cls}" href="${tel(d.contact.phone)}">${icon ? ICON.phone + ' ' : ''}${telLabel}</a>`;
  return '';
};
const lazy = (src, alt, extra = '') => `<img src="${src}" alt="${esc(alt)}" loading="lazy" decoding="async" ${extra}>`;
module.exports = { F, cta, esc, wa, tel, money, img, photo, mapsLink, mapsEmbed, menuByCat, socials, ICON, SOC_ICON, shell, lazy };
