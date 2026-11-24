"""Genera el PDF de la entrega: Home RWD con React + Tailwind CSS.

Uso:  python3 docs/generar_pdf.py
Requiere: pip install reportlab
"""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
    XPreformatted,
)

BASE = Path(__file__).resolve().parent
CAPTURAS = BASE / "captures"
SALIDA = BASE / "Entrega_Home_React_Tailwind.pdf"

AMARILLO = colors.HexColor("#ffe600")
ROSA = colors.HexColor("#ff7ac6")
VERDE = colors.HexColor("#b8ff5c")
AZUL = colors.HexColor("#7cc4ff")
GRIS = colors.HexColor("#eeeeee")
NEGRO = colors.black

styles = getSampleStyleSheet()

titulo = ParagraphStyle(
    "Titulo", parent=styles["Title"], fontName="Helvetica-Bold",
    fontSize=27, leading=31, textColor=NEGRO, alignment=TA_CENTER,
)
subtitulo = ParagraphStyle(
    "Subtitulo", parent=styles["Normal"], fontName="Helvetica",
    fontSize=13, leading=18, alignment=TA_CENTER,
)
normal = ParagraphStyle(
    "Normal2", parent=styles["Normal"], fontName="Helvetica",
    fontSize=9.5, leading=14,
)
small = ParagraphStyle(
    "Small", parent=normal, fontSize=8.3, leading=11.5,
)
seccion = ParagraphStyle(
    "Seccion", parent=normal, fontName="Helvetica-Bold",
    fontSize=13, leading=16,
)
codigo_style = ParagraphStyle(
    "Codigo", parent=styles["Code"], fontName="Courier",
    fontSize=7.4, leading=10, textColor=NEGRO,
)


def cabecera_seccion(texto, color=AMARILLO):
    tabla = Table([[Paragraph(texto, seccion)]], colWidths=[170 * mm])
    tabla.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), color),
        ("BOX", (0, 0), (-1, -1), 1.2, NEGRO),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return tabla


def bloque_codigo(texto):
    tabla = Table([[XPreformatted(texto, codigo_style)]], colWidths=[170 * mm])
    tabla.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GRIS),
        ("BOX", (0, 0), (-1, -1), 0.9, NEGRO),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return tabla


def tabla_datos(filas, anchos):
    tabla = Table(filas, colWidths=anchos, repeatRows=1)
    tabla.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NEGRO),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.3),
        ("LEADING", (0, 0), (-1, -1), 11),
        ("GRID", (0, 0), (-1, -1), 0.7, NEGRO),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, GRIS]),
    ]))
    return tabla


def imagen(nombre, ancho_max):
    ruta = CAPTURAS / nombre
    img = Image(str(ruta))
    factor = min(ancho_max / img.imageWidth, 1)
    img.drawWidth = img.imageWidth * factor
    img.drawHeight = img.imageHeight * factor
    img.hAlign = "CENTER"
    return img


def pie(canvas, doc):
    """Numera las páginas (excepto la portada) y dibuja una línea brutalista."""
    canvas.saveState()
    numero = canvas.getPageNumber()
    if numero > 1:
        canvas.setStrokeColor(NEGRO)
        canvas.setLineWidth(1)
        canvas.line(20 * mm, 15 * mm, 190 * mm, 15 * mm)
        canvas.setFont("Helvetica", 8)
        canvas.drawString(20 * mm, 10 * mm, "Desarrollo de Interfaces · 2º DAM · React + Tailwind CSS")
        canvas.drawRightString(190 * mm, 10 * mm, f"Página {numero}")
    canvas.restoreState()


story = []

