# API-USUARIOS

**Identity & Access Management System** — A robust identity management, profiling, and audit system for SaaS platforms, built with Clean Architecture principles on NestJS.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS 11 (TypeScript) |
| ORM | TypeORM (Data Mapper pattern) |
| Database | PostgreSQL 15+ |
| Authentication | JWT + Argon2 |
| Admin Dashboard | AdminJS |
| API Docs | Swagger / OpenAPI |
| Auth Strategies | PassportJS |
| Validation | class-validator + class-transformer |

## Features

- **User registration** with simultaneous Profile + UserAttributes creation
- **Multi-address management** — billing, shipping, home with ISO country codes
- **Role-Based Access Control (RBAC)** — custom NestJS Guards (`RolesGuard`)
- **AdminJS dashboard** at `/admin` (role-protected)
- **Dynamic JSONB attributes** for extensible user data (`preferences`, `custom_data`)
- **Automatic audit logging** interceptor for all admin mutations
- **Soft delete** — users are deactivated, never hard-deleted
- **Swagger UI** at `/api`

## Architecture

```
src/
├── modules/
│   ├── users/              # User CRUD & management
│   ├── auth/               # JWT authentication + Argon2 hashing
│   ├── profiles/           # User profile management
│   ├── addresses/          # Multi-address support
│   ├── roles/              # Role management (ADMIN, USER, EDITOR)
│   ├── admin/              # Admin endpoints (role-protected)
│   ├── adminjs/            # AdminJS dashboard integration
│   ├── audit-logs/         # Automatic audit trail
│   └── user-attributes/    # Dynamic JSONB attributes
├── common/
│   ├── decorators/         # @Roles() decorator
│   ├── guards/             # RolesGuard
│   └── interceptors/       # Audit interceptor
├── config/                 # TypeORM configuration
├── entities/               # TypeORM entities
│   ├── user.entity.ts
│   ├── role.entity.ts
│   ├── profile.entity.ts
│   ├── address.entity.ts
│   ├── user-attribute.entity.ts
│   └── audit-log.entity.ts
├── app.module.ts
└── main.ts
```

## Data Model

```
┌─────────────┐     ┌─────────────┐
│    roles     │     │    users     │
├─────────────┤     ├─────────────┤
│ id (PK)     │◀────│ role_id (FK) │
│ name        │     │ id (UUID PK) │
│ description │     │ email (UQ)   │
└─────────────┘     │ password_hash│
                    │ is_active    │
                    │ created_at   │
                    │ deleted_at   │
                    └──────┬───────┘
                           │ 1:1
              ┌────────────┼──────────────┐
              │            │              │
    ┌─────────┴──┐  ┌─────┴──────┐  ┌────┴─────────────┐
    │  profiles   │  │  addresses  │  │ user_attributes  │
    ├────────────┤  ├─────────────┤  ├─────────────────┤
    │ id (UUID) │  │ id (UUID)   │  │ id (UUID)       │
    │ user_id   │  │ user_id     │  │ user_id         │
    │ first_name│  │ type        │  │ preferences(↑)  │
    │ last_name │  │ street      │  │ custom_data(↑)  │
    │ phone     │  │ city        │  │ updated_at      │
    │ avatar_url│  │ state       │  └─────────────────┘
    └────────────┘  │ zip_code    │        ↑ JSONB
                    │ country(ISO)│
                    │ is_main     │
                    └─────────────┘
                           │
                    ┌──────┴───────┐
                    │  audit_logs  │
                    ├──────────────┤
                    │ id (UUID)    │
                    │ admin_id(FK) │
                    │ action       │
                    │ target_user  │
                    │ details(↑)   │
                    │ created_at   │
                    └──────────────┘
                           ↑ JSONB
```

## Security Layers

1. **Argon2** password hashing (memory-hard, resistant to GPU attacks)
2. **JWT** token-based API authentication (PassportJS strategy)
3. **RBAC** with custom `RolesGuard` decorator (`@Roles()`)
4. **DTO strict validation** via `class-validator` on all inputs
5. **Automatic audit trail** — all admin mutations logged with diffs

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your database and JWT credentials
```

### Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=api_usuarios
DB_PASSWORD=your_password
DB_DATABASE=db_api_usuarios
DB_SCHEMA=db_api_usuarios

JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=7d

PORT=3000
NODE_ENV=development
```

### Database

```sql
CREATE DATABASE db_api_usuarios;
\c db_api_usuarios;
CREATE SCHEMA db_api_usuarios;
```

## Running

```bash
npm run start:dev
```

| Command | Description |
|---------|------------|
| `npm run start:dev` | Dev server with hot-reload |
| `npm run build` | Production build |
| `npm run start:prod` | Run production build |
| `npm run test` | Unit tests |
| `npm run test:cov` | Coverage report |
| `npm run lint` | ESLint check |

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | `/auth/register` | Register user (creates Profile + UserAttributes) |
| POST | `/auth/login` | Login, returns JWT |

### Users

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/users` | List all users |
| GET | `/users/:id` | Get user by ID |
| PATCH | `/users/:id` | Update user |
| DELETE | `/users/:id` | Soft delete |
| PATCH | `/users/:id/restore` | Restore soft-deleted user |

### Profiles

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/profiles/:userId` | Get user profile |
| PATCH | `/profiles/:userId` | Update profile |

### Addresses

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/addresses/user/:userId` | List user addresses |
| POST | `/addresses/user/:userId` | Create address |
| PATCH | `/addresses/:id` | Update address |
| DELETE | `/addresses/:id` | Delete address |

### User Attributes

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/user-attributes/:userId` | Get attributes |
| PATCH | `/user-attributes/:userId` | Update attributes |
| PATCH | `/user-attributes/:userId/custom-data` | Update custom JSONB data |

### Roles

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/roles` | List all roles |
| GET | `/roles/:id` | Get role by ID |

### Admin (requires ADMIN role)

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/admin/users` | List users |
| GET | `/admin/users/:id` | Get user |
| POST | `/admin/users` | Create user |
| PATCH | `/admin/users/:id` | Update user |
| DELETE | `/admin/users/:id` | Delete user |
| PATCH | `/admin/users/:id/role` | Change user role |
| GET | `/admin/roles` | List roles |

## Role System

| ID | Role | Description |
|----|------|------------|
| 1 | ADMIN | Full access — admin endpoints + dashboard |
| 2 | USER | Standard access — own data only |
| 3 | EDITOR | Content management access |

The **first registered user** is automatically assigned the **ADMIN** role. Subsequent users get **USER**.

## Testing

```bash
npm run test          # Unit tests
npm run test:cov      # Coverage
npm run test:watch    # Watch mode
npm run test:e2e      # E2E tests
```

## Documentation

| Resource | URL |
|----------|-----|
| Swagger UI | `http://localhost:3000/api` |
| Postman Collection | `postman/collection.json` |
| DBML Schema | `db-api-users.DBML` |

## License

UNLICENSED — Private project.