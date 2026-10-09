// PLANTILLA 2 — PREMIUM DINING: negro, dorado, fotografía editorial a pantalla completa
const c = require('./common');
const T = require('./tico');

module.exports = d => {
  const { esc, img, photo, lazy } = c;
  const hero = photo(d, d.hero);
  const cats = c.menuByCat(d);
  const tico = d.custom?.tico !== 'off';
  const waMsg = `Buenas, quisiera reservar una mesa en ${d.biz.name}`;
  const logo = d.logo ? `<img src="${d.logo}" alt="${esc(d.biz.name)}" class="logo">` : `<span class="logo-txt">${esc(d.biz.name)}</span>`;
  const roman = ['I', 'II', 'III'];

  const WL = T.uri(T.wheelLine('#c9a45c'));
  const css = `
:root{--f-panel:#17140f;--f-ink:#ece6da;--f-line:rgba(201,164,92,.3);--bg:#0b0a09;--bg2:#141210;--gold:#c9a45c;--gold2:#e8d3a2;--txt:#ece6da;--mut:#9b9284}
body{background:var(--bg);color:var(--txt);font-family:'Montserrat',system-ui,sans-serif;font-weight:300;line-height:1.75;font-size:16px;letter-spacing:.01em}
h1,h2,h3{font-family:'Cormorant Garamond',serif;font-weight:400;line-height:1.05}
.eyebrow{font-size:.72rem;letter-spacing:.42em;text-transform:uppercase;color:var(--gold);font-weight:500}
.wrap{max-width:1240px;margin:0 auto;padding:0 24px}
.gold-line{display:flex;align-items:center;gap:14px;justify-content:center;color:var(--gold)}.gold-line:before,.gold-line:after{content:'';height:1px;width:60px;background:linear-gradient(90deg,transparent,var(--gold))}.gold-line:after{transform:scaleX(-1)}
/* header */
.hdr{position:fixed;inset:0 0 auto;z-index:50;padding:22px 0;transition:.5s}
.hdr.scrolled{background:rgba(11,10,9,.86);backdrop-filter:blur(14px);padding:12px 0;border-bottom:1px solid rgba(201,164,92,.18)}
.hdr .wrap{display:flex;align-items:center;justify-content:space-between}
.logo{height:46px;width:auto;filter:drop-shadow(0 2px 8px rgba(0,0,0,.5))}.logo-txt{font-family:'Cormorant Garamond';font-size:1.6rem;letter-spacing:.12em;text-transform:uppercase}
.nav{display:flex;gap:2.4rem}.nav a{text-decoration:none;font-size:.72rem;letter-spacing:.3em;text-transform:uppercase;font-weight:500;position:relative}
.nav a:after{content:'';position:absolute;left:0;bottom:-6px;height:1px;width:0;background:var(--gold);transition:.4s}.nav a:hover:after{width:100%}
.burger{display:none;background:none;border:1px solid var(--gold);color:var(--gold);width:44px;height:44px;font-size:1.1rem}
@media(max-width:900px){.burger{display:block;position:relative;z-index:2}.nav{position:fixed;inset:0;background:var(--bg);flex-direction:column;align-items:center;justify-content:center;gap:2rem;opacity:0;pointer-events:none;transition:.4s}.nav-open .nav{opacity:1;pointer-events:auto}.nav a{font-size:.95rem}}
/* hero */
.hero{height:100svh;min-height:620px;position:relative;display:grid;place-items:center;text-align:center;overflow:hidden}
.hero .bg{position:absolute;inset:0}.hero .bg img{width:100%;height:100%;object-fit:cover;animation:zoom 24s ease-out forwards;transform:scale(1.18)}
@keyframes zoom{to{transform:scale(1)}}
.hero:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,.25),rgba(0,0,0,.78)),linear-gradient(180deg,rgba(0,0,0,.55),transparent 30%,transparent 60%,var(--bg))}
.hero .in{position:relative;z-index:2;padding:0 24px;max-width:960px}
.hero .hlogo{height:96px;width:auto;margin:0 auto 1.6rem;animation:up 1.4s .2s both}
.hero h1{font-size:clamp(3rem,10vw,7.5rem);font-weight:300;letter-spacing:.02em;animation:up 1.4s .4s both}
.hero h1 em{font-style:italic;color:var(--gold2)}
.hero p{font-family:'Cormorant Garamond';font-style:italic;font-size:clamp(1.3rem,3vw,1.9rem);color:var(--gold2);margin:1rem 0 2.6rem;animation:up 1.4s .6s both}
.hero .btns{animation:up 1.4s .8s both}
@keyframes up{from{opacity:0;transform:translateY(40px)}}
.btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:.7rem;padding:1.05rem 2.1rem;text-decoration:none;font-size:.72rem;letter-spacing:.28em;text-transform:uppercase;font-weight:600;transition:.4s;border:1px solid var(--gold)}
.btn-1{background:var(--gold);color:#0b0a09}.btn-1:hover{background:var(--gold2)}
.btn-2{color:var(--gold2);background:rgba(0,0,0,.25);backdrop-filter:blur(6px)}.btn-2:hover{background:var(--gold);color:#0b0a09}
.scroll{position:absolute;bottom:30px;left:50%;z-index:2;width:1px;height:60px;background:linear-gradient(var(--gold),transparent);animation:sc 2.2s infinite}
@keyframes sc{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
section{padding:clamp(80px,12vw,150px) 0}
.head{text-align:center;margin-bottom:clamp(3rem,6vw,5rem)}.head h2{font-size:clamp(2.6rem,6vw,4.6rem);margin-top:.8rem}
/* especialidades editoriales */
.feat{display:grid;grid-template-columns:1.25fr 1fr;align-items:center;gap:clamp(2rem,6vw,6rem);margin-bottom:clamp(4rem,9vw,8rem)}
.feat:nth-child(even){grid-template-columns:1fr 1.25fr}.feat:nth-child(even) .fi{order:2}
.fi{position:relative;aspect-ratio:4/3;overflow:hidden;cursor:zoom-in}
.fi:before{content:'';position:absolute;inset:18px;border:1px solid rgba(232,211,162,.45);z-index:2;pointer-events:none;transition:.6s}
.fi img{width:100%;height:100%;object-fit:cover;transition:transform 1.6s cubic-bezier(.2,.7,.2,1)}.fi:hover img{transform:scale(1.06)}.fi:hover:before{inset:28px}
.ft .num{font-family:'Cormorant Garamond';font-size:6rem;line-height:.8;color:transparent;-webkit-text-stroke:1px var(--gold);opacity:.6}
.ft h3{font-size:clamp(2.2rem,4.5vw,3.4rem);margin:.6rem 0 1rem}.ft p{color:var(--mut);max-width:42ch}
.ft .pr{font-family:'Cormorant Garamond';font-size:1.9rem;color:var(--gold);margin-top:1.4rem;display:flex;align-items:center;gap:1rem}.ft .pr:before{content:'';width:40px;height:1px;background:var(--gold)}
@media(max-width:820px){.feat,.feat:nth-child(even){grid-template-columns:1fr}.feat:nth-child(even) .fi{order:0}.ft{text-align:center}.ft p{margin:0 auto}.ft .pr{justify-content:center}}
/* quote banda */
.band{position:relative;padding:clamp(100px,16vw,200px) 0;text-align:center;overflow:hidden}
.band img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.35}
.band blockquote{position:relative;font-family:'Cormorant Garamond';font-style:italic;font-size:clamp(1.8rem,4.5vw,3.4rem);max-width:900px;margin:0 auto;padding:0 24px;color:var(--gold2)}
/* menú */
.menu{background:var(--bg2);border-top:1px solid rgba(201,164,92,.15);border-bottom:1px solid rgba(201,164,92,.15)}
.tabs{display:flex;gap:2rem;justify-content:center;flex-wrap:wrap;margin-bottom:3.5rem}
.tabs button{background:none;border:0;color:var(--mut);font-size:.72rem;letter-spacing:.3em;text-transform:uppercase;padding:.5rem 0;border-bottom:1px solid transparent;font-weight:500}
.tabs button.on,.tabs button:hover{color:var(--gold);border-color:var(--gold)}
.mcat{margin-bottom:3.5rem}.mcat>h3{font-size:2.4rem;text-align:center;margin-bottom:2rem;font-style:italic;color:var(--gold2)}
.mgrid{display:grid;grid-template-columns:1fr 1fr;gap:2rem 5rem}
.mi{display:grid;grid-template-columns:auto 1fr;gap:1.2rem;align-items:center}
.mi img{width:84px;height:84px;object-fit:cover;border-radius:50%;border:1px solid var(--gold);padding:3px;cursor:zoom-in}
.mi .r{display:flex;align-items:baseline;gap:.8rem}.mi .n{font-family:'Cormorant Garamond';font-size:1.45rem;font-weight:500}
.mi .dots{flex:1;border-bottom:1px solid rgba(201,164,92,.3)}.mi .p{color:var(--gold);font-family:'Cormorant Garamond';font-size:1.35rem}
.mi .ds{color:var(--mut);font-size:.88rem}.mi.nop{grid-template-columns:1fr}
@media(max-width:820px){.mgrid{grid-template-columns:1fr}}
/* galería */
.gal{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:240px;gap:10px}
.gal figure{overflow:hidden;cursor:zoom-in;position:relative}.gal figure:nth-child(5n+1){grid-column:span 2;grid-row:span 2}
.gal img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s,filter 1.2s;filter:grayscale(.25) brightness(.85)}.gal figure:hover img{transform:scale(1.08);filter:none}
@media(max-width:820px){.gal{grid-template-columns:1fr 1fr;grid-auto-rows:170px}}
/* nosotros */
.about{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,7vw,7rem);align-items:center}
.about .pic{aspect-ratio:3/4;overflow:hidden;position:relative}.about .pic img{width:100%;height:100%;object-fit:cover}
.about .pic:after{content:'';position:absolute;inset:auto -1px -1px auto;width:45%;height:45%;border-right:1px solid var(--gold);border-bottom:1px solid var(--gold);transform:translate(22px,22px)}
.about h2{font-size:clamp(2.4rem,5vw,4rem);margin:.8rem 0 1.6rem}.about p{color:var(--mut);margin-bottom:1.2rem}.about p:first-of-type:first-letter{font-family:'Cormorant Garamond';float:left;font-size:4.4rem;line-height:.8;padding:6px 10px 0 0;color:var(--gold)}
@media(max-width:820px){.about{grid-template-columns:1fr}}
/* visita */
.visit{display:grid;grid-template-columns:1fr 1fr;border:1px solid rgba(201,164,92,.25)}
.visit iframe{width:100%;height:100%;min-height:440px;border:0;filter:grayscale(1) invert(.92) contrast(.9) sepia(.2)}
.visit .card{padding:clamp(2rem,5vw,4rem);display:flex;flex-direction:column;justify-content:center;gap:1.6rem}
.visit h3{font-size:2.6rem}.ci{display:flex;gap:1rem;align-items:flex-start;text-decoration:none;color:var(--txt)}.ci svg{color:var(--gold);flex:none;margin-top:4px}.ci small{display:block;font-size:.66rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold)}
.soc{display:flex;gap:.7rem}.soc a{width:44px;height:44px;border:1px solid var(--gold);display:grid;place-items:center;color:var(--gold);text-decoration:none;font-size:.75rem;letter-spacing:.05em;font-weight:600;transition:.3s;border-radius:50%}.soc a:hover{background:var(--gold);color:#0b0a09}
.visit .btns{justify-content:flex-start}
@media(max-width:820px){.visit{grid-template-columns:1fr}.visit iframe{min-height:300px}}
footer{padding:3rem 0;text-align:center;border-top:1px solid rgba(201,164,92,.15);color:var(--mut);font-size:.8rem;letter-spacing:.2em;text-transform:uppercase}
.res-card{border:1px solid rgba(201,164,92,.3)}.res-card h3{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:2rem}
${tico ? `/* ── toque tico, discreto ── */
#especialidades{position:relative;overflow:hidden}
#especialidades:before{content:'';position:absolute;width:640px;height:640px;left:50%;top:-180px;margin-left:-320px;background:${WL} center/contain no-repeat;opacity:.09;animation:spin 120s linear infinite;pointer-events:none}
@keyframes spin{to{transform:rotate(360deg)}}
#especialidades .wrap{position:relative}
.band:after{content:'';position:absolute;width:520px;height:520px;left:50%;top:50%;margin:-260px 0 0 -260px;background:${WL} center/contain no-repeat;opacity:.22;animation:spin 140s linear infinite reverse}
.band blockquote{z-index:1}
footer .cr{display:block;margin-top:.8rem;letter-spacing:.3em;color:var(--gold)}footer .cr img{width:22px;display:inline-block;vertical-align:middle;margin-right:8px}` : ''}
`;
  const words = esc(d.biz.name).split(' ');
  const h1 = words.length > 1 ? words.slice(0, -1).join(' ') + ' <em>' + words[words.length - 1] + '</em>' : words[0];
  const bandPic = photo(d, d.gallery[1] || d.hero);

  const body = `
<header class="hdr" data-hdr><div class="wrap">${d.logo ? logo : `<span class="logo-txt">${esc(d.biz.name)}</span>`}
<nav class="nav" data-nav><a href="#especialidades">Especialidades</a><a href="#menu">Carta</a><a href="#galeria">Galería</a><a href="#nosotros">Nosotros</a><a href="${c.F.flags(d).reserve ? '#reservar' : '#visita'}">Reservas</a></nav>
<button class="burger" data-burger aria-label="Menú">☰</button></div></header>

<section class="hero" style="padding:0">${hero ? `<div class="bg"><img src="${img(d, hero)}" alt="" fetchpriority="high"></div>` : ''}
<div class="in">${d.logo ? `<img class="hlogo" src="${d.logo}" alt="">` : `<div class="eyebrow" style="animation:up 1.4s .2s both">${esc(d.type || 'Experiencia gastronómica')}</div>`}
<h1>${h1}</h1><p>${esc(d.slogan)}</p>
<div class="btns">${c.cta(d, waMsg, 'btn btn-1', 'Reservar mesa', 'Reservar mesa')}<a class="btn btn-2" href="${c.mapsLink(d)}" target="_blank" rel="noopener">${c.ICON.pin} Cómo llegar</a></div></div>
<div class="scroll"></div></section><!--NOTICE-->

${d.specials.length ? `<section id="especialidades"><div class="wrap">
 <div class="head" data-r><div class="gold-line eyebrow">Signature</div><h2>Especialidades de la casa</h2></div>
 ${d.specials.map((s, i) => `<article class="feat"><div class="fi" data-r data-lb="${img(d, photo(d, s.id))}" data-alt="${esc(s.name)}">${lazy(img(d, photo(d, s.id)), s.name)}</div>
  <div class="ft" data-r style="--d:.2s"><div class="num">${roman[i]}</div><h3>${esc(s.name)}</h3>${s.desc ? `<p>${esc(s.desc)}</p>` : ''}${s.price ? `<div class="pr">${c.money(s.price)}</div>` : ''}</div></article>`).join('')}
</div></section>` : ''}

${bandPic ? `<div class="band"><img src="${img(d, bandPic)}" alt="" loading="lazy"><blockquote data-r>“${esc(d.slogan)}”<div class="gold-line eyebrow" style="margin-top:1.6rem;font-style:normal;font-family:Montserrat">${esc(d.biz.name)}</div></blockquote></div>` : ''}

${cats.length ? `<section id="menu" class="menu"><div class="wrap">
 <div class="head" data-r><div class="gold-line eyebrow">La carta</div><h2>Nuestro Menú</h2></div>
 ${cats.length > 1 ? `<div class="tabs" data-r><button class="on" data-tab="all">Todo</button>${cats.map(([k]) => `<button data-tab="${esc(k)}">${esc(k)}</button>`).join('')}</div>` : ''}
 ${cats.map(([k, items]) => `<div class="mcat" data-cat="${esc(k)}"><h3 data-r>${esc(k)}</h3><div class="mgrid">${items.map((it, i) => {
    const p = photo(d, it.photo);
    return `<div class="mi${p ? '' : ' nop'}" data-r style="--d:${(i % 2) * .1}s">${p ? `<img src="${img(d, p, 1)}" alt="${esc(it.name)}" loading="lazy" data-lb="${img(d, p)}" data-alt="${esc(it.name)}">` : ''}<div><div class="r"><span class="n">${esc(it.name)}</span><span class="dots"></span><span class="p">${c.money(it.price)}</span></div>${it.desc ? `<div class="ds">${esc(it.desc)}</div>` : ''}</div></div>`;
  }).join('')}</div></div>`).join('')}
</div></section>` : ''}

${d.gallery.length ? `<section id="galeria"><div class="wrap"><div class="head" data-r><div class="gold-line eyebrow">Ambiente</div><h2>Galería</h2></div>
 <div class="gal">${d.gallery.map((id, i) => { const p = photo(d, id); return `<figure data-r style="--d:${(i % 4) * .08}s;background:${p.dom}" data-lb="${img(d, p)}">${lazy(img(d, p, i % 5 ? 1 : 0), d.biz.name)}</figure>`; }).join('')}</div>
</div></section>` : ''}

<section id="nosotros" style="padding-top:0"><div class="wrap about">
 <div class="pic" data-r>${d.aboutPics[0] ? lazy(img(d, photo(d, d.aboutPics[0])), d.biz.name) : ''}</div>
 <div data-r style="--d:.2s"><div class="eyebrow">Nuestra filosofía</div><h2>${esc(d.biz.name)}</h2>${d.about.map(p => `<p>${esc(p)}</p>`).join('')}</div>
</div></section>

<!--RESERVA-->
<section id="visita" style="padding-top:0"><div class="wrap">
 <div class="head" data-r><div class="gold-line eyebrow">Reservaciones</div><h2>Le esperamos</h2></div>
 <div class="visit" data-r><iframe src="${c.mapsEmbed(d)}" loading="lazy" title="Mapa" referrerpolicy="no-referrer-when-downgrade"></iframe>
  <div class="card"><h3>Visítenos</h3>
   <a class="ci" href="${c.mapsLink(d)}" target="_blank" rel="noopener">${c.ICON.pin}<span><small>Dirección</small>${esc(d.location.address)}</span></a>
   ${d.contact.phone ? `<a class="ci" href="${c.tel(d.contact.phone)}">${c.ICON.phone}<span><small>Teléfono</small>${esc(d.contact.phone)}</span></a>` : ''}
   ${d.contact.whatsapp ? `<a class="ci" href="${c.wa(d.contact.whatsapp, waMsg)}" target="_blank" rel="noopener">${c.ICON.wa}<span><small>WhatsApp</small>${esc(d.contact.whatsapp)}</span></a>` : ''}
   ${d.contact.email ? `<a class="ci" href="mailto:${esc(d.contact.email)}">${c.ICON.mail}<span><small>Correo</small>${esc(d.contact.email)}</span></a>` : ''}
   <div class="soc">${c.socials(d).map(s => `<a href="${esc(s.u)}" target="_blank" rel="noopener" aria-label="${s.l}">${c.SOC_ICON[s.k]}</a>`).join('')}</div>
   <div class="btns">${c.cta(d, waMsg, 'btn btn-1', 'Reservar', 'Reservar', false)}<a class="btn btn-2" href="${c.mapsLink(d)}" target="_blank" rel="noopener">Cómo llegar</a></div>
  </div></div>
</div></section>
<footer>© ${new Date().getFullYear()} ${esc(d.biz.name)}${tico ? `<span class="cr"><img src="data:image/svg+xml,${encodeURIComponent(T.flag)}" alt="">Alta cocina con alma costarricense</span>` : ''}</footer>`;

  return c.shell(d, { fonts: 'family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Montserrat:wght@300;400;500;600', css, body, theme: '#0b0a09' });
};