# ============================ PORTADA ============================
story.append(Spacer(1, 32 * mm))
portada = Table(
    [[Paragraph("DESARROLLO DE INTERFACES<br/>2º CFGS DAM", subtitulo)]],
    colWidths=[170 * mm],
)
portada.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), VERDE),
    ("BOX", (0, 0), (-1, -1), 1.5, NEGRO),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
]))
story.append(portada)
story.append(Spacer(1, 12 * mm))
story.append(Paragraph("HOME RWD CON<br/>REACT + TAILWIND", titulo))
story.append(Spacer(1, 6 * mm))
story.append(Paragraph("Página personal responsive: brutalismo, microinteracciones y layout con vh", subtitulo))
story.append(Spacer(1, 14 * mm))
datos_portada = [
    ["Alumno", "Mateo Fernández Blasco"],
    ["Módulo", "Desarrollo de Interfaces (Código 0488)"],
    ["Curso", "2º CFGS Desarrollo de Aplicaciones Multiplataforma"],
    ["Fecha", "24 de noviembre de 2026"],
    ["Tecnologías", "React 18 · Vite 5 · Tailwind CSS 3 · JavaScript"],
]
story.append(tabla_datos(datos_portada, [40 * mm, 130 * mm]))
story.append(Spacer(1, 12 * mm))
story.append(Paragraph(
    "Entrega: capturas Desktop / Tablet / Mobile y despliegue en Vercel",
    subtitulo,
))
story.append(PageBreak())

# ============================ 1. ENUNCIADO ============================
story.append(cabecera_seccion("1. Enunciado y objetivo"))
story.append(Spacer(1, 4 * mm))
story.append(Paragraph(
    "Se pide crear un proyecto nuevo en React con un componente <b>Home</b> al que se le "
    "aplique <b>Tailwind CSS</b>. La entrega debe demostrar que la página se adapta a "
    "<b>escritorio, tablet y móvil (RWD)</b>, que usa estética <b>brutalista</b>, "
    "<b>microinteracciones</b> y un layout basado en unidades <b>vh</b>. "
    "Además se debe publicar en <b>Vercel</b> y documentar todo en este PDF.",
    normal,
))
story.append(Spacer(1, 6 * mm))

story.append(cabecera_seccion("2. Requisitos cumplidos", AMARILLO))
story.append(Spacer(1, 4 * mm))
requisitos = [
    ["Requisito", "Cómo se ha hecho", "Dónde"],
    ["Proyecto React nuevo", "Vite + React 18 (JavaScript, sin TypeScript para simplificar)", "package.json / main.jsx"],
    ["Componente Home", "Un único componente funcional con useState", "src/Home.jsx"],
    ["Tailwind CSS", "Clases utilitarias + @tailwind en CSS + configuración ampliada", "index.css / tailwind.config.js"],
    ["RWD (3 tamaños)", "Mobile first: 1 columna, sm: 2, md: 2 y lg: 3 columnas", "Home.jsx (grid)"],
    ["Brutalismo", "Bordes de 4 px, sombras duras, colores planos, sin border-radius", "Home.jsx / index.css"],
    ["Microinteracciones", "Hover, active, contador animado, pop, pulse, scroll suave", "Home.jsx / index.css"],
    ["Layout con vh", "min-h-[100vh], min-h-[80vh], min-h-[10vh]...", "Home.jsx"],
    ["Despliegue", "Proyecto preparado para Vercel (vercel.json + build)", "vercel.json"],
]
story.append(tabla_datos(requisitos, [38 * mm, 92 * mm, 40 * mm]))
story.append(Spacer(1, 6 * mm))

story.append(cabecera_seccion("3. Estructura del proyecto", ROSA))
story.append(Spacer(1, 4 * mm))
story.append(bloque_codigo(
    "react-tailwind-home/\n"
    "├── index.html            ← idioma es, meta viewport y título\n"
    "├── package.json          ← dependencias y scripts (dev / build / preview)\n"
    "├── tailwind.config.js    ← content, sombras y animaciones personalizadas\n"
    "├── postcss.config.js     ← conecta Tailwind con Vite\n"
    "├── vercel.json           ← reescritura SPA para Vercel\n"
    "└── src/\n"
    "    ├── main.jsx          ← monta &lt;Home /&gt; en #root\n"
    "    ├── Home.jsx          ← componente principal (toda la interfaz)\n"
    "    └── index.css         ← @tailwind + clase .brutal-btn"
))
story.append(PageBreak())

