# Riwi Jobs API

API REST para gestión de vacantes laborales y postulaciones de coders en Riwi.

## 🚀 Instalación y ejecución

1. Instalar dependencias:
```bash
npm install
```

2. Configurar archivo `.env` (ver `.env.example`)

3. Ejecutar seeders:
```bash
npm run seed
```

4. Iniciar servidor:
```bash
npm run start:dev
```

Aplicación disponible en: `http://localhost:3000`

## 🔑 Credenciales de prueba (Seeders)

| Nombre | Email | Password | Rol |
|--------|-------|----------|-----|
| Angelica | angelica@riwi.com | Admin123! | Administrator |
| Gestor Riwi | gestor@riwi.com | Gestor123! | Manager |
| Juan Coder | juan@riwi.com | Coder123! | Developer |
| Maria Developer | maria@riwi.com | Coder123! | Developer |
| Carlos Dev | carlos@riwi.com | Coder123! | Developer |

## 📚 Endpoints de Autenticación

### Registro
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "angelica@riwi.com",
  "password": "Admin123!"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Angelica",
      "email": "angelica@riwi.com",
      "role": "administrator"
    },
    "access_token": "eyJhbGc..."
  },
  "message": "Login successful"
}
```

## 🛡️ Headers requeridos para endpoints protegidos

```http
Authorization: Bearer <jwt_token>
x-api-key: <api_key_from_env>
```

## 🔐 Roles y Permisos

- **Administrator**: Acceso total
- **Manager**: Crear/gestionar vacantes, consultar postulaciones
- **Developer**: Registrarse, consultar vacantes, postularse

## 📦 Scripts

```bash
npm run start:dev    # Desarrollo
npm run seed         # Ejecutar seeders
npm run build        # Compilar
npm run test         # Tests
```