import { useState } from 'react';

/*
 * Datos de ejemplo.
 * Los dejamos fuera del componente para no repetir el mismo JSX tres veces.
 */
const proyectos = [
  {
    id: 1,
    titulo: 'Calculadora React',
    descripcion: 'Operaciones básicas usando el estado useState.',
    tecnologia: 'React',
    color: 'bg-[#ffe600]',
  },
  {
    id: 2,
    titulo: 'To-Do brutalista',
    descripcion: 'Lista de tareas con bordes gruesos y sombras duras.',
    tecnologia: 'Tailwind',
    color: 'bg-[#ff7ac6]',
  },
  {
    id: 3,
    titulo: 'API de películas',
    descripcion: 'Consulta de una API pública con fetch y useEffect.',
    tecnologia: 'JavaScript',
    color: 'bg-[#b8ff5c]',
  },
];

function Home() {
  // Estado 1: contador de "Me gusta" (microinteracción)
  const [likes, setLikes] = useState(0);

  // Estado 2: qué tarjeta tiene el detalle abierto (null = ninguna)
  const [detalleAbierto, setDetalleAbierto] = useState(null);

  return (
    /* min-h-[100vh]: la página ocupa como mínimo toda la altura de la pantalla */
    <div className="min-h-[100vh] bg-[#f4f1ea] font-mono text-black">
      {/* ================= CABECERA ================= */}
      <header className="flex min-h-[10vh] flex-wrap items-center justify-between gap-3 border-b-4 border-black bg-white px-4 py-3 sm:px-8">
        <a href="#inicio" className="text-xl font-black uppercase tracking-tight sm:text-2xl">
          MATEO<span className="bg-[#ffe600] px-1">.DEV</span>
        </a>

        <nav className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase sm:gap-5 sm:text-sm">
          <a href="#inicio" className="border-2 border-black px-2 py-1 transition-colors hover:bg-black hover:text-white">
            Inicio
          </a>
          {/* En móvil se ocultan dos enlaces para que la cabecera no se amontone */}
          <a href="#proyectos" className="hidden border-2 border-black px-2 py-1 transition-colors hover:bg-black hover:text-white sm:inline">
            Proyectos
          </a>
          <a href="#contacto" className="hidden border-2 border-black px-2 py-1 transition-colors hover:bg-black hover:text-white sm:inline">
            Contacto
          </a>
          <span className="animate-pulse border-2 border-black bg-[#b8ff5c] px-2 py-1">
            Disponible
          </span>
        </nav>
      </header>

      <main>
        {/* ================= HERO (PANTALLA PRINCIPAL) ================= */}
        <section
          id="inicio"
          className="flex min-h-[80vh] flex-col justify-center border-b-4 border-black px-4 py-12 sm:px-8"
        >
          <div className="mx-auto w-full max-w-6xl">
            <p className="mb-5 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-bold uppercase shadow-brutal sm:text-sm">
              Hola, bienvenido a mi web
            </p>

            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-tighter sm:text-7xl lg:text-8xl">
              Yo soy <span className="bg-[#ffe600] px-2">Mateo</span>,
              <br />
              desarrollo{' '}
              <span className="underline decoration-8 decoration-[#ff7ac6] underline-offset-4">
                interfaces
              </span>{' '}
              web.
            </h1>

            <p className="mt-6 max-w-xl border-l-4 border-black pl-4 text-base sm:text-lg">
              Estudio 2º DAM y estoy aprendiendo React y Tailwind CSS. Esta es mi
              primera página responsive con estilo brutalista.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#proyectos" className="brutal-btn bg-[#ffe600] text-center">
                Ver mis proyectos →
              </a>

              {/* Botón con estado: cada clic suma 1 y la estrella se mueve */}
              <button
                type="button"
                onClick={() => setLikes(likes + 1)}
                className="brutal-btn bg-white"
                aria-label="Dar me gusta"
              >
                <span className="mr-1 inline-block animate-wiggle">★</span>
                Me gusta ({likes})
              </button>
            </div>
          </div>
        </section>

        {/* ================= FRANJA DE DATOS ================= */}
        {/* 1 columna en móvil, 3 columnas desde tablet (sm) */}
        <section className="grid grid-cols-1 border-b-4 border-black sm:grid-cols-3">
          <div className="border-b-4 border-black bg-white p-6 sm:border-b-0 sm:border-r-4">
            <p className="text-4xl font-black sm:text-5xl">2º</p>
            <p className="mt-1 text-xs font-bold uppercase sm:text-sm">Curso DAM</p>
          </div>
          <div className="border-b-4 border-black bg-[#ff7ac6] p-6 sm:border-b-0 sm:border-r-4">
            <p className="text-4xl font-black sm:text-5xl">3</p>
            <p className="mt-1 text-xs font-bold uppercase sm:text-sm">Proyectos de clase</p>
          </div>
          <div className="bg-[#b8ff5c] p-6">
            <p className="text-4xl font-black sm:text-5xl">100%</p>
            <p className="mt-1 text-xs font-bold uppercase sm:text-sm">Hecho con Tailwind</p>
          </div>
        </section>

        {/* ================= PROYECTOS ================= */}
        {/* 1 columna en móvil, 2 en tablet (md), 3 en escritorio (lg) */}
        <section id="proyectos" className="px-4 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-3xl font-black uppercase sm:text-5xl">
              Mis proyectos <span className="text-[#ff7ac6]">✦</span>
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {proyectos.map((proyecto) => (
                <article
                  key={proyecto.id}
                  className="border-4 border-black bg-white p-5 shadow-brutal transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg"
                >
                  <span className={`inline-block border-2 border-black px-2 py-1 text-xs font-bold ${proyecto.color}`}>
                    {proyecto.tecnologia}
                  </span>

                  <h3 className="mt-4 text-2xl font-black uppercase">
                    {proyecto.titulo}
                  </h3>

                  <p className="mt-2 text-sm sm:text-base">{proyecto.descripcion}</p>

                  <button
                    type="button"
                    onClick={() =>
                      setDetalleAbierto(
                        detalleAbierto === proyecto.id ? null : proyecto.id
                      )
                    }
                    className="mt-4 font-bold underline decoration-4 underline-offset-4 hover:no-underline"
                  >
                    {detalleAbierto === proyecto.id
                      ? 'Ocultar detalle ↑'
                      : 'Ver detalle →'}
                  </button>

                  {/* El detalle solo aparece si esta tarjeta está abierta */}
                  {detalleAbierto === proyecto.id && (
                    <p className="mt-3 animate-pop border-2 border-black bg-[#f4f1ea] p-2 text-sm">
                      Detalle: ejercicio de clase realizado con{' '}
                      {proyecto.tecnologia}.
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CONTACTO ================= */}
        <section
          id="contacto"
          className="flex min-h-[40vh] flex-col justify-center border-t-4 border-black bg-[#7cc4ff] px-4 py-12 sm:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-black uppercase sm:text-5xl">¿Hablamos?</h2>
            <p className="mt-2 text-sm font-bold uppercase sm:text-base">
              Escríbeme y respondo lo antes posible.
            </p>
            <a href="mailto:mateo@example.com" className="brutal-btn mt-6 bg-white">
              mateo@example.com
            </a>
          </div>
        </section>
      </main>

      {/* ================= PIE ================= */}
      <footer className="flex min-h-[10vh] items-center justify-center border-t-4 border-black bg-black px-4 py-4 text-center text-xs font-bold uppercase text-white sm:text-sm">
        Hecho con React + Tailwind CSS · 2º DAM · 2026
      </footer>
    </div>
  );
}

export default Home;
