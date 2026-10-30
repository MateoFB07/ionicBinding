# Sistema de Gestión Multiplataforma

## 📋 Información de la Entrega Académica

* **Módulo Profesional:** Desarrollo de Interfaces (Código: 0488)

* **Ciclo Formativo:** Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM) - 2º Curso

* **Tipo de Entrega:** Proyecto Individual de Evaluación Práctica


## 💡 Descripción General del Proyecto

Esta aplicación es una solución de software multiplataforma (Web y PWA Híbrida) concebida para la gestión integral de usuarios (tanto users como admins), control de salarios y administración de accesos.

El sistema implementa una arquitectura desacoplada basada en el patrón **MVVM (Model-View-ViewModel)** utilizando **Ionic 8** con **Angular (Standalone Components Architecture)** en el frontend, conectado de forma asíncrona a la infraestructura en la nube de **Supabase (PostgreSQL y GoTrue Auth)** en el backend.

La aplicación garantiza el control de acceso basado en roles, cuadros de mando analíticos con gráficos vectoriales interactivos, exportación de informes en formatos estándar (PDF/CSV), y cumplimiento estricto de las directivas de usabilidad y accesibilidad (WCAG 2.1) con soporte para Modo Oscuro nativo.

## 🛠️ Arquitectura y Stack Tecnológico

### Frontend & Capa de Presentación

* **Ionic Framework 8:** Componentes UI adaptativos y móviles nativos.

* **Angular (v18+):** Controladores de vista, enrutamiento declarativo y Standalone Components.

* **Angular Signals & Control Flow:** Gestión de estado reactivo granular (`signal()`, `@if`, `@else`, `@for`).

* **Chart.js:** Renderizado dinámico de métricas consolidadas sobre canvas interactivos.

* **SCSS & CSS Variables:** Sistema de tematización global, diseño fluido y variables reactivas para Modo Oscuro.

### Backend & Persistencia

* **Supabase:** Base de datos relacional orientada al almacenamiento de empleados y roles.

* **Supabase Auth (GoTrue):** Gestión de sesiones, encriptación automática de contraseñas mediante hashing (**bcrypt**).

* **RxJS / Promises (Async-Await):** Consumo concurrente de datos e integración con APIs externas.

### Despliegue y CI/CD

* **Git & GitHub:** Control de versiones.

* **Vercel:** Integración continua y despliegue automatizado para producción.

## 📌 Guía Técnica e Implementación de Requisitos

### 1. Control de Flujo con `@if` y Estado Reactivo con Signals

En cumplimiento con los estándares modernos de Angular, la aplicación prescinde de los módulos clásicos (`NgModule`) y adopta **Standalone Components** junto con **Angular Signals** para el control de estado reactivo sin sobrecarga de ciclos de re-renderizado (`ChangeDetectionStrategy`).

#### Ejemplo de uso en `HomePage`:

Definimos la señal para indicar el estado de la comunicación asíncrona:

```
// home.page.ts
public cargando = signal<boolean>(true);
public totalEmpleados = signal<number>(0);



```

En la plantilla HTML, evaluamos directamente el valor de la Signal sin necesidad de pipes asíncronos (`async` pipe), logrando un rendimiento superior:

```
<!-- home.page.html -->
@if (cargando()) {
  <div class="contenedor-spinner ion-text-center ion-padding-top">
    <ion-spinner name="crescent" color="primary"></ion-spinner>
    <p>Cargando métricas del sistema en tiempo real...</p>
  </div>
} @else {
  <ion-grid class="ion-no-padding">
    <ion-row>
      <ion-col size="12" size-md="6">
        <app-widget-estadistico
          titulo="Total Empleados"
          [valor]="totalEmpleados()"
          subtitulo="Plantilla Registrada"
          colorBorde="#3880ff">
        </app-widget-estadistico>
      </ion-col>
    </ion-row>
  </ion-grid>
}



```

### 2. Sistema de Tematización y Modo Oscuro (Dark Mode)

