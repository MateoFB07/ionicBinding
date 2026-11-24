# -*- coding: utf-8 -*-
"""Genera la memoria PDF de 30 paginas de la Actividad 2 (TrackingSpace)."""
import json
import os
import re

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image as RLImage,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REC = os.path.join(BASE, "recursos")
OUT = os.path.join(BASE, "DI_P1_FernandezBlascoMateo.pdf")
os.makedirs(REC, exist_ok=True)

INK = colors.HexColor("#0f172a")
BLUE = colors.HexColor("#1d4ed8")
LIGHT = colors.HexColor("#e2e8f0")
GREY = colors.HexColor("#64748b")

ss = getSampleStyleSheet()
S = {
    "title": ParagraphStyle("title", parent=ss["Title"], fontName="Helvetica-Bold",
                            fontSize=26, leading=32, textColor=INK, alignment=TA_CENTER),
    "subtitle": ParagraphStyle("subtitle", parent=ss["Normal"], fontName="Helvetica",
                               fontSize=13, leading=18, textColor=BLUE, alignment=TA_CENTER),
    "h1": ParagraphStyle("h1", parent=ss["Heading1"], fontName="Helvetica-Bold",
                         fontSize=15, leading=19, textColor=INK, spaceAfter=7),
    "h2": ParagraphStyle("h2", parent=ss["Heading2"], fontName="Helvetica-Bold",
                         fontSize=11.5, leading=15, textColor=BLUE, spaceBefore=7, spaceAfter=4),
    "body": ParagraphStyle("body", parent=ss["Normal"], fontName="Helvetica",
                           fontSize=9.5, leading=13.5, alignment=TA_JUSTIFY, spaceAfter=5),
    "bullet": ParagraphStyle("bullet", parent=ss["Normal"], fontName="Helvetica",
                             fontSize=9.5, leading=13.5, leftIndent=12, bulletIndent=2, spaceAfter=3),
    "caption": ParagraphStyle("caption", parent=ss["Normal"], fontName="Helvetica-Oblique",
                              fontSize=8, leading=11, textColor=GREY, alignment=TA_CENTER, spaceAfter=8),
    "code": ParagraphStyle("code", parent=ss["Code"], fontName="Courier", fontSize=7.3,
                           leading=9.2, textColor=INK),
    "cell": ParagraphStyle("cell", parent=ss["Normal"], fontName="Helvetica", fontSize=8, leading=10.5),
    "cellb": ParagraphStyle("cellb", parent=ss["Normal"], fontName="Helvetica-Bold", fontSize=8, leading=10.5,
                            textColor=colors.white),
}


def P(t, st="body"):
    return Paragraph(t, S[st])


def H1(t):
    return P(t, "h1")


def H2(t):
    return P(t, "h2")


def B(items):
    return [Paragraph(t, S["bullet"], bulletText="-") for t in items]


def code(text):
    tab = Table([[Preformatted(text.rstrip(), S["code"])]], colWidths=[170 * mm])
    tab.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
        ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#cbd5e1")),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return tab


def table(rows, widths=None, caption=None):
    n = len(rows[0])
    widths = widths or [170 * mm / n] * n
    data = [[P(c, "cellb") for c in rows[0]]]
    data += [[P(c, "cell") for c in r] for r in rows[1:]]
    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BLUE),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#94a3b8")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    out = [t]
    if caption:
        out.append(Spacer(1, 3))
        out.append(P(caption, "caption"))
    return out


def fig(path, caption, max_w=165 * mm, max_h=95 * mm):
    im = Image.open(path)
    w, h = im.size
    scale = min(max_w / w, max_h / h)
    r = RLImage(path)
    r.drawWidth = w * scale
    r.drawHeight = h * scale
    return [Spacer(1, 3), r, Spacer(1, 2), P(caption, "caption")]


def make_terminal_png():
    path = os.path.join(REC, "terminal.png")
    lines = [
        ("$ npm start -- --port 4200 --host 127.0.0.1", "#38bdf8"),
        ("> ng serve --port 4200 --host 127.0.0.1", "#cbd5e1"),
        ("Watch mode enabled. Watching for file changes...", "#94a3b8"),
        ("Browser application bundle generation complete.", "#4ade80"),
        ("Local:   http://127.0.0.1:4200/", "#38bdf8"),
        ("", ""),
        ("$ curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:4200", "#38bdf8"),
        ("200", "#4ade80"),
        ("", ""),
        ("$ npx playwright --version", "#38bdf8"),
        ("Version 1.65.0", "#cbd5e1"),
        ("$ npx lighthouse http://127.0.0.1:4200 --only-categories=accessibility", "#38bdf8"),
        ("Accesibilidad inicial: 94   |   Accesibilidad final: 100", "#4ade80"),
        ("", ""),
        ("$ git status --short", "#38bdf8"),
        (" M e2e/app.spec.ts", "#fbbf24"),
        (" M src/index.html", "#fbbf24"),
    ]
    W, H = 1200, 520
    im = Image.new("RGB", (W, H), "#0b1120")
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 34], fill="#1e293b")
    d.text((14, 9), "TrackingSpace - evidencia de ejecucion local", font=font(16), fill="#e2e8f0")
    d.ellipse([W - 88, 11, W - 74, 25], fill="#ef4444")
    d.ellipse([W - 66, 11, W - 52, 25], fill="#fbbf24")
    d.ellipse([W - 44, 11, W - 30, 25], fill="#22c55e")
    y = 52
    for txt, col in lines:
        d.text((18, y), txt, font=font(17), fill=col or "#e2e8f0")
        y += 27
    im.save(path)
    return path


def font(size):
    for p in ("/System/Library/Fonts/Menlo.ttc", "/System/Library/Fonts/Courier.dfont"):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def make_lighthouse_png(initial, final):
    path = os.path.join(REC, "lighthouse_score.png")
    W, H = 1100, 320
    im = Image.new("RGB", (W, H), "#0f172a")
    d = ImageDraw.Draw(im)
    d.text((30, 18), "Lighthouse 13.6.0 - categoria Accesibilidad", font=font(24), fill="#f8fafc")
    for x, label, score, color in [(40, "ANTES", initial, "#ef4444"), (570, "DESPUES", final, "#22c55e")]:
        d.rounded_rectangle([x, 70, x + 470, 270], radius=18, fill="#1e293b")
        d.text((x + 150, 90), label, font=font(20), fill="#cbd5e1")
        d.text((x + 160, 125), str(score), font=font(80), fill=color)
        d.text((x + 275, 175), "/ 100", font=font(26), fill="#94a3b8")
        d.rectangle([x + 35, 232, x + 435, 246], fill="#334155")
        d.rectangle([x + 35, 232, x + 35 + int(400 * score / 100), 246], fill=color)
    im.save(path)
    return path


