const fs = require('fs');
const sharp = require('sharp');
const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5-5';

const enabled = () => !!process.env.ANTHROPIC_API_KEY;

async function call(content, system) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 4000, system, messages: [{ role: 'user', content }] })
  });
  if (!r.ok) throw new Error('Claude API ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const j = await r.json();
  return j.content.map(c => c.text || '').join('');
}

// Devuelve { photos:[{i,category,appeal(0-100)}], slogan, about, type } o null
async function analyzePhotos(files, biz) {
  if (!enabled()) return null;
  const content = [];
  for (let i = 0; i < files.length; i++) {
    const buf = await sharp(files[i]).rotate().resize(512, 512, { fit: 'inside' }).jpeg({ quality: 70 }).toBuffer();
    content.push({ type: 'text', text: `Foto ${i}:` });
    content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: buf.toString('base64') } });
  }
  content.push({ type: 'text', text: `Restaurante: ${biz.name}. Descripción del dueño: ${biz.description || '(ninguna)'}.
Responde SOLO JSON válido con esta forma:
{"type":"tipo de restaurante en 2-4 palabras","slogan":"eslogan corto y memorable en español de Costa Rica, máx 8 palabras, sin comillas",
"about":["párrafo 1 (2-3 frases)","párrafo 2 (2-3 frases)"],
"photos":[{"i":0,"category":"fachada|interior|ambiente|personal|comida|bebida|clientes","appeal":0-100,"dish":"nombre corto y apetitoso del platillo o bebida (solo si es comida o bebida)","scene":"solo comida/bebida: dirección de arte EN INGLÉS (1-2 frases) para el fondo y la utilería"}]}
"scene": fondo y utilería para convertir la foto en foto profesional de marketing SIN cambiar la comida. Si el platillo es típico costarricense, que refleje la cultura tica (mesa de madera, hoja de plátano, chorreador de café, carreta de Sarchí desenfocada, mantel típico, frutas tropicales). Si es de otro estilo (mariscos, parrilla, hamburguesa, pizza, sushi, postre), un ambiente acorde a ese estilo, con un toque costarricense sutil si encaja.
"appeal" = qué tan apetitosa/atractiva es la foto de venta (nitidez, luz, encuadre, antojo). El texto "about" debe ser específico, cálido, basado SOLO en lo que ves y en la descripción; no inventes premios, años ni datos no dados; sin lorem ipsum ni frases genéricas.` });
  const txt = await call(content, 'Eres un director creativo y fotógrafo gastronómico experto en marketing para restaurantes.');
  const m = txt.match(/\{[\s\S]*\}/);
  return JSON.parse(m[0]);
}

module.exports = { analyzePhotos, enabled };