# ============================ 4. HOME ============================
story.append(cabecera_seccion("4. El componente Home", AMARILLO))
story.append(Spacer(1, 4 * mm))
story.append(Paragraph(
    "Todo el diseño vive en <b>src/Home.jsx</b>. Es un componente funcional sencillo: "
    "importa <font face='Courier'>useState</font>, define un array de proyectos de ejemplo "
    "y devuelve el JSX de la página. No hay react-router ni librerías de UI: solo React y "
    "clases de Tailwind, para que sea fácil de entender en clase.",
    normal,
))
story.append(Spacer(1, 4 * mm))
story.append(Paragraph("4.1. Los dos estados del componente", seccion))
story.append(Spacer(1, 2 * mm))
story.append(bloque_codigo(
    "const [likes, setLikes] = useState(0);\n"
    "const [detalleAbierto, setDetalleAbierto] = useState(null);\n\n"
    "&lt;button onClick={() =&gt; setLikes(likes + 1)}&gt;\n"
    "  &lt;span className='animate-wiggle'&gt;★&lt;/span&gt; Me gusta ({likes})\n"
    "&lt;/button&gt;"
))
story.append(Spacer(1, 4 * mm))
story.append(Paragraph(
    "El primer estado cuenta los clics del botón “Me gusta”. El segundo guarda el id de la "
    "tarjeta cuyo detalle está abierto; si es <font face='Courier'>null</font> no se muestra "
    "ningún detalle. Con esto ya tenemos dos microinteracciones reales sin complicación.",
    normal,
))
story.append(Spacer(1, 5 * mm))

story.append(Paragraph("4.2. Listado de proyectos con map()", seccion))
story.append(Spacer(1, 2 * mm))
story.append(bloque_codigo(
    "&lt;div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'&gt;\n"
    "  {proyectos.map((proyecto) =&gt; (\n"
    "    &lt;article key={proyecto.id} className='border-4 border-black\n"
    "              bg-white p-5 shadow-brutal ...'&gt;\n"
    "      &lt;h3&gt;{proyecto.titulo}&lt;/h3&gt;\n"
    "    &lt;/article&gt;\n"
    "  ))}\n"
    "&lt;/div&gt;"
))
story.append(Spacer(1, 3 * mm))
story.append(Paragraph(
    "En lugar de copiar y pegar tres tarjetas, usamos <font face='Courier'>map()</font> sobre "
    "el array <font face='Courier'>proyectos</font>. La prop <font face='Courier'>key</font> "
    "ayuda a React a identificar cada elemento.",
    normal,
))
story.append(Spacer(1, 5 * mm))

story.append(cabecera_seccion("5. Brutalismo aplicado", VERDE))
story.append(Spacer(1, 3 * mm))
brutalismo = [
    ["Técnica", "Clase / valor usado", "Efecto visual"],
    ["Bordes gruesos negros", "border-4 border-black", "Apariencia de “bloque” sin suavizar"],
    ["Sombras duras", "shadow-brutal / shadow-brutal-lg", "Desplazamiento de 8 y 12 px sin desenfoque"],
    ["Colores planos vivos", "#ffe600, #ff7ac6, #b8ff5c, #7cc4ff", "Amarillo, rosa, verde y azul saturados"],
    ["Sin esquinas redondeadas", "sin rounded-*", "Formas rectangulares, honestidad visual"],
    ["Tipografía monoespacio", "font-mono (Space Mono)", "Letra de “código”, muy del estilo"],
    ["Mayúsculas y peso extra", "uppercase font-black tracking-tighter", "Títulos grandes y contundentes"],
]
story.append(tabla_datos(brutalismo, [42 * mm, 60 * mm, 68 * mm]))
story.append(Spacer(1, 4 * mm))
story.append(bloque_codigo(
    "// tailwind.config.js\n"
    "boxShadow: {\n"
    "  brutal:    '8px 8px 0px 0px #000000',\n"
    "  'brutal-lg': '12px 12px 0px 0px #000000',\n"
    "},\n"
    "animation: {\n"
    "  wiggle: 'wiggle 0.6s ease-in-out infinite',\n"
    "  pop:    'pop 0.25s ease-out',\n"
    "}"
))
story.append(PageBreak())

