# Memoria del proyecto: Gestión Multiplataforma

## 1. Descripción general

Aplicación web de gestión de empleados desarrollada con Angular e Ionic. Utiliza Supabase para autenticar a los usuarios y almacenar los perfiles de empleados. Incluye un panel de inicio con indicadores, consulta y filtrado de la plantilla, alta de perfiles, control de acceso por rol e informes exportables.

La aplicación está preparada para ejecutarse como aplicación web y usa Capacitor como base para futuras compilaciones móviles.

## 2. Objetivos

- Separar el acceso, el inicio, la lista de empleados, el alta y los informes en rutas independientes.
- Consultar y mantener los perfiles de empleados en Supabase.
- Autenticar las credenciales mediante Supabase Auth.
- Aplicar políticas RLS para limitar las operaciones sobre la tabla.
- Presentar los datos con indicadores, gráficos y una tabla que se pueda buscar, filtrar y ordenar.
- Exportar el listado a PDF (mediante impresión del navegador) y CSV.

## 3. Tecnologías

- Angular 22 y TypeScript.
- Ionic Angular 9 para los componentes de interfaz.
- Supabase JS 2 para Auth y acceso a PostgreSQL.
- Chart.js 4 para el gráfico de distribución de empleados por rol.
- Capacitor 8 para la configuración de aplicación multiplataforma.
- Vitest y Angular CLI para pruebas.
- ESLint y Angular ESLint para análisis estático.

Las versiones exactas están declaradas en `package.json`.

## 4. Estructura principal

```text
src/app/
  components/
    navegacion/          Menú compartido para páginas autenticadas
    tabla-usuarios/      Búsqueda, filtros, ordenación y acciones
    tarjeta-info/        Componente reutilizable de tarjeta informativa
    widget-estadistico/  Componente reutilizable de indicador
    tabla-datos/         Componente de tabla adicional
  environments/          Configuración Supabase por entorno
  guards/                Protección de rutas
  models/                Tipos de Usuario y Empleado
  pages/
    dashboard/           Inicio y resumen
    empleado-formulario/ Alta de un perfil de empleado
    informes/             Exportación PDF y CSV
    login/                Inicio de sesión
    usuarios/             Gráfico y listado de la plantilla
  services/
    auth.ts               Auth, perfiles y operaciones de empleados
    supabase.client.ts    Cliente Supabase compartido
supabase/
  migrations/             SQL de RLS y políticas de empleados
```

## 5. Navegación

| Ruta | Página | Acceso |
|---|---|---|
| `/login` | Inicio de sesión | Pública |
| `/inicio` | Panel de control | Usuario autenticado |
| `/dashboard` | Redirección a Inicio | Usuario autenticado al llegar a `/inicio` |
| `/usuarios` | Lista y gráfico de empleados | Usuario autenticado |
| `/usuarios/nuevo` | Formulario de alta | Solo rol `Admin` |
| `/informes` | Exportaciones PDF/CSV | Usuario autenticado |
| `/` | Redirección a `/login` | Pública |

El guard está en `src/app/guards/auth.guard.ts`. El menú compartido está en `src/app/components/navegacion/`.

## 6. Modelo de datos

### Perfil de empleado

La aplicación espera una tabla `public.empleados` con estos campos:

| Campo | Tipo/uso esperado |
|---|---|
| `id` | Identificador numérico autogenerado |
| `created_at` | Fecha de creación, opcional en el modelo |
| `nombre` | Nombre mostrado en la interfaz |
| `email` | Correo usado para relacionar el perfil con Auth |
| `edad` | Edad del empleado |
| `salario` | Salario mensual |
| `activo` | Estado operativo |
| `rol` | `Admin` o `User` |

El modelo TypeScript está en `src/app/models/empleado.interface.ts`.

### Cuenta de autenticación

Las credenciales pertenecen a **Supabase Authentication → Users**. La aplicación no debe leer, crear ni guardar contraseñas en `public.empleados`. El perfil se enlaza actualmente con la cuenta de Auth mediante el correo electrónico. Una mejora futura sería enlazarlo mediante un UUID `auth_user_id` con referencia a `auth.users.id`, evitando depender del correo como identificador.

## 7. Flujo de autenticación y seguridad de contraseñas

