// Motivos costarricenses dibujados en SVG (sin imágenes externas, sin costo):
// rueda de carreta de Sarchí, hoja de plátano, granos de café, chorreador y mantel típico.

const uri = svg => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

// Rueda de carreta de Sarchí: pétalos, triángulos y puntos de colores alrededor de un centro
function wheel({ size = 400, colors = ['#d62828', '#f7b801', '#1d4e89', '#2a9d8f', '#ffffff'], bg = '#7a1f12', line = '#1a1a1a' } = {}) {
  const r = size / 2, c = r;
  const P = n => (a, rad) => [c + rad * Math.cos(a), c + rad * Math.sin(a)];
  const pt = P();
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">`;
  s += `<circle cx="${c}" cy="${c}" r="${r - 2}" fill="${bg}" stroke="${line}" stroke-width="6"/>`;
  s += `<circle cx="${c}" cy="${c}" r="${r * 0.9}" fill="none" stroke="${colors[1]}" stroke-width="5"/>`;
  // anillo de triángulos
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2, a2 = ((i + 0.5) / 32) * Math.PI * 2, a3 = ((i + 1) / 32) * Math.PI * 2;
    const [x1, y1] = pt(a, r * 0.86), [x2, y2] = pt(a2, r * 0.74), [x3, y3] = pt(a3, r * 0.86);
    s += `<path d="M${x1} ${y1}L${x2} ${y2}L${x3} ${y3}Z" fill="${colors[i % 2 ? 0 : 4]}"/>`;
  }
  // pétalos grandes
  for (let i = 0; i < 12; i++) {
    const deg = i * 30, col = colors[[0, 2, 3, 1][i % 4]];
    s += `<ellipse cx="${c}" cy="${c - r * 0.45}" rx="${r * 0.11}" ry="${r * 0.24}" fill="${col}" stroke="${line}" stroke-width="2" transform="rotate(${deg} ${c} ${c})"/>`;
    s += `<ellipse cx="${c}" cy="${c - r * 0.45}" rx="${r * 0.04}" ry="${r * 0.12}" fill="${colors[4]}" opacity=".85" transform="rotate(${deg} ${c} ${c})"/>`;
  }
  // puntos entre pétalos
  for (let i = 0; i < 12; i++) { const [x, y] = pt(((i + 0.5) / 12) * Math.PI * 2 - Math.PI / 2, r * 0.6); s += `<circle cx="${x}" cy="${y}" r="${r * 0.045}" fill="${colors[1]}" stroke="${line}" stroke-width="1.5"/>`; }
  // centro
  s += `<circle cx="${c}" cy="${c}" r="${r * 0.2}" fill="${colors[1]}" stroke="${line}" stroke-width="3"/>`;
  for (let i = 0; i < 8; i++) { const [x, y] = pt((i / 8) * Math.PI * 2, r * 0.13); s += `<circle cx="${x}" cy="${y}" r="${r * 0.03}" fill="${colors[0]}"/>`; }
  s += `<circle cx="${c}" cy="${c}" r="${r * 0.06}" fill="${line}"/></svg>`;
  return s;
}

// Rueda en línea fina (para fondos elegantes, ej. dorado sobre negro)
function wheelLine(color = '#c9a45c', size = 400) {
  const c = size / 2, r = c - 4;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none" stroke="${color}" stroke-width="1.4">`;
  s += `<circle cx="${c}" cy="${c}" r="${r}"/><circle cx="${c}" cy="${c}" r="${r * 0.88}"/><circle cx="${c}" cy="${c}" r="${r * 0.2}"/><circle cx="${c}" cy="${c}" r="${r * 0.08}"/>`;
  for (let i = 0; i < 12; i++) s += `<ellipse cx="${c}" cy="${c - r * 0.47}" rx="${r * 0.1}" ry="${r * 0.24}" transform="rotate(${i * 30} ${c} ${c})"/>`;
  for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; s += `<line x1="${c + r * 0.88 * Math.cos(a)}" y1="${c + r * 0.88 * Math.sin(a)}" x2="${c + r * Math.cos(a)}" y2="${c + r * Math.sin(a)}"/>`; }
  return s + '</svg>';
}

// Hoja de plátano con nervaduras
function leaf(color = '#2f7d32', dark = '#1b5e20') {
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 220">`;
  s += `<path d="M10 110 C120 10 420 -5 590 105 C420 220 120 215 10 110Z" fill="${color}"/>`;
  s += `<path d="M10 110 C200 104 400 104 590 105" stroke="${dark}" stroke-width="5" fill="none"/>`;
  for (let i = 1; i < 18; i++) { const x = 30 + i * 31; s += `<path d="M${x} 108 C${x + 25} 70 ${x + 45} 45 ${x + 55} ${30 + Math.abs(9 - i) * 2}" stroke="${dark}" stroke-width="1.6" fill="none" opacity=".55"/><path d="M${x} 110 C${x + 25} 150 ${x + 45} 175 ${x + 55} ${190 - Math.abs(9 - i) * 2}" stroke="${dark}" stroke-width="1.6" fill="none" opacity=".55"/>`; }
  // pequeños cortes naturales en el borde
  s += `<path d="M200 33 l8 18 M380 30 l-6 20 M290 190 l6 -18" stroke="#00000033" stroke-width="3"/>`;
  return s + '</svg>';
}

// Patrón de granos de café
function beans(color = '#5a3820', op = 0.06) {
  const bean = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><ellipse rx="9" ry="13" fill="${color}"/><path d="M0 -12 C-5 -4 5 4 0 12" stroke="#00000055" stroke-width="2" fill="none"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" opacity="${op}">${bean(25, 30, 30)}${bean(85, 20, -20)}${bean(60, 75, 70)}${bean(15, 100, -50)}${bean(100, 95, 15)}</svg>`;
}

// Chorreador de café (soporte de madera con bolsita de tela)
function chorreador(wood = '#6b4426', cloth = '#efe0c4') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 160" fill="none" stroke="#2a1a10" stroke-width="3" stroke-linejoin="round">
<path d="M20 20h80M28 20v118M92 20v118M14 140h92" stroke="${wood}" stroke-width="9" stroke-linecap="round"/>
<path d="M38 34h44l-10 46c-2 8-22 8-24 0z" fill="${cloth}"/><ellipse cx="60" cy="34" rx="22" ry="5" fill="#d9c49d"/>
<path d="M60 86v8M60 100v6" stroke="#5a3820" stroke-width="3" stroke-linecap="round"/>
<path d="M40 112h40v22c0 6-40 6-40 0z" fill="#fff"/><path d="M80 116c10 0 10 14 0 14" />
<path d="M48 104c2-6-2-8 0-14M60 104c2-6-2-8 0-14M72 104c2-6-2-8 0-14" stroke="#9b9284" stroke-width="2" opacity=".7"/></svg>`;
}

// Bandera de Costa Rica (pequeña, para sellos)
const flag = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 18"><rect width="30" height="18" fill="#002b7f"/><rect y="3" width="30" height="12" fill="#fff"/><rect y="6" width="30" height="6" fill="#ce1126"/></svg>`;

// Mantel típico (cuadros) como CSS
const mantel = (c = '#c0392b') =>
  `repeating-linear-gradient(0deg,${c}33 0 14px,transparent 14px 28px),repeating-linear-gradient(90deg,${c}33 0 14px,transparent 14px 28px),#fbf6ec`;

module.exports = { uri, wheel, wheelLine, leaf, beans, chorreador, flag, mantel };
