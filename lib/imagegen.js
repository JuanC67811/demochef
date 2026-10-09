// Edición de fotos con un modelo de imágenes (Gemini "Nano Banana"). Claude no genera imágenes:
// Claude escribe la dirección de arte de cada foto y este modelo la ejecuta.
const sharp = require('sharp');
const MODEL = () => process.env.GEMINI_IMAGE_MODEL || 'gemini-nano-banana-2.1';
const enabled = () => !!process.env.GEMINI_API_KEY;

const RATIOS = { '1:1': 1, '5:4': 1.25, '4:5': 0.8, '4:3': 4 / 3, '3:4': 0.75, '3:2': 1.5, '2:3': 2 / 3, '16:9': 16 / 9, '9:16': 9 / 16 };
const closestRatio = r => Object.entries(RATIOS).sort((a, z) => Math.abs(a[1] - r) - Math.abs(z[1] - r))[0][0];

// Busca el primer bloque de imagen en la respuesta, sin depender de la estructura exacta
function findImage(o) {
  if (!o || typeof o !== 'object') return null;
  if (o.type === 'image' && typeof o.data === 'string') return o.data;
  for (const v of Array.isArray(o) ? o : Object.values(o)) { const r = findImage(v); if (r) return r; }
  return null;
}

const RULES = `Professional food photography retouch for a restaurant's website.
STRICT RULES: keep the exact same dish — same ingredients, portion size, plating and serving dish. Do not add, remove or change any food. Do not add text, logos, watermarks or people's faces.
Improve: natural appetizing light (soft window light), rich but realistic color, crisp focus on the food, gentle shallow depth of field, a hint of freshness (steam or sheen only if it fits the dish).
Background and props: `;

async function enhance(file, scene) {
  const meta = await sharp(file).rotate().metadata();
  const w = meta.autoOrient?.width || meta.width, h = meta.autoOrient?.height || meta.height;
  const input = await sharp(file).rotate().resize(1536, 1536, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 88 }).toBuffer();
  const r = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      model: MODEL(),
      input: [
        { type: 'text', text: RULES + scene },
        { type: 'image', mime_type: 'image/jpeg', data: input.toString('base64') },
      ],
      response_format: { type: 'image', aspect_ratio: closestRatio(w / h), image_size: '2K' },
    }),
  });
  if (!r.ok) throw new Error('Gemini ' + r.status + ' ' + (await r.text()).slice(0, 300));
  const b64 = findImage(await r.json());
  if (!b64) throw new Error('Gemini no devolvió imagen');
  return Buffer.from(b64, 'base64');
}

// Escena por defecto cuando no hay Claude: según el tipo de comida
function defaultScene(kindText, cat) {
  const t = (kindText || '').toLowerCase();
  if (cat === 'bebida') return 'rustic Costa Rican wooden table, a traditional cloth coffee "chorreador" or fresh tropical fruit softly blurred in the background, warm morning light.';
  if (/marisc|pescad|ceviche|mariner/.test(t)) return 'Costa Rican Pacific coast vibe: weathered wood table near the sea, soft sunset light, lime halves and fresh cilantro, ocean bokeh in the background.';
  if (/parrilla|carne|steak|gourmet|autor|fine/.test(t)) return 'elegant dark slate or dark wood surface, low-key dramatic light, subtle Costa Rican touches (coffee beans, local hardwood), premium restaurant atmosphere.';
  if (/hambur|pizza|urbana|r[aá]pida|burger|truck/.test(t)) return 'modern urban street-food setting, dark backdrop with a colorful neon glow, kraft paper, energetic but clean composition.';
  return 'traditional Costa Rican "soda" setting: warm wooden table, banana leaf under the plate, a cloth coffee chorreador and a hand-painted Sarchí oxcart pattern softly blurred in the background, warm natural light.';
}

// Ejecuta tareas con concurrencia limitada
async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const it = items[i++]; await fn(it); } }));
}

module.exports = { enabled, enhance, defaultScene, pool };
