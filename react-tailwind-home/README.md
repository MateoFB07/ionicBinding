# Home RWD con React + Tailwind CSS

Proyecto sencillo de **2º DAM (Desarrollo de Interfaces)**: una página personal con
diseño **brutalista**, **microinteracciones**, layout con **vh** y diseño **responsive**
(móvil, tablet y escritorio).

## Estructura

```text
react-tailwind-home/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── vercel.json
└── src/
    ├── main.jsx      ← arranca React y monta <Home />
    ├── Home.jsx      ← componente principal (todo el diseño está aquí)
    └── index.css     ← directivas de Tailwind y clase .brutal-btn
```

## Arrancar en local

Necesitas Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente `http://localhost:5173`).

## Compilar y probar la versión final

```bash
npm run build
npm run preview
```

## Desplegar en Vercel

1. Sube la carpeta a un repositorio de GitHub.
2. Entra en https://vercel.com y haz clic en **Add New → Project**.
3. Importa el repositorio. Vercel detecta automáticamente **Vite**.
4. Deja los comandos por defecto (`npm run build` y carpeta `dist`) y pulsa **Deploy**.
5. Copia la URL que te da Vercel y pégala en tu documento de entrega.

> Si prefieres hacerlo desde la terminal: `npm i -g vercel`, luego `vercel`,
> acepta los valores por defecto y por último `vercel --prod`.

## Qué se ha aplicado

- **Brutalismo:** bordes negros gruesos (`border-4`), sombras duras sin desenfoque
  (`shadow-brutal`), colores planos muy vivos, fuente monoespacio y cero esquinas redondeadas.
- **Microinteracciones:** botones que se hunden al pulsar, tarjetas que se levantan al
  pasar el ratón, contador de "Me gusta" con estrella animada, detalle de proyecto que
  aparece con animación `pop`, badge con `animate-pulse` y scroll suave.
- **Layout con vh:** `min-h-[100vh]` en el contenedor, `min-h-[10vh]` en cabecera y pie,
  `min-h-[80vh]` en el hero y `min-h-[40vh]` en contacto. Se usa `min-h` (no `h`) para
  que el contenido nunca se corte en pantallas pequeñas.
- **RWD (mobile first):** `grid-cols-1` en móvil, `sm:` (tablet) y `lg:` (escritorio)
  para cambiar a 2 y 3 columnas y agrandar tipografía.