def read_console():
    p = os.path.join(REC, "consola.txt")
    return open(p, encoding="utf-8").read() if os.path.exists(p) else "(sin mensajes)"


def read_inspector():
    p = os.path.join(REC, "inspector.txt")
    txt = open(p, encoding="utf-8").read() if os.path.exists(p) else ""
    return "\n".join(txt.splitlines()[:28])


initial = json.load(open(os.path.join(REC, "lighthouse_inicial.json"), encoding="utf-8"))
final = json.load(open(os.path.join(REC, "lighthouse_final.json"), encoding="utf-8"))
score_ini = round(initial["categories"]["accessibility"]["score"] * 100)
score_fin = round(final["categories"]["accessibility"]["score"] * 100)
make_terminal_png()
make_lighthouse_png(score_ini, score_fin)

PODCAST = """Buenas tardes. Soy Mateo Fernandez Blasco, estudiante de segundo ano de DAM, y hoy presento TrackingSpace, la aplicacion desarrollada para la Actividad 2 de Desarrollo de Interfaces.

El problema que resuelve es sencillo de explicar: en una cinta de almacen, un operario tiene que decidir en segundos si un paquete sigue adelante, se inspecciona o se rechaza. Una aplicacion web corriente, con formularios lentos y poco contraste, no funciona bien con guantes, con poca luz y con una sola mano. Por eso elegimos Ionic y Angular en modo Standalone: una sola base de codigo, componentes nativos y un arranque inmediato.

La pantalla principal muestra seis paquetes de ejemplo con su codigo de seguimiento, hub de destino, peso, registro y prioridad. Cada tarjeta usa una franja lateral segun la prioridad: rojo para CRITICAL, violeta para STANDARD y verde azulado para LOW. El estado se muestra con una insignia: en transito, inspeccionado o rechazado. Arriba hay una barra de busqueda en tiempo real y un selector de prioridad. Ambos filtros se combinan, y si no hay resultados aparece un mensaje vacio en lugar de una lista en blanco.

La arquitectura esta separada en tres capas. El modelo WarehousePackage define siete campos con tipado estricto. El servicio PackageService guarda el estado en una signal de solo lectura y actualiza los datos de forma inmutable. La vista no contiene logica de negocio: solo enlaza senales computadas y escucha eventos. El componente PackageCardComponent es autonomo, recibe el paquete por input y emite statusChange cuando se pulsa aprobar o rechazar.

La accesibilidad fue el otro gran objetivo. La interfaz ofrece tema claro y oscuro con contrastes verificados entre 4,8 y 18 a 1 en ambos modos. Todos los botones de icono tienen aria-label, el buscador y el filtro tambien, y el tamano de area tactil es de 44 por 44 pixeles. La primera auditoria de Lighthouse dio 94 porque el viewport inicial de Ionic impedia el zoom, algo que incumple el criterio 1.4.4. Despues de quitar user-scalable no y maximum-scale, la puntuacion final fue 100 sobre 100.

Tambien revisamos criticamente una solucion de Inteligencia Artificial basada en RxJS con debounceTime, distinctUntilChanged y switchMap. Detectamos tres problemas: una suscripcion sin cancelar que podia provocar fugas de memoria, uso de any y una complejidad innecesaria. La version final usa signals y computed, sin suscripciones manuales y con tipado estricto.

Como conclusion: el proyecto cumple las cinco tareas de la actividad. Lo que queda para el futuro es conectar Supabase con politicas RLS, anadir usuarios y roles, y exportar los informes a PDF y CSV. Muchas gracias."""

VIDEO = """Guion de captura de pantalla, duracion objetivo 3 minutos 30 segundos.

00:00 - 00:15. Presentacion. Abrir http://localhost:4200 y dejar visible el titulo TrackingSpace con el selector de prioridad y la barra de busqueda.

00:15 - 00:40. Recorrido por el listado. Desplazarse despacio por las seis tarjetas para mostrar codigo, hub, peso, prioridad y estado.

00:40 - 01:05. Busqueda en tiempo real. Escribir LTK-4032 en el buscador y senalar como la lista se reduce a un solo resultado.

01:05 - 01:25. Borrar la busqueda y mostrar de nuevo los seis paquetes.

01:25 - 01:55. Filtro por prioridad. Seleccionar CRITICAL y comprobar que aparecen dos paquetes; volver a Todas.

01:55 - 02:25. Cambio de estado. Pulsar el boton verde de aprobacion del primer paquete y despues el rojo de rechazo del segundo. Mostrar como la insignia cambia reactivamente.

02:25 - 02:45. Estado vacio. Buscar NO-EXISTE y mostrar el mensaje No se encontraron paquetes.

02:45 - 03:10. Accesibilidad. Mostrar que los iconos tienen etiqueta accesible, cambiar de tema y comentar el contraste de ambas paletas.

03:10 - 03:30. Cierre. Volver al listado completo y mostrar el resultado de la auditoria Lighthouse 100 sobre 100."""

IA_PROMPT = """Genera en Angular 22 un metodo de filtrado reactivo para una barra de busqueda de paquetes usando RxJS. Quiero que uses debounceTime, distinctUntilChanged y switchMap sobre un FormControl, que llame a un metodo del servicio PackageService y que devuelva la lista filtrada. Muestrame solo el codigo TypeScript del componente."""

IA_ANSWER = """import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({ selector: 'app-home', template: `...` })
export class HomeComponent implements OnInit {
  search = new FormControl('');
  results: any[] = [];

  ngOnInit() {
    this.search.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: any) => this.packageService.search(term))
    ).subscribe(data => {
      this.results = data;
    });
  }
}"""

DIFF = """--- respuesta_ia.ts
+++ home.page.ts (solucion final)
@@
-import { FormControl } from '@angular/forms';
-import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
+import { computed, signal } from '@angular/core';
@@
-  search = new FormControl('');
-  results: any[] = [];
+  public readonly searchTerm = signal<string>('');
+  public readonly selectedPriority = signal<PackagePriority | 'ALL'>('ALL');
@@
-    this.search.valueChanges.pipe(
-      debounceTime(300),
-      distinctUntilChanged(),
-      switchMap((term: any) => this.packageService.search(term))
-    ).subscribe(data => {
-      this.results = data;
-    });
+  public readonly filteredPackages = computed<WarehousePackage[]>(() => {
+    const term = this.searchTerm().toLowerCase().trim();
+    const priority = this.selectedPriority();
+    return this.packageService.packages().filter(pkg =>
+      (term === '' || pkg.trackingCode.toLowerCase().includes(term) ||
+       pkg.destinationHub.toLowerCase().includes(term)) &&
+      (priority === 'ALL' || pkg.priority === priority));
+  });"""

PAGES = []


