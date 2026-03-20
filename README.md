# ERP AdminPro - Sistema de Gestión Full-Stack

Este es un sistema ERP completo desarrollado con **React (Vite)** en el frontend y **Node.js (Express) + SQLite** en el backend. Cuenta con un sistema de diseño profesional inspirado en "AdminPro" y un motor de permisos dinámicos (RBAC).

## 🚀 Cómo Iniciar el Proyecto

Para ejecutar tanto el servidor (Backend) como la interfaz (Frontend) de forma simultánea, utiliza el siguiente comando en la terminal:

```bash
npm run start:erp
```

> **Nota:** Asegúrate de haber ejecutado `npm install` previamente para instalar todas las dependencias necesarias.

## 🔐 Cuentas de Acceso (Demo)

El sistema viene pre-configurado con las siguientes cuentas para pruebas:

### Administrador (Acceso Total)
- **Usuario:** `admin@erp.com`
- **Contraseña:** `123456`

### Usuarios de Prueba
- **Plan Básico:** `ana@test.com` / `123456`
- **Plan Avanzado:** `luis@test.com` / `123456`
- **Plan Completo:** `carlos@test.com` / `123456`

## 🛠️ Características Principales

1. **Dashboard Analytical:** Resumen visual con tarjetas de métricas e indicadores.
2. **Control de Acceso Dinámico:** El Administrador puede configurar qué módulos ve cada plan desde el panel `/admin`.
3. **5 Módulos Integrados:**
   - **Inventario:** Gestión de productos.
   - **Clientes (CRM):** Directorio de empresas y contactos.
   - **Ventas:** Listado de transacciones y KPIs de ventas.
   - **Reportes:** Gráficos de crecimiento y adquisición.
   - **Configuración:** Ajustes generales de la empresa.
4. **Gestión de Suscripción:** Los usuarios pueden realizar *Upgrade* de su plan desde su perfil.
5. **Base de Datos Persistente:** Uso de SQLite para almacenamiento local de datos.

---
Desarrollado como práctica de arquitectura Full-Stack y Control de Acceso.