La tematización de la aplicación respeta las especificaciones de accesibilidad de contraste de color **WCAG 2.1**. El usuario puede cambiar entre Modo Claro y Modo Oscuro mediante un botón interactivo situado en la barra de navegación superior.

#### A. Lógica de Control en TypeScript (`home.page.ts`)

El estado del tema se almacena en `localStorage` para garantizar la persistencia entre sesiones y se sincroniza dinámicamente con los colores del canvas de **Chart.js**:

```
public esModoOscuro = signal<boolean>(false);

public toggleModoOscuro(): void {
  const nuevoEstado = !this.esModoOscuro();
  this.esModoOscuro.set(nuevoEstado);
  
  // Modificación del DOM raíz
  document.body.classList.toggle('dark', nuevoEstado);
  localStorage.setItem('modoOscuro', String(nuevoEstado));

  // Re-renderizado de la leyenda del gráfico para mantener legibilidad
  if (this.miGrafico) {
    const colorTexto = nuevoEstado ? '#ffffff' : '#333333';
    if (this.miGrafico.options.plugins?.legend?.labels) {
      this.miGrafico.options.plugins.legend.labels.color = colorTexto;
    }
    this.miGrafico.update();
  }
}



```

#### B. Estilos Globales en SCSS (`global.scss` / `home.page.scss`)

Utilizamos las CSS Variables nativas de Ionic para conmutar la paleta cromática completa sin romper la maquetación:

```
/* MODO CLARO (Default) */
ion-content {
  --background: #f8fafc;
  --color: #0f172a;
}

/* MODO OSCURO (Activado mediante la clase .dark en <body>) */
body.dark {
  --ion-background-color: #0f172a;
  --ion-text-color: #f8fafc;
  --ion-card-background: #1e293b;

  ion-content {
    --background: #0f172a !important;
    --color: #f8fafc !important;
  }

  ion-card {
    --background: #1e293b !important;
    color: #f8fafc !important;
  }
}



```

### 3. Conexión Backend y Seguridad de Credenciales con Supabase

La persistencia de la aplicación está conectada con una instancia de **Supabase PostgreSQL**.

#### Hasheo y Seguridad de Contraseñas

La autenticación no almacena en ningún caso contraseñas en texto plano dentro de la base de datos pública. Supabase Auth hace uso del servicio **GoTrue**, aplicando un algoritmo de hasheo seguro **bcrypt** con *salting* automático en el servidor.

#### Configuración del Cliente (`auth.service.ts` / `supabase.service.ts`):

```
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Obtención de empleados mediante llamadas asíncronas basadas en Promesas
  public async getEmpleados(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('empleados')
      .select('*');

    if (error) throw error;
    return data || [];
  }
}



```

### 4. Cuadro de Mando Interactivo (Dashboard) y Chart.js

El Dashboard procesa en tiempo real la información recopilada desde Supabase y calcula las métricas requeridas por el rol de Administrador:

1. **KPI 1 (Total Empleados):** Métrica calculada según la longitud del array de datos devuelto.

2. **KPI 2 (Masa Salarial Total):** Reducción funcional del array sumando la columna `salario` y formateada con el pipe `currency:'EUR'`.

3. **Gráfico Doughnut:** Procesamiento dinámico del conteo de usuarios agrupados por la propiedad `rol` e instanciación sobre un lienzo `<canvas #graficoMasaSalarial>`:

```
private crearGrafico(empleados: any[]): void {
  if (!this.graficoCanvas) return;
  if (this.miGrafico) this.miGrafico.destroy();

  const conteoRoles: { [key: string]: number } = {};
  empleados.forEach(e => {
    const rol = e.rol || 'User';
    conteoRoles[rol] = (conteoRoles[rol] || 0) + 1;
  });

  this.miGrafico = new Chart(this.graficoCanvas.nativeElement, {
    type: 'doughnut',
    data: {
      labels: Object.keys(conteoRoles),
      datasets: [{
        data: Object.values(conteoRoles),
        backgroundColor: ['#3880ff', '#2dd36f', '#ffc409', '#eb445a']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}



```