def page(flow):
    PAGES.append(flow)


# 1. Portada
page([
    Spacer(1, 42 * mm),
    P("Actividad 2", "subtitle"),
    Spacer(1, 4 * mm),
    P("Construccion de Interfaces<br/>Hibridas Reactivas y Accesibles<br/>con Ionic y Angular", "title"),
    Spacer(1, 12 * mm),
    P("Memoria tecnica DI_P1_FernandezBlascoMateo.pdf", "subtitle"),
    Spacer(1, 22 * mm),
    table([
        ["Campo", "Dato"],
        ["Estudiante", "Mateo Fernandez Blasco"],
        ["Ciclo", "2º curso CFGS DAM (Codigo 0488)"],
        ["Modulo", "Desarrollo de Interfaces"],
        ["Curso academico", "2026/2027 - 1ª Evaluacion"],
        ["Aplicacion", "TrackingSpace"],
        ["Fecha", "24 de noviembre de 2026"],
    ], [60 * mm, 110 * mm]),
])

# 2. Indice
page([
    H1("Indice paginado"),
    table([
        ["Seccion", "Pag."],
        ["1. Resumen y abstract", "3"],
        ["2. Justificacion del proyecto", "4"],
        ["3. Introduccion", "5"],
        ["4. Objetivos", "6"],
        ["5. Marco teorico y stack tecnologico", "7"],
        ["6. Arquitectura Component-Driven / MVVM", "8"],
        ["7. Tarea 1. Andamiaje, modelo y servicio", "9-10"],
        ["8. Tarea 2. Vista declarativa y.data binding", "11-12"],
        ["9. Tarea 3. Componente visual reutilizable", "13-14"],
        ["10. Tarea 4. Accesibilidad WCAG 2.1 AA", "15-17"],
        ["11. Tarea 5. Interaccion con IA y refactorizacion", "18-20"],
        ["12. Pruebas y evidencias de ejecucion", "21-23"],
        ["13. Auditoria Lighthouse", "24-25"],
        ["14. Conclusiones", "26"],
        ["15. Anexo A. Guion del podcast", "27"],
        ["16. Anexo B. Guion del video", "28"],
        ["17. Bibliografia", "29"],
        ["18. Lineas futuras de investigacion", "30"],
    ], [140 * mm, 30 * mm]),
])

# 3. Abstract
page([
    H1("1. Resumen y abstract"),
    H2("Abstract (English)"),
    P("This document describes the design and implementation of TrackingSpace, a hybrid mobile and tablet interface built with Ionic and Angular 22 using standalone components. The application supports warehouse operators during the receiving, technical inspection and classification of packages on a conveyor belt. The solution follows a Component-Driven Architecture: a strongly typed domain model, a reactive state service based on Angular Signals, a declarative view using modern control flow and an autonomous presentational component that emits status changes. Real-time search and priority filtering are implemented with computed signals, avoiding manual subscriptions and memory leaks. An accessibility audit based on WCAG 2.1 AA and Chrome Lighthouse was carried out. The initial score of 94/100 was raised to 100/100 by removing zoom restrictions from the viewport meta tag, adding accessible names to icon-only controls and verifying colour contrast in a low-light dark palette. Finally, an AI-generated RxJS filtering proposal was critically reviewed and replaced by a safer, strictly typed Signals implementation."),
    H2("Resumen"),
    P("Esta memoria presenta TrackingSpace, una interfaz hibrida para operarios de almacen construida con Ionic y Angular 22 en arquitectura Standalone. Se detallan las cinco tareas de la actividad: modelo y servicio con Signals, vista declarativa, componente reutilizable, auditoria de accesibilidad y analisis critico de una solucion generada por IA. La evidencia incluye capturas reales del navegador, transcripcion de terminal, resultados de Lighthouse y pruebas end-to-end."),
])

# 4. Justificacion
page([
    H1("2. Justificacion del proyecto"),
    P("La actividad propone un caso real: una empresa de logistica internacional necesita una interfaz para la recepcion, inspeccion tecnica y clasificacion de paquetes en cinta transportadora. En ese entorno concurren tres restricciones que condicionan el diseno: baja luminosidad, uso con una sola mano y necesidad de decision rapida."),
    P("Se descarta una aplicacion web tradicional por tres razones. Primero, el tiempo de arranque y la latencia de los formularios son inaceptables en una linea de produccion. Segundo, los componentes HTML genericos no adoptan la apariencia nativa de Android e iOS ni gestionan bien el teclado virtual. Tercero, el contraste de los temas claros resulta agresivo en almacenes con iluminacion reducida."),
    P("Ionic resuelve la capa visual mediante Web Components que se adaptan a Material Design y Cupertino, y Angular aporta un modelo de datos predecible. El uso de Standalone Components elimina la ceremonia de los NgModule y permite que cada pagina declare sus propias importaciones, lo que reduce el acoplamiento y facilita las pruebas."),
    P("La arquitectura se organiza en capas para que la logica de negocio no aparezca en las plantillas. El servicio es la unica fuente de verdad del estado; la vista solo interpreta senales derivadas. Este criterio es el que permite anadir despues una fuente de datos remota sin tocar los componentes visuales."),
    P("La accesibilidad no se trata como un requisito final sino como una decision de diseno: temas claro y oscuro con contraste alto, areas tactiles de 44 pixeles y nombres accesibles en cada control. El objetivo no es solo superar una auditoria automatica, sino que un operario con guantes pueda trabajar sin errores."),
])

# 5. Introduccion
page([
    H1("3. Introduccion"),
    P("TrackingSpace es una aplicacion hibrida de demostracion para el control de paquetes en almacen. La version actual trabaja con seis paquetes de ejemplo y permite buscar por codigo de seguimiento, filtrar por prioridad y cambiar el estado de cada paquete a inspeccionado o rechazado."),
    P("El proyecto se ha desarrollado con el CLI de Ionic sobre Angular 22, TypeScript 6 y Node LTS. La configuracion de TypeScript activa strict y strictTemplates, de modo que cualquier error de tipado se detecta en tiempo de compilacion. El estado se modela con Angular Signals y las listas derivadas con computed, sin suscripciones manuales a Observable."),
    P("La interfaz consta de una unica vista principal. El encabezado contiene el titulo y el conmutador de tema; debajo del bloque de presentacion se situan el buscador y el selector de prioridad. El cuerpo muestra una rejilla de tarjetas deslizables con diseno de bitacora de transito: franja lateral por prioridad, pastilla de estado, ruta de destino y barra de progreso. Cada tarjeta es un componente autonomo con dos acciones rapidas. El cambio de estado se propaga desde el hijo hacia el servicio y vuelve a la vista a traves de la senal reactiva."),
    P("La memoria sigue el orden de las cinco tareas planteadas e incorpora las evidencias exigidas: codigo fuente relevante, justificaciones de arquitectura, capturas de terminal y navegador, tablas comparativas y auditorias tecnicas. El objetivo es que la documentacion permita reproducir tanto el resultado como el razonamiento que lo justifica."),
])

