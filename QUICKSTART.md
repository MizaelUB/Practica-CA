# 🚀 Guía de Inicio Rápido - ERP Modular

## Primera vez - Instalación

```bash
# 1. Instalar todas las dependencias (puede tardar unos minutos)
npm run install:all
```

## Iniciar el Sistema

### Opción A: Usar el script batch (Windows)
```bash
# Ejecutar desde el explorador de archivos o terminal
start-all.bat
```

### Opción B: Usar npm (todos los servicios)
```bash
npm run start:all
```

### Opción C: Servicios individuales (múltiples terminales)
```bash
# Terminal 1 - Auth Service
npm run start:auth

# Terminal 2 - Admin Backend
npm run start:admin-back

# Terminal 3 - Admin Frontend  
npm run start:admin-front

# Terminal 4 - Finance Backend
npm run start:finance-back

# Terminal 5 - Finance Frontend
npm run start:finance-front

# Terminal 6 - Sales Backend
npm run start:sales-back

# Terminal 7 - Sales Frontend
npm run start:sales-front
```

## 🌐 Acceder a los Módulos

| Módulo | URL | Función |
|--------|-----|---------|
| Admin | http://localhost:5173 | Usuarios y permisos |
| Finance | http://localhost:5174 | Finanzas y reportes |
| Sales | http://localhost:5175 | Ventas y CRM |

## 🔑 Login Demo

```
Email: admin@erp.com
Contraseña: 123456
```

## 📋 Comandos Útiles

```bash
# Reinstalar todo
npm run install:all

# Solo auth service
npm run start:auth

# Solo módulo Admin (back + front)
npm run start:admin-back
npm run start:admin-front

# Solo módulo Finance
npm run start:finance-back
npm run start:finance-front

# Solo módulo Sales
npm run start:sales-back
npm run start:sales-front
```

## ⚠️ Importante

1. **El Auth Service debe iniciar primero** (puerto 3000)
2. **Todos los módulos comparten el mismo token** - puedes navegar entre ellos sin volver a loguearte
3. **Los permisos se configuran desde Admin** - define qué usuarios pueden acceder a cada módulo

## 🐛 Problemas Comunes

**Error: "Token no proveído"**
- Verifica que el Auth Service esté corriendo

**Error: "Puerto ya en uso"**
- Cierra otros procesos o cambia el puerto en `vite.config.ts`

**Error: "Database no encontrada"**
- Asegúrate de que `shared/db/erp_shared.sqlite` exista

---
Más información en [README.md](./README.md)