1. La pantalla de Login envía correo y contraseña a `AuthService.login()`.
2. `login()` llama a `supabase.auth.signInWithPassword()`.
3. Supabase Auth valida la contraseña. Supabase administra su almacenamiento seguro mediante hash; **no se debe hashear en Angular ni hacer una comparación contra una columna de la tabla**.
4. Si Auth valida las credenciales, la aplicación lee de `public.empleados` el perfil con el mismo correo para obtener nombre y rol.
5. Si RLS no permite leer el perfil, la aplicación cierra la sesión de Auth y muestra un error de perfil no encontrado/visible.
6. El cierre de sesión utiliza `supabase.auth.signOut()`.

Los botones «Preparar Admin» y «Preparar Usuario» solo rellenan el correo. No se incluyen contraseñas de demostración en el código cliente.

### Alta de cuentas

El formulario actual de `/usuarios/nuevo` inserta un perfil en `public.empleados`; **no crea una cuenta nueva en Supabase Auth**. Antes de que esa persona pueda autenticarse, su cuenta debe crearse en Supabase Auth y el perfil debe tener el mismo correo. La creación automatizada de cuentas requiere un backend confiable o una Supabase Edge Function; nunca debe exponerse la clave `service_role` en Angular.

### Recomendación para las contraseñas

- Crear o restablecer las credenciales en Supabase Auth.
- Usar contraseñas nuevas y únicas; las credenciales compartidas durante las pruebas deben cambiarse antes de entregar o publicar.
- No guardar contraseñas en tablas de negocio, en el código fuente, en variables frontend ni en botones de acceso demo.
- No aplicar un hash manual antes de llamar a `signInWithPassword()`: Auth recibe la contraseña por HTTPS y verifica el hash almacenado en el servidor.

## 8. Row Level Security (RLS)

La migración `supabase/migrations/20261028_empleados_auth_rls.sql`:

- Activa RLS en `public.empleados`.
- Sustituye las políticas existentes de esa tabla.
- Permite leer al usuario autenticado su propio perfil por correo y permite la lectura administrativa.
- Restringe inserciones, cambios y eliminaciones a administradores.
- Quita permisos de `anon` y concede permisos SQL de tabla a `authenticated`, manteniendo RLS como filtro de filas.
- Elimina la antigua columna `contraseña` de `empleados`, si existe.

La función `public.es_admin_empleados()` comprueba el rol `Admin` del perfil asociado al correo del JWT. Las políticas se definen en SQL y deben comprobarse en el proyecto Supabase correcto.

### Precaución al ejecutar la migración

La migración elimina todas las políticas preexistentes de `public.empleados` antes de crear las suyas y elimina la columna `contraseña`. Antes de aplicarla en una base con datos reales, revisar las políticas actuales y realizar una copia de seguridad. No volver a ejecutarla a ciegas si se han creado otras políticas que deban conservarse.

El proyecto no puede verificar desde el código si la migración ya se ejecutó en el panel remoto. La vista de políticas RLS debe mostrar las políticas requeridas, y deben probarse tanto con un usuario normal como con un administrador.

### Configuración inicial de perfiles

Cada usuario de Auth que vaya a entrar necesita un perfil coincidente en `public.empleados`, con el mismo correo. Para el primer perfil Admin, si RLS impide insertarlo desde el cliente, un administrador del proyecto puede crearlo desde el SQL Editor o desde el Table Editor de Supabase. Configurar el rol `Admin` solo a usuarios de confianza.

## 9. Funcionalidades

### Inicio (`/inicio`)

- Lee el usuario de sesión para el saludo y el rol mostrado.
- Consulta empleados a Supabase al entrar en la página.
- Calcula el total de empleados, la suma de salarios mensuales y la cantidad de empleados activos.
- Permite navegar al listado.

### Usuarios (`/usuarios`)

- Recupera los perfiles de empleados y muestra un gráfico circular de distribución por rol.
- Presenta una tabla con búsqueda por nombre/correo/rol.
- Permite filtrar por rol y por estado activo/inactivo.
- Permite ordenar ascendente o descendente por nombre, correo, edad, salario, rol y estado.
- El botón de alta y la acción de eliminar solo se ofrecen a Admin en la interfaz; RLS debe ser la protección real de base de datos.

### Alta (`/usuarios/nuevo`)

