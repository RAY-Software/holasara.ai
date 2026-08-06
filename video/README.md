# sara-video

Video promo de **Sara** (`holasara.ai`) — 56.6s, 1920×1080, 30fps. Reconstruido como
proyecto de código (antes era el `RAY Health.mp4`, hecho en una sesión de Cowork que se perdió).

## Cómo re-renderizar

```bash
npm install                 # instala puppeteer-core (usa el Chrome del sistema)
node render.mjs full        # -> out/Sara.mp4  (con la música original ya incluida)
```

Otros modos:
```bash
node render.mjs range 0 20  # preview mudo de un tramo -> out/preview.mp4
node render.mjs qa 0 23 49  # frames sueltos para QA -> out/qa/t_*.png
```

## Estructura

- `index.html` — timeline determinístico de 10 escenas (`window.setTime(t)` en segundos).
- `styles.css` — sistema de diseño (paleta tinta/menta, fuentes).
- `render.mjs` — Chrome headless → frames PNG → ffmpeg (h264) → mux del audio.
- `assets/fonts/` — Archivo 900/700 + Inter (offline).
- `assets/img/` — logo/mark de Sara y fotos recortadas.
- `assets/audio/music.m4a` — pista de audio original (auto-contenida).

## Requisitos
- Node 18+ y `ffmpeg` en el PATH.
- Google Chrome instalado (macOS). Si cambia la ruta, ajustá `CHROME` en `render.mjs`.

## Marca
Paleta: tinta `#0A0F0D` · crema `#EDEFEA` · menta `#3FE08A` · pino `#0C6B47`.
Fuente display: Archivo 900. Tagline: "la recepción que nunca cierra".
