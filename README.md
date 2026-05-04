# UrBus
 
Plataforma de desarrollo colaborativo orientada a la integración de estudiantes en equipos de trabajo organizados por “buses”.
El proyecto busca simular un entorno de desarrollo profesional donde múltiples grupos trabajan sobre distintos módulos dentro de una arquitectura moderna basada en servicios.
 
Este proyecto forma parte del proceso de aprendizaje y práctica en desarrollo backend, arquitectura de software y trabajo en equipo.
 
---
 
## Arquitectura del Proyecto
 
UrBus está diseñado utilizando una arquitectura distribuida donde distintos servicios se encargan de responsabilidades específicas dentro del sistema.
 
Cada servicio puede ser desarrollado y mantenido por diferentes equipos de estudiantes, permitiendo una organización modular del proyecto.
 
El sistema está construido utilizando:
 
* **Node.js** para servicios backend y APIs
* **ASP.NET Core** para servicios principales del sistema
* **PostgreSQL** como base de datos relacional
* **Docker** para facilitar el despliegue y la ejecución del entorno
* Comunicación entre servicios mediante **HTTP APIs**
 
---
 
## Organización por Equipos
 
El proyecto está estructurado de manera que distintos grupos de estudiantes trabajen en módulos independientes del sistema.
 
Cada **bus** representa un conjunto de equipos responsables de implementar y mantener uno o varios servicios dentro del ecosistema.
 
Esto permite:
 
* Trabajo paralelo entre equipos
* Simulación de entornos reales de desarrollo
* Separación clara de responsabilidades
* Integración continua entre módulos
 
---
 
## Tecnologías Utilizadas
 
| Tecnología     | Uso en el proyecto                  |
| -------------- | ----------------------------------- |
| Node.js        | Desarrollo de microservicios        |
| ASP.NET Core   | Servicios principales del sistema   |
| PostgreSQL     | Base de datos relacional            |
| MongoDB        | Base de datos NoSQL por servicio    |
| Docker         | Contenedorización del entorno       |
| Docker Compose | Orquestación de contenedores        |
| Git / GitHub   | Control de versiones y colaboración |
 
---
 
## Estado del Proyecto
 
El proyecto se encuentra en fase de desarrollo inicial.
 
Actualmente se está trabajando en:
 
* Definición de arquitectura general
* Implementación de servicios base
* Integración entre equipos de desarrollo
* Configuración del entorno de desarrollo con Docker
 
Con el avance del proyecto se irán integrando nuevos servicios y funcionalidades.
 
---
 
## Servicios del Sistema
 
La plataforma está diseñada para crecer mediante servicios independientes.
 
* **AuthenticationService**
  Gestión de autenticación, usuarios, control de acceso y roles.
 
* **LocationService**
  Gestión de ubicación en tiempo real del bus mediante mapas interactivos.
 
* **NotificationService**
  Comunicación entre conductor y pasajeros mediante notificaciones (integración con WhatsApp).
 
* **PassengerService**
  Gestión de estudiantes, control de asistencia y estado de viaje.
 
* **PostService**
  Publicación de avisos como retrasos, cambios de ruta o información relevante.
 
---
 
## Base de Datos
 
Cada microservicio utiliza su propia base de datos siguiendo buenas prácticas de arquitectura de microservicios.
 
| Servicio              | Base de Datos | Motor      |
| --------------------- | ------------- | ---------- |
| AuthenticationService | urbus_users   | PostgreSQL |
| LocationService       | UrBus         | MongoDB    |
| NotificationService   | notifications | MongoDB    |
| PassengerService      | passenger     | MongoDB    |
| PostService           | urbus_posts   | MongoDB    |
 
---
 
## Puertos de los Servicios
 
| Servicio              | Puerto |
| --------------------- | ------ |
| AuthenticationService | 5166   |
| LocationService       | 3033   |
| NotificationService   | 5000   |
| PassengerService      | 3011   |
| PostService           | 5001   |
 
---
 
## AuthenticationService
 
Microservicio encargado de la autenticación y gestión de usuarios.
 
### Funcionalidades
 
* Registro de usuarios
* Inicio de sesión
* Verificación de correo electrónico
* Gestión de roles y control de acceso
* Recuperación y restablecimiento de contraseña
* Control de acceso mediante JWT
* Renovación de tokens

### Endpoints

**Base URL:**

```
http://localhost:5166/api/v1
```

#### Health Check

| Método | Endpoint | Descripción              | Autenticación |
| ------ | -------- | ------------------------ | -------------- |
| GET    | /health  | Verificar estado del servicio | No |
| GET    | /swagger | Documentación de la API (Swagger UI) | No |

#### Autenticación (Auth)

