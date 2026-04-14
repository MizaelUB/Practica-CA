// Script para resetear la base de datos
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'erp_shared.sqlite');

// Backup existing database
if (fs.existsSync(dbPath)) {
  const backupPath = path.resolve(__dirname, 'erp_shared.backup.sqlite');
  fs.copyFileSync(dbPath, backupPath);
  console.log(`Backup creado: ${backupPath}`);
  fs.unlinkSync(dbPath);
  console.log('Base de datos eliminada para recrear con nuevo schema');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error abriendo la base de datos', err.message);
    return;
  }

  console.log('Conectado a SQLite. Creando schema...');

  db.serialize(() => {
    // Create Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )`);

    // Create User Module Access table
    db.run(`CREATE TABLE IF NOT EXISTS user_module_access (
      user_id INTEGER,
      module TEXT,
      PRIMARY KEY (user_id, module),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Create Products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      sku TEXT UNIQUE,
      price REAL,
      stock INTEGER
    )`);

    // Create Customers table
    db.run(`CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      company TEXT,
      status TEXT
    )`);

    // Create Invoices table
    db.run(`CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      total REAL,
      status TEXT,
      date TEXT,
      FOREIGN KEY(customer_id) REFERENCES customers(id)
    )`);

    // Create Financial Reports table
    db.run(`CREATE TABLE IF NOT EXISTS financial_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_type TEXT,
      period TEXT,
      data TEXT,
      created_at TEXT
    )`);

    // Seed Users
    console.log('Insertando usuarios...');
    const userStmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const hash = bcrypt.hashSync('123456', 8);
    userStmt.run('Ventas', 'ventas@test.com', hash);
    userStmt.run('Finanzas', 'finanzas@test.com', hash);
    userStmt.run('Multi-Modulo', 'multi@test.com', hash);
    userStmt.run('Admin', 'admin@erp.com', hash);
    userStmt.finalize();

    // Seed User Module Access
    console.log('Insertando accesos a módulos...');
    const accessStmt = db.prepare('INSERT INTO user_module_access (user_id, module) VALUES (?, ?)');
    // Admin (id=4) has access to all modules
    accessStmt.run(4, 'admin');
    accessStmt.run(4, 'finance');
    accessStmt.run(4, 'sales');
    // Ventas (id=1) has access to sales only
    accessStmt.run(1, 'sales');
    // Finanzas (id=2) has access to finance only
    accessStmt.run(2, 'finance');
    // Multi-Modulo (id=3) has access to all modules
    accessStmt.run(3, 'admin');
    accessStmt.run(3, 'finance');
    accessStmt.run(3, 'sales');
    accessStmt.finalize();

    // Seed Products
    console.log('Insertando productos...');
    const prodStmt = db.prepare('INSERT INTO products (name, sku, price, stock) VALUES (?, ?, ?, ?)');
    const products = [
      ['Monitor LED 24"', 'MON-024', 199.99, 45],
      ['Teclado Mecánico RGB', 'TEC-MEC', 89.50, 120],
      ['Mouse Inalámbrico', 'MOU-WL', 29.99, 200],
      ['Silla Ergonómica', 'SIL-ERG', 249.00, 15],
      ['Escritorio Ajustable', 'ESC-ADJ', 399.00, 8]
    ];
    products.forEach(p => prodStmt.run(p));
    prodStmt.finalize();

    // Seed Customers
    console.log('Insertando clientes...');
    const custStmt = db.prepare('INSERT INTO customers (name, email, company, status) VALUES (?, ?, ?, ?)');
    const customers = [
      ['Tech Solutions Inc', 'contacto@techsol.com', 'Tech Sol', 'Activo'],
      ['Global Imports', 'ventas@globalimp.com', 'GlobalImports', 'Activo'],
      ['Comercio Local SA', 'admin@comercioloc.com', 'Comercio Local', 'Inactivo']
    ];
    customers.forEach(c => custStmt.run(c));
    custStmt.finalize();

    // Seed Invoices
    console.log('Insertando facturas...');
    const invStmt = db.prepare('INSERT INTO invoices (customer_id, total, status, date) VALUES (?, ?, ?, ?)');
    const invoices = [
      [1, 1500.00, 'paid', '2025-01-15'],
      [2, 2300.50, 'pending', '2025-02-10'],
      [1, 890.00, 'paid', '2025-02-20'],
      [3, 3200.00, 'paid', '2025-03-05'],
      [2, 1750.25, 'cancelled', '2025-03-10']
    ];
    invoices.forEach(i => invStmt.run(i));
    invStmt.finalize();

    console.log('\n✅ Base de datos reseteada exitosamente!');
    console.log('\n📋 Usuarios creados:');
    console.log('  - admin@erp.com / 123456 (Admin - todos los módulos)');
    console.log('  - ventas@test.com / 123456 (Solo Ventas)');
    console.log('  - finanzas@test.com / 123456 (Solo Finanzas)');
    console.log('  - multi@test.com / 123456 (Multi-Modulo - todos los módulos)');

    db.close();
  });
});
