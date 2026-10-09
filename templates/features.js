// Funciones interactivas de la demo (gratis, todo en el navegador del cliente):
// reservaciones por WhatsApp y buscador del menú.
// Se adaptan a cada plantilla con variables: --f-panel, --f-ink, --f-line (y --c1/--on1 del negocio).

const flags = d => {
  const f = { reserve: true, search: true, ...(d.features || {}) };
  if (!d.contact.whatsapp) f.reserve = false; // la reserva se envía por WhatsApp
  return f;
};

const css = `
:root{--f-panel:#fff;--f-ink:#1a1a1a;--f-line:rgba(0,0,0,.12)}
.f-in{width:100%;padding:11px 12px;border-radius:10px;border:1px solid var(--f-line);background:transparent;color:inherit;font:inherit;font-size:.95rem}
.f-in option{color:#111}
.f-send{display:flex;align-items:center;justify-content:center;gap:.6rem;background:#25d366;color:#fff;border:0;border-radius:12px;padding:15px;font:700 1rem system-ui,sans-serif;cursor:pointer}
.f-send:hover{filter:brightness(1.06)}
.f-res{padding:clamp(60px,9vw,110px) 0}
.res-card{max-width:760px;margin:0 auto;background:var(--f-panel);color:var(--f-ink);border-radius:20px;padding:clamp(1.4rem,4vw,2.6rem);box-shadow:0 25px 60px rgba(0,0,0,.18);display:grid;grid-template-columns:repeat(3,1fr);gap:12px;font-family:system-ui,sans-serif}
.res-card .full{grid-column:1/-1}.res-card label{display:block;font-size:.8rem;font-weight:600;margin-bottom:4px;opacity:.75}
.res-card h3{grid-column:1/-1;font-size:1.4rem;margin-bottom:4px}.res-card p{grid-column:1/-1;opacity:.75;font-size:.95rem;margin-bottom:6px}
@media(max-width:640px){.res-card{grid-template-columns:1fr 1fr}.res-card .wide{grid-column:1/-1}}
.m-search{display:block;max-width:420px;margin:0 auto 1.4rem;padding:12px 18px 12px 42px;border-radius:999px;border:1px solid currentColor;background:transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' stroke='%23999' stroke-width='2'%3E%3Ccircle cx='8' cy='8' r='6'/%3E%3Cpath d='m13 13 4 4'/%3E%3C/svg%3E") 16px center no-repeat;color:inherit;font:inherit;font-size:1rem;opacity:.9;width:100%}
.m-none{text-align:center;opacity:.7;padding:1rem;display:none}
`;

const WA = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>';

// Sección de reservaciones
const reserveHTML = d => !flags(d).reserve ? '' : `
<section class="f-res" id="reservar"><div class="wrap"><form class="res-card" id="resForm" data-r>
<h3>Reservá tu mesa</h3><p>Escogé el día y la hora; te confirmamos por WhatsApp.</p>
<div class="wide"><label>Fecha</label><input class="f-in" type="date" id="rDate" required></div>
<div><label>Hora</label><input class="f-in" type="time" id="rTime" value="19:00" required></div>
<div><label>Personas</label><select class="f-in" id="rPpl">${Array.from({ length: 12 }, (_, i) => `<option${i === 1 ? ' selected' : ''}>${i + 1}</option>`).join('')}<option>13 o más</option></select></div>
<div class="full"><label>Nombre</label><input class="f-in" id="rName" required placeholder="¿A nombre de quién?"></div>
<div class="full"><label>Ocasión o nota (opcional)</label><input class="f-in" id="rNote" placeholder="Cumpleaños, aniversario, silla para bebé…"></div>
<button class="f-send full" type="submit">${WA} Solicitar reservación</button></form></div></section>`;

const js = d => {
  const f = flags(d);
  const waNum = (() => { let n = String(d.contact.whatsapp || '').replace(/\D/g, ''); if (n.length === 8) n = '506' + n; return n; })();
  return `
(()=>{const WA=${JSON.stringify(waNum)},BIZ=${JSON.stringify(d.biz.name)};const $=s=>document.querySelector(s);
${f.search ? `
// buscador del menú
const menu=document.querySelector('#menu');if(menu&&menu.querySelectorAll('.mi').length>5){
 const first=menu.querySelector('.tabs')||menu.querySelector('.mcat');const inp=document.createElement('input');inp.type='search';inp.className='m-search';inp.placeholder='Buscar en el menú…';first.parentNode.insertBefore(inp,first);
 const none=document.createElement('div');none.className='m-none';none.textContent='No encontramos ese platillo';first.parentNode.appendChild(none);
 const n=s=>s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');
 inp.addEventListener('input',()=>{const q=n(inp.value.trim());let any=0;
  menu.querySelectorAll('.mcat').forEach(c=>{let k=0;c.querySelectorAll('.mi').forEach(m=>{const ok=!q||n(m.textContent).includes(q);m.style.display=ok?'':'none';k+=ok});c.hidden=!k;any+=k});
  none.style.display=any?'none':'block';if(q)menu.querySelectorAll('[data-tab]').forEach(t=>t.classList.toggle('on',t.dataset.tab==='all'))});}` : ''}
${f.reserve ? `
// reservaciones
const rf=$('#resForm');if(rf){const today=new Date().toISOString().slice(0,10);$('#rDate').min=today;$('#rDate').value=today;
 rf.onsubmit=e=>{e.preventDefault();const dt=new Date($('#rDate').value+'T12:00').toLocaleDateString('es-CR',{weekday:'long',day:'numeric',month:'long'});
  const t=['¡Hola '+BIZ+'! Quisiera reservar una mesa:','','📅 '+dt,'🕒 '+$('#rTime').value,'👥 '+$('#rPpl').value+' personas','🙋 A nombre de: '+$('#rName').value,$('#rNote').value?'📝 '+$('#rNote').value:''].filter(Boolean).join('\\n');
  window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(t),'_blank')}}` : ''}
})();`;
};

module.exports = { css, reserveHTML, js, flags };