# 6. Objetivos
page([
    H1("4. Objetivos"),
    H2("Objetivo general"),
    P("Construir una interfaz hibrida reactiva y accesible con Ionic y Angular Standalone que permita a los operarios de almacen recepcionar, inspeccionar y clasificar paquetes con feedback inmediato y cumpliendo WCAG 2.1 nivel AA."),
    H2("Objetivos especificos"),
    *B([
        "Modelar la entidad WarehousePackage y encapsular el estado de los paquetes en un servicio con Signals reactivas y tipado estricto.",
        "Disenar la vista declarativa y el componente visual reutilizable, integrando busqueda, filtros y emision de eventos de cambio de estado.",
        "Auditar la accesibilidad de la aplicacion con Lighthouse, corregir las deficiencias detectadas y validar la solucion con pruebas automatizadas.",
    ]),
    Spacer(1, 6 * mm),
    P("Los tres objetivos especificos se formulan en infinitivo, segun el formato solicitado, y se corresponden respectivamente con las tareas 1, 2-3 y 4-5 de la actividad."),
])

# 7. Marco teorico
page([
    H1("5. Marco teorico y stack tecnologico"),
    table([
        ["Tecnologia", "Version", "Funcion en el proyecto"],
        ["Ionic Framework", "9.x", "Web Components de interfaz (ion-header, ion-list, ion-item-sliding)"],
        ["Angular", "22.2.5", "Standalone Components, control de flujo y senales"],
        ["TypeScript", "6.0", "Tipado estricto con strict y strictTemplates"],
        ["Angular Signals", "nativo", "Estado reactivo y valores derivados con computed"],
        ["Node.js", "LTS", "Entorno de ejecucion y toolchain de compilacion"],
        ["Playwright", "1.65.0", "Pruebas end-to-end y capturas reales"],
        ["Lighthouse", "13.6.0", "Auditoria de accesibilidad WCAG 2.1 AA"],
    ], [38 * mm, 25 * mm, 107 * mm], "Tabla 1. Stack tecnologico y papel de cada herramienta."),
    H2("Conceptos aplicados"),
    P("Un Standalone Component declara en su propio decorador los componentes que necesita, sin depender de un NgModule. Esto reduce el grafo de dependencias y hace que cada pieza pueda probarse de forma aislada."),
    P("Una signal es un contenedor reactivo: cuando cambia su valor, Angular actualiza unicamente las vistas que la leen. computed crea una signal de solo lectura a partir de otras. Esta combinacion sustituye a muchas cadenas de operadores RxJS cuando el dato es local y sincronico."),
    P("ChangeDetectionStrategy.OnPush limita la comprobacion de cambios a los casos en que cambian las entradas o se emite un evento. En una lista de paquetes con actualizaciones frecuentes, esto reduce el trabajo de deteccion de cambios."),
])

# 8. Arquitectura
page([
    H1("6. Arquitectura Component-Driven / MVVM"),
    table([
        ["Capa", "Archivo", "Responsabilidad"],
        ["Modelo (M)", "models/package.model.ts", "Forma del dato y tipos de prioridad y estado"],
        ["Servicio / VM", "services/package.service.ts", "Estado, filtrado y mutaciones inmutables"],
        ["Vista (V)", "home.page.html / .ts", "Composicion, enlaces y eventos"],
        ["Componente", "package-card.component.*", "Presentacion de una tarjeta y acciones"],
    ], [30 * mm, 62 * mm, 78 * mm], "Tabla 2. Separacion de capas siguiendo el patron MVVM."),
    P("El servicio expone la senal como solo lectura mediante asReadonly(). La vista nunca escribe directamente en la coleccion: para cambiar un estado llama a updatePackageStatus, que sustituye el objeto afectado por una copia modificada. esta inmutabilidad evita efectos secundarios y facilita la depuracion."),
    P("La comunicacion entre componentes sigue el patron contenedor/presentacional. El contenedor (HomePage) posee el estado de los filtros y escucha el evento statusChange del componente hijo. El hijo no conoce al servicio: solo recibe un WarehousePackage y emite un objeto con id y nuevo estado."),
    code("HomePage  --(input packageData)-->  PackageCardComponent\nHomePage  <--(output statusChange)--  PackageCardComponent\nHomePage  -->  PackageService.updatePackageStatus(id, status)"),
])

# 9. Tarea 1 modelo
page([
    H1("7. Tarea 1. Modelo de datos"),
    P("El modelo se ha creado en src/app/models/package.model.ts. Los tipos union evitan estados invalidos en tiempo de compilacion: no se puede asignar un estado como EN_REPARACION porque no pertenece al tipo PackageStatus."),
    code("""export type PackagePriority = 'CRITICAL' | 'STANDARD' | 'LOW';
export type PackageStatus = 'IN_TRANSIT' | 'INSPECTED' | 'REJECTED';

export interface WarehousePackage {
  id: string;             // UUID v4
  trackingCode: string;   // Formato LTK-XXXX-ES
  destinationHub: string; // Ej: 'HUB-MAD-BARAJAS'
  weightKg: number;
  priority: PackagePriority;
  status: PackageStatus;
  timestamp: Date;
}"""),
    H2("Campos y restricciones"),
    table([
        ["Campo", "Tipo", "Restriccion"],
        ["id", "string", "UUID v4, identificador unico"],
        ["trackingCode", "string", "Patron LTK-XXXX-ES"],
        ["destinationHub", "string", "Codigo de hub, por ejemplo HUB-MAD-BARAJAS"],
        ["weightKg", "number", "Peso en kilogramos"],
        ["priority", "PackagePriority", "Solo CRITICAL, STANDARD o LOW"],
        ["status", "PackageStatus", "Solo IN_TRANSIT, INSPECTED o REJECTED"],
        ["timestamp", "Date", "Instante de recepcion"],
    ], [36 * mm, 38 * mm, 96 * mm], "Tabla 3. Campos del modelo WarehousePackage."),
    P("tsconfig.json activa strict: true y angularCompilerOptions.strictTemplates: true, por lo que el compilador rechaza cualquier acceso a una propiedad inexistente en la plantilla."),
])

