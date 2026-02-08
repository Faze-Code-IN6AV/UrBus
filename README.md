**UrBus — Sistema de Gestión de Transporte Escolar**

Breve descripción

UrBus (de “Your Bus”) es una solución académica —web y móvil— para mejorar la organización, puntualidad y comunicación del transporte escolar a nivel diversificado.

Características principales

- **Monitoreo en tiempo real:** ubicación del bus y seguimiento del recorrido.
- **Notificaciones:** avisos automáticos sobre cambios de ruta, horarios y el estado del bus.
- **Gestión de pasajeros:** listas por bus, asignación de estudiantes a rutas y grupos.
- **Control de recorridos:** estados del bus (en ruta, detenido, finalizado) y tiempo estimado de llegada.

Objetivos

- Optimizar la llegada de los estudiantes al transporte.
- Mejorar la comunicación entre estudiantes, padres y conductores.
- Facilitar la administración de recorridos y pasajeros.

Audiencia

- Estudiantes y padres (consulta de ubicación y notificaciones).
- Conductores (gestión de recorridos y pasajeros).
- Administradores (configuración de buses, rutas y usuarios).

Arquitectura y alcance

El sistema está diseñado para soportar múltiples buses, cada uno con su grupo y lista de estudiantes. Los estudiantes solo ven la información correspondiente a su bus. El proyecto se enfoca en transporte escolar (nivel diversificado) y no incluye, por ejemplo, pagos en línea.

Tecnologías (estado actual)

- Backend: .NET y/o Node.js (según módulo)
- Base de datos: PostgreSQL
- Contenedores: Docker
- Cliente: Aplicación web y móvil

Estado del proyecto

En desarrollo — fase de diseño y desarrollo funcional.

Instrucciones rápidas (desarrollo local)

1. Levantar la base de datos localmente (desde la carpeta `pg_db`):

```powershell
cd pg_db
docker-compose up -d
```

2. Restaurar dependencias y ejecutar la API (ejemplo .NET):

```powershell
cd authentication-service/src/AuthenticationService.Api
dotnet restore
dotnet build
dotnet run --urls "http://localhost:5000"
```

3. Acceder al cliente web o a la app móvil según instrucciones de cada módulo.

Buenas prácticas

- Usar ramas por feature y pull requests para revisión.
- Mantener la configuración sensible fuera del repositorio (usar variables de entorno o `appsettings.Development.json` localmente).

Contribuciones

Este proyecto es académico; las contribuciones son bienvenidas. Para proponer cambios:

1. Abre una issue describiendo la mejora o bug.
2. Crea una rama con cambios claros y un PR con descripción.

Contacto

Equipo del proyecto: Product Owner — Ricardo; Scrum Master — Diego.

Licencia

Proyecto de uso académico. No listo para producción sin validaciones, pruebas y auditoría.

---

Cambios realizados

- Reestructura y organiza el contenido para facilitar la lectura.
- Añade instrucciones básicas de arranque local.
- Resume tecnologías y estado actual.

Si quieres, adapto la sección "Instrucciones rápidas" con comandos exactos para tu entorno (por ejemplo, puertos distintos o variables de entorno necesarias).