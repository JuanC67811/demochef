// PLANTILLA 3 — URBAN FOOD: tipografía gigante, stickers, bordes duros, marquesina, energía
const c = require('./common');
const T = require('./tico');

module.exports = d => {
  const { esc, img, photo, lazy } = c;
  const hero = photo(d, d.hero);
  const cats = c.menuByCat(d);
  const tico = d.custom?.tico !== 'off';
  const waMsg = `¡Hola ${d.biz.name}! Quiero pedir 🔥`;
  const logo = d.logo ? `<img src="${d.logo}" alt="${esc(d.biz.name)}" class="logo">` : `<span class="logo-txt">${esc(d.biz.name)}</span>`;
  const ticker = [d.slogan, ...d.specials.map(s => s.name), ...(d.custom?.tico !== 'off' ? ['Pura vida'] : []), d.contact.whatsapp ? 'Pedí por WhatsApp' : 'Te esperamos'].map(esc);
  const tick = (ticker.map(t => `<span>${t}</span><b>✦</b>`).join('')).repeat(3);

  const css = `
:root{--ink:#0e0e0e;--paper:#f4f1ea;--acc:var(--c1);--on:var(--on1);--acc2:var(--c2)}
body{background:var(--paper);color:var(--ink);font-family:'Space Grotesk',system-ui,sans-serif;line-height:1.55;font-size:17px;overflow-x:hidden}
h1,h2,h3,.big{font-family:'Anton',Impact,sans-serif;font-weight:400;text-transform:uppercase;line-height:.92;letter-spacing:.01em}
.wrap{max-width:1280px;margin:0 auto;padding:0 20px}
.hdr{position:fixed;inset:12px 12px auto;z-index:50;transition:.3s}
.hdr .wrap{display:flex;align-items:center;justify-content:space-between;background:var(--ink);color:#fff;border-radius:999px;padding:8px 8px 8px 18px;box-shadow:0 10px 30px rgba(0,0,0,.25)}
.logo{height:42px;width:42px;object-fit:contain;border-radius:50%;background:#fff}.logo-txt{font-family:'Anton';font-size:1.3rem;text-transform:uppercase}
.nav{display:flex;gap:.3rem}.nav a{text-decoration:none;font-weight:700;font-size:.85rem;padding:.6rem 1rem;border-radius:999px;text-transform:uppercase;transition:.2s}.nav a:hover{background:var(--acc);color:var(--on)}
.nav a.cta{background:var(--acc);color:var(--on)}
.burger{display:none;background:var(--acc);color:var(--on);border:0;width:44px;height:44px;border-radius:50%;font-size:1.2rem}
@media(max-width:860px){.burger{display:block;position:relative;z-index:2}.nav{position:fixed;inset:0;background:var(--acc);flex-direction:column;align-items:center;justify-content:center;clip-path:circle(0 at 92% 40px);transition:clip-path .55s cubic-bezier(.7,0,.2,1)}.nav-open .nav{clip-path:circle(150% at 92% 40px)}.nav a{font-family:'Anton';font-size:2.6rem;color:var(--on)}.nav a.cta{background:var(--ink);color:#fff}}
/* hero */
.hero{min-height:100svh;padding:110px 0 40px;display:flex;align-items:center;position:relative;background:var(--ink);color:#fff;overflow:hidden}
.hero .wrap{display:grid;grid-template-columns:1.1fr .9fr;gap:2rem;align-items:center;width:100%}
.hero h1{font-size:clamp(3.6rem,13vw,10.5rem);word-break:break-word}
.hero h1 .o{color:transparent;-webkit-text-stroke:2px #fff}
.hero h1 span{display:block;animation:sl .9s cubic-bezier(.2,.8,.2,1) both}.hero h1 span:nth-child(2){animation-delay:.12s}
@keyframes sl{from{transform:translateY(100%);opacity:0}}
.hero p{font-size:1.25rem;max-width:30ch;margin:1.4rem 0 2rem;font-weight:500;opacity:.9}
.pill{display:inline-block;background:var(--acc);color:var(--on);font-weight:700;padding:.35rem .9rem;border-radius:999px;font-size:.8rem;text-transform:uppercase;letter-spacing:.08em;transform:rotate(-2deg)}
.btns{display:flex;gap:.8rem;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:.6rem;padding:1rem 1.6rem;font-weight:700;text-decoration:none;text-transform:uppercase;font-size:.95rem;border:3px solid var(--ink);border-radius:14px;transition:.15s;box-shadow:5px 5px 0 var(--ink)}
.btn:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 var(--ink)}.btn:active{transform:translate(3px,3px);box-shadow:2px 2px 0 var(--ink)}
.hero .btn{border-color:#fff;box-shadow:5px 5px 0 #fff}.hero .btn:hover{box-shadow:7px 7px 0 #fff}
.b1{background:var(--acc);color:var(--on)}.b2{background:#fff;color:var(--ink)}
.blob{position:relative;aspect-ratio:1}
.blob .ph{position:absolute;inset:0;border-radius:42% 58% 63% 37%/41% 44% 56% 59%;overflow:hidden;animation:morph 12s ease-in-out infinite;border:6px solid var(--acc);box-shadow:0 0 0 12px rgba(255,255,255,.06)}
.blob img{width:100%;height:100%;object-fit:cover;transform:scale(1.05)}
@keyframes morph{50%{border-radius:58% 42% 38% 62%/55% 61% 39% 45%}}
.sticker{position:absolute;width:130px;height:130px;border-radius:50%;background:var(--acc2,#ffd400);color:var(--ink);display:grid;place-items:center;text-align:center;font-family:'Anton';text-transform:uppercase;font-size:1.25rem;line-height:1;padding:12px;animation:spin 14s linear infinite;border:3px solid var(--ink);top:-10px;right:-6px;z-index:2}
@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:860px){.hero .wrap{grid-template-columns:1fr}.blob{max-width:360px;margin:1rem auto 0;width:100%}.sticker{width:100px;height:100px;font-size:1rem}}
.marq{background:var(--acc);color:var(--on);border-block:3px solid var(--ink);overflow:hidden;white-space:nowrap;padding:14px 0;transform:rotate(-1.5deg);margin:-20px -10px 0;position:relative;z-index:3}
.marq div{display:inline-block;animation:mq 30s linear infinite;font-family:'Anton';font-size:clamp(1.4rem,3vw,2.2rem);text-transform:uppercase}.marq span{margin:0 1.2rem}.marq b{font-weight:400}
@keyframes mq{to{transform:translateX(-33.333%)}}
section{padding:clamp(70px,10vw,120px) 0}
.head{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:2.6rem;flex-wrap:wrap}
.head h2{font-size:clamp(3rem,9vw,6.5rem)}.head h2 em{font-style:normal;color:var(--acc);-webkit-text-stroke:2px var(--ink)}
/* top 3 */
.top{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem}
.card{background:#fff;border:3px solid var(--ink);border-radius:24px;overflow:hidden;box-shadow:8px 8px 0 var(--ink);transition:.2s;position:relative}
.card:hover{transform:translate(-4px,-4px) rotate(-.6deg);box-shadow:12px 12px 0 var(--ink)}
.card .ph{aspect-ratio:1;overflow:hidden;border-bottom:3px solid var(--ink);cursor:zoom-in}.card .ph img{width:100%;height:100%;object-fit:cover;transition:transform .6s}.card:hover .ph img{transform:scale(1.08)}
.card .rank{position:absolute;top:14px;left:14px;background:var(--ink);color:#fff;font-family:'Anton';font-size:1.8rem;width:56px;height:56px;display:grid;place-items:center;border-radius:50%;z-index:2}
.card .bd{padding:1.2rem 1.3rem 1.4rem;display:flex;justify-content:space-between;gap:1rem;align-items:flex-start}
.card h3{font-size:1.9rem}.card p{font-size:.92rem;opacity:.75;margin-top:.3rem}
.price{background:var(--acc);color:var(--on);font-weight:700;padding:.35rem .8rem;border-radius:10px;border:2px solid var(--ink);white-space:nowrap;font-size:1rem}
@media(max-width:860px){.top{grid-template-columns:1fr}}
/* menú */
.menu{background:var(--ink);color:#fff}
.menu .head h2 em{-webkit-text-stroke:0}
.tabs{display:flex;gap:.5rem;overflow-x:auto;padding-bottom:.6rem;margin-bottom:2rem;scrollbar-width:none}
.tabs button{flex:none;background:transparent;border:2px solid #fff;color:#fff;padding:.6rem 1.2rem;border-radius:999px;font-weight:700;text-transform:uppercase;font-size:.85rem}
.tabs button.on,.tabs button:hover{background:var(--acc);color:var(--on);border-color:var(--acc)}
.mcat h3{font-size:2.6rem;margin:2rem 0 1rem;color:var(--acc)}
.mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:1rem}
.mi{background:#1b1b1b;border:2px solid #2c2c2c;border-radius:18px;overflow:hidden;display:flex;flex-direction:column;transition:.2s}.mi:hover{border-color:var(--acc);transform:translateY(-4px)}
.mi .ph{aspect-ratio:16/10;overflow:hidden;cursor:zoom-in}.mi img{width:100%;height:100%;object-fit:cover}
.mi .bd{padding:1rem 1.1rem 1.2rem;display:flex;flex-direction:column;gap:.4rem;flex:1}
.mi .r{display:flex;justify-content:space-between;gap:.8rem;align-items:start}.mi .n{font-weight:700;font-size:1.1rem}.mi .ds{opacity:.65;font-size:.9rem}
/* galería */
.gal{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:6px 6px 24px;scrollbar-width:thin}
.gal figure{flex:none;width:min(72vw,340px);aspect-ratio:3/4;border-radius:22px;overflow:hidden;border:3px solid var(--ink);scroll-snap-align:start;cursor:zoom-in;box-shadow:6px 6px 0 var(--ink)}
.gal figure:nth-child(even){transform:translateY(24px) rotate(1.5deg)}.gal figure:nth-child(odd){transform:rotate(-1deg)}
.gal img{width:100%;height:100%;object-fit:cover;transition:.5s}.gal figure:hover img{transform:scale(1.06)}
/* nosotros */
.about{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center}
.about .big{font-size:clamp(2.8rem,7vw,5rem)}.about p{font-size:1.1rem;margin-top:1.2rem}
.about .ph{border-radius:28px;overflow:hidden;border:3px solid var(--ink);box-shadow:10px 10px 0 var(--acc);aspect-ratio:4/5}.about .ph img{width:100%;height:100%;object-fit:cover}
@media(max-width:860px){.about{grid-template-columns:1fr}}
/* contacto */
.contact{display:grid;grid-template-columns:1fr 1fr;gap:1.4rem}
.box{border:3px solid var(--ink);border-radius:24px;overflow:hidden;background:#fff;box-shadow:8px 8px 0 var(--ink)}
.box iframe{width:100%;height:100%;min-height:420px;border:0;display:block}
.box.info{padding:2rem;display:flex;flex-direction:column;gap:1rem;background:var(--acc);color:var(--on)}
.box.info h3{font-size:3rem}
.ci{display:flex;gap:.8rem;align-items:center;text-decoration:none;font-weight:600;background:rgba(255,255,255,.92);color:var(--ink);padding:.9rem 1rem;border-radius:14px;border:2px solid var(--ink);transition:.15s}.ci:hover{transform:translateX(4px)}
.soc{display:flex;gap:.6rem;flex-wrap:wrap}.soc a{background:var(--ink);color:#fff;text-decoration:none;font-weight:700;padding:.6rem 1rem;border-radius:999px;text-transform:uppercase;font-size:.8rem}
@media(max-width:860px){.contact{grid-template-columns:1fr}.box iframe{min-height:300px}}
footer{background:var(--ink);color:#fff;padding:3rem 0 5rem;text-align:center}footer .big{font-size:clamp(2.6rem,12vw,9rem);color:var(--acc);line-height:.85;margin-bottom:1rem;word-break:break-word}
.res-card{border:3px solid var(--ink);box-shadow:10px 10px 0 var(--acc);border-radius:24px}.res-card h3{font-family:'Anton',sans-serif;font-weight:400;text-transform:uppercase;font-size:2.4rem}
${tico ? `/* ── toque tico ── */
.wheel{position:absolute;width:150px;height:150px;left:-24px;bottom:-10px;z-index:2;background:${T.uri(T.wheel({ bg: '#0e0e0e' }))} center/contain no-repeat;animation:spin 20s linear infinite;filter:drop-shadow(4px 4px 0 var(--acc))}
@media(max-width:860px){.wheel{width:100px;height:100px;left:-6px}}
footer .cr{display:inline-flex;gap:8px;align-items:center;margin-top:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;font-size:.85rem}footer .cr img{width:26px;border-radius:2px}` : ''}
`;
  const nameWords = esc(d.biz.name).split(' ');
  const h1 = nameWords.length > 1
    ? `<span>${nameWords.slice(0, Math.ceil(nameWords.length / 2)).join(' ')}</span><span class="o">${nameWords.slice(Math.ceil(nameWords.length / 2)).join(' ')}</span>`
    : `<span>${nameWords[0]}</span>`;

  const body = `
<header class="hdr" data-hdr><div class="wrap">${logo}
<nav class="nav" data-nav><a href="#top">Top 3</a><a href="#menu">Menú</a><a href="#galeria">Fotos</a><a href="#nosotros">Nosotros</a>${c.F.flags(d).reserve ? '<a href="#reservar">Reservar</a>' : ''}<a class="cta" href="#contacto">Pedir</a></nav>
<button class="burger" data-burger aria-label="Menú">☰</button></div></header>

<section class="hero"><div class="wrap">
 <div><span class="pill">${esc(d.type || 'Street food')}</span><h1>${h1}</h1><p>${esc(d.slogan)}</p>
  <div class="btns">${c.cta(d, waMsg, 'btn b1', 'Pedir ya', 'Llamar ya')}<a class="btn b2" href="${c.mapsLink(d)}" target="_blank" rel="noopener">${c.ICON.pin} Cómo llegar</a></div></div>
 <div class="blob" data-r>${hero ? `<div class="ph"><img src="${img(d, hero)}" alt="${esc(d.biz.name)}" fetchpriority="high"></div>` : ''}<div class="sticker">100% antojo</div>${tico ? '<div class="wheel" aria-hidden="true"></div>' : ''}</div>
</div></section>
<div class="marq" aria-hidden="true"><div>${tick}</div></div><!--NOTICE-->

${d.specials.length ? `<section id="top"><div class="wrap">
 <div class="head" data-r><h2>Los <em>más</em><br>pedidos</h2>${c.cta(d, waMsg, 'btn b1', 'Lo quiero', 'Lo quiero', false)}</div>
 <div class="top">${d.specials.map((s, i) => `<article class="card" data-r style="--d:${i * .1}s"><span class="rank">#${i + 1}</span>
  <div class="ph" data-lb="${img(d, photo(d, s.id))}" data-alt="${esc(s.name)}">${lazy(img(d, photo(d, s.id)), s.name)}</div>
  <div class="bd"><div><h3>${esc(s.name)}</h3>${s.desc ? `<p>${esc(s.desc)}</p>` : ''}</div>${s.price ? `<span class="price">${c.money(s.price)}</span>` : ''}</div></article>`).join('')}</div>
</div></section>` : ''}

${cats.length ? `<section id="menu" class="menu"><div class="wrap">
 <div class="head" data-r><h2>El <em>menú</em></h2></div>
 ${cats.length > 1 ? `<div class="tabs"><button class="on" data-tab="all">Todo</button>${cats.map(([k]) => `<button data-tab="${esc(k)}">${esc(k)}</button>`).join('')}</div>` : ''}
 ${cats.map(([k, items]) => `<div class="mcat" data-cat="${esc(k)}"><h3>${esc(k)}</h3><div class="mgrid">${items.map((it, i) => {
    const p = photo(d, it.photo);
    return `<div class="mi" data-r style="--d:${(i % 3) * .07}s">${p ? `<div class="ph" data-lb="${img(d, p)}" data-alt="${esc(it.name)}"><img src="${img(d, p, 1)}" alt="${esc(it.name)}" loading="lazy"></div>` : ''}<div class="bd"><div class="r"><span class="n">${esc(it.name)}</span>${it.price ? `<span class="price">${c.money(it.price)}</span>` : ''}</div>${it.desc ? `<div class="ds">${esc(it.desc)}</div>` : ''}</div></div>`;
  }).join('')}</div></div>`).join('')}
</div></section>` : ''}

${d.gallery.length ? `<section id="galeria"><div class="wrap"><div class="head" data-r><h2>Puro <em>flow</em></h2><span style="font-weight:700">Deslizá →</span></div></div>
 <div class="wrap"><div class="gal">${d.gallery.map(id => { const p = photo(d, id); return `<figure style="background:${p.dom}" data-lb="${img(d, p)}">${lazy(img(d, p, 1), d.biz.name)}</figure>`; }).join('')}</div></div>
</section>` : ''}

<section id="nosotros" style="padding-top:0"><div class="wrap about">
 <div data-r><span class="pill">Nuestra historia</span><div class="big" style="margin-top:1rem">Somos ${esc(d.biz.name)}</div>${d.about.map(p => `<p>${esc(p)}</p>`).join('')}</div>
 ${d.aboutPics[0] ? `<div class="ph" data-r style="--d:.15s">${lazy(img(d, photo(d, d.aboutPics[0])), d.biz.name)}</div>` : ''}
</div></section>

<!--RESERVA-->
<section id="contacto" style="padding-top:0"><div class="wrap">
 <div class="head" data-r><h2>Caé <em>hoy</em></h2></div>
 <div class="contact"><div class="box" data-r><iframe src="${c.mapsEmbed(d)}" loading="lazy" title="Mapa" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
 <div class="box info" data-r style="--d:.1s"><h3>Dónde y cómo</h3>
  <a class="ci" href="${c.mapsLink(d)}" target="_blank" rel="noopener">${c.ICON.pin}<span>${esc(d.location.address)}</span></a>
  ${d.contact.whatsapp ? `<a class="ci" href="${c.wa(d.contact.whatsapp, waMsg)}" target="_blank" rel="noopener">${c.ICON.wa}<span>WhatsApp ${esc(d.contact.whatsapp)}</span></a>` : ''}
  ${d.contact.phone ? `<a class="ci" href="${c.tel(d.contact.phone)}">${c.ICON.phone}<span>${esc(d.contact.phone)}</span></a>` : ''}
  ${d.contact.email ? `<a class="ci" href="mailto:${esc(d.contact.email)}">${c.ICON.mail}<span>${esc(d.contact.email)}</span></a>` : ''}
  <div class="soc">${c.socials(d).map(s => `<a href="${esc(s.u)}" target="_blank" rel="noopener">${s.l}</a>`).join('')}</div>
 </div></div>
</div></section>
<footer><div class="wrap"><div class="big">${esc(d.biz.name)}</div><div>${esc(d.slogan)} · © ${new Date().getFullYear()}</div>${tico ? `<span class="cr"><img src="data:image/svg+xml,${encodeURIComponent(T.flag)}" alt="">Hecho en Costa Rica</span>` : ''}</div></footer>`;

  return c.shell(d, { fonts: 'family=Anton&family=Space+Grotesk:wght@400;500;700', css, body, theme: '#0e0e0e' });
};
