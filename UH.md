
🎯 HU-05: Reglas de Negocio de Postulaciones
Como sistema
Quiero validar las reglas de negocio
Para garantizar integridad en las postulaciones

Tasks:
 Implementar validación: no duplicar postulaciones (mismo user + vacancy)
 Implementar validación: verificar cupo disponible
 Implementar método para contar postulaciones actuales vs maxApplicants
 Implementar validación: coder no puede tener más de 3 postulaciones activas
 Crear mensajes de error descriptivos para cada regla
 Agregar método para obtener estadísticas de vacante (cupos disponibles)
 Testing de reglas de negocio
Commit: feat(applications): add business rules validation for applications

🎯 HU-06: Filtros y Consultas Avanzadas
Como usuario
Quiero filtrar y buscar vacantes
Para encontrar oportunidades que se ajusten a mi perfil

Tasks:
 Agregar QueryDto para vacantes (tecnología, seniority, ubicación, modalidad)
 Implementar filtros en VacanciesService.findAll()
 Agregar ordenamiento (más recientes, más cupos, etc.)
 Implementar paginación básica
 Agregar endpoint para obtener vacantes con cupo disponible
 Testing de filtros
Commit: feat(vacancies): add advanced filters and search capabilities

🎯 HU-07: Métricas y Estadísticas (Opcional)
Como gestor/admin
Quiero ver estadísticas del sistema
Para hacer seguimiento al proceso de postulaciones

Tasks:
 Endpoint para contar postulaciones por vacante
 Endpoint para estadísticas de usuario (cuántas postulaciones tiene)
 Endpoint para vacantes más populares
 Endpoint para dashboard de gestor (resumen)
 Proteger con roles apropiados
Commit: feat(metrics): add statistics and metrics endpoints

🎯 HU-08: Documentación con Swagger
Como desarrollador
Quiero tener la API documentada con Swagger
Para facilitar el uso y testing de endpoints

Tasks:
 Agregar @ApiTags a todos los controllers
 Agregar @ApiProperty a todos los DTOs
 Documentar responses con @ApiResponse
 Agregar @ApiBearerAuth para endpoints protegidos
 Documentar @ApiHeader para x-api-key
 Agregar ejemplos de requests/responses
 Configurar Swagger en main.ts
 Actualizar README con URL de Swagger
Commit: docs(swagger): add complete API documentation

🎯 HU-09: Tests Unitarios
Como desarrollador
Quiero tener tests unitarios
Para garantizar calidad y funcionalidad del código

Tasks:
 Tests para VacanciesService.create()
 Tests para VacanciesService con diferentes roles
 Tests para ApplicationsService.create()
 Tests para reglas de negocio (duplicados, cupo, límite 3)
 Tests para AuthService
 Alcanzar cobertura mínima del 40%
 Configurar CI/CD básico (opcional)
Commit: test: add unit tests with 40% coverage

🎯 HU-10: Frontend Básico (Opcional)
Como usuario
Quiero una interfaz web básica
Para interactuar con la API sin usar Postman

Tasks:
 Crear estructura HTML/CSS básica
 Página de login/registro
 Página para listar vacantes
 Página para postularse
 Usar fetch/axios con promesas
 Manejar JWT en localStorage
 Agregar headers (Authorization + x-api-key)
Commit: feat(frontend): add basic HTML/CSS interface with promises

📋 Orden recomendado de implementación:
HU-02 - Users (fundación)
HU-03 - Vacancies (CRUD completo)
HU-04 - Applications básico
HU-05 - Reglas de negocio (crítico)
HU-06 - Filtros (nice to have)
HU-08 - Swagger (documentación)
HU-09 - Tests (obligatorio)
HU-07 - Métricas (extra)
HU-10 - Frontend (extra)