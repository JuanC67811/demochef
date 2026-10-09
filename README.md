# DemoChef — Generador de demos web para restaurantes

Herramienta interna para crear, en minutos, una demostración comercial de la página web de un restaurante.

## Uso
```
npm install
npm start          # http://localhost:4321
```
1. Llenar el formulario (nombre, logo, colores, contacto, ubicación, redes, fotos, menú).
2. **Generar demo**: analiza las fotos, elige las 3 mejores comidas como *Especialidades*, las retoca y arma la web.
3. En la pantalla de presentación: cambiar plantilla en vivo (Rustic CR / Premium / Urban), vista móvil o escritorio, ajustar textos y copiar el enlace.

## IA (opcional, recomendado)
Copiar `.env.example` a `.env` y completar las claves:
- `ANTHROPIC_API_KEY` (**Claude**): clasifica cada foto, puntúa qué tan apetitosa es, nombra los platillos, escribe eslogan y "Sobre nosotros", y escribe la **dirección de arte** (fondo y utilería) de cada foto de comida.
- `GEMINI_API_KEY` (**Gemini, edición de imágenes**): rehace las fotos de comida y bebida siguiendo esa dirección de arte: la misma comida, pero con luz profesional y un fondo acorde (costarricense si es comida típica). Claude no genera imágenes, por eso este paso usa Gemini. Las originales se conservan y en la presentación hay un botón para alternar **Fotos IA / Originales**.

Sin claves: puntaje local (nitidez, luz, contraste, color, encuadre), retoque local con `sharp` y textos a partir de la descripción.

## Colores y contacto
- Con logo, la página usa automáticamente sus 2 colores principales (casilla "Usar los colores del logo").
- Teléfono y WhatsApp son opcionales: si no hay WhatsApp, los botones pasan a "Llamar"; si no hay ninguno, se ocultan.

## Funciones interactivas (gratis)
- 📅 **Reservaciones**: fecha, hora, personas y nota, enviado por WhatsApp.
- 🔍 **Buscador del menú** (con más de 5 platillos).
Se activan o desactivan en el formulario o en "Ajustar". Las reservas requieren WhatsApp.

## Guardar y publicar
- Las demos se guardan solas en `data/` y aparecen en la lista (🗑 para eliminar).
- **⬇ Descargar sitio** (en la presentación) genera un ZIP con `index.html` + imágenes. Descomprimir y arrastrar la carpeta a https://app.netlify.com/drop para tener un enlace público gratis que mandarle al cliente.

## Instrucciones especiales
Al final del formulario (y en "Ajustar" de la presentación) se escriben pedidos del cliente o propios, uno por línea. Gratis, interpretados con reglas en español:
- `Horario: ...` · `Plato del día: ...` · `Aviso: ...` (banda destacada bajo la portada)
- `Eslogan: ...` · `Agregar en nosotros: ...` · `El botón que diga ...`
- `Ocultar la galería` (también menú, especialidades, nosotros, ubicación)
- `Color principal verde` / `Color secundario dorado` / `#hex`
- `Que se vea más elegante` / `más moderno` / `más tradicional` (cambia plantilla)
- `Sin adornos ticos` / `Más tico`

Lo que no entienda se muestra aparte. Si [Ollama](https://ollama.com) (IA local gratuita) está instalado y corriendo, se usa automáticamente para frases libres.

## Estructura
- `server.js`: API y rutas (`/` formulario, `/p/:slug` presentación, `/demo/:slug?t=plantilla` la web)
- `lib/images.js`: análisis de calidad y retoque · `lib/ai.js`: Claude visión · `lib/instructions.js`: instrucciones especiales · `lib/imagegen.js`: fotos con IA (Gemini) · `lib/copy.js`: textos de respaldo
- `templates/`: `rustic.js`, `premium.js`, `urban.js` + `common.js`
- `data/<slug>/`: cada demo (demo.json + imágenes optimizadas en webp)
