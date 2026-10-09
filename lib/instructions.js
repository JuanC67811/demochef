// Instrucciones libres ("prompt" del cliente o propio) -> ajustes concretos de la demo. 100% gratis:
// 1) reglas en español; 2) si hay Ollama corriendo en esta computadora (IA local gratuita), se usa para frases libres.

const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const SECTIONS = {
  especialidades: /especialidad|destacad|top ?3|mas pedid/,
  menu: /\bmenu\b|\bcarta\b/,
  galeria: /galeria|fotos del local|fotografias/,
  nosotros: /nosotros|historia/,
  ubicacion: /ubicacion|mapa|direccion|como llegar/,
};
const COLORS = {
  rojo: '#c0392b', vino: '#7b1e2b', naranja: '#e67e22', amarillo: '#f2b705', dorado: '#c9a45c', verde: '#2e7d32', 'verde oscuro': '#1b5e20',
  turquesa: '#16a085', azul: '#1d4e89', celeste: '#3a9bd9', morado: '#6c3483', rosado: '#e84393', rosa: '#e84393', cafe: '#6b4426', marron: '#6b4426',
  negro: '#111111', gris: '#555555', terracota: '#c0592b', mostaza: '#d4a017',
};
const colorOf = t => { const hex = /#[0-9a-f]{6}\b/.exec(t); if (hex) return hex[0]; const k = Object.keys(COLORS).sort((a, z) => z.length - a.length).find(k => t.includes(k)); return k && COLORS[k]; };

// Texto original (con mayúsculas/tildes) después de "clave:" o de la palabra clave
const after = (orig, re) => { const m = re.exec(orig); return m ? orig.slice(m.index + m[0].length).replace(/^[\s:,-]+/, '').replace(/^["“'](.*)["”']$/, '$1').trim() : ''; };

function byRules(text) {
  const out = { custom: {}, set: {}, understood: [], unknown: [] };
  const sentences = text.split(/\n+|(?<=[.;!?])\s+/).map(s => s.trim()).filter(Boolean);
  for (const orig of sentences) {
    const t = norm(orig);
    let ok = false;
    const say = msg => { out.understood.push(msg); ok = true; };

    if (/^(eslogan|slogan|lema|frase)\b/.test(t) || /(cambia|pon|usa)\w* (el )?(eslogan|slogan|lema)/.test(t)) {
      const v = after(orig, /(eslogan|slogan|lema|frase)( principal)?( a| por| que diga| sea)?/i);
      if (v) { out.set.slogan = v; say(`Eslogan: "${v}"`); }
    } else if (/^horario|horario[s]? (es|son|de atencion)|abierto|abrimos/.test(t)) {
      const v = /^horario/.test(t) ? after(orig, /horarios?( de atenci[oó]n)?/i) : orig;
      out.custom.hours = v; say(`Horario: ${v}`);
    } else if (/^plato del dia|^especial del dia|^menu del dia/.test(t)) {
      const v = after(orig, /^(plato|especial|men[uú]) del d[ií]a/i);
      if (v) { out.custom.daily = v; say(`Plato del día: ${v}`); }
    } else if (/^(aviso|anuncio|promo|promocion|banner|nota|importante)\b/.test(t)) {
      const v = after(orig, /^(aviso|anuncio|promo|promoci[oó]n|banner|nota|importante)/i);
      if (v) { out.custom.notice = v; say(`Aviso destacado: "${v}"`); }
    } else if (/(agrega|anade|incluye|pon)\w* .*(nosotros|historia)/.test(t)) {
      const v = after(orig, /(nosotros|historia)( que diga| que)?/i);
      if (v) { (out.custom.aboutExtra ||= []).push(v); say(`Texto extra en "Sobre nosotros"`); }
    }
    if (ok) continue;

    // ocultar / mostrar secciones
    if (/(oculta|quita|elimina|esconde|borra|saca|sin |no (mostrar|poner|incluir|quiero))/.test(t)) {
      for (const [k, re] of Object.entries(SECTIONS)) if (re.test(t)) { (out.custom.hide ||= []).push(k); say(`Ocultar sección: ${k}`); }
      if (/(adorno|decoracion|rueda|carreta|tico|bandera|pura vida|motivo)/.test(t)) { out.custom.tico = 'off'; say('Sin adornos ticos'); }
      if (ok) continue;
    }
    if (/(mas|muy|bien) (tico|tipico|costarricense)|toque tico|adornos ticos/.test(t)) { out.custom.tico = 'on'; say('Con adornos ticos'); continue; }

    // colores
    if (/color/.test(t) && colorOf(t)) {
      if (/secundari|segundo|acento/.test(t)) { out.set.color2 = colorOf(t); say(`Color secundario: ${out.set.color2}`); }
      else { out.set.color = colorOf(t); say(`Color principal: ${out.set.color}`); }
      continue;
    }
    // plantilla / estilo
    const tpl = /(premium|elegante|fino|lujo|gourmet)/.test(t) ? 'premium' : /(urban|moderno|juvenil|urbano|joven)/.test(t) ? 'urban' : /(rustic|tradicional|tipico|casero|familiar|madera)/.test(t) ? 'rustic' : null;
    if (tpl && /(plantilla|estilo|diseno|mas |que se vea|look)/.test(t)) { out.set.template = tpl; say(`Plantilla: ${tpl}`); continue; }
    // botón principal
    if (/boton/.test(t) && /(diga|texto)/.test(t)) {
      const v = after(orig, /(que diga|texto( del bot[oó]n)?( a)?)/i);
      if (v) { out.custom.cta = v; say(`Texto del botón principal: "${v}"`); continue; }
    }
    out.unknown.push(orig);
  }
  return out;
}

// IA local gratuita (Ollama), solo si está instalada y corriendo
async function ollamaModel() {
  try {
    const r = await fetch('http://127.0.0.1:11434/api/tags', { signal: AbortSignal.timeout(800) });
    const { models } = await r.json();
    return process.env.OLLAMA_MODEL || models?.[0]?.name || null;
  } catch { return null; }
}
async function byOllama(text, model) {
  const prompt = `Convierte estas instrucciones para la página web de un restaurante en JSON. Solo usa estas claves (omite las que no apliquen):
{"slogan":"texto","hours":"texto","daily":"plato del día","notice":"aviso destacado","aboutExtra":["párrafo"],"hide":["especialidades|menu|galeria|nosotros|ubicacion"],"tico":"on|off","color":"#hex","color2":"#hex","template":"rustic|premium|urban","cta":"texto del botón","unknown":["instrucciones que no encajan en ninguna clave"]}
Instrucciones:\n${text}`;
  const r = await fetch('http://127.0.0.1:11434/api/generate', {
    method: 'POST', body: JSON.stringify({ model, prompt, format: 'json', stream: false, options: { temperature: 0.1 } }), signal: AbortSignal.timeout(90000),
  });
  const j = JSON.parse((await r.json()).response || '{}');
  const out = { custom: {}, set: {}, understood: [], unknown: Array.isArray(j.unknown) ? j.unknown : [] };
  for (const k of ['slogan', 'color', 'color2', 'template']) if (j[k]) { out.set[k] = j[k]; out.understood.push(`${k}: ${j[k]}`); }
  for (const k of ['hours', 'daily', 'notice', 'aboutExtra', 'hide', 'tico', 'cta']) if (j[k] && (!Array.isArray(j[k]) || j[k].length)) { out.custom[k] = j[k]; out.understood.push(`${k}: ${Array.isArray(j[k]) ? j[k].join(', ') : j[k]}`); }
  return out;
}

async function interpret(text) {
  if (!text || !text.trim()) return { custom: {}, set: {}, understood: [], unknown: [], engine: 'ninguno' };
  const rules = byRules(text);
  const model = rules.unknown.length ? await ollamaModel() : null;
  if (model) {
    try { const o = await byOllama(text, model); return { ...o, engine: `Ollama (${model})` }; }
    catch (e) { console.warn('Ollama falló, uso reglas:', e.message); }
  }
  return { ...rules, engine: 'reglas' };
}

// Aplica el resultado a la demo
function apply(d, r) {
  const okTpl = ['rustic', 'premium', 'urban'];
  if (r.set.slogan) d.slogan = r.set.slogan;
  if (/^#[0-9a-f]{6}$/i.test(r.set.color || '')) d.biz.color = r.set.color;
  if (/^#[0-9a-f]{6}$/i.test(r.set.color2 || '')) d.biz.color2 = r.set.color2;
  if (okTpl.includes(r.set.template)) d.template = r.set.template;
  const c = r.custom;
  d.custom = {
    hide: (Array.isArray(c.hide) ? c.hide : []).filter(h => Object.keys(SECTIONS).includes(h)),
    tico: c.tico === 'off' ? 'off' : 'on',
    hours: c.hours || '', daily: c.daily || '', notice: c.notice || '', cta: c.cta || '',
    aboutExtra: Array.isArray(c.aboutExtra) ? c.aboutExtra : [],
  };
  d.instructionsResult = { understood: r.understood, unknown: r.unknown, engine: r.engine };
  return d;
}

module.exports = { interpret, apply };
