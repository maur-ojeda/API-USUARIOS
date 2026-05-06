# API de Gestión de Usuarios

API REST desarrollada con NestJS para la gestión de usuarios, perfiles, direcciones y atributos personalizados.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecutar el Proyecto](#ejecutar-el-proyecto)
- [Documentación API](#documentación-api)
- [Endpoints Disponibles](#endpoints-disponibles)
- [Sistema de Roles](#sistema-de-roles)
- [Tests](#tests)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Licencia](#licencia)

---

## Características

- ✅ Autenticación JWT con Argon2
- ✅ CRUD completo de usuarios
- ✅ Perfiles de usuario
- ✅ Gestión de direcciones (múltiples por usuario)
- ✅ Atributos personalizados (JSONB)
- ✅ Sistema de roles (ADMIN, USER, EDITOR)
- ✅ Soft delete para usuarios
- ✅ Documentación Swagger/OpenAPI
- ✅ Tests unitarios

---

## Tecnologías

| Tecnología      | Versión |
| --------------- | ------- |
| NestJS          | 11.x    |
| TypeORM         | Latest  |
| PostgreSQL      | 15+     |
| Argon2          | Latest  |
| JWT             | Latest  |
| Swagger/OpenAPI | Latest  |

---

## Requisitos

- Node.js 20.x
- PostgreSQL 15+
- npm o yarn

---

## Instalación

```bash
# Instalar dependencias
npm install
```

---

## Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=api_usuarios
DB_PASSWORD=tu_password
DB_DATABASE=db_api_usuarios
DB_SCHEMA=db_api_usuarios

# JWT
JWT_SECRET=tu-secret-jwt-muy-seguro
JWT_EXPIRATION=7d

# App
PORT=3000
NODE_ENV=development

# Admin (para acceso futuro al panel)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### Base de Datos

1. Crear la base de datos:

```sql
CREATE DATABASE db_api_usuarios;
```

2. Crear el esquema:

```sql
\c db_api_usuarios;
CREATE SCHEMA db_api_usuarios;
```

---

## Ejecutar el Proyecto

```bash
# Desarrollo (con hot-reload)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

---

## Documentación API

Una vez iniciado el servidor, acceder a:

| Recurso    | URL                       |
| ---------- | ------------------------- |
| Swagger UI | http://localhost:3000/api |

---

## Endpoints Disponibles

### Autenticación

| Método | Endpoint         | Descripción             |
| ------ | ---------------- | ----------------------- |
| POST   | `/auth/register` | Registrar nuevo usuario |
| POST   | `/auth/login`    | Iniciar sesión          |

### Usuarios

| Método | Endpoint             | Descripción                    |
| ------ | -------------------- | ------------------------------ |
| GET    | `/users`             | Listar todos los usuarios      |
| GET    | `/users/:id`         | Obtener usuario por ID         |
| PATCH  | `/users/:id`         | Actualizar usuario             |
| DELETE | `/users/:id`         | Eliminar usuario (soft delete) |
| PATCH  | `/users/:id/restore` | Restaurar usuario eliminado    |

### Roles

| Método | Endpoint     | Descripción            |
| ------ | ------------ | ---------------------- |
| GET    | `/roles`     | Listar todos los roles |
| GET    | `/roles/:id` | Obtener rol por ID     |

### Perfiles

| Método | Endpoint            | Descripción               |
| ------ | ------------------- | ------------------------- |
| GET    | `/profiles/:userId` | Obtener perfil de usuario |
| PATCH  | `/profiles/:userId` | Actualizar perfil         |

### Direcciones

| Método | Endpoint                  | Descripción                   |
| ------ | ------------------------- | ----------------------------- |
| GET    | `/addresses/user/:userId` | Listar direcciones de usuario |
| POST   | `/addresses/user/:userId` | Crear dirección               |
| PATCH  | `/addresses/:id`          | Actualizar dirección          |
| DELETE | `/addresses/:id`          | Eliminar dirección            |

### Atributos de Usuario

| Método | Endpoint                               | Descripción                    |
| ------ | -------------------------------------- | ------------------------------ |
| GET    | `/user-attributes/:userId`             | Obtener atributos              |
| PATCH  | `/user-attributes/:userId`             | Actualizar atributos           |
| PATCH  | `/user-attributes/:userId/custom-data` | Actualizar custom_data (JSONB) |

### Admin (requiere rol ADMIN)

| Método | Endpoint                | Descripción            |
| ------ | ----------------------- | ---------------------- |
| GET    | `/admin/users`          | Listar usuarios        |
| GET    | `/admin/users/:id`      | Obtener usuario        |
| POST   | `/admin/users`          | Crear usuario          |
| PATCH  | `/admin/users/:id`      | Actualizar usuario     |
| DELETE | `/admin/users/:id`      | Eliminar usuario       |
| PATCH  | `/admin/users/:id/role` | Cambiar rol de usuario |
| GET    | `/admin/roles`          | Listar roles           |

---

## Sistema de Roles

| ID  | Nombre | Descripción                              |
| --- | ------ | ---------------------------------------- |
| 1   | ADMIN  | Administrador con acceso completo        |
| 2   | USER   | Usuario regular con acceso básico        |
| 3   | EDITOR | Editor con acceso a gestión de contenido |

### Regla de Registro

- El **primer usuario** registrado en el sistema se crea automáticamente con rol **ADMIN**
- Los usuarios subsiguientes se crean con rol **USER**

---

## Tests

```bash
# Ejecutar tests unitarios
npm run test

# Tests con coverage
npm run test:cov

# Tests en modo watch
npm run test:watch
```

---

## Estructura del Proyecto

```
src/
├── config/                 # Configuración
├── common/
│   ├── decorators/         # Decoradores personalizados
│   ├── guards/            # Guards (RolesGuard)
│   └── interceptors/      # Interceptores (Audit)
├── entities/               # Entidades TypeORM
│   ├── user.entity.ts
│   ├── role.entity.ts
│   ├── profile.entity.ts
│   ├── address.entity.ts
│   ├── user-attribute.entity.ts
│   └── audit-log.entity.ts
├── modules/
│   ├── auth/              # Autenticación
│   ├── users/             # Gestión de usuarios
│   ├── roles/             # Gestión de roles
│   ├── profiles/          # Perfiles de usuario
│   ├── addresses/         # Direcciones
│   ├── user-attributes/   # Atributos personalizados
│   ├── audit-logs/       # Logs de auditoría
│   └── admin/             # Endpoints de administración
├── app.module.ts
├── main.ts
└── app.controller.ts
```

---

## Licencia

MIT License

---

## Autor

Desarrollado con ❤️ usando NestJS
