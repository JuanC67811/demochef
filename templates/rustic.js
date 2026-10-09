// PLANTILLA 1 — RUSTIC CR: madera, papel, pizarra, calidez de soda familiar
const c = require('./common');
const T = require('./tico');

module.exports = d => {
  const { esc, img, photo, lazy } = c;
  const hero = photo(d, d.hero);
  const cats = c.menuByCat(d);
  const tico = d.custom?.tico !== 'off';
  const waMsg = `¡Hola ${d.biz.name}! Quisiera hacer un pedido`;
  const logo = d.logo ? `<img src="${d.logo}" alt="${esc(d.biz.name)}" class="logo">` : `<span class="logo-txt">${esc(d.biz.name)}</span>`;

  const W = T.uri(T.wheel()), WS = T.wheel({ size: 120 }), LEAF = T.uri(T.leaf()), BEANS = T.uri(T.beans());
  const css = `
:root{--f-panel:#fffaf0;--f-ink:#2a1a10;--f-line:rgba(59,36,22,.18);--wood:#3b2416;--wood2:#5a3820;--paper:#f6ecda;--paper2:#efe0c4;--ink:#2a1a10;--acc:var(--c1);--acc2:var(--c2)}
body{font-family:'Lora',Georgia,serif;background:var(--paper);color:var(--ink);line-height:1.65;font-size:17px;
 background-image:radial-gradient(rgba(90,56,32,.06) 1px,transparent 1px);background-size:4px 4px}
h1,h2,h3{font-family:'Alfa Slab One',serif;font-weight:400;line-height:1.08;letter-spacing:.5px}
.script{font-family:'Caveat',cursive;color:var(--acc);font-size:1.7rem;line-height:1}
.wrap{max-width:1180px;margin:0 auto;padding:0 20px}
.wood{background:var(--wood);color:var(--paper);background-image:
 repeating-linear-gradient(90deg,rgba(0,0,0,.0) 0 38px,rgba(0,0,0,.18) 38px 40px),
 repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 2px,transparent 2px 7px),
 linear-gradient(180deg,#4a2d1a,#2f1c10)}
/* header */
.hdr{position:fixed;top:0;left:0;right:0;z-index:50;transition:.35s;padding:14px 0}
.hdr.scrolled{background:rgba(47,28,16,.94);backdrop-filter:blur(8px);padding:8px 0;box-shadow:0 6px 24px rgba(0,0,0,.25)}
.hdr .wrap{display:flex;align-items:center;justify-content:space-between;gap:1rem}
.logo{height:52px;width:auto;border-radius:50%;background:var(--paper);padding:3px}.logo-txt{font-family:'Alfa Slab One';color:var(--paper);font-size:1.3rem}
.nav{display:flex;gap:1.6rem}.nav a{color:var(--paper);text-decoration:none;font-weight:600;font-size:.95rem;opacity:.9}.nav a:hover{color:var(--acc2,#f3c27a)}
.burger{display:none;background:none;border:0;color:var(--paper);font-size:1.8rem}
@media(max-width:820px){.burger{display:block}.nav{position:fixed;inset:0;background:var(--wood);flex-direction:column;align-items:center;justify-content:center;font-size:1.6rem;opacity:0;visibility:hidden;transition:.35s}.nav-open .nav{opacity:1;visibility:visible}.nav a{font-size:1.5rem}.burger{position:relative;z-index:2}}
/* hero */
.hero{min-height:100svh;display:grid;align-items:center;padding:110px 0 70px;position:relative;overflow:hidden}
.hero .wrap{display:grid;grid-template-columns:1.05fr .95fr;gap:3rem;align-items:center}
.hero h1{font-size:clamp(2.6rem,7vw,5.2rem);margin:.4rem 0 1rem;text-shadow:0 3px 0 rgba(0,0,0,.35)}
.hero p.lead{font-size:1.15rem;max-width:34ch;opacity:.92}
.arch{aspect-ratio:4/5;border-radius:999px 999px 18px 18px;overflow:hidden;border:10px solid var(--paper2);box-shadow:0 30px 60px rgba(0,0,0,.45),0 0 0 2px var(--acc);position:relative}
.arch img{width:100%;height:100%;object-fit:cover;animation:kb 18s ease-in-out infinite alternate}
@keyframes kb{to{transform:scale(1.1)}}
.stamp{position:absolute;bottom:-8px;left:-18px;background:var(--acc);color:#fff;width:118px;height:118px;border-radius:50%;display:grid;place-items:center;text-align:center;font-family:'Caveat';font-size:1.3rem;line-height:1;transform:rotate(-12deg);box-shadow:0 10px 30px rgba(0,0,0,.4);border:3px dashed rgba(255,255,255,.6);padding:10px}
.btns{display:flex;gap:.8rem;flex-wrap:wrap;margin-top:2rem}
.btn{display:inline-flex;align-items:center;gap:.55rem;padding:.95rem 1.5rem;border-radius:10px;font-weight:700;text-decoration:none;transition:.25s;font-family:'Lora'}
.btn-wa{background:#25d366;color:#fff;box-shadow:0 6px 0 #178a42}.btn-wa:hover{transform:translateY(-2px)}
.btn-go{background:var(--paper);color:var(--wood);box-shadow:0 6px 0 #c9b38d}.btn-go:hover{transform:translateY(-2px)}
@media(max-width:820px){.hero .wrap{grid-template-columns:1fr;text-align:center}.hero p.lead{margin:0 auto}.btns{justify-content:center}.arch{max-width:340px;margin:0 auto}.hero{padding-top:96px}}
.torn{height:28px;background:var(--paper);-webkit-mask:radial-gradient(14px at 50% 0,transparent 98%,#000) 0 0/28px 100%;mask:radial-gradient(14px at 50% 0,transparent 98%,#000) 0 0/28px 100%;margin-top:-27px;position:relative}
/* secciones */
section{padding:90px 0}
.head{text-align:center;margin-bottom:3rem}.head h2{font-size:clamp(2rem,5vw,3.2rem);color:var(--wood)}
.head .rule{width:120px;height:10px;margin:1rem auto 0;background:radial-gradient(circle,var(--acc) 3px,transparent 4px) center/20px 10px repeat-x}
/* especialidades: polaroids */
.specs{display:grid;grid-template-columns:repeat(3,1fr);gap:2.4rem}
.pol{background:#fffaf0;padding:14px 14px 22px;box-shadow:0 18px 40px rgba(59,36,22,.22);transition:.4s;cursor:zoom-in}
.pw:nth-child(1) .pol{transform:rotate(-2.5deg)}.pw:nth-child(3) .pol{transform:rotate(2deg)}.pw:nth-child(2) .pol{transform:translateY(-18px)}
.pw .pol.pol:hover{transform:rotate(0) scale(1.04)}
.pol .ph{aspect-ratio:1;overflow:hidden;position:relative}.pol img{width:100%;height:100%;object-fit:cover}
.pol .tag{position:absolute;top:12px;right:-8px;background:var(--acc);color:#fff;font-family:'Caveat';font-size:1.3rem;padding:2px 14px;box-shadow:0 4px 10px rgba(0,0,0,.3)}
.pol h3{font-size:1.35rem;margin:1rem 0 .3rem;color:var(--wood)}.pol p{font-size:.95rem;opacity:.8}.pol .pr{font-family:'Caveat';font-size:1.8rem;color:var(--acc)}
@media(max-width:820px){.specs{grid-template-columns:1fr;max-width:400px;margin:0 auto}.pw .pol{transform:none}}
/* menú: pizarra */
.menu-sec{position:relative}
.board{background:#22261f;color:#efe9dc;border:16px solid #6b4426;border-radius:8px;box-shadow:inset 0 0 80px rgba(0,0,0,.6),0 30px 60px rgba(0,0,0,.3);padding:clamp(1.2rem,4vw,3rem);
 background-image:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.06),transparent 60%)}
.board h2{color:#fff}.tabs{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-bottom:2rem}
.tabs button{background:transparent;border:2px solid rgba(255,255,255,.25);color:#efe9dc;padding:.4rem 1rem;border-radius:999px;font-family:'Caveat';font-size:1.3rem}
.tabs button.on,.tabs button:hover{background:var(--acc);border-color:var(--acc);color:#fff}
.mcat h3{font-family:'Caveat';font-size:2.2rem;color:var(--acc2,#f3c27a);margin:1.2rem 0 .6rem;font-weight:700}
.mgrid{display:grid;grid-template-columns:1fr 1fr;gap:.4rem 3rem}
.mi{display:flex;gap:1rem;padding:.8rem 0;border-bottom:1px dashed rgba(255,255,255,.15);align-items:center}
.mi img{width:72px;height:72px;border-radius:50%;object-fit:cover;flex:none;border:3px solid rgba(255,255,255,.2);cursor:zoom-in}
.mi .t{flex:1;min-width:0}.mi .r{display:flex;align-items:baseline;gap:.5rem}.mi .n{font-weight:700;font-size:1.05rem}
.mi .dots{flex:1;border-bottom:2px dotted rgba(255,255,255,.3);transform:translateY(-4px)}.mi .p{font-family:'Caveat';font-size:1.6rem;color:var(--acc2,#f3c27a);white-space:nowrap}
.mi .ds{font-size:.88rem;opacity:.7;font-style:italic}
@media(max-width:820px){.mgrid{grid-template-columns:1fr}}
/* galería */
.gal{columns:3 260px;column-gap:14px}.gal figure{break-inside:avoid;margin-bottom:14px;border-radius:12px;overflow:hidden;cursor:zoom-in;position:relative;border:6px solid #fffaf0;box-shadow:0 10px 24px rgba(59,36,22,.18)}
.gal img{width:100%;transition:transform .8s}.gal figure:hover img{transform:scale(1.07)}
/* nosotros */
.about{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
.about .pics{position:relative;aspect-ratio:1}.about .pics img{position:absolute;object-fit:cover;border:8px solid #fffaf0;box-shadow:0 20px 40px rgba(0,0,0,.25)}
.about .pics img:first-child{width:72%;height:80%;top:0;left:0;transform:rotate(-3deg)}.about .pics img:last-child{width:58%;height:60%;bottom:0;right:0;transform:rotate(4deg)}
.about h2{font-size:clamp(2rem,4.5vw,3rem);color:var(--wood);margin:.3rem 0 1.2rem}.about p{margin-bottom:1rem}
@media(max-width:820px){.about{grid-template-columns:1fr;gap:2.5rem}}
/* ubicación y contacto */
.loc{display:grid;grid-template-columns:1.2fr .8fr;gap:0;border-radius:18px;overflow:hidden;box-shadow:0 25px 50px rgba(0,0,0,.35)}
.loc iframe{width:100%;height:100%;min-height:380px;border:0;filter:sepia(.35) saturate(.9)}
.loc .card{background:var(--paper);color:var(--ink);padding:2.4rem}
.loc h3{font-size:1.6rem;margin-bottom:1rem;color:var(--wood)}
.ci{display:flex;gap:.8rem;align-items:center;padding:.7rem 0;border-bottom:1px dashed #cdb48c;text-decoration:none}.ci svg{color:var(--acc);flex:none}
.soc{display:flex;gap:.6rem;margin-top:1.4rem;flex-wrap:wrap}.soc a{background:var(--wood);color:var(--paper);padding:.5rem 1rem;border-radius:999px;text-decoration:none;font-weight:600;font-size:.9rem}.soc a:hover{background:var(--acc)}
@media(max-width:820px){.loc{grid-template-columns:1fr}.loc iframe{min-height:280px}}
footer{padding:2.5rem 0;text-align:center;font-size:.9rem;opacity:.85}
${tico ? `/* ── toque tico ── */
body{background-image:${BEANS},radial-gradient(rgba(90,56,32,.06) 1px,transparent 1px);background-size:200px 200px,4px 4px}
.hero .wheel{position:absolute;width:min(560px,60vw);aspect-ratio:1;right:-140px;top:50%;margin-top:-280px;background:${W} center/contain no-repeat;opacity:.9;animation:spin 90s linear infinite;filter:drop-shadow(0 20px 40px rgba(0,0,0,.5))}
@keyframes spin{to{transform:rotate(360deg)}}
.hero .wrap{position:relative;z-index:1}
.stamp{background:var(--acc);font-size:1.45rem}.stamp img{width:30px;margin:4px auto 0;border-radius:2px;box-shadow:0 0 0 2px #fff}
.rule{width:auto;height:auto;background:none;display:flex;gap:10px;justify-content:center;align-items:center}.rule svg{width:34px;height:34px}.rule:before,.rule:after{content:'';width:60px;height:2px;background:var(--acc);opacity:.6}
#especialidades{background:${T.mantel('#b03a2e')};position:relative}
#especialidades:before{content:'';position:absolute;inset:0;background:linear-gradient(var(--paper),transparent 18%,transparent 82%,var(--paper));pointer-events:none}
#especialidades .wrap{position:relative}
.pw{position:relative}.pol{position:relative;z-index:1}
.pw:before{content:'';position:absolute;left:-24%;right:-24%;top:8%;height:84%;background:${LEAF} center/100% 100% no-repeat;z-index:0;transform:rotate(-14deg);filter:drop-shadow(0 10px 14px rgba(0,0,0,.25))}
.pw:nth-child(2):before{transform:rotate(10deg)}.pw:nth-child(3):before{transform:rotate(-4deg) scaleX(-1)}
.specs{isolation:isolate}
.board{position:relative}.board .chorr{position:absolute;right:clamp(10px,3vw,40px);top:clamp(10px,3vw,30px);width:clamp(54px,8vw,96px);opacity:.9}
.mi img{border-color:#7fb069}
.about .pics:after{content:'';position:absolute;width:110px;height:110px;right:-20px;top:-20px;background:${W} center/contain no-repeat;animation:spin 40s linear infinite;z-index:2}
footer .cr{display:inline-flex;align-items:center;gap:8px;margin-top:.6rem;font-family:'Caveat';font-size:1.4rem}footer .cr img{width:28px;border-radius:2px}
@media(max-width:820px){.hero .wheel{width:420px;right:-210px;top:auto;bottom:-120px;margin:0;opacity:.55}}` : ''}
`;

  const body = `
<header class="hdr" data-hdr><div class="wrap">${logo}
<nav class="nav" data-nav><a href="#especialidades">Especialidades</a><a href="#menu">Menú</a><a href="#galeria">Galería</a><a href="#nosotros">Nosotros</a><a href="#ubicacion">Ubicación</a>${c.F.flags(d).reserve ? '<a href="#reservar">Reservar</a>' : ''}</nav>
<button class="burger" data-burger aria-label="Menú">☰</button></div></header>

<section class="hero wood">${tico ? '<div class="wheel" aria-hidden="true"></div>' : ''}<div class="wrap">
 <div data-r><span class="script">¡Bienvenidos a la mesa!</span><h1>${esc(d.biz.name)}</h1><p class="lead">${esc(d.slogan)}</p>
  <div class="btns">${c.cta(d, waMsg, 'btn btn-wa', 'Pedir por WhatsApp', 'Llamar para pedir')}
  <a class="btn btn-go" href="${c.mapsLink(d)}" target="_blank" rel="noopener">${c.ICON.pin} Cómo llegar</a></div></div>
 <div data-r style="--d:.2s;position:relative">${hero ? `<div class="arch"><img src="${img(d, hero)}" alt="${esc(d.biz.name)}" fetchpriority="high"></div>` : ''}<div class="stamp">${tico ? `<span>¡Pura vida!<img src="data:image/svg+xml,${encodeURIComponent(T.flag)}" alt=""></span>` : 'Hecho con cariño'}</div></div>
</div></section><div class="torn"></div><!--NOTICE-->

${d.specials.length ? `<section id="especialidades"><div class="wrap">
 <div class="head" data-r><span class="script">Lo que más piden</span><h2>Especialidades de la casa</h2><div class="rule">${tico ? WS : ''}</div></div>
 <div class="specs">${d.specials.map((s, i) => `<div class="pw" data-r style="--d:${i * .12}s"><article class="pol" data-lb="${img(d, photo(d, s.id))}" data-alt="${esc(s.name)}">
  <div class="ph">${lazy(img(d, photo(d, s.id)), s.name)}<span class="tag">${['¡La favorita!', 'Recomendado', 'De la casa'][i]}</span></div>
  <h3>${esc(s.name)}</h3>${s.desc ? `<p>${esc(s.desc)}</p>` : ''}${s.price ? `<div class="pr">${c.money(s.price)}</div>` : ''}</article></div>`).join('')}</div>
</div></section>` : ''}

${cats.length ? `<section id="menu" class="menu-sec"><div class="wrap"><div class="board" data-r>
 ${tico ? `<img class="chorr" alt="" src="data:image/svg+xml,${encodeURIComponent(T.chorreador())}">` : ''}<div class="head"><span class="script">Hoy en la cocina</span><h2>Nuestro Menú</h2></div>
 ${cats.length > 1 ? `<div class="tabs"><button class="on" data-tab="all">Todo</button>${cats.map(([k]) => `<button data-tab="${esc(k)}">${esc(k)}</button>`).join('')}</div>` : ''}
 ${cats.map(([k, items]) => `<div class="mcat" data-cat="${esc(k)}"><h3>${esc(k)}</h3><div class="mgrid">${items.map(it => {
    const p = photo(d, it.photo);
    return `<div class="mi">${p ? `<img src="${img(d, p, 1)}" alt="${esc(it.name)}" loading="lazy" data-lb="${img(d, p)}" data-alt="${esc(it.name)}">` : ''}<div class="t"><div class="r"><span class="n">${esc(it.name)}</span><span class="dots"></span><span class="p">${c.money(it.price)}</span></div>${it.desc ? `<div class="ds">${esc(it.desc)}</div>` : ''}</div></div>`;
  }).join('')}</div></div>`).join('')}
</div></div></section>` : ''}

${d.gallery.length ? `<section id="galeria"><div class="wrap"><div class="head" data-r><span class="script">Así se vive</span><h2>Galería</h2><div class="rule">${tico ? WS : ''}</div></div>
 <div class="gal">${d.gallery.map((id, i) => { const p = photo(d, id); return `<figure data-r style="--d:${(i % 3) * .08}s;background:${p.dom}" data-lb="${img(d, p)}">${lazy(img(d, p, 1), d.biz.name)}</figure>`; }).join('')}</div>
</div></section>` : ''}

<section id="nosotros" style="background:var(--paper2)"><div class="wrap about">
 <div class="pics" data-r>${d.aboutPics.map(id => lazy(img(d, photo(d, id), 1), d.biz.name)).join('')}</div>
 <div data-r style="--d:.15s"><span class="script">Nuestra historia</span><h2>Sobre ${esc(d.biz.name)}</h2>${d.about.map(p => `<p>${esc(p)}</p>`).join('')}</div>
</div></section>

<!--RESERVA-->
<section id="ubicacion" class="wood"><div class="wrap">
 <div class="head" data-r><span class="script" style="color:var(--acc2,#f3c27a)">Te esperamos</span><h2 style="color:var(--paper)">Visítenos</h2></div>
 <div class="loc" data-r><iframe src="${c.mapsEmbed(d)}" loading="lazy" title="Mapa" referrerpolicy="no-referrer-when-downgrade"></iframe>
  <div class="card"><h3>Contacto</h3>
   <a class="ci" href="${c.mapsLink(d)}" target="_blank" rel="noopener">${c.ICON.pin}<span>${esc(d.location.address)}</span></a>
   ${d.contact.phone ? `<a class="ci" href="${c.tel(d.contact.phone)}">${c.ICON.phone}<span>${esc(d.contact.phone)}</span></a>` : ''}
   ${d.contact.whatsapp ? `<a class="ci" href="${c.wa(d.contact.whatsapp, waMsg)}" target="_blank" rel="noopener">${c.ICON.wa}<span>WhatsApp ${esc(d.contact.whatsapp)}</span></a>` : ''}
   ${d.contact.email ? `<a class="ci" href="mailto:${esc(d.contact.email)}">${c.ICON.mail}<span>${esc(d.contact.email)}</span></a>` : ''}
   <div class="soc">${c.socials(d).map(s => `<a href="${esc(s.u)}" target="_blank" rel="noopener">${s.l}</a>`).join('')}</div>
   <div class="btns">${c.cta(d, waMsg, 'btn btn-wa', 'Escribinos', 'Llamanos')}<a class="btn btn-go" href="${c.mapsLink(d)}" target="_blank" rel="noopener">${c.ICON.pin} Cómo llegar</a></div>
  </div></div>
</div></section>
<footer class="wood"><div class="wrap">© ${new Date().getFullYear()} ${esc(d.biz.name)} · ${esc(d.slogan)}${tico ? `<br><span class="cr"><img src="data:image/svg+xml,${encodeURIComponent(T.flag)}" alt="">Sabor 100% tico</span>` : ''}</div></footer>`;

  return c.shell(d, { fonts: 'family=Alfa+Slab+One&family=Caveat:wght@500;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400', css, body, theme: '#3b2416' });
};
