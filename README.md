# UrBus

Plataforma de desarrollo colaborativo orientada a la integración de estudiantes en equipos de trabajo organizados por “buses”.
El proyecto busca simular un entorno de desarrollo profesional donde múltiples grupos trabajan sobre distintos módulos dentro de una arquitectura moderna basada en servicios.

Este proyecto forma parte del proceso de aprendizaje y práctica en desarrollo backend, arquitectura de software y trabajo en equipo.

---

# Arquitectura del Proyecto

UrBus está diseñado utilizando una arquitectura distribuida donde distintos servicios se encargan de responsabilidades específicas dentro del sistema.

Cada servicio puede ser desarrollado y mantenido por diferentes equipos de estudiantes, permitiendo una organización modular del proyecto.

El sistema está construido utilizando:

* **Node.js** para servicios backend y APIs
* **ASP.NET Core** para servicios principales del sistema
* **PostgreSQL** como base de datos relacional
* **Docker** para facilitar el despliegue y la ejecución del entorno
* Comunicación entre servicios mediante **HTTP APIs**

---

# Organización por Equipos

El proyecto está estructurado de manera que distintos grupos de estudiantes trabajen en módulos independientes del sistema.

Cada **bus** representa un conjunto de equipos responsables de implementar y mantener uno o varios servicios dentro del ecosistema.

Esto permite:

* Trabajo paralelo entre equipos
* Simulación de entornos reales de desarrollo
* Separación clara de responsabilidades
* Integración continua entre módulos

---

# Tecnologías Utilizadas

| Tecnología   | Uso en el proyecto                  |
| ------------ | ----------------------------------- |
| Node.js      | Desarrollo de microservicios        |
| ASP.NET Core | Servicios principales del sistema   |
| PostgreSQL   | Base de datos relacional            |
| Docker       | Contenedorización del entorno       |
| Git / GitHub | Control de versiones y colaboración |

---

# Estado del Proyecto

El proyecto se encuentra en fase de desarrollo inicial.

Actualmente se está trabajando en:

* Definición de arquitectura general
* Implementación de servicios base
* Integración entre equipos de desarrollo
* Configuración del entorno de desarrollo con Docker

Con el avance del proyecto se irán integrando nuevos servicios y funcionalidades.

---

# Posibles Servicios del Sistema

La plataforma está diseñada para poder crecer mediante distintos servicios independientes.
Algunos ejemplos de módulos que pueden formar parte del sistema son:

* **AuthService**
  Gestión de autenticación, usuarios y control de acceso.

* **UserService**
  Administración de perfiles y datos de usuarios.

* **BusManagementService**
  Gestión de buses, equipos y estudiantes asociados.

* **IntegrationService**
  Servicio encargado de la comunicación entre módulos.

Estos servicios pueden ser implementados y mantenidos por diferentes equipos.

---

# Base de Datos

El proyecto utiliza **PostgreSQL** como sistema de gestión de base de datos.

Cada servicio puede trabajar con su propio esquema o base de datos dependiendo de la arquitectura que se adopte durante el desarrollo.

Esto permite mantener independencia entre servicios y facilitar el escalamiento del sistema.

---

# Estructura General del Proyecto

Una posible organización del repositorio es la siguiente:

```
urbus/

├── auth-service/
│   └── src/
│
├── user-service/
│   └── src/
│
├── bus-management-service/
│   └── src/
│
├── shared/
│   └── common-libraries/
│
├── database/
│   └── docker-compose.yml
│
├── docker/
│   └── containers/
│
├── docs/
│
├── .gitignore
├── LICENSE
└── README.md
```

La estructura puede evolucionar conforme el proyecto crezca y se agreguen nuevos servicios.

---

# Instalación y Ejecución

## Prerequisitos

Antes de ejecutar el proyecto es necesario contar con:

* Node.js 18+
* .NET 8 SDK
* Docker
* PostgreSQL
* Git

---

# Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd urbus
```

---

# Base de Datos con Docker

Si el proyecto incluye configuración de contenedores para la base de datos:

```bash
docker compose down -v
docker compose up -d
```

Esto levantará los contenedores necesarios para el entorno de desarrollo.

---

# Ejecutar servicios Node

```bash
pnpm install
pnpm run dev
```

---

# Ejecutar servicios .NET

```bash
dotnet restore
dotnet build
dotnet run
```

---

# Contribución

El desarrollo del proyecto se realiza de forma colaborativa entre distintos equipos de estudiantes.

Se recomienda seguir las siguientes prácticas:

* Crear ramas por funcionalidad
* Realizar commits descriptivos
* Abrir Pull Requests para integrar cambios
* Mantener documentación actualizada

