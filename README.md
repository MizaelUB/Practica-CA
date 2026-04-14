# ERP Modular - Sistema de Gestión Multi-Proyecto

Este es un sistema ERP **modular** dividido en 3 proyectos independientes que comparten autenticación y base de datos.

## 🏗️ Arquitectura

```
Practica-CA/
├── shared/                     # Recursos compartidos
│   ├── auth-service/           # Servicio de autenticación (Puerto 3000)
│   └── db/erp_shared.sqlite    # Base de datos compartida
│
├── admin/                      # Módulo de Administración
│   ├── front/                  # React (Puerto 5173)
│   └── back/                   # Express API (Puerto 3001)
│
├── finance/                    # Módulo de Finanzas
│   ├── front/                  # React (Puerto 5174)
│   └── back/                   # Express API (Puerto 3002)
│
└── sales/                      # Módulo de Ventas
    ├── front/                  # React (Puerto 5175)
    └── back/                   # Express API (Puerto 3003)
```

## 🔐 Autenticación Compartida

Todos los proyectos utilizan el **mismo token JWT** emitido por el `auth-service`. La clave secreta es compartida entre todos los backends para validar tokens.

### JWT Secret Compartida

```javascript
const JWT_SECRET = "super_secret_jwt_key_for_erp_modules";
```

## 📦 Instalación

### 1. Instalar todas las dependencias

```bash
# Desde la raíz del proyecto
npm run install:all
```

### 2. O instalar manualmente cada proyecto

```bash
cd shared/auth-service && npm install
cd admin/back && npm install
cd admin/front && npm install
cd finance/back && npm install
cd finance/front && npm install
cd sales/back && npm install
cd sales/front && npm install
```

## 🚀 Cómo Iniciar

### Opción 1: Iniciar todo simultáneamente

```bash
npm run start:all
```

### Opción 2: Iniciar servicios individualmente

**Terminal 1 - Auth Service:**

```bash
npm run start:auth
```

**Terminal 2 - Admin Backend:**

```bash
npm run start:admin-back
```

**Terminal 3 - Admin Frontend:**

```bash
npm run start:admin-front
```

**Terminal 4 - Finance Backend:**

```bash
npm run start:finance-back
```

**Terminal 5 - Finance Frontend:**

```bash
npm run start:finance-front
```

**Terminal 6 - Sales Backend:**

```bash
npm run start:sales-back
```

**Terminal 7 - Sales Frontend:**

```bash
npm run start:sales-front
```

## 🌐 Accesos

| Módulo      | Frontend              | Backend               | Descripción                    |
| ----------- | --------------------- | --------------------- | ------------------------------ |
| **Auth**    | -                     | http://localhost:3000 | Servicio de autenticación      |
| **Admin**   | http://localhost:5173 | http://localhost:3001 | Gestión de usuarios y permisos |
| **Finance** | http://localhost:5174 | http://localhost:3002 | Reportes financieros           |
| **Sales**   | http://localhost:5175 | http://localhost:3003 | Ventas, productos y CRM        |

## 🔑 Cuentas de Acceso

| Usuario           | Email           | Contraseña | Módulos Accesibles              |
| ----------------- | --------------- | ---------- | ------------------------------- |
| **Admin**         | admin@erp.com   | 123456     | Admin, Finanzas, Ventas (todos) |
| Ana (Básico)      | ana@test.com    | 123456     | Ventas                          |
| Luis (Avanzado)   | luis@test.com   | 123456     | Finanzas, Ventas                |
| Carlos (Completo) | carlos@test.com | 123456     | Admin, Finanzas, Ventas (todos) |

## 🛡️ Sistema de Control de Acceso

El sistema ahora cuenta con **control de acceso por módulo**. Cada usuario puede tener acceso a:

- **Admin** - Administración de usuarios y permisos
- **Finanzas** - Reportes financieros y facturación
- **Ventas** - Gestión de productos y CRM

### Gestión de Usuarios y Módulos

Desde el módulo **Admin** puedes:

1. **Crear nuevos usuarios** - Define nombre, email, contraseña, rol y módulos accesibles
2. **Modificar roles** - Cambia el plan (basic, advanced, complete, admin)
3. **Gestionar módulos** - Activa/desactiva el acceso a cada módulo por usuario
4. **Eliminar usuarios** - Remueve usuarios del sistema

### Permisos por Plan

El sistema mantiene los planes tradicionales para funcionalidades específicas:

- `dashboard` - Acceso al panel principal
- `crm` - Gestión de clientes
- `sales` - Gestión de productos y ventas
- `reports` - Reportes financieros
- `settings` - Configuración
- `admin` - Administración de usuarios
- `finance` - Módulo financiero

### Flujo de Autenticación y Sesión Compartida

1. El usuario se loguea en cualquier frontend → `/api/auth/login`
2. El **Auth Service** valida credenciales y emite JWT con `moduleAccess`
3. El token se guarda en `localStorage` como `erp_token`
4. **La sesión se comparte entre pestañas** - Si te logueas en Admin, la sesión está disponible en Finance y Sales
5. Cada backend valida el token y verifica acceso al módulo
6. Si el usuario no tiene acceso, ve una pantalla de "Acceso Denegado"

## 🗄️ Base de Datos

Ubicación: `shared/db/erp_shared.sqlite`

### Tablas:

- `users` - Usuarios del sistema
- `plans` - Planes y permisos
- `user_module_access` - Acceso de usuarios a módulos (nueva)
- `products` - Productos (módulo Ventas)
- `customers` - Clientes (módulo CRM)
- `invoices` - Facturas (módulo Finanzas)
- `financial_reports` - Reportes financieros

### Resetear la Base de Datos

Si necesitas reiniciar la base de datos con el schema actualizado:

```bash
npm run reset:db
```

Esto creará un backup y reiniciará la base de datos con los datos de ejemplo.

## 📝 Notas Importantes

1. **El Auth Service debe estar corriendo primero** antes de acceder a cualquier módulo
2. **El token es compartido** - puedes loguearte en Admin y usar el mismo token en Finance y Sales
3. **La sesión se sincroniza entre pestañas** - Si te logueas en una pestaña, automáticamente se refleja en las demás
4. **Los módulos se configuran desde Admin** - un usuario puede tener acceso limitado a ciertos módulos
5. **La base de datos es única** - todos los módulos comparten los mismos datos
6. **Para aplicar los cambios de schema** - ejecuta `npm run reset:db`

## 🔧 Desarrollo

Cada módulo es independiente y puede ser desarrollado/desplegado por separado. La única dependencia común es:

- Auth Service (para validar tokens)
- Base de datos compartida

---

**Desarrollado como práctica de arquitectura modular y Control de Acceso (RBAC)**
