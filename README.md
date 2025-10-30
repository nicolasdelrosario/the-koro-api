# The Koro API – E‑commerce Backend with NestJS

A Node.js (NestJS) API for managing authentication, products, categories, reviews, and orders with PostgreSQL. Built with clean modular architecture, robust validation, role-based authorization, and first-class OpenAPI docs (Swagger UI + Scalar).

## ✨ Features

- Authentication with JWT and roles (user, admin)
- Role-based authorization guards and decorators
- Products, Categories, Reviews CRUD
- Orders with transactional stock updates and status transitions
- DTO validation with Class Validator + global ValidationPipe (whitelist, transform)
- OpenAPI docs via @nestjs/swagger and Scalar (@scalar/nestjs-api-reference)
- Health checks with @nestjs/terminus
- Migrations via TypeORM


## ⚙️ Prerequisites

- Node.js v18 or higher
- PostgreSQL running and reachable
- npm or pnpm installed

> [!NOTE] 
> This app reads environment variables from .env. See the example below and copy it from .env.example.


## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/nicolasdelrosario/the-koro-api
cd the-koro-api
```

Install dependencies:

```bash
npm install
```

Configure environment variables:

```bash
cp .env.example .env
```

Edit .env and set:

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/the_koro_api
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=3600
NODE_ENV=development
```

## 🗃️ Database & Migrations

Apply migrations before starting:

```bash
npm run migration:run
```

Useful commands:

```bash
npm run migration:generate -- <name> – generate a migration
npm run migration:run – run migrations
npm run migration-revert – revert last migration
npm run db:drop – drop schema
```

## 🧪 Development

Start the dev server with watch:

```bash
npm run start:dev
```

Server runs on:

```bash
http://localhost:3000
```

Global API prefix:

```bash
http://localhost:3000/api/v1
```

## 📘 API Docs (OpenAPI)

Interactive docs:

Scalar UI: `http://localhost:3000/docs`

Swagger UI: `http://localhost:3000/api`

OpenAPI JSON: `http://localhost:3000/api-json`


Auth:

Bearer token: `Authorization: Bearer <token>`


> [!NOTE] 
> Endpoints are organized under tags: Auth, Products, Categories, Reviews, Orders, Health. Use the docs above to explore and try requests.


## 🧱 Project Structure

- src/auth – register, login, profile; JWT guard; local strategy; roles guard
- src/products – products CRUD
- src/categories – categories CRUD
- src/reviews – user reviews (create), admin update/delete
- src/orders – order creation, stock updates, admin management
- src/health – service/database health
- db – TypeORM data source and migrations

## 📜 Scripts

- npm run format – format with Biome
- npm run lint – lint with Biome
- npm run check – Biome checks and safe fixes
- npm run build – build to dist
- npm run start – start prod server
- npm run start:dev – start dev server (watch)


## 🩺 Health

Health check endpoint (Scalar/Swagger docs include details):

```bash
http://localhost:3000/api/v1/health
```

Returns OK if service and DB are healthy; reports 503 when not.

## 🔒 Authorization

- Public endpoints use @Public() decorator (e.g., register , login , health, public GETs).
- Protected endpoints require Bearer token.
- Admin-only endpoints enforce @Roles(Role.ADMIN) (e.g., products/categories create/update/delete, orders management beyond creation).

> [!TIP]
> Use the Scalar UI at /docs to see which endpoints require auth, their expected payloads, and standardized error responses.


## 🧑‍💻 Author

Developed by [Nicolas Del Rosario](https://github.com/nicolasdelrosario)

## 📜 License

MIT