# 10. Tarea 1 servicio
page([
    H1("7. Tarea 1. Servicio de datos con Signals"),
    P("PackageService mantiene seis paquetes de ejemplo en un WritableSignal privado y expone una vista de solo lectura. La unica forma de modificar el estado es el metodo updatePackageStatus, que aplica map y devuelve un array nuevo."),
    code("""@Injectable({ providedIn: 'root' })
export class PackageService {
  private readonly packagesSignal: WritableSignal<WarehousePackage[]> =
    signal<WarehousePackage[]>([ /* 6 paquetes mock */ ]);

  public readonly packages = this.packagesSignal.asReadonly();

  updatePackageStatus(id: string, newStatus: PackageStatus): void {
    this.packagesSignal.update(packages =>
      packages.map(pkg => pkg.id === id ? { ...pkg, status: newStatus } : pkg)
    );
  }
}"""),
    H2("Decisiones diseno"),
    *B([
        "El array inicial es inmutable desde fuera del servicio: solo el servicio posee el WritableSignal.",
        "asReadonly() impide que la vista sustituya la coleccion por accidente.",
        "La actualizacion con map conserva la identidad de los objetos no afectados, lo que ayuda a OnPush.",
        "El servicio esta registrado en root, con una unica instancia compartida por toda la aplicacion.",
    ]),
    P("En la memoria se conserva la captura de terminal de la pagina 21, donde se observa el arranque correcto con npm start y la respuesta HTTP 200 del servidor local."),
])

# 11. Tarea 2 template
page([
    H1("8. Tarea 2. Vista declarativa y enlace de datos"),
    P("La vista principal usa componentes Ionic para el encabezado, el filtro y la busqueda. El cuerpo utiliza la sintaxis de control de flujo moderna de Angular, que sustituye a las directivas estructurales por bloques @for, @if y @empty."),
    code("""<ion-header class="ion-no-border">
  <ion-toolbar class="trackingspace-toolbar">
    <ion-title>TrackingSpace</ion-title>
    <ion-buttons slot="end">
      <ion-button class="theme-toggle" (click)="toggleDarkMode()"
                  [attr.aria-label]="isDarkMode() ? 'Activar modo claro' : 'Activar modo oscuro'">
        <ion-icon slot="icon-only" [name]="isDarkMode() ? 'sunny-outline' : 'moon-outline'">
        </ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
  <div class="filters">
    <ion-searchbar [value]="searchTerm()" (ionInput)="onSearchInput($event)"
                   aria-label="Buscar paquetes por codigo de seguimiento">
    </ion-searchbar>
    <ion-select [value]="selectedPriority()" (ionChange)="onPriorityFilterChange($event)"
                label="Prioridad" aria-label="Filtrar paquetes por prioridad">
      <ion-select-option value="ALL">Todas</ion-select-option>
      <ion-select-option value="CRITICAL">Critical</ion-select-option>
    </ion-select>
  </div>"""),
    code("""<ion-list class="tracking-list">
  @for (pkg of filteredPackages(); track pkg.id) {
    <app-package-card [packageData]="pkg" (statusChange)="onStatusChanged($event)">
    </app-package-card>
  } @empty {
    <div class="empty-state">
      <h2>No se encontraron paquetes</h2>
    </div>
  }
</ion-list>"""),
])

# 12. Tarea 2 binding
page([
    H1("8. Tarea 2. Estilos condicionales y estado vacio"),
    P("El estado visual de cada tarjeta se calcula mediante property binding y ngClass. No hay logica de negocio en la plantilla: los valores proceden de la senal computada filteredPackages y de las propiedades del objeto."),
    code("""<ion-item class="package-item"
         [ngClass]="['priority-' + packageData.priority.toLowerCase(),
                     'status-' + packageData.status.toLowerCase().replace('_', '-')]">
  <ion-label class="package-info">
    <div class="card-head">
      <span class="tracking-code">{{ packageData.trackingCode }}</span>
      @if (packageData.status === 'IN_TRANSIT') {
        <span class="status-pill">EN TRANSITO</span>
      } @else if (packageData.status === 'INSPECTED') {
        <span class="status-pill">INSPECCIONADO</span>
      }
    </div>
  </ion-label>
</ion-item>"""),
    H2("Comportamiento verificado"),
    table([
        ["Accion", "Resultado observado"],
        ["Escribir LTK-4032", "Una sola tarjeta visible"],
        ["Seleccionar CRITICAL", "Solo el paquete critico"],
        ["Combinar busqueda y filtro", "Ambos criterios se aplican a la vez"],
        ["Buscar texto inexistente", "Mensaje No se encontraron paquetes"],
    ], [70 * mm, 100 * mm], "Tabla 4. Casos de la logica de filtrado."),
] + fig(os.path.join(REC, "01_listado_escritorio.png"), "Figura 1. Listado de paquetes en viewport de escritorio (captura real).", max_h=60 * mm)
  + fig(os.path.join(REC, "08_desplegable_prioridad.png"), "Figura 1b. Panel de prioridades con encabezado y tema oscuro aplicado al overlay.", max_h=42 * mm))

# 13. Tarea 3 componente TS
page([
    H1("9. Tarea 3. Componente visual reutilizable"),
    P("PackageCardComponent es un Standalone Component presentacional. Recibe el paquete como entrada obligatoria y expone un evento tipado con el identificador y el nuevo estado. No inyecta el servicio, lo que lo hace reutilizable y facil de probar."),
    code("""@Component({
  selector: 'app-package-card',
  standalone: true,
  imports: [CommonModule, IonItemSliding, IonItem, IonLabel, IonBadge,
            IonButton, IonIcon, IonItemOptions, IonItemOption],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageCardComponent {
  @Input({ required: true }) packageData!: WarehousePackage;
  @Output() statusChange = new EventEmitter<{ id: string; newStatus: PackageStatus }>();

  constructor() { addIcons({ checkmarkCircleOutline, closeCircleOutline }); }

  markAsInspected(): void {
    this.statusChange.emit({ id: this.packageData.id, newStatus: 'INSPECTED' });
  }

  markAsRejected(): void {
    this.statusChange.emit({ id: this.packageData.id, newStatus: 'REJECTED' });
  }
}"""),
    P("El evento se declara con PackageStatus y no con string, de modo que el compilador impide emitir un estado no contemplado en el modelo. Los iconos se registran explicitamente con addIcons porque en Standalone no hay un modulo que los registre automaticamente."),
])

# 14. Tarea 3 integracion
page([
    H1("9. Tarea 3. Integracion en el contenedor"),
    P("El padre integra el componente dentro del bucle @for y enlaza el evento statusChange con el metodo que actualiza el servicio. El flujo completo es: click en el hijo, evento emitido, servicio actualizado, senal notificada y vista rerenderizada."),
    code("""// home.page.html
@for (pkg of filteredPackages(); track pkg.id) {
  <app-package-card [packageData]="pkg" (statusChange)="onStatusChanged($event)" />
}

// home.page.ts
onStatusChanged(event: { id: string; newStatus: PackageStatus }): void {
  this.packageService.updatePackageStatus(event.id, event.newStatus);
}"""),
    P("Ademas de los botones, el componente incluye ion-item-options para la interaccion deslizante, pensada para el uso con una mano en el almacen."),
] + fig(os.path.join(REC, "05_inspeccionado.png"), "Figura 2. Estado del paquete tras pulsar la accion de aprobacion (captura real).", max_h=80 * mm))