- Valida nombre, correo, edad, salario, rol y duplicidad de correo en perfiles.
- Inserta el perfil con estado activo por defecto.
- No recibe ni guarda contraseña. La cuenta de autenticación se administra por separado en Supabase Auth.

### Informes (`/informes`)

- Consulta los empleados actuales desde Supabase.
- Exporta una vista imprimible con tabla para guardar como PDF desde el navegador.
- Descarga CSV con encabezados, BOM UTF-8 y separador punto y coma.
- No incluye contraseñas.

## 10. Configuración y ejecución

1. Instalar Node.js/npm compatibles con Angular CLI del proyecto.
2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Configurar `supabaseUrl` y la clave **publishable/anon** del proyecto en `src/environments/environment.ts`. El entorno de producción reutiliza esa configuración y establece `production: true`.
4. No incluir nunca una clave `service_role` en una configuración Angular.
5. Crear la tabla y los perfiles requeridos en Supabase.
6. Revisar y aplicar las políticas RLS de la migración según las políticas existentes.
7. Crear usuarios de Auth y confirmar sus correos según la configuración del proyecto.
8. Ejecutar:

   ```bash
   npm start
   ```

Comandos adicionales:

```bash
npm run build
npm run lint
npm test
```

La aplicación se sirve en modo desarrollo mediante Angular CLI. La salida de producción se genera en `www` según `angular.json`; `www` está ignorado por Git.

## 11. Validación conocida

- `npm run build`: se ha ejecutado correctamente durante los cambios; Angular avisa de navegadores antiguos configurados en Browserslist.
- ESLint focalizado sobre las páginas modificadas: se ha ejecutado correctamente en las validaciones recientes.
- `npm test -- --watch=false --include=src/app/pages/usuarios/usuarios.page.spec.ts`: no pudo compilar el conjunto de pruebas porque `src/app/services/auth.spec.ts` importa `Auth` desde `auth.ts`, pero el servicio exportado se llama `AuthService`.
- El lint global había señalado errores en `tabla-datos/tabla-datos.component.html`. Revisar el resultado actualizado de `npm run lint` antes de la entrega.

## 12. Limitaciones y mejoras futuras

1. **Perfil enlazado por email:** añadir `auth_user_id` UUID como clave foránea a `auth.users.id`; adaptar login y políticas para usar `auth.uid()`.
2. **Creación de cuentas:** implementar una Edge Function autenticada que compruebe el rol Admin y cree la cuenta de Auth y el perfil de forma coordinada. No crear usuarios Auth desde el navegador usando una clave privilegiada.
3. **Restauración de sesión:** el servicio mantiene una copia del perfil en `localStorage`; el guard actual se apoya en ese estado local. Para una sesión robusta, inicializar desde `supabase.auth.getSession()` y escuchar `onAuthStateChange()`, sin confiar en el rol guardado por el cliente como autorización definitiva.
4. **Pruebas automatizadas:** corregir el test de `AuthService`, añadir pruebas del login, políticas/servicios y filtros/ordenación de tabla.
5. **Errores y carga:** mostrar un estado de error y opción de reintento en el dashboard cuando no se puedan cargar métricas.
6. **Prueba integral de RLS:** verificar las operaciones con cuentas reales de User y Admin en el proyecto Supabase, incluyendo acceso directo a la API; ocultar botones en la interfaz no sustituye las políticas.
7. **Datos personales:** limitar el acceso a salario y otros campos según el mínimo privilegio que requiera la aplicación.

## 13. Archivos clave

- `src/app/app.routes.ts`: rutas.
- `src/app/guards/auth.guard.ts`: autenticación y restricción por rol en rutas.
- `src/app/services/auth.ts`: integración Auth y operaciones con perfiles.
- `src/app/services/supabase.client.ts`: cliente Supabase.
- `src/app/pages/login/`: formulario de acceso y accesos rápidos que rellenan correo.
- `src/app/pages/dashboard/`: inicio e indicadores.
- `src/app/pages/usuarios/`: gráfico y gestión de lista.
- `src/app/pages/empleado-formulario/`: alta de perfiles.
- `src/app/pages/informes/`: exportación.
- `src/app/components/tabla-usuarios/`: tabla, filtros y ordenación.
- `src/app/components/navegacion/`: navegación autenticada.
- `supabase/migrations/20261028_empleados_auth_rls.sql`: configuración SQL de RLS propuesta.
