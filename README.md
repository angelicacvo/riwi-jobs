# Riwi Jobs API

<div align="center">

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

**REST API for job vacancy management and developer applications**

[Documentation](#api-documentation) · [Installation](#installation-and-setup) · [Features](#main-features)

</div>

---

## Project Description

**Riwi Jobs API** is a backend application built with **NestJS** and **TypeScript** that facilitates job vacancy management and the developer application process. This system allows companies to post job offers and coders to apply to vacancies that match their profile, all within an ecosystem controlled by roles and permissions.

### Context

This application was developed as a project for the **Advanced Backend Route** at **Riwi**, implementing clean architecture principles, robust validations, secure authentication, and complete documentation with Swagger.

### Target Audience

- **Administrators**: Full system management (users, vacancies, applications)
- **Managers**: Vacancy creation and management, application consultation
- **Developers (Coders)**: Available vacancy consultation and job application

---

## Technologies Used

### Core Framework
- **NestJS v10** - Progressive Node.js framework for scalable server-side applications
- **TypeScript v5** - JavaScript superset with static typing

### Database
- **PostgreSQL** - Relational database management system
- **TypeORM v0.3** - Object-Relational Mapping for TypeScript and JavaScript

### Authentication and Security
- **JWT (JSON Web Tokens)** - Token-based authentication
- **bcrypt** - Secure password hashing
- **Passport.js** - Authentication middleware with JWT strategy
- **class-validator** - DTO validation using decorators
- **class-transformer** - Transform plain objects to class instances

### Documentation
- **Swagger/OpenAPI** - Interactive API documentation
- **@nestjs/swagger** - Swagger integration for NestJS

### Testing
- **Jest** - Testing framework with code coverage
- **Supertest** - HTTP endpoint testing

---

## Project Architecture

The project follows **NestJS modular architecture**, organizing code into independent functional modules:

```
src/
├── auth/              # Authentication module (register, login, JWT)
│   ├── dto/           # Data Transfer Objects
│   ├── entities/      # Database entities
│   └── guards/        # Authentication guards
├── users/             # User module (CRUD, roles, permissions)
├── vacancies/         # Vacancy module (CRUD, filters, statistics)
├── applications/      # Application module (business rules, metrics)
├── database/          # TypeORM configuration and DB connection
└── common/            # Shared resources (guards, decorators, enums, interceptors)
```

### Applied Principles

- **Separation of concerns**: Each module handles its own business logic
- **Dependency injection**: Facilitates testing and maintainability
- **Data validation**: DTOs with class-validator on all inputs
- **Error handling**: Custom HTTP exceptions
- **Interceptors**: Response transformation with standardized format
- **Guards**: Role-based access control (RBAC)

---

## Main Features

### 1. Authentication System
- User registration with data validation
- Login with JWT token generation
- Route protection using guards
- Dual authentication: Bearer Token + API Key

### 2. User Management
- Complete user CRUD (administrators only)
- Roles: Administrator, Manager, Developer
- Users can view/edit their own profile
- Unique email validation
- Secure password hashing with bcrypt

### 3. Vacancy Management
- Vacancy CRUD (Admin and Managers)
- Advanced filters: company, location, modality, status
- Pagination and sorting
- Vacancy activation/deactivation
- Maximum slots control per vacancy
- Public consultation of active vacancies

### 4. Application System
- Developers can apply to vacancies
- **Implemented business rules**:
  - Cannot apply twice to the same vacancy
  - Maximum 3 active applications per user simultaneously
  - Cannot apply if vacancy has no available slots
- Status updates (Admin and Managers)
- View own applications or all (based on role)

### 5. Metrics and Statistics
- Dashboard with general system statistics
- User statistics (applications, statuses)
- Vacancy statistics (applications, slots)
- Top 10 most popular vacancies
- User metrics by role

### 6. Swagger Documentation
- Interactive documentation at `/api/docs`
- Automatic request/response schemas
- Real-time endpoint testing
- Authentication configured in interface

---

## Prerequisites

Before installing the project, make sure you have installed:

| Software | Minimum Version | Download |
|----------|----------------|----------|
| **Node.js** | v18.0.0 | [nodejs.org](https://nodejs.org/) |
| **npm** | v9.0.0 | (included with Node.js) |
| **PostgreSQL** | v14.0 | [postgresql.org](https://www.postgresql.org/download/) |
| **Git** | v2.0 | [git-scm.com](https://git-scm.com/downloads) |

---

## Installation and Setup

### Step 1: Clone the Repository

Open your terminal (CMD, PowerShell, Git Bash or your OS terminal) and execute:

```bash
git clone https://github.com/your-username/riwi-jobs.git
cd riwi-jobs
```

### Step 2: Install Dependencies

Install all necessary packages with npm:

```bash
npm install
```

This command will download and install all libraries defined in the `package.json` file (NestJS, TypeORM, Passport, etc.).

### Step 3: Configure Database

#### Create the database in PostgreSQL:

1. Open **pgAdmin** or your PostgreSQL client
2. Create a new database called `riwi_jobs`:

```sql
CREATE DATABASE riwi_jobs;
```

#### Configure environment variables:

Create a `.env` file in the project root (you can copy the `.env.example` file if it exists):

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=riwi_jobs

# JWT
JWT_SECRET=your_very_secure_jwt_secret_key

# API Key
API_KEY=riwi-2024-secret-key-pro

# Application Port
PORT=3000
```

> **Important**: Replace `your_postgres_password` with your actual PostgreSQL password and generate a secure `JWT_SECRET` (you can use a random key generator).

### Step 4: Run Migrations (Automatic)

TypeORM is configured with `synchronize: true` in development, so tables will be created automatically when starting the application.

### Step 5: Load Test Data (Seeders)

To populate the database with sample users and vacancies:

```bash
npm run seed
```

This command will create:
- 5 users with different roles (1 Admin, 1 Manager, 3 Developers)
- 5 sample vacancies

### Step 6: Start the Application

#### Development Mode (with hot-reload):
```bash
npm run start:dev
```

#### Production Mode:
```bash
npm run build
npm run start:prod
```

If everything is configured correctly, you will see in the terminal:

```
Application is running on: http://localhost:3000
Swagger documentation available at: http://localhost:3000/api/docs
```

---

## API Documentation

### Swagger UI

The complete and interactive documentation of all endpoints is available at:

**http://localhost:3000/api/docs**

From the Swagger interface you can:
- View all available endpoints organized by modules
- Check request and response schemas
- Test endpoints directly from the browser
- Authenticate with your JWT token and API Key
- See which roles have access to each endpoint

### Authentication in Swagger

1. Click the **"Authorize"** button
2. Enter:
   - **JWT-auth**: `Bearer <your_jwt_token>` (get the token by logging in)
   - **x-api-key**: `riwi-2024-secret-key-pro` (or your .env value)
3. Click **"Authorize"** and you're ready

---

## Test Credentials

After running the seeders (`npm run seed`), you can use these credentials to test the API:

### Users Table

| Name | Email | Password | Role |
|------|-------|----------|------|
| Angelica | angelica@riwi.com | Admin123! | Administrator |
| Gestor Riwi | gestor@riwi.com | Gestor123! | Manager |
| Juan Coder | juan@riwi.com | Coder123! | Developer |
| Maria Developer | maria@riwi.com | Coder123! | Developer |
| Carlos Dev | carlos@riwi.com | Coder123! | Developer |

### Login Example

Make a POST request to `http://localhost:3000/auth/login`:

```json
{
  "email": "angelica@riwi.com",
  "password": "Admin123!"
}
```

You will receive a JWT token that you must include in the `Authorization: Bearer <token>` header to access protected routes.

### Testing Different Roles

**Administrator (angelica@riwi.com)**
- Full access to all endpoints
- Can manage users, vacancies, and applications
- Access to all statistics

**Manager (gestor@riwi.com)**
- Can create and manage vacancies
- Can view and update applications
- Access to vacancy and application statistics

**Developer (juan@riwi.com, maria@riwi.com, carlos@riwi.com)**
- Can view public vacancies
- Can apply to vacancies (max 3 active applications)
- Can view their own applications only

---

## Roles and Permissions System

| Role | Permissions |
|-----|----------|
| **Administrator** | Full system access: user, vacancy, application and statistics management |
| **Manager** | Create and manage vacancies, consult applications, access statistics |
| **Developer** | Consult public vacancies, apply to offers (max. 3 active), view own applications |

---

## Testing

The project includes unit tests for all services.

### Run all tests:
```bash
npm run test
```

### Run tests with coverage:
```bash
npm run test:cov
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### E2E (End-to-End) Tests:
```bash
npm run test:e2e
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Starts the server in development mode with hot-reload |
| `npm run build` | Compiles the TypeScript project to JavaScript |
| `npm run start:prod` | Starts the server in production mode |
| `npm run seed` | Executes seeders to load test data |
| `npm run test` | Runs unit tests |
| `npm run test:cov` | Runs tests with coverage report |
| `npm run lint` | Checks code with ESLint |
| `npm run format` | Formats code with Prettier |

---

## Database Structure

### Main Tables

**users**
- Stores user information (name, email, hashed password, role)
- Relationship: One user can have many applications

**vacancies**
- Contains published vacancies (title, description, company, modality, slots)
- Relationship: One vacancy can have many applications

**applications**
- Records developer applications to vacancies
- Relationship: Belongs to one user and one vacancy
- States: pending, reviewed, accepted, rejected

### Relationships

```
users (1) ----< (N) applications (N) >---- (1) vacancies
```

---

## Common Troubleshooting

### Error: "Cannot find module..."
**Solution**: Run `npm install` again

### Error: "Connection refused" (PostgreSQL)
**Solution**: 
1. Verify that PostgreSQL is running
2. Check credentials in the `.env` file
3. Confirm that the `riwi_jobs` database exists

### Error: "Port 3000 is already in use"
**Solution**: 
1. Change the port in the `.env` file: `PORT=3001`
2. Or stop the process using port 3000

### Error in seeders
**Solution**: 
1. Delete existing data manually from the database
2. Run `npm run seed` again

---

## Author

**Angelica María Cuervo Marín**  
Clan Ubuntu - Riwi  
Advanced Backend Route

---

## Academic Project

This project was developed as part of the training program at **Riwi**, an organization focused on technological education and employability of young people in Colombia.

---

## License

This project is open source and available under the MIT license.

---

<div align="center">

**Developed by Angelica María Cuervo Marín**  
**Riwi - Clan Ubuntu**

</div>
