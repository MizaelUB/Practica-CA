# 🏗️ Arquitectura del Sistema ERP Modular

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENTE / NAVEGADOR                              │
│  (Misma sesión compartida entre los 3 módulos frontend)                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
        │  ADMIN FRONT    │ │ FINANCE FRONT   │ │  SALES FRONT    │
        │  Puerto 5173    │ │ Puerto 5174     │ │  Puerto 5175    │
        │  React + Vite   │ │ React + Vite    │ │  React + Vite   │
        └────────┬────────┘ └────────┬────────┘ └────────┬────────┘
                 │                   │                   │
                 │ Proxy /api/auth   │ Proxy /api/auth   │ Proxy /api/auth
                 │ Proxy /api/admin  │ Proxy /api/finance│ Proxy /api/sales
                 │                   │                   │
                 ▼                   ▼                   ▼
        ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
        │  ADMIN BACK     │ │ FINANCE BACK    │ │  SALES BACK     │
        │  Puerto 3001    │ │ Puerto 3002     │ │  Puerto 3003    │
        │  Express API    │ │ Express API     │ │  Express API    │
        └────────┬────────┘ └────────┬────────┘ └────────┬────────┘
                 │                   │                   │
                 └───────────────────┼───────────────────┘
                                     │
                                     ▼
                          ┌───────────────────┐
                          │   AUTH SERVICE    │
                          │   Puerto 3000     │
                          │   Express API     │
                          │   JWT Validation  │
                          └─────────┬─────────┘
                                    │
                                    ▼
                          ┌───────────────────┐
                          │  BASE DE DATOS    │
                          │  SQLite Compartida│
                          │  erp_shared.sqlite│
                          └───────────────────┘
```

## Flujo de Autenticación

```
1. Login en cualquier frontend
         │
         ▼
2. POST /api/auth/login → Auth Service (3000)
         │
         ▼
3. Valida credenciales en DB
         │
         ▼
4. Genera JWT con secret compartida
         │
         ▼
5. Retorna token + usuario + permisos
         │
         ▼
6. Frontend guarda token en localStorage
         │
         ▼
7. Todas las peticiones incluyen: Authorization: Bearer <token>
         │
         ▼
8. Cada backend valida el token con la MISMA JWT_SECRET
         │
         ▼
9. Verifica permisos específicos del endpoint
         │
         ▼
10. Permite/deniega acceso
```

## Estructura de Directorios

```
Practica-CA/
│
├── shared/                         # Recursos compartidos
│   ├── auth-service/               # Servicio central de autenticación
│   │   ├── index.js                # Express server + rutas auth
│   │   ├── package.json
│   │   └── ...
│   └── db/
│       ├── database.js             # Configuración y seed de DB
│       └── erp_shared.sqlite       # Base de datos única
│
├── admin/                          # Módulo de Administración
│   ├── back/
│   │   ├── index.js                # API de gestión de usuarios
│   │   └── package.json
│   └── front/
│       ├── src/
│       │   ├── App.tsx
│       │   ├── pages/
│       │   │   ├── Login.tsx
│       │   │   └── Dashboard.tsx   # Gestión usuarios + permisos
│       │   └── context/
│       │       └── AuthContext.tsx
│       └── package.json
│
├── finance/                        # Módulo de Finanzas
│   ├── back/
│   │   ├── index.js                # API financiera
│   │   └── package.json
│   └── front/
│       ├── src/
│       │   ├── App.tsx
│       │   ├── pages/
│       │   │   ├── Login.tsx
│       │   │   └── Dashboard.tsx   # Facturas + reportes
│       │   └── context/
│       │       └── AuthContext.tsx
│       └── package.json
│
├── sales/                          # Módulo de Ventas
│   ├── back/
│   │   ├── index.js                # API de ventas/CRM
│   │   └── package.json
│   └── front/
│       ├── src/
│       │   ├── App.tsx
│       │   ├── pages/
│       │   │   ├── Login.tsx
│       │   │   └── Dashboard.tsx   # Productos + clientes
│       │   └── context/
│       │       └── AuthContext.tsx
│       └── package.json
│
├── package.json                    # Scripts globales
├── start-all.bat                   # Script inicio Windows
├── README.md                       # Documentación completa
└── QUICKSTART.md                   # Guía rápida
```

## Puertos Utilizados

| Servicio         | Puerto | Tipo     |
| ---------------- | ------ | -------- |
| Auth Service     | 3000   | Backend  |
| Admin Backend    | 3001   | Backend  |
| Admin Frontend   | 5173   | Frontend |
| Finance Backend  | 3002   | Backend  |
| Finance Frontend | 5174   | Frontend |
| Sales Backend    | 3003   | Backend  |
| Sales Frontend   | 5175   | Frontend |

## Endpoints API

### Auth Service (3000)

```
POST   /api/auth/login       - Iniciar sesión
POST   /api/auth/register    - Registrar usuario (con módulo: sales o finance)
PUT    /api/auth/register/plan - Seleccionar plan después del registro
GET    /api/auth/plans       - Obtener planes disponibles
GET    /api/auth/me          - Obtener usuario actual
POST   /api/auth/validate    - Validar token
```

### Admin Backend (3001)

```
GET    /api/admin/users           - Listar usuarios
POST   /api/admin/users           - Crear usuario
PUT    /api/admin/users/:id/role  - Cambiar rol
PUT    /api/admin/users/:id/modules - Cambiar módulos
DELETE /api/admin/users/:id       - Eliminar usuario
GET    /api/admin/stats           - Estadísticas
```

**Nota:** La gestión de usuarios solo está disponible en el módulo Admin. Los módulos Finance y Sales permiten registro de nuevos usuarios.

### Finance Backend (3002)

```
GET    /api/finance/invoices          - Listar facturas
GET    /api/finance/summary           - Resumen financiero
GET    /api/finance/monthly-revenue   - Ingresos mensuales
POST   /api/finance/invoices          - Crear factura
PUT    /api/finance/invoices/:id      - Actualizar factura
DELETE /api/finance/invoices/:id      - Eliminar factura
GET    /api/finance/customers         - Listar clientes
```

### Sales Backend (3003)

```
GET    /api/sales/products        - Listar productos
POST   /api/sales/products        - Crear producto
PUT    /api/sales/products/:id    - Actualizar producto
DELETE /api/sales/products/:id    - Eliminar producto
GET    /api/sales/customers       - Listar clientes
POST   /api/sales/customers       - Crear cliente
PUT    /api/sales/customers/:id   - Actualizar cliente
DELETE /api/sales/customers/:id   - Eliminar cliente
GET    /api/sales/stats           - Estadísticas
```

## Seguridad

### JWT Token Structure

```javascript
{
  "id": 1,
  "name": "Admin",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234567890 + 7200  // 2 horas
}
```

### JWT Secret Compartida

```javascript
const JWT_SECRET = "super_secret_jwt_key_for_erp_modules";
// Esta constante está en TODOS los backends
```

### Middleware de Autenticación

```javascript
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
};
```

## Base de Datos - Tablas

### users

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'basic'  -- basic, advanced, complete, admin
);
```

### user_module_access

```sql
CREATE TABLE user_module_access (
  user_id INTEGER,
  module TEXT,  -- admin, finance, sales
  PRIMARY KEY (user_id, module),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
```

**Nota:** Los roles (basic, advanced, complete, admin) definen el nivel de acceso del usuario. La tabla `user_module_access` controla a qué módulos puede acceder cada usuario.

---

**Nota:** Todos los módulos son independientes pero comparten autenticación y datos.
Puedes desplegar cada módulo por separado manteniendo el Auth Service y DB compartidos.