| Método | Endpoint                    | Descripción                              | Autenticación |
| ------ | ----------------------------- | ---------------------------------------- | -------------- |
| POST   | /auth/login                 | Iniciar sesión de usuario                | No |
| POST   | /auth/register              | Registrar nuevo usuario                  | No |
| POST   | /auth/verify-email          | Verificar correo electrónico              | No |
| POST   | /auth/resend-verification   | Reenviar correo de verificación          | No |
| POST   | /auth/forgot-password       | Solicitar recuperación de contraseña      | No |
| POST   | /auth/reset-password        | Restablecer contraseña                   | No |
| POST   | /auth/refresh               | Renovar access token usando refresh token | No |
| POST   | /auth/logout                | Cerrar sesión (revocar refresh token)    | Sí (JWT) |

#### Gestión de Usuarios (User Management)

| Método | Endpoint              | Descripción                     | Autenticación | Roles |
| ------ | ---------------------- | ------------------------------- | -------------- | -------- |
| PUT    | /users/{userId}/role  | Actualizar rol de usuario       | Sí (JWT)      | ADMIN_ROLE |
| GET    | /users/{userId}/roles | Obtener roles de un usuario     | Sí (JWT)      | ADMIN_ROLE |
| GET    | /users/by-role        | Listar usuarios por rol         | Sí (JWT)      | ADMIN_ROLE |

* Visualización del bus en mapa
* Seguimiento en tiempo real
* Definición de destino
 
### Endpoints
 
**Base URL:**
 
```
http://localhost:3033/UrBus/v1
```
 
| Método | Endpoint | Descripción         |
| ------ | -------- | ------------------- |
| GET    | /health  | Estado del servicio |
| GET    | /        | Obtener ubicación   |
| GET    | /swagger | Documentación de la API (Swagger UI) |
 
---
 
## NotificationService
 
Servicio encargado del envío de notificaciones mediante WhatsApp.
 
### Funcionalidades
 
* Generación de código QR
* Envío de mensajes a grupos
* Notificaciones automáticas
 
### Tipos de notificaciones
 
* Llegada
* Retrasos
* Cambios de ruta
* Mensajes personalizados
 
### Endpoints
 
**Base URL:**
 
```
http://localhost:5000/urbus/v1
```
 
| Método | Endpoint      | Descripción           |
| ------ | ------------- | --------------------- |
| GET    | /health       | Estado del servicio   |
| POST   | /arrival      | Notificar llegada     |
| POST   | /delay        | Notificar retraso     |
| POST   | /route-change | Cambio de ruta        |
| POST   | /custom       | Mensaje personalizado |
| GET    | /groups       | Obtener grupos        |
| GET    | /swagger      | Documentación de la API (Swagger UI) |
 
---
 
## PassengerService
 
Servicio encargado de la gestión de pasajeros.
 
### Funcionalidades
 
* Registro de estudiantes
* Listado de pasajeros
* Control de asistencia
* Eliminación de pasajeros
 
### Endpoints
 
**Base URL:**
 
```
http://localhost:3011/urbus/v1/passengers
```
 
| Método | Endpoint    | Descripción       |
| ------ | ----------- | ----------------- |
| POST   | /           | Crear pasajero    |
| GET    | /           | Listar pasajeros  |
| PATCH  | /:id/status | Actualizar estado |
| DELETE | /:id        | Eliminar pasajero |
| GET    | /swagger    | Documentación de la API (Swagger UI) |
 
---
 
## PostService
 
Servicio encargado de las publicaciones del sistema.
 
### Funcionalidades
 
* Crear avisos
* Publicaciones con imagen
* Consultar publicaciones
* Reactivar publicaciones
 
### Endpoints
 
**Base URL:**
 
```
http://localhost:5001/urbus/v1/posts
```
 
| Método | Endpoint        | Descripción           |
| ------ | --------------- | --------------------- |
| POST   | /               | Crear publicación     |
| GET    | /               | Obtener publicaciones |
| GET    | /my-posts       | Publicaciones propias |
| GET    | /:id            | Obtener por ID        |
| PUT    | /:id            | Actualizar            |
| DELETE | /:id            | Eliminar              |
| PATCH  | /:id/reactivate | Reactivar             |
| GET    | /swagger        | Documentación de la API (Swagger UI) |
 
---
 
## Estructura del Proyecto
 
```
UrBus/
├── authentication-service/
├── location-service/
├── notification-service/
├── passenger-service/
├── post-service/
├── pg_db/
├── .gitignore
└── README.md
```
 
---
 
## Instalación y Ejecución
 
### Prerequisitos
 
* Node.js 18+
* .NET 8 SDK
* Docker
* PostgreSQL
* MongoDB
* Git
 
---
 
### Clonar repositorio
 
```bash
git clone <url-del-repositorio>
cd urbus
```
 
---
 
### Base de datos con Docker
 
```bash
docker compose down -v
docker compose up -d
```
 
---
 
### Ejecutar servicios Node
 
```bash
pnpm install
pnpm run dev
```
 
---
 
### Ejecutar servicios .NET
 
```bash
dotnet restore
dotnet build
dotnet run
```
 
---
 
## Contribución
 
El desarrollo del proyecto se realiza de forma colaborativa entre distintos equipos de estudiantes.
 
Se recomienda:
 
* Crear ramas por funcionalidad
* Hacer commits descriptivos
* Usar Pull Requests
* Mantener la documentación actualizada