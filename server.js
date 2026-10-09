const express = require('express');
const multer = require('multer');
const { ZipArchive } = require('archiver');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const images = require('./lib/images');
const ai = require('./lib/ai');
const copy = require('./lib/copy');
const imagegen = require('./lib/imagegen');
const instructions = require('./lib/instructions');
const TEMPLATES = { rustic: require('./templates/rustic'), premium: require('./templates/premium'), urban: require('./templates/urban') };

// .env sencillo (opcional): ANTHROPIC_API_KEY=...
try { for (const l of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) { const m = /^\s*([\w]+)\s*=\s*(.*)\s*$/.exec(l); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch {}

const DATA = path.join(__dirname, 'data');
fs.mkdirSync(DATA, { recursive: true });
const app = express();
const upload = multer({ dest: path.join(os.tmpdir(), 'demo-uploads'), limits: { fileSize: 25 * 1024 * 1024, files: 120 } });
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/d', express.static(DATA, { maxAge: '7d' }));

const slugify = s => (s || 'demo').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'demo';
const load = slug => JSON.parse(fs.readFileSync(path.join(DATA, slug, 'demo.json'), 'utf8'));
const save = d => fs.writeFileSync(path.join(DATA, d.slug, 'demo.json'), JSON.stringify(d, null, 2));
const pickTemplate = text => {
  const k = copy.kind(text).type;
  return /soda/.test(k) ? 'rustic' : /autor/.test(k) ? 'premium' : /urbana/.test(k) ? 'urban' : 'premium';
};

app.post('/api/demos', upload.any(), async (req, res) => {
  const t0 = Date.now();
  const files = req.files || [];
  try {
    const b = req.body;
    if (!b.name) throw new Error('Falta el nombre del restaurante');
    const slug = `${slugify(b.name)}-${crypto.randomBytes(2).toString('hex')}`;
    const dir = path.join(DATA, slug), imgDir = path.join(dir, 'img');
    fs.mkdirSync(imgDir, { recursive: true });

    const menu = JSON.parse(b.menu || '[]').filter(m => m.name);
    const cats = JSON.parse(b.photoCats || '[]');
    const byField = f => files.filter(x => x.fieldname === f);

    // 1) Reunir fotos: galería (con categoría) + fotos de platillos del menú
    const photos = [];
    byField('photos').forEach((f, i) => photos.push({ id: 'p' + i, file: f.path, cat: cats[i] || 'auto', src: 'gallery' }));
    menu.forEach((m, i) => {
      const f = byField('menuPhoto_' + m.key)[0];
      m.photo = null;
      if (f) { const id = 'm' + i; photos.push({ id, file: f.path, cat: /bebid|drink|cafe|café|jugo|batido|cocte|cerve/i.test(m.cat + m.name) ? 'bebida' : 'comida', src: 'menu', item: i }); m.photo = id; }
      delete m.key;
    });
    if (!photos.length) throw new Error('Sube al menos una fotografía');

    // 2) Análisis local de calidad (nitidez, luz, contraste, color, encuadre)
    await Promise.all(photos.map(async p => { p.q = await images.analyze(p.file); }));

    // 3) Análisis con IA (opcional): categorías, atractivo, eslogan, textos
    let aiRes = null;
    try { aiRes = await ai.analyzePhotos(photos.slice(0, 20).map(p => p.file), { name: b.name, description: b.description }); }
    catch (e) { console.warn('IA no disponible:', e.message); }
    if (aiRes?.photos) for (const r of aiRes.photos) {
      const p = photos[r.i]; if (!p) continue;
      p.appeal = r.appeal;
      if (p.cat === 'auto' && r.category) p.cat = r.category;
      if (r.dish) p.dish = r.dish;
      if (r.scene) p.scene = r.scene;
    }
    for (const p of photos) {
      if (p.cat === 'auto') p.cat = 'comida';
      p.score = p.appeal != null ? Math.round(p.q.score * 0.45 + p.appeal * 0.55) : p.q.score;
    }

    // 4) Elegir los 3 mejores platillos -> especialidades
    const food = photos.filter(p => p.cat === 'comida').sort((a, z) => z.score - a.score);
    const pool = food.length >= 3 ? food : [...food, ...photos.filter(p => p.cat === 'bebida').sort((a, z) => z.score - a.score)];
    const specialsP = pool.slice(0, 3);
    const specials = specialsP.map(p => {
      const it = p.item != null ? menu[p.item] : null;
      return { id: p.id, name: it?.name || p.dish || 'Especialidad de la casa', desc: it?.desc || '', price: it?.price || '' };
    });

    // 5) Hero: el ambiente más impactante si compite con el mejor platillo; si no, el platillo
    const amb = photos.filter(p => ['ambiente', 'interior', 'fachada'].includes(p.cat)).sort((a, z) => z.score - a.score)[0];
    const top = specialsP[0] || photos.slice().sort((a, z) => z.score - a.score)[0];
    const heroP = amb && amb.score >= (top?.score || 0) - 4 ? amb : top;

    // 6) Procesar: webp optimizado para todo, look gastronómico para toda foto de comida/bebida + hero
    const enhance = new Set([...photos.filter(p => p.cat === 'comida' || p.cat === 'bebida').map(p => p.id), heroP.id]);
    await Promise.all(photos.map(async p => {
      Object.assign(p, await images.process(p.file, path.join(imgDir, p.id), { enhance: enhance.has(p.id) }));
      p.enhanced = enhance.has(p.id);
    }));

    // 7) Fotos de comida/bebida rehechas con IA (fondo y luz profesionales, misma comida).
    //    Prioridad: especialidades, hero, luego el resto por puntaje. Se conserva el original.
    const kindText = (b.description || '') + ' ' + b.name + ' ' + (aiRes?.type || '');
    let aiDone = 0, aiFailed = 0;
    if (b.aiPhotos === '1' && imagegen.enabled()) {
      const MAX = +process.env.MAX_AI_PHOTOS || 15;
      const order = [...specialsP, heroP, ...photos.slice().sort((a, z) => z.score - a.score)];
      const targets = [...new Set(order)].filter(p => p.cat === 'comida' || p.cat === 'bebida').slice(0, MAX);
      await imagegen.pool(targets, 4, async p => {
        try {
          const buf = await imagegen.enhance(p.file, p.scene || imagegen.defaultScene(kindText, p.cat));
          await images.process(buf, path.join(imgDir, p.id + '-ai'), {});
          p.ai = true; aiDone++;
        } catch (e) { aiFailed++; console.warn('Foto IA falló', p.id, e.message); }
      });
    }

    let logo = null;
    const lf = byField('logo')[0];
    let colors = [];
    if (lf) {
      const ext = (path.extname(lf.originalname) || '.png').toLowerCase();
      fs.copyFileSync(lf.path, path.join(dir, 'logo' + ext));
      logo = `/d/${slug}/logo${ext}`;
      if (b.logoColors === '1') colors = await images.palette(lf.path).catch(() => []);
    }

    const galleryPs = photos.filter(p => p.src === 'gallery' && p.id !== heroP.id).sort((a, z) => z.score - a.score);
    // si hay pocas fotos sueltas, la galería se completa con las del menú (fuera de las especialidades)
    if (galleryPs.length < 6) galleryPs.push(...photos.filter(p => p.src === 'menu' && p.id !== heroP.id && !specialsP.includes(p)).sort((a, z) => z.score - a.score).slice(0, 9 - galleryPs.length));
    const aboutPics = [
      ...photos.filter(p => ['personal', 'interior', 'fachada', 'ambiente', 'clientes'].includes(p.cat) && p.id !== heroP.id),
      ...galleryPs,
    ].map(p => p.id).filter((v, i, a) => a.indexOf(v) === i).slice(0, 2);

    const desc = b.description || '';
    const d = {
      slug, createdAt: new Date().toISOString(),
      template: b.template && b.template !== 'auto' ? b.template : pickTemplate(desc + ' ' + b.name + ' ' + menu.map(m => m.name).join(' ')),
      biz: { name: b.name.trim(), desc, color: colors[0] || b.color || '#c0392b', color2: colors[1] || b.color2 || '' },
      logo,
      contact: { phone: b.phone || '', whatsapp: b.whatsapp || '', email: b.email || '' },
      location: { address: b.address || '', url: b.mapsUrl || '' },
      social: { facebook: b.facebook || '', instagram: b.instagram || '', tiktok: b.tiktok || '', website: b.website || '' },
      type: aiRes?.type || copy.kind(desc + ' ' + b.name).type,
      slogan: aiRes?.slogan || copy.slogan(b.name, desc),
      about: aiRes?.about?.length ? aiRes.about : copy.about(b.name.trim(), desc, b.address, specials.map(s => s.name).filter(n => n !== 'Especialidad de la casa')),
      photos: photos.map(({ id, cat, score, q, appeal, enhanced, w, h, dom, dish, scene, ai }) => ({ id, cat, score, q, appeal, enhanced, w, h, dom, dish, scene, ai: !!ai })),
      hero: heroP.id, specials, gallery: galleryPs.map(p => p.id), aboutPics, menu,
      ai: !!aiRes, aiPhotos: aiDone > 0, aiDone, aiFailed, ms: 0,
    };
    d.features = { reserve: b.fReserve !== '0', search: b.fSearch !== '0' };
    d.instructions = (b.instructions || '').trim();
    instructions.apply(d, await instructions.interpret(d.instructions));
    d.ms = Date.now() - t0;
    save(d);
    res.json({ slug, ms: d.ms, ai: d.ai, aiDone, aiFailed, instructions: d.instructionsResult });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  } finally {
    for (const f of files) fs.rm(f.path, { force: true }, () => {});
  }
});

// Paleta del logo para previsualizar en el formulario (mismo cálculo que al generar)
app.post('/api/palette', upload.single('logo'), async (req, res) => {
  try { res.json({ colors: req.file ? await images.palette(req.file.path) : [] }); }
  catch { res.json({ colors: [] }); }
  finally { if (req.file) fs.rm(req.file.path, { force: true }, () => {}); }
});

app.get('/api/demos', (req, res) => {
  const list = fs.readdirSync(DATA).filter(s => fs.existsSync(path.join(DATA, s, 'demo.json'))).map(s => {
    const d = load(s);
    return { slug: s, name: d.biz.name, template: d.template, createdAt: d.createdAt, hero: `/d/${s}/img/${d.hero}${d.aiPhotos && d.photos.find(p => p.id === d.hero)?.ai ? "-ai" : ""}-s.webp`, ai: d.ai };
  }).sort((a, z) => z.createdAt.localeCompare(a.createdAt));
  res.json({ demos: list, aiEnabled: ai.enabled(), imageAiEnabled: imagegen.enabled() });
});
app.get('/api/demos/:slug', (req, res) => { try { res.json(load(req.params.slug)); } catch { res.status(404).end(); } });
app.patch('/api/demos/:slug', async (req, res) => {
  try {
    const d = load(req.params.slug);
    const { template, slogan, about, specials, hero, aiPhotos } = req.body;
    if (typeof aiPhotos === "boolean") d.aiPhotos = aiPhotos;
    if (req.body.features && typeof req.body.features === 'object') d.features = { ...d.features, ...req.body.features };
    if (template && TEMPLATES[template]) d.template = template;
    if (typeof slogan === 'string') d.slogan = slogan;
    if (Array.isArray(about)) d.about = about.filter(Boolean);
    if (Array.isArray(specials)) d.specials = specials;
    if (hero && d.photos.some(p => p.id === hero)) d.hero = hero;
    if (typeof req.body.instructions === 'string') {
      d.instructions = req.body.instructions.trim();
      instructions.apply(d, await instructions.interpret(d.instructions));
    }
    save(d);
    res.json({ ok: true, demo: d });
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/demos/:slug', (req, res) => {
  const dir = path.join(DATA, path.basename(req.params.slug));
  try { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 }); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: 'No se pudo borrar: ' + e.code }); }
});