# ============================ 6. MICROINTERACCIONES ============================
story.append(cabecera_seccion("6. Microinteracciones", ROSA))
story.append(Spacer(1, 3 * mm))
micro = [
    ["Elemento", "Acción del usuario", "Respuesta visual"],
    ["Botones .brutal-btn", "Pasar el ratón / pulsar", "Se levantan con la sombra más grande; al pulsar se hunden y la sombra desaparece"],
    ["Tarjetas de proyecto", "Hover", "Se desplazan -4 px y aumentan la sombra (transición de 200 ms)"],
    ["Botón “Me gusta”", "Clic", "El contador sube y la estrella balancea con animate-wiggle"],
    ["Enlace “Ver detalle”", "Clic", "Aparece un recuadro con animación animate-pop"],
    ["Badge “Disponible”", "Automático", "Parpadeo suave con animate-pulse"],
    ["Enlaces del menú", "Hover", "Fondo negro y texto blanco con transition-colors"],
    ["Navegación interna", "Clic en #inicio/#proyectos", "Desplazamiento suave gracias a scroll-behavior: smooth"],
]
story.append(tabla_datos(micro, [40 * mm, 46 * mm, 84 * mm]))
story.append(Spacer(1, 5 * mm))
story.append(Paragraph("Código del botón reutilizable (src/index.css):", seccion))
story.append(Spacer(1, 2 * mm))
story.append(bloque_codigo(
    "@layer components {\n"
    "  .brutal-btn {\n"
    "    @apply inline-block border-4 border-black px-5 py-3\n"
    "           font-bold uppercase shadow-brutal\n"
    "           transition-all duration-150\n"
    "           hover:-translate-x-1 hover:-translate-y-1\n"
    "           hover:shadow-brutal-lg\n"
    "           active:translate-x-1 active:translate-y-1\n"
    "           active:shadow-none;\n"
    "  }\n"
    "}"
))
story.append(Spacer(1, 5 * mm))

story.append(cabecera_seccion("7. Layout con unidades vh", AMARILLO))
story.append(Spacer(1, 3 * mm))
story.append(Paragraph(
    "<b>vh</b> significa <i>viewport height</i> (1 vh = 1 % de la altura de la ventana). "
    "Se usa <font face='Courier'>min-h</font> en vez de <font face='Courier'>h</font> para que, "
    "si el contenido crece en móvil, la sección pueda expandirse y no quede cortada.",
    normal,
))
story.append(Spacer(1, 3 * mm))
story.append(bloque_codigo(
    "&lt;div className='min-h-[100vh] bg-[#f4f1ea]'&gt;   ← página completa\n"
    "  &lt;header className='min-h-[10vh]'&gt; ... &lt;/header&gt;\n"
    "  &lt;section className='min-h-[80vh]'&gt; ... &lt;/section&gt;  ← hero\n"
    "  &lt;section className='min-h-[40vh]'&gt; ... &lt;/section&gt;  ← contacto\n"
    "  &lt;footer className='min-h-[10vh]'&gt; ... &lt;/footer&gt;\n"
    "&lt;/div&gt;"
))
story.append(Spacer(1, 3 * mm))
story.append(Paragraph(
    "Así la cabecera y el pie se reparten el 10 % de la pantalla cada uno y el hero ocupa "
    "el 80 % restante en escritorio. En móvil, el texto más grande hace que el hero crezca "
    "por encima de ese 80 % sin problema.",
    normal,
))
story.append(Spacer(1, 5 * mm))

story.append(cabecera_seccion("8. Diseño RWD (mobile first)", VERDE))
story.append(Spacer(1, 3 * mm))
rwd = [
    ["Dispositivo", "Ancho de prueba", "Comportamiento"],
    ["Móvil", "390 × 844 px", "1 columna, menú reducido, botones apilados, texto 5xl"],
    ["Tablet", "820 × 1180 px", "sm: 2 columnas en la franja de datos, texto 7xl, botones en fila"],
    ["Escritorio", "1440 × 900 px", "lg: 3 columnas de proyectos, texto 8xl, ancho máximo 1152 px"],
]
story.append(tabla_datos(rwd, [34 * mm, 38 * mm, 98 * mm]))
story.append(PageBreak())

# ============================ 9. CAPTURAS ============================
story.append(cabecera_seccion("9. Home en escritorio (1440 × 900 px)", AMARILLO))
story.append(Spacer(1, 4 * mm))
story.append(imagen("desktop.png", 170 * mm))
story.append(Spacer(1, 3 * mm))
story.append(Paragraph(
    "En escritorio se ven las tres columnas de proyectos, el menú completo y el hero "
    "centrado con las dos acciones en horizontal.",
    small,
))
story.append(PageBreak())

story.append(cabecera_seccion("10. Home en tablet (820 × 1180 px)", ROSA))
story.append(Spacer(1, 4 * mm))
story.append(imagen("tablet.png", 145 * mm))
story.append(Spacer(1, 3 * mm))
story.append(Paragraph(
    "En tablet la franja de datos pasa a 3 columnas (sm:) y los proyectos se muestran en "
    "2 columnas (md:). La tipografía crece respecto al móvil.",
    small,
))
story.append(PageBreak())

