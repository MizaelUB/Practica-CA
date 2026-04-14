@echo off
echo ========================================
echo   ERP Modular - Iniciando todos los servicios
echo ========================================
echo.

echo [1/7] Iniciando Auth Service (Puerto 3000)...
start "Auth Service" cmd /k "cd shared\auth-service ^&^& npm start"
timeout /t 2 /nobreak >nul

echo [2/7] Iniciando Admin Backend (Puerto 3001)...
start "Admin Backend" cmd /k "cd admin\back ^&^& npm start"
timeout /t 2 /nobreak >nul

echo [3/7] Iniciando Admin Frontend (Puerto 5173)...
start "Admin Frontend" cmd /k "cd admin\front ^&^& npm run dev"
timeout /t 2 /nobreak >nul

echo [4/7] Iniciando Finance Backend (Puerto 3002)...
start "Finance Backend" cmd /k "cd finance\back ^&^& npm start"
timeout /t 2 /nobreak >nul

echo [5/7] Iniciando Finance Frontend (Puerto 5174)...
start "Finance Frontend" cmd /k "cd finance\front ^&^& npm run dev"
timeout /t 2 /nobreak >nul

echo [6/7] Iniciando Sales Backend (Puerto 3003)...
start "Sales Backend" cmd /k "cd sales\back ^&^& npm start"
timeout /t 2 /nobreak >nul

echo [7/7] Iniciando Sales Frontend (Puerto 5175)...
start "Sales Frontend" cmd /k "cd sales\front ^&^& npm run dev"

echo.
echo ========================================
echo   Todos los servicios estan corriendo!
echo ========================================
echo.
echo Accesos:
echo   - Admin:   http://localhost:5173
echo   - Finance: http://localhost:5174
echo   - Sales:   http://localhost:5175
echo.
echo Usuario demo: admin@erp.com / 123456
echo ========================================
