// Textos de respaldo (sin IA). Específicos según palabras clave, nunca lorem ipsum.
const KINDS = [
  { k: /soda|casado|t[ií]pic|casero|gallo pinto|almuerzo/i, type: 'soda típica costarricense', slogans: ['Sabor casero, de la casa a su mesa', 'Como en casa de la abuela', 'El sabor de Costa Rica en cada plato'] },
  { k: /parrilla|carne|marisc|mariner|gourmet|fine|chef|vino|steak/i, type: 'restaurante de cocina de autor', slogans: ['Una experiencia que se saborea', 'Cada plato, una obra de arte', 'Cocina con fuego, alma y elegancia'] },
  { k: /hambur|pizza|pizzer|food ?truck|burger|wings|alitas|tacos|r[aá]pida/i, type: 'casa de comida urbana', slogans: ['Antójate. Repite. Cuéntaselo a todos', 'Hecho para los que tienen hambre de verdad', 'Sabor sin filtros'] },
];
function kind(text) {
  return KINDS.find(x => x.k.test(text || '')) || { type: 'restaurante', slogans: ['Buen sabor, buen ambiente, buena compañía', 'Donde siempre quieres volver', 'Comer rico es una buena decisión'] };
}
function slogan(name, desc) {
  const k = kind((desc || '') + ' ' + (name || ''));
  return k.slogans[(name || '').length % k.slogans.length];
}
function about(name, desc, loc, dishes) {
  const k = kind((desc || '') + ' ' + (name || ''));
  const d = (desc || '').trim();
  const parts = (loc || '').split(',').map(s => s.trim()).filter(Boolean);
  const city = parts.length > 1 ? parts[parts.length - 2] : '';
  const p1 = d
    ? `${name} es ${k.type}${city ? ' en ' + city : ''}. ${d}`
    : `${name} es ${k.type}${city ? ' en ' + city : ''}, un lugar pensado para sentarse sin prisa y disfrutar.`;
  const p2 = dishes.length
    ? `En nuestra mesa destacan ${dishes.slice(0, 3).join(', ').replace(/, ([^,]*)$/, ' y $1')}, preparados cada día con ingredientes frescos y la atención de un equipo que ya te espera con una sonrisa.`
    : `Cada día preparamos nuestros platillos con ingredientes frescos y la atención de un equipo que ya te espera con una sonrisa.`;
  return [p1, p2];
}
module.exports = { slogan, about, kind };
