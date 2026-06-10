# Portafolio — Diedrizon Fargas

Portafolio personal de **Diedrizon Domingo Fargas Barrera**, desarrollador de
software y analista de datos BI (Juigalpa, Nicaragua).

**Producción:** https://portafolio-de-diedrizon.netlify.app

---

## Stack

- **React 19 + Vite 6** — SPA de una sola página, sin router.
- **CSS plano con design tokens** — sin frameworks de UI ni CSS-in-JS.
- **Cero dependencias de runtime extra** — solo `react` y `react-dom`.
- Fuentes **auto-hospedadas** (woff2, subset latin): Archivo Black, Archivo
  (variable) y Martian Mono. Sin peticiones a Google Fonts.
- Iconos **SVG inline** (`src/components/Icons.jsx`). Sin `react-icons`.

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
  fonts/                woff2 auto-hospedadas (preload en index.html)
  icons/                favicons PNG + maskable (PWA)
  CV-Diedrizon.pdf      CV descargable
  og.png                imagen Open Graph 1200×630
  favicon.svg           favicon vectorial
  manifest.webmanifest  robots.txt · sitemap.xml
src/
  data/profile.js       ← ÚNICA fuente de contenido (textos, proyectos, redes)
  styles/global.css     tokens, base, utilidades y motivos de marca
  hooks/
    useReveal.js        reveal en cascada con un solo IntersectionObserver
    useCountUp.js       contadores de KPIs (rAF, una sola vez)
  components/           secciones + su CSS colocalizado
```

## Cómo personalizar

Casi todo el contenido vive en **`src/data/profile.js`**: identidad, contacto,
redes, indicadores, stack y proyectos. Editá ese archivo y no hace falta tocar
componentes.

- Colores y tipografía → tokens en `src/styles/global.css` (`:root`).
- Imagen OG / favicons → reemplazar archivos en `public/`.
- CV → reemplazar `public/CV-Diedrizon.pdf` (mismo nombre).

## Decisiones de rendimiento

- **Animación solo con CSS `transform`/`opacity`** (composición en GPU). No
  hay bucles `requestAnimationFrame` permanentes ni listeners de `mousemove`.
- El reveal de secciones usa **un único `IntersectionObserver`** que se
  desconecta al terminar; el contador de KPIs corre **una vez** (~1.1 s).
- El indicador de progreso del scroll usa un solo listener pasivo con
  *throttle* por `requestAnimationFrame`.
- `prefers-reduced-motion` desactiva toda animación (entrada del hero,
  reveals, ticker, contadores) mostrando el estado final.
- Sin JavaScript la página es **100 % legible**: el ocultamiento previo a la
  animación solo se aplica bajo `html.js` (clase añadida por un script inline
  en `<head>`).
- Imágenes del retrato en **AVIF/WebP/JPG** con `width`/`height` explícitos
  (sin CLS) y `fetchpriority="high"` en el hero.
- Fuentes críticas con `<link rel="preload">` y `font-display: swap`.

## Accesibilidad

- Salto al contenido (`skip-link`), foco visible ámbar en todo control.
- Navegación móvil real (botón con `aria-expanded`, cierre con `Escape`).
- H1 con texto real (el contorno es solo CSS), `aria-label` en iconos,
  estados del botón «Copiar» anunciados con `aria-live`.
- Objetivos táctiles ≥ 44 px y contraste AA sobre fondo tinta.

## Despliegue (Netlify)

El repo incluye `netlify.toml` con el comando de build, el directorio
`dist/` y cabeceras de caché/seguridad. Basta con conectar el repositorio en
Netlify; no se necesita configuración adicional.