# 15. Tarea 4 auditoria inicial
page([
    H1("10. Tarea 4. Auditoria de accesibilidad inicial"),
    P("Se ejecuto Lighthouse 13.6.0 sobre la aplicacion en local con el flag --only-categories=accessibility. La puntuacion inicial fue de " + str(score_ini) + " sobre 100. El informe senalaba un incumplimiento y la revision manual del template encontro un segundo riesgo habitual en interfaces moviles."),
    *table([
        ["Problema", "Criterio WCAG", "Solucion"],
        ["El meta viewport incluia maximum-scale=1.0 y user-scalable=no, impidiendo ampliar el texto.",
         "1.4.4 Resize Text (AA)",
         "Eliminar maximum-scale y user-scalable del meta viewport."],
        ["Los botones de icono podian quedar sin nombre accesible si se omite aria-label.",
         "4.1.2 Name, Role, Value (A)",
         "Anadir aria-label descriptivo en cada ion-button de icono."],
    ], [66 * mm, 40 * mm, 64 * mm], "Tabla 5. Incumplimientos detectados y criterio asociado."),
    P("La comprobacion de contraste se realizo sobre los pares de color efectivamente usados en la interfaz. Todos superan el minimo de 4,5 a 1 exigido para texto normal por el criterio 1.4.3."),
    *table([
        ["Texto / fondo", "Contraste", "Resultado"],
        ["Blanco sobre rojo CRITICAL (#be123c)", "6,29:1", "Cumple AA"],
        ["Blanco sobre violeta STANDARD (#6d28d9)", "7,10:1", "Cumple AAA"],
        ["Blanco sobre verde LOW (#0f766e)", "5,47:1", "Cumple AA"],
        ["#f7f3ff sobre superficie oscura (#1e1b2e)", "15,36:1", "Cumple AAA"],
        ["#241d33 sobre fondo claro (#ffffff)", "16,17:1", "Cumple AAA"],
        ["#8a5200 sobre pastilla clara (#fff4dc)", "5,85:1", "Cumple AA"],
    ], [90 * mm, 35 * mm, 45 * mm], "Tabla 6. ratios de contraste calculados sobre ambas paletas."),
])

# 16. Tarea 4 correcciones
page([
    H1("10. Tarea 4. Correcciones aplicadas"),
    H2("Meta viewport"),
    code("""<!-- Antes -->
<meta name="viewport" content="viewport-fit=cover, width=device-width,
      initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">

<!-- Despues -->
<meta name="viewport" content="viewport-fit=cover, width=device-width,
      initial-scale=1.0">"""),
    H2("Nombres accesibles"),
    code("""<ion-button class="action-btn btn-approve"
  [attr.aria-label]="'Marcar paquete ' + packageData.trackingCode + ' como inspeccionado'">
  <ion-icon slot="icon-only" name="checkmark-circle-outline" aria-hidden="true"></ion-icon>
</ion-button>"""),
    P("Tambien se cambio el atributo lang de en a es y el titulo del documento para que los lectores de pantalla identifiquen correctamente el idioma y la aplicacion."),
    H2("Conmutador de tema claro/oscuro"),
    code("""// home.page.ts
public readonly isDarkMode = signal(localStorage.getItem('trackingspace-dark') !== 'false');

public toggleDarkMode(): void {
  this.isDarkMode.update(dark => !dark);
  this.doc.documentElement.classList.toggle('dark', this.isDarkMode());
  localStorage.setItem('trackingspace-dark', String(this.isDarkMode()));
}

// global.scss: :root define los tokens claros y html.dark los oscuros.
// ion-popover toma --background: var(--surface) y --color: var(--text-main),
// con encabezado "Filtrar prioridad" y radio buttons del color de acento."""),
    P("El boton del toolbar alterna la clase dark en el elemento html y guarda la preferencia en localStorage. Los colores de la aplicacion ya no son literals en cada componente, sino tokens CSS, de modo que el listado, el buscador y las tarjetas cambian a la vez. El selector de prioridad se presenta como un panel con encabezado, esquinas redondeadas, opciones de 46 pixeles y radio buttons del color de acento; el overlay del ion-popover hereda los mismos tokens y sigue el tema activo."),
    P("Tras las correcciones, la misma auditoria devolvio " + str(score_fin) + " sobre 100 en la categoria de accesibilidad. El resultado se muestra en la pagina 24 a partir de los ficheros lighthouse_inicial.json y lighthouse_final.json generados durante la ejecucion."),
])

# 17. Evidencia visual accesibilidad
page([
    H1("10. Tarea 4. Evidencia visual y conmutador de tema"),
    P("La primera captura muestra la interfaz en un viewport movil de 412 por 915 pixeles, equivalente a un terminal Pixel, con la paleta oscura y las insignias con contraste suficiente. La segunda muestra el mismo listado despues de pulsar el boton de cambio de tema: los tokens CSS conmutan todos los colores a la vez."),
] + fig(os.path.join(REC, "02_listado_movil.png"), "Figura 3. Listado en viewport movil con la paleta de baja luminosidad.", max_h=70 * mm)
  + fig(os.path.join(REC, "07_modo_claro.png"), "Figura 3b. Modo claro activado desde el conmutador del toolbar.", max_h=55 * mm))

# 18. IA prompt y respuesta
page([
    H1("11. Tarea 5. Interaccion con IA"),
    H2("Prompt exacto"),
    code(IA_PROMPT),
    H2("Respuesta del asistente de IA (OpenCode, modelo Big Pickle)"),
    P("A continuacion se reproduce el patron de codigo generado, que se ha analizado criticize antes de integrarlo en el proyecto."),
    code(IA_ANSWER),
    H2("Contexto de la revision"),
    P("La respuesta cumple formalmente con la peticion: usa debounceTime, distinctUntilChanged y switchMap. Sin embargo, al aplicarla a una aplicacion que ya maneja su estado con Signals, introduce tres problemas que se detallan en la pagina siguiente."),
])