story.append(cabecera_seccion("11. Home en móvil (390 × 844 px)", VERDE))
story.append(Spacer(1, 4 * mm))
story.append(imagen("mobile.png", 115 * mm))
story.append(Spacer(1, 3 * mm))
story.append(Paragraph(
    "En móvil todo va en una sola columna: los enlaces “Proyectos” y “Contacto” se ocultan "
    "para no recargar la cabecera, y los botones del hero se apilan.",
    small,
))
story.append(PageBreak())

# ============================ 12. VERCEL ============================
story.append(cabecera_seccion("12. Despliegue en Vercel", AMARILLO))
story.append(Spacer(1, 3 * mm))
story.append(Paragraph(
    "Vercel detecta automáticamente los proyectos Vite, así que no hace falta configurar "
    "nada especial. El archivo <font face='Courier'>vercel.json</font> añade una reescritura "
    "para que cualquier ruta sirva el <font face='Courier'>index.html</font>.",
    normal,
))
story.append(Spacer(1, 3 * mm))
pasos = [
    ["Paso", "Acción"],
    ["1", "Crear un repositorio en GitHub y subir la carpeta del proyecto (sin node_modules ni dist)."],
    ["2", "Entrar en vercel.com → Add New… → Project e importar ese repositorio."],
    ["3", "Vercel reconoce Vite. Confirmar Build Command: npm run build y Output Directory: dist."],
    ["4", "Pulsar Deploy y esperar a que termine la compilación."],
    ["5", "Copiar la URL pública que aparece y pegarla en la línea siguiente de esta entrega."],
]
story.append(tabla_datos(pasos, [18 * mm, 152 * mm]))
story.append(Spacer(1, 4 * mm))
story.append(KeepTogether([
    Paragraph("<b>URL del despliegue:</b> ______________________________________________", normal),
    Spacer(1, 2 * mm),
    Paragraph("(se rellena después de pulsar Deploy en Vercel)", small),
]))
story.append(Spacer(1, 6 * mm))

story.append(cabecera_seccion("13. Comandos para probarlo", ROSA))
story.append(Spacer(1, 3 * mm))
story.append(bloque_codigo(
    "npm install          # instalar dependencias\n"
    "npm run dev          # servidor de desarrollo (http://localhost:5173)\n"
    "npm run build        # genera la carpeta dist/\n"
    "npm run preview      # prueba local de la versión de producción"
))
story.append(Spacer(1, 6 * mm))

story.append(cabecera_seccion("14. Conclusiones", VERDE))
story.append(Spacer(1, 3 * mm))
story.append(Paragraph(
    "Con este trabajo he practicado la creación de un proyecto React desde cero con Vite, "
    "el uso de componentes funcionales y <font face='Courier'>useState</font>, y la "
    "utilización de Tailwind CSS mediante clases utilitarias. También he aprendido a "
    "organizar el diseño con unidades <font face='Courier'>vh</font> y a usar los prefijos "
    "responsive (<font face='Courier'>sm:</font>, <font face='Courier'>md:</font>, "
    "<font face='Courier'>lg:</font>) para que una misma página funcione en móvil, tablet "
    "y escritorio sin escribir CSS media queries a mano.",
    normal,
))
story.append(Spacer(1, 3 * mm))
story.append(Paragraph(
    "Por último, el diseño brutalista me ha servido para trabajar con border gruesos, "
    "sombras duras y colores planos, y las microinteracciones han quedado resumidas en "
    "una clase <font face='Courier'>.brutal-btn</font> reutilizable y en dos animaciones "
    "definidas en <font face='Courier'>tailwind.config.js</font>.",
    normal,
))

doc = SimpleDocTemplate(
    str(SALIDA),
    pagesize=A4,
    leftMargin=20 * mm,
    rightMargin=20 * mm,
    topMargin=18 * mm,
    bottomMargin=20 * mm,
    title="Home RWD con React + Tailwind CSS",
    author="Mateo Fernández Blasco",
)
doc.build(story, onFirstPage=pie, onLaterPages=pie)
print(f"PDF generado: {SALIDA}")