### 5. Sincronización e Inserción/Eliminación en Tiempo Real

Para mantener la concordancia de datos entre la vista web y la base de datos alojada en la nube sin necesidad de reiniciar el estado de la PWA ni hacer refrescos manuales del navegador (`F5`):

1. **Petición CRUD:** Cuando un administrador crea o elimina un registro mediante la interfaz `TablaUsuariosComponent`, se emite una orden al servicio:

   ```
   await this.supabase.from('empleados').delete().eq('id', idUsuario);
   
   
   
   ```

2. **Respuesta y Notificación:** Tras verificar la respuesta del servidor (`error === null`), el componente vuelve a invocar de forma automática la función de obtención de datos (`cargarMetricas()` / `cargarUsuarios()`).

3. **Actualización Reactiva:** Las Signals detectan la modificación del array, desencadenando la actualización inmediata del DOM y el re-calculo automático del gráfico de Chart.js.

## 💻 Componentes Reutilizables Desarrollados (RA 3)

### 1. `WidgetEstadisticoComponent`

Componente agnóstico encargado de renderizar indicadores clave de rendimiento (KPIs).

* **`@Input`:** `titulo` (string), `valor` (string | number), `subtitulo` (string), `colorBorde` (string).

* **`@Output`:** `alHacerClic` (`EventEmitter<string>`).

### 2. `TablaUsuariosComponent`

Componente encargado del filtrado, paginación y renderizado tabular de la plantilla de usuarios con acciones CRUD.

## 📦 Instrucciones para la Instalación y Despliegue Local

### Requisitos Previos

* **Node.js:** v18.0.0 o superior.

* **Ionic CLI:** `npm install -g @ionic/cli`

* **Angular CLI:** `npm install -g @angular/cli`

### Pasos de Configuración

1. **Clonar el repositorio:**

   ```
   git clone https://github.com/MateoFB07/ionicBinding.git
   cd ionicBinding
   
   
   
   ```

2. **Instalar dependencias de desarrollo:**

   ```
   npm install
   
   
   
   ```

3. **Configurar variables de entorno (`src/environments/environment.ts`):**

   ```
   export const environment = {
     production: false,
     supabaseUrl: 'HTTPS://TU_PROYECTO_SUPABASE.supabase.co',
     supabaseKey: 'TU_CLAVE_ANONIMA_SUPABASE'
   };
   
   
   
   ```

4. **Ejecutar la aplicación en modo servidor local:**

   ```
   ionic serve
   
   
   
   ```

   La aplicación se abrirá automáticamente en `http://localhost:8100/`.

## 🌐 Estructura del Proyecto

```
gestion-multiplataforma/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── navegacion/
│   │   │   ├── tabla-datos/
│   │   │   ├── tabla-usuarios/
│   │   │   ├── tarjeta-info/
│   │   │   └── widget-estadistico/
│   │   │       ├── widget.estadistico.component.html
│   │   │       ├── widget.estadistico.component.scss
│   │   │       └── widget.estadistico.component.ts
│   │   ├── environments/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── models/
│   │   ├── pages/
│   │   │   ├── empleado-formulario/
│   │   │   ├── home/
│   │   │   │   ├── home.page.html
│   │   │   │   ├── home.page.scss
│   │   │   │   ├── home.page.spec.ts
│   │   │   │   └── home.page.ts
│   │   │   ├── informes/
│   │   │   ├── login/
│   │   │   └── usuarios/
│   │   ├── services/
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── assets/
│   ├── theme/
│   ├── global.scss
│   ├── index.html
│   ├── main.ts
│   └── test-setup.ts
├── supabase/
├── www/
├── .browserslistrc
├── .editorconfig
├── .gitignore
├── angular.json
├── capacitor.config.ts
├── eslint.config.js
└── ionic.config.json
        

```