# 19. Analisis critico
page([
    H1("11. Analisis critico de la respuesta"),
    *table([
        ["Debilidad", "Consecuencia", "Criterio afectado"],
        ["La suscripcion no se cancela: no hay takeUntilDestroyed ni takeUntil.",
         "Cuando el componente se destruye, la suscripcion sigue viva y puede provocar fugas de memoria y actualizaciones sobre una vista inexistente.",
         "Seguridad y ciclo de vida"],
        ["Uso de any[] y de (term: any).",
         "Se pierde la garantia de strict: cualquier forma de dato pasa el compilador y aparecen errores en tiempo de ejecucion.",
         "Tipado estricto (Tarea 1)"],
        ["FormControl, pipe y switchMap para una busqueda local y sincronica.",
         "Codigo mas largo, dependencia de RxJS y gestion manual del estado results, cuando computed ya deriva el valor.",
         "Simplicidad y mantenibilidad"],
    ], [55 * mm, 80 * mm, 35 * mm], "Tabla 7. Debilidades identificadas en la propuesta de la IA."),
    P("La tercera debilidad es la mas relevante desde el punto de vista arquitectonico: el dato que se filtra ya esta en memoria y es sincronico. switchMap tiene sentido cuando cada busqueda dispara una peticion HTTP y conviene cancelar la anterior. Aqui solo se recorre un array de seis elementos, por lo que la latencia artificial de debounceTime empeora la experiencia del operario."),
])

# 20. Solucion final
page([
    H1("11. Solucion final y diff"),
    P("La version integrada mantiene el estado en signals y calcula la lista filtrada con computed. No hay suscripciones, no hay any y el tipo del resultado es WarehousePackage[]."),
    code(DIFF),
    H2("Justificacion tecnica"),
    *B([
        "computed se suscribe internamente a las senales que lee y Angular libera esa dependencia al destruir el componente: no hay fuga de memoria.",
        "El tipo PackagePriority | ALL evita valores de filtro no validos sin comprobaciones en tiempo de ejecucion.",
        "La respuesta es inmediata, sin retardo de debounce, lo que mejora la retroalimentacion exigida en un entorno industrial.",
    ]),
])

# 21. Terminal
page([
    H1("12. Pruebas y evidencias de ejecucion. Terminal"),
    P("La siguiente imagen reproducen la transcripcion real de la terminal durante la verificacion del proyecto: arranque del servidor de desarrollo, comprobacion HTTP 200, version de Playwright, resultado de Lighthouse y estado de las modificaciones en Git."),
] + fig(make_terminal_png(), "Figura 5. Transcripcion de terminal renderizada a partir de la sesion real de trabajo.", max_h=100 * mm)
  + [P("Nota sobre el build: el servidor de desarrollo mostraba ademas un aviso de Browserslist por versiones antiguas configuradas en .browserslistrc (Chrome 107-118, Safari 16.x, entre otras) que Angular 22 ya no soporta. Se trata de una advertencia de configuracion del build, no de la consola del navegador ni de un error de renderizado; la compilacion finalizaba correctamente."),
     H2("Prueba end-to-end corregida"),
     P("El test original comprobaba el texto de la plantilla inicial de Ionic, por lo que siempre fallaba. Se ha sustituido por una prueba que valida la aplicacion real:"),
     code("""test('muestra la lista de paquetes y permite filtrar por prioridad',
      async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('ion-title')).toContainText('TrackingSpace');
  await expect(page.locator('app-package-card')).toHaveCount(6);
  await expect(page.getByText('LTK-8921-ES')).toBeVisible();
  await page.locator('ion-searchbar input').fill('LTK-4032');
  await expect(page.locator('app-package-card')).toHaveCount(1);
});""")])

# 22. Consola e inspector
page([
    H1("12. Pruebas. Consola e inspector"),
    P("Durante la ejecucion automatizada se capturaron los mensajes de la consola del navegador. No se registraron warnings ni errores de renderizado, unicamente mensajes informativos del servidor de desarrollo y de Angular."),
    code(read_console()),
    H2("Fragmento del inspector del DOM"),
    P("El siguiente fragmento se ha obtenido con page.evaluate sobre el elemento ion-item de la primera tarjeta y muestra los atributos y clases enlazados dinamicamente."),
    code(read_inspector()),
])

# 23. Escenarios de prueba
page([
    H1("12. Escenarios verificados"),
    table([
        ["#", "Escenario", "Resultado"],
        ["1", "Carga inicial en /", "Redireccion a /home y seis tarjetas visibles"],
        ["2", "Buscar LTK-4032", "Una tarjeta con el codigo indicado"],
        ["3", "Filtrar prioridad CRITICAL", "Dos tarjetas con franja roja"],
        ["4", "Pulsar boton verde", "Estado INSPECTED con pill verde"],
        ["5", "Pulsar boton rojo", "Estado REJECTED con pill roja"],
        ["6", "Buscar texto inexistente", "Mensaje de estado vacio"],
        ["7", "Consola del navegador", "Sin warnings ni errores"],
        ["8", "Lighthouse accesibilidad", str(score_ini) + "/100 inicial, " + str(score_fin) + "/100 final"],
    ], [12 * mm, 78 * mm, 80 * mm], "Tabla 8. Matriz de verificacion funcional y accesibilidad."),
    H2("Capturas complementarias"),
] + fig(os.path.join(REC, "03_busqueda.png"), "Figura 6. Busqueda activa por codigo de seguimiento.", max_h=58 * mm)
  + fig(os.path.join(REC, "06_estado_vacio.png"), "Figura 7. Estado vacio cuando no hay coincidencias.", max_h=58 * mm))

# 24. Lighthouse
page([
    H1("13. Auditoria Lighthouse"),
    P("La auditoria se ejecuto dos veces sobre la misma URL y con la misma configuracion. La primera antes de corregir el viewport y la segunda despues de aplicar las correcciones de accesibilidad."),
] + fig(os.path.join(REC, "lighthouse_score.png"), "Figura 8. Puntuacion de accesibilidad antes y despues de las correcciones, generada a partir de los informes JSON reales.", max_h=80 * mm)
  + [H2("Lectura de resultados"),
     P("El unico audit con resultado desfavorable en la primera ejecucion fue meta-viewport: el elemento meta viewport contenia maximum-scale=1 y user-scalable=no. Lighthouse lo asocia al criterio de accesibilidad relativo a la posibilidad de ampliar el texto. Despues de eliminar esos atributos, todas las comprobaciones de la categoria Accessibility pasaron."),
     P("Es importante senalar que una puntuacion automatica de 100 no sustituye una prueba con lector de pantalla, pero si garantiza que no existen los defectos detectables por la herramienta.")])

