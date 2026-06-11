# Portafolio — Diedrizon Fargas

Portafolio personal de **Diedrizon Domingo Fargas Barrera**, desarrollador de
software y analista de datos BI (Juigalpa, Nicaragua). Concepto v4:
**observatorio de datos** — una sola escena 3D que VIAJA con el scroll por
todo el sitio (terreno → torres KPI → constelación → logotipo DF), carril
horizontal pineado de proyectos y micro-interacciones de instrumento sobre
la identidad "ficha técnica".

**Producción:** https://portafolio-de-diedrizon.netlify.app

---

## Stack

- **React 19 + Vite 6** — SPA de una sola página.
- **Three.js** — escena de datos procedural por fases (shaders propios) en
  un chunk asíncrono que se descarga mientras corre el preloader.
- **GSAP + ScrollTrigger** — intro del hero, scrubs por scroll, manifiesto.
- **Lenis** — scroll inercial (nativo, no transform) sincronizado con
  ScrollTrigger a través de un único ticker.
- CSS plano con design tokens; fuentes **auto-hospedadas** (woff2 subset
  latin): Archivo Black, Archivo variable y Martian Mono.
- Iconos SVG inline y arte de proyectos pregenerado (AVIF/WebP).

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # desarrollo (http://localhost:5173)
npm run build    # build de producción → dist/
npm run preview  # servir dist/ localmente
npm run lint     # ESLint
```

## Estructura

```
public/
  fonts/ icons/ CV-Diedrizon.pdf og.png favicon.svg
  manifest.webmanifest · robots.txt · sitemap.xml
src/
  data/profile.js        ← ÚNICA fuente de contenido
  lib/motion.js          GSAP + ScrollTrigger + Lenis (una fuente rAF)
  lib/scramble.js        efecto de texto "descifrándose"
  three/createDataScene.js  escena viajera: terreno, torres KPI,
                            constelación y DF extruido (GLSL, vanilla three)
  lib/split.js           títulos letra a letra (accesible)
  lib/marquee.js         marquesinas reactivas a la velocidad del scroll
  assets/previews/       tarjetas de instrumento por proyecto (generadas)
  assets/retrato.*       retrato duotono de campo (generado)
  hooks/                 useReveal · useActiveSection
  components/            secciones + Preloader, Scene3D, Cursor, Rail,
                         Odometer
  styles/global.css      tokens, base, Lenis, grano