const render = (d, t) => {
  const tpl = TEMPLATES[t] ? t : d.template;
  return TEMPLATES[tpl]({ ...d, about: [...d.about, ...(d.custom?.aboutExtra || [])] });
};

// Descargar el sitio como ZIP (index.html + imágenes) para publicarlo gratis (ej. Netlify Drop)
app.get('/api/demos/:slug/export', (req, res) => {
  let d;
  const slug = path.basename(req.params.slug);
  try { d = load(slug); } catch { return res.status(404).send('Demo no encontrada'); }
  const html = render(d, req.query.t).split(`/d/${slug}/`).join('');
  res.attachment(`${slug}.zip`);
  const zip = new ZipArchive({ zlib: { level: 6 } });
  zip.on('error', e => { console.error(e); res.end(); });
  zip.pipe(res);
  zip.append(html, { name: `${slug}/index.html` });
  zip.directory(path.join(DATA, slug, 'img'), `${slug}/img`);
  if (d.logo) zip.file(path.join(DATA, slug, path.basename(d.logo)), { name: `${slug}/${path.basename(d.logo)}` });
  zip.finalize();
});

// La demo en sí. ?t=rustic|premium|urban para cambiar de plantilla en vivo
app.get('/demo/:slug', (req, res) => {
  let d;
  try { d = load(path.basename(req.params.slug)); } catch { return res.status(404).send('Demo no encontrada'); }
  res.type('html').send(render(d, req.query.t));
});
app.get('/p/:slug', (req, res) => res.sendFile(path.join(__dirname, 'public', 'present.html')));

const PORT = process.env.PORT || 4321;
app.listen(PORT, () => console.log(`Generador de demos listo → http://localhost:${PORT}  (Claude: ${ai.enabled() ? "activo" : "no"} · Fotos IA: ${imagegen.enabled() ? "activas" : "no"})`));
