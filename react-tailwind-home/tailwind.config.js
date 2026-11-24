/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind solo genera las clases que aparecen en estos archivos
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Fuente monoespacio: muy usada en el diseño brutalista
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        // Sombra dura y desplazada: sello del brutalismo (sin desenfoque)
        brutal: '8px 8px 0px 0px #000000',
        'brutal-lg': '12px 12px 0px 0px #000000',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-8deg)' },
          '50%': { transform: 'rotate(8deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.6s ease-in-out infinite',
        pop: 'pop 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