```

## Experiencia v4

1. **Preloader de arranque**: porcentaje real (fuentes + escena 3D),
   frases que se descifran, salida en cortina.
2. **Hero cinematográfico**: 170svh con interior sticky; el nombre entra
   por líneas, el HUD muestra hora local viva y, al hacer scroll, la
   cámara se sumerge en el terreno mientras el titular se parte.
3. **Viaje 3D por fases** — UNA escena persiste todo el recorrido y la
   cámara vuela entre 5 estaciones conducida por las secciones:
   - *Hero*: terreno desplazado por ruido simplex con rejilla milimetrada
     antialiasada y polvo ámbar (todo el movimiento en GPU).
   - *Perfil*: un **skyline de 16 pilares de luz** crece del terreno en
     cascada al pasar por los indicadores (líneas con gradiente y puntas
     que titilan — un solo draw call, altura calculada en el shader); la
     cámara los sobrevuela.
   - *Proyectos*: un **dial de radar** profundo (anillos concéntricos +
     36 marcas contra-rotando) aparece tenue tras el contenido; durante
     el carril pineado la escena entera se ATENÚA al 45% para que las
     láminas manden, y recupera presencia hacia el cierre.
   - *Contacto*: el logotipo **DF extruido** se ensambla girando con un
     anillo orbital de partículas — el jefe final del scroll.
4. **Manifiesto**: las palabras se "encienden" conducidas por el scroll.
5. **Retrato de campo**: foto real del Hackathon Nicaragua en duotono
   tinta/papel con rejilla de instrumento, capa fantasma ámbar y línea de
   escaneo que lo "ensambla" al entrar en viewport — montado como carnet
   junto a los indicadores (foto + KPIs = ficha técnica).
6. **KPIs de rodillo**: cada dígito es una columna 0-9 que gira hasta su
   valor (odómetro de instrumento), con el valor real en `sr-only`.
7. **Carril horizontal pineado** (escritorio sin reduced-motion): los
   destacados se recorren en horizontal con HUD `01 / 03` + barra de
   progreso y parallax interno del arte por lámina
   (`containerAnimation`). En táctil/reduced: pila vertical.
8. **Títulos letra a letra**: máscaras por carácter en cascada, texto
   real en `aria-label`.
9. **Marquesinas reactivas**: stack y cinta de contacto aceleran y se
   inclinan (skew) con la velocidad del scroll vía Lenis.
10. **Proyectos (rejilla)**: tarjeta de instrumento que flota siguiendo
    el puntero (escritorio) o inline (táctil).
11. **Contacto**: cinta inversa a sangre completa y HABLEMOS gigante con
    llenado ámbar al hover.
12. **Cursor de instrumento + botones magnéticos** (solo puntero fino),
    regla lateral de progreso y grano fílmico estático.
13. **Huevos de pascua**: arte ASCII + mensaje para reclutadores en la
    consola; la pestaña pregunta «¿Ya te vas?» al cambiar de pestaña;
    página **404 "Señal perdida"** autónoma con scramble.

## Rendimiento

- **three en chunk asíncrono** (141 KB gz) que se descarga en paralelo al
  preloader; el hilo inicial carga ~127 KB gz (react 60.5 + motion 50.6 +
  app 16.1).
- La escena usa **DPR limitado** (1.5 móvil / 1.75 escritorio), menos
  geometría/partículas/órbita en móvil y **se pausa** con la pestaña
  oculta; los grupos por fase se ocultan (`visible=false`) fuera de su
  tramo, así el render dibuja solo lo que toca.
- Desplazamiento de vértices, dibujado de enlaces y órbita **en GPU**:
  por frame la CPU solo interpola cámara y escalas (decenas de números).
- Lenis + ScrollTrigger comparten **un único ticker**; sin listeners de
  `mousemove` globales fuera del parallax del hero y el cursor (ambos
  quickTo, solo punteros finos).
- `prefers-reduced-motion` desactiva TODO: sin preloader, sin 3D (queda el
  Backdrop estático idéntico en identidad), sin scrubs, sin carril
  horizontal (pila vertical), sin odómetros ni marquesinas (valores y
  contenido estáticos).
- Sin WebGL la página funciona igual con el fondo estático.
- Imágenes AVIF/WebP con dimensiones explícitas (cero CLS), fuentes con
  preload y `font-display: swap`, caché inmutable vía `netlify.toml`.
- **Alturas cortas** (laptops 1366×768, ventanas reducidas): dos tiers de
  compresión vertical del hero (≤860px y ≤720px) garantizan que título,
  CTAs, redes y ficha entren completos en el pliegue.

## Accesibilidad

Skip-link con salto nativo, anclas suaves que **mueven el foco** al
destino, foco visible ámbar, menú móvil con `aria-expanded` + Escape,
H1/H2 con texto real (contornos y capas decorativas `aria-hidden`),
estados del botón «Copiar» con `aria-live`, targets ≥ 44 px. Los títulos
divididos conservan su texto en `aria-label`; los odómetros llevan el
valor real en `sr-only`; el carril horizontal es solo presentación (el
orden del DOM es el natural).

## Personalización

Contenido en `src/data/profile.js`; colores/tipos en
`src/styles/global.css`; arte de proyectos en `src/assets/previews/`
(regenerable); CV en `public/CV-Diedrizon.pdf`.

## Despliegue (Netlify)

`netlify.toml` incluido (build, `dist/`, caché y cabeceras de seguridad).
Conectar el repositorio y listo.
