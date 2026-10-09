const sharp = require('sharp');
sharp.cache(false); // en Windows la caché deja archivos abiertos y no se pueden borrar las demos

// Análisis local: nitidez, iluminación, contraste, color y encuadre -> score 0..100
async function analyze(file) {
  const S = 192;
  const { data } = await sharp(file).rotate().resize(S, S, { fit: 'cover' }).raw().toBuffer({ resolveWithObject: true });
  const ch = 3, n = S * S;
  const gray = new Float32Array(n);
  let sumSat = 0;
  for (let i = 0; i < n; i++) {
    const r = data[i * ch], g = data[i * ch + 1], b = data[i * ch + 2];
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    sumSat += mx ? (mx - mn) / mx : 0;
  }
  let mean = 0; for (const v of gray) mean += v; mean /= n;
  let varr = 0; for (const v of gray) varr += (v - mean) ** 2; const contrast = Math.sqrt(varr / n);
  // Laplaciano: nitidez total y energía de detalle en el centro vs bordes
  let lapSum = 0, lapSq = 0, cnt = 0, centerE = 0, centerN = 0, edgeE = 0, edgeN = 0;
  for (let y = 1; y < S - 1; y++) for (let x = 1; x < S - 1; x++) {
    const i = y * S + x;
    const l = 4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - S] - gray[i + S];
    lapSum += l; lapSq += l * l; cnt++;
    const inC = x > S * 0.25 && x < S * 0.75 && y > S * 0.25 && y < S * 0.75;
    if (inC) { centerE += l * l; centerN++; } else { edgeE += l * l; edgeN++; }
  }
  const sharpVar = lapSq / cnt - (lapSum / cnt) ** 2;
  const sat = sumSat / n;
  const sharpScore = Math.min(1, Math.log10(1 + sharpVar) / 3.2);
  const lightScore = 1 - Math.min(1, Math.abs(mean - 135) / 110);
  const contrastScore = Math.min(1, contrast / 60);
  const colorScore = Math.min(1, sat / 0.45);
  const frame = (centerE / centerN) / ((edgeE / edgeN) + 1e-6);
  const frameScore = Math.min(1, frame / 1.6);
  const score = Math.round(100 * (0.34 * sharpScore + 0.2 * lightScore + 0.16 * contrastScore + 0.18 * colorScore + 0.12 * frameScore));
  return { score, sharp: +sharpScore.toFixed(2), light: +lightScore.toFixed(2), contrast: +contrastScore.toFixed(2), color: +colorScore.toFixed(2), frame: +frameScore.toFixed(2) };
}

// Look gastronómico local (gratis): rango tonal, balance cálido, viveza, contraste, nitidez y viñeta suave
async function foodLook(buf, w, h) {
  const vignette = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><radialGradient id="v" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#fff"/><stop offset="100%" stop-color="#c4bfb8"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#v)"/></svg>`);
  return sharp(buf)
    .normalise({ lower: 1, upper: 99.5 })                          // rango tonal
    .recomb([[1.05, 0.03, 0], [0.01, 1.02, 0], [0, 0.02, 0.93]])    // balance cálido (apetitoso)
    .modulate({ brightness: 1.04, saturation: 1.24 })               // viveza
    .linear(1.08, -10)                                              // contraste
    .sharpen({ sigma: 1, m1: 0.6, m2: 2.4 })                        // nitidez
    .composite([{ input: vignette, blend: 'multiply' }])            // viñeta: centra la mirada en el plato
    .toBuffer();
}

// Optimiza la foto (webp grande + miniatura). Con enhance aplica el look gastronómico a ambas.
async function process(file, outBase, { enhance = false, maxW = 1800 } = {}) {
  const { data, info } = await sharp(file).rotate().resize({ width: maxW, height: maxW, fit: 'inside', withoutEnlargement: true }).toBuffer({ resolveWithObject: true });
  const out = enhance ? await foodLook(data, info.width, info.height) : data;
  await sharp(out).webp({ quality: enhance ? 86 : 78 }).toFile(outBase + '.webp');
  await sharp(out).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 72 }).toFile(outBase + '-s.webp');
  // color dominante para fondos mientras carga
  const { dominant } = await sharp(outBase + '-s.webp').stats();
  return { w: info.width, h: info.height, dom: `rgb(${dominant.r},${dominant.g},${dominant.b})` };
}

// Paleta del logo: [principal, secundario]. Ignora fondos blancos/negros/grises.
async function palette(file) {
  const { data } = await sharp(file, { density: 150 }).ensureAlpha().resize(80, 80, { fit: 'inside' }).raw().toBuffer({ resolveWithObject: true });
  const bins = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 200) continue;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx - mn < 35 || mx < 35 || mn > 235) continue;
    const k = (r >> 4) * 256 + (g >> 4) * 16 + (b >> 4);
    const e = bins.get(k) || { n: 0, r: 0, g: 0, b: 0 };
    e.n++; e.r += r; e.g += g; e.b += b; bins.set(k, e);
  }
  const cols = [...bins.values()].map(e => ({ n: e.n, r: e.r / e.n, g: e.g / e.n, b: e.b / e.n }));
  if (!cols.length) return [];
  const hue = c => { const mx = Math.max(c.r, c.g, c.b), mn = Math.min(c.r, c.g, c.b), d = mx - mn || 1; const h = mx === c.r ? (c.g - c.b) / d : mx === c.g ? 2 + (c.b - c.r) / d : 4 + (c.r - c.g) / d; return ((h * 60) + 360) % 360; };
  const sat = c => (Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b)) / 255;
  // agrupar por tono (30°) y pesar por cantidad y saturación
  const groups = new Map();
  for (const c of cols) { const k = Math.round(hue(c) / 30) % 12; const g = groups.get(k) || { w: 0, best: c, bw: 0 }; const w = c.n * (0.4 + sat(c)); g.w += w; if (c.n > g.bw) { g.best = c; g.bw = c.n; } groups.set(k, g); }
  const hex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  const ranked = [...groups.values()].sort((a, z) => z.w - a.w);
  return ranked.slice(0, 2).filter(g => g.w > ranked[0].w * 0.08).map(g => hex(g.best));
}

module.exports = { analyze, process, palette };
