# Riwi Jobs API

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

REST API for managing job vacancies and developer applications.

**Developer:** Angelica Maria Cuervo Marin  
**Riwi - Clan Ubuntu**  
Email: angiemarin0707@gmail.com  
Date: January 2026

---

## What is this?

Platform connecting developers with job opportunities. Solves the problem of disorganized vacancy sharing (chat, email, documents).

**Features by role:**
- **Coder:** Browse vacancies, apply (max 3), track applications
- **Manager:** Create vacancies, view applications
- **Admin:** Manage system and users

---

## Access

**Production:**
- API: https://riwi-jobs-production.up.railway.app
- Docs: https://riwi-jobs-production.up.railway.app/api/docs

**Local with Docker:**
```bash
git clone https://github.com/angelicacvo/riwi-jobs.git
cd riwi-jobs
docker-compose up -d
# Access http://localhost:3000
```

**Local without Docker:**
```bash
npm install
npm run start:dev
# Access http://localhost:3000
```

---

## Test Users

| Email | Password | Role | Capabilities |
|-------|----------|------|--------------|
| angelica@riwi.com | Admin123! | Admin | Full system management |
| gestor@riwi.com | Gestor123! | Manager | Create vacancies, view applications |
| juan@riwi.com | Coder123! | Coder | Apply to vacancies |

---

## Technologies

- **NestJS** - Backend framework
- **TypeScript** - Type-safe code
- **PostgreSQL** - Database (Supabase)
- **JWT** - Secure authentication
- **Swagger** - API documentation
- **Docker** - Containerization
- **Jest** - Testing

---

## Project Structure

```
src/
├── auth/              # Login and registration
├── users/             # User management
├── vacancies/         # Vacancy management
├── applications/      # Application management
├── database/          # Database configuration
└── common/            # Shared resources (guards, validators)
```

---

## API Examples

**1. Login**
```bash
POST /auth/login
Content-Type: application/json
x-api-key: angelica-secure-api-key-2026

{
  "email": "juan@riwi.com",
  "password": "Coder123!"
}
```

**2. Get Vacancies**
```bash
GET /vacancies?page=1&limit=10
x-api-key: angelica-secure-api-key-2026
```

**3. Apply to Vacancy**
```bash
POST /applications
Authorization: Bearer your-token-here
x-api-key: angelica-secure-api-key-2026

{
  "vacancyId": "vacancy-id"
}
```

---

## Documentation

Full interactive documentation:
- Local: http://localhost:3000/api/docs
- Production: https://riwi-jobs-production.up.railway.app/api/docs

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start:prod` | Start production server |
| `npm run seed` | Load test users |
| `npm run test` | Run tests |
| `docker-compose up -d` | Start with Docker |

---

## Features

**Requirements met:**
- JWT + API Key authentication
- 3 roles (Admin, Manager, Coder)
- Business rules: no duplicate applications, max 3 active, slot control
- Validations, Swagger docs, tests, Docker

**Extras:**
- Advanced filters, statistics, pagination, React frontend, Railway deployment

---

## Troubleshooting

**Port busy:** Change `PORT=3001` in `.env`  
**DB connection:** Already configured (Supabase), check `.env`  
**No users:** Run `npm run seed`

---

## License

Academic project for Riwi - MIT License

---

**Developed by Angelica Maria Cuervo Marin**  
**Riwi - Clan Ubuntu - Advanced Backend Track**