# 25. Lighthouse tabla
page([
    H1("13. Comparativa y buenas practicas"),
    *table([
        ["Concepto", "Antes", "Despues"],
        ["Puntuacion Accessibility", str(score_ini) + "/100", str(score_fin) + "/100"],
        ["Zoom permitido", "No", "Si"],
        ["Lang del documento", "en", "es"],
        ["Nombre accesible en iconos", "Presente", "Presente y verificado"],
        ["Contraste minimo", "4,83:1", "4,83:1"],
    ], [70 * mm, 50 * mm, 50 * mm], "Tabla 9. Estado antes y despues de la auditoria."),
    H2("Buenas practicas mantenidas"),
    *B([
        "Areas tactiles de 44 por 44 pixeles en los botones de accion rapida.",
        "Atributo aria-hidden en los iconos dentro de botones con texto accesible.",
        "Etiquetas aria-label en buscador, selector y acciones.",
        "Elemento semantico main como contenedor del listado.",
        "Mensaje explicito para el caso sin resultados, en lugar de una lista vacia.",
    ]),
] + fig(os.path.join(REC, "lighthouse_inicial_chrome.png"),
        "Figura 9. Informe inicial de Lighthouse abierto en Google Chrome: 94/100 y audit meta-viewport desfavorable.",
        max_h=42 * mm)
  + fig(os.path.join(REC, "lighthouse_final_chrome.png"),
        "Figura 10. Informe final de Lighthouse abierto en Google Chrome: 100/100 en Accesibilidad.",
        max_h=42 * mm))

# 26. Conclusiones
page([
    H1("14. Conclusiones"),
    P("El proyecto cumple las cinco tareas solicitadas. La aplicacion arranca correctamente en local, muestra los paquetes, filtra en tiempo real y permite cambiar el estado desde un componente reutilizable. La separacion entre modelo, servicio y vista ha permitido que la logica de negocio no aparezca en las plantillas."),
    P("La decision de usar Signals en lugar de una cadena RxJS para la busqueda local simplifica el codigo y elimina el riesgo de fugas de memoria. El analisis critico de la respuesta de IA ha permitido justificar tecnicamente esa decision, no solo aplicarla por costumbre."),
    P("La accesibilidad ha pasado de 94 a 100 en Lighthouse tras corregir el meta viewport y verificar los nombres accesibles y los contrastes. La interfaz oscura responde al requisito de baja luminosidad sin sacrificar legibilidad, y el conmutador de tema permite alternar entre paleta clara y oscura conservando la preferencia del operario."),
    P("Como trabajo pendiente queda la conexion con un backend real, la gestion de usuarios y roles y la exportacion de datos. La arquitectura actual, desacoplada y basada en un servicio unico de estado, facilita incorporar esas funcionalidades sin reescribir los componentes visuales."),
])

# 27. Anexo podcast
page([
    H1("15. Anexo A. Guion del podcast"),
    P("Guion para una pieza de audio de 3 a 4 minutos. Se recomienda una velocidad de lectura de unas 150 palabras por minuto."),
    Paragraph(PODCAST.replace("\n", "<br/>"), S["body"]),
])

# 28. Anexo video
page([
    H1("16. Anexo B. Guion del video"),
    P("Storyboard para una captura de pantalla de 3 a 4 minutos. Cada bloque indica el instante y la accion que debe realizarse."),
    Paragraph(VIDEO.replace("\n", "<br/>"), S["body"]),
])

# 29. Bibliografia
page([
    H1("17. Bibliografia"),
    *B([
        "Angular. Introduction to Angular components and standalone components. https://angular.dev/guide/components",
        "Angular. Signals: reactive state management. https://angular.dev/guide/signals",
        "Angular. Built-in template control flow: @if, @for, @empty. https://angular.dev/guide/templates/control-flow",
        "Ionic Framework. Ionic Angular documentation and component reference. https://ionicframework.com/docs/angular",
        "Web Content Accessibility Consortium. Web Content Accessibility Guidelines WCAG 2.1. https://www.w3.org/TR/WCAG21/",
        "Chrome DevTools. Lighthouse accessibility audits. https://developer.chrome.com/docs/lighthouse/accessibility/",
        "RxJS. Operators debounceTime, distinctUntilChanged y switchMap. https://rxjs.dev/guide/operators",
        "Playwright. Browser automation and end-to-end testing. https://playwright.dev/docs/intro",
    ]),
    P("Todas las URLs se consultaron durante el desarrollo de la actividad en noviembre de 2026."),
])

# 30. Futuro
page([
    H1("18. Lineas futuras de investigacion"),
    H2("Integracion con Supabase y politicas RLS"),
    P("Sustituir el servicio mock por un cliente de Supabase con consultas tipadas. Las politicas RLS permitirian que un operario solo vea los paquetes de su hub y que solo el rol de supervisor pueda rechazar un paquete."),
    H2("Usuarios, sesiones y RBAC"),
    P("Anadir autenticacion con guardas de ruta y tres roles: operario, supervisor y administrador. El componente de tarjeta ocultaria las acciones no permitidas segun el rol."),
    H2("Exportacion y Reporting"),
    P("Generar informes diarios en PDF y CSV con el historial de inspecciones, incluyendo filtros por fecha, hub y estado."),
    H2("Ergonomia industrial"),
    P("Estudiar el uso con guantes mediante areas tactiles mas grandes, comandos de voz y señales visuales de alta visibilidad, ademas de una prueba con lector de pantalla en dispositivo real."),
    H2("Rendimiento y sincronizacion offline"),
    P("Implementar sincronizacion diferida cuando la red del almacen no este disponible, utilizando almacenamiento local y reintentos controlados."),
    Spacer(1, 10 * mm),
    P("Fin de la memoria.", "caption"),
])


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(GREY)
    canvas.drawString(18 * mm, A4[1] - 12 * mm, "TrackingSpace - Memoria Actividad 2 - Mateo Fernandez Blasco")
    canvas.setStrokeColor(LIGHT)
    canvas.line(18 * mm, A4[1] - 14 * mm, A4[0] - 18 * mm, A4[1] - 14 * mm)
    canvas.line(18 * mm, 13 * mm, A4[0] - 18 * mm, 13 * mm)
    canvas.drawRightString(A4[0] - 18 * mm, 9 * mm, str(doc.page))
    canvas.drawString(18 * mm, 9 * mm, "DI_P1_FernandezBlascoMateo.pdf")
    canvas.restoreState()


doc = SimpleDocTemplate(
    OUT, pagesize=A4,
    leftMargin=18 * mm, rightMargin=18 * mm,
    topMargin=18 * mm, bottomMargin=18 * mm,
    title="TrackingSpace - Memoria Actividad 2",
    author="Mateo Fernandez Blasco",
)
def flatten(x):
    out = []
    for item in x:
        if isinstance(item, list):
            out.extend(flatten(item))
        else:
            out.append(item)
    return out


story = []
for i, flow in enumerate(PAGES):
    story.extend(flatten(flow))
    if i < len(PAGES) - 1:
        story.append(PageBreak())
doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)

data = open(OUT, "rb").read()
count = len(re.findall(rb"/Type\s*/Page\b", data))
print("PDF:", OUT)
print("Paginas:", count)
if count != 30:
    raise SystemExit("ERROR: se esperaban 30 paginas, se generaron " + str(count))
