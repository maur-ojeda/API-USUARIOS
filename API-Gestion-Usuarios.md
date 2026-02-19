

## 1. Visión General

Sistema robusto de gestión de identidades, perfiles y auditoría para plataformas SaaS, diseñado bajo principios de **Clean Architecture** y **Semántica de Datos**. Soporta múltiples direcciones, roles dinámicos y un panel administrativo protegido.

---

## 2. Modelo de Datos (DBML)


Fragmento de código

```
// AuthService v2.5 - Final Schema

Table users {
  id uuid [pk, default: `uuid_generate_v4()`]
  email varchar(255) [unique, not null]
  password_hash varchar(255) [not null]
  role_id integer [not null]
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  deleted_at timestamp [note: 'Soft delete']
}

Table roles {
  id integer [pk, increment]
  name varchar(50) [unique, not null, note: 'ADMIN, USER, EDITOR']
  description text
}

Table profiles {
  id uuid [pk]
  user_id uuid [unique, not null]
  first_name varchar(100)
  last_name varchar(100)
  phone varchar(20)
  avatar_url varchar(255)
}

Table addresses {
  id uuid [pk]
  user_id uuid [not null]
  type varchar(20) [note: 'billing, shipping, home']
  street varchar(255)
  city varchar(100)
  state varchar(100)
  zip_code varchar(20)
  country_code varchar(3) [note: 'ISO 3166-1 alpha-3']
  is_main boolean [default: true]
}

Table user_attributes {
  id uuid [pk]
  user_id uuid [unique, not null]
  preferences jsonb [note: 'UI Theme, Language, Notifications']
  custom_data jsonb [note: 'Dynamic N-data: experimental fields or legacy tags']
  updated_at timestamp [default: `now()`]
}

Table audit_logs {
  id uuid [pk]
  admin_id uuid [not null]
  action varchar(50) [not null, note: 'CREATE_USER, DELETE_USER, CHANGE_ROLE']
  target_user_id uuid
  details jsonb [note: 'Diff of old and new values']
  created_at timestamp [default: `now()`]
}

// Relaciones
Ref: roles.id < users.role_id
Ref: users.id - profiles.user_id [update: cascade, delete: cascade]
Ref: users.id < addresses.user_id [update: cascade, delete: cascade]
Ref: users.id - user_attributes.user_id [update: cascade, delete: cascade]
Ref: users.id < audit_logs.admin_id
```

---

## 3. Especificaciones Técnicas

### **Stack Tecnológica**

- **Backend:** NestJS (Node.js) con TypeScript.
    
- **Base de Datos:** PostgreSQL 16+.
    
- **ORM:** TypeORM con patrón Data Mapper.
    
- **Auth:** JWT para API y Session-based para AdminJS.
    
- **Admin Panel:** AdminJS (con login protegido por rol `ADMIN`).
    

### **Capas de Seguridad**

1. **Hashing:** Argon2 para almacenamiento de contraseñas.
    
2. **RBAC:** Guards personalizados en NestJS para restringir rutas según el `role_id`.
    
3. **Sanitización:** DTOs estrictos para evitar inyección de campos no deseados en los JSONB.
    
4. **Auditoría:** Interceptores automáticos que registran toda mutación de datos (`POST`, `PATCH`, `DELETE`).
    

---

## 4. Historias de Usuario (HU) Actualizadas

|**ID**|**Historia**|**Criterio de Aceptación**|
|---|---|---|
|**HU 01**|**Registro Flexible**|El sistema crea un `User`, un `Profile` y una entrada en `UserAttributes` simultáneamente.|
|**HU 02**|**Gestión Geográfica**|Un usuario puede tener múltiples direcciones (ej. Facturación y Envío).|
|**HU 03**|**Admin Dashboard**|Panel en `/admin` accesible solo para `role_id: 1` con MFA opcional.|
|**HU 04**|**Datos Dinámicos**|El endpoint `PATCH /attributes` permite guardar cualquier JSON válido en `custom_data`.|
|**HU 05**|**Trazabilidad**|Cada cambio realizado desde el Dashboard genera un registro en `audit_logs`.|

---

## 5. Roadmap de Implementación

### **M0: Setup & Core **

- Estructura modular: `UsersModule`, `AuthModule`, `CommonModule`.
    
- Configuración de Docker (Postgres + pgAdmin).
    
- Implementación de Entidades y Migraciones basadas en el DBML.
    

### **M1: Identidad & Perfiles **

- Registro con Hash de contraseña.
    
- Servicios de Perfil y Direcciones (CRUD).
    
- Validación de esquemas JSON para `user_attributes`.
    

### **M2: Seguridad & Admin **

- Integración de AdminJS.
    
- Lógica de login para el Dashboard (Cookie Session).
    
- Implementación de RolesGuard.
    

### **M3: Observabilidad & CI/CD **

- Interceptor de Auditoría.
    
- Documentación Swagger completa.
    
- Pipeline de GitHub Actions (Lint -> Test -> Build).