import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'erp.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.serialize(() => {
      // Create Plans table
      db.run(`CREATE TABLE IF NOT EXISTS plans (
        name TEXT PRIMARY KEY,
        permissions TEXT
      )`);

      // Create Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'basic'
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

      // Seed Initial Plans if not exists
      db.get('SELECT count(*) as count FROM plans', (err, row) => {
        if (row && row.count === 0) {
          console.log('Seeding initial plans...');
          const stmt = db.prepare('INSERT INTO plans (name, permissions) VALUES (?, ?)');
          stmt.run('basic', JSON.stringify(['dashboard']));
          stmt.run('advanced', JSON.stringify(['dashboard', 'crm', 'sales']));
          stmt.run('complete', JSON.stringify(['dashboard', 'crm', 'sales', 'reports', 'settings']));
          // Admin has a special role that bypasses or we can give an admin plan
          stmt.run('admin', JSON.stringify(['dashboard', 'crm', 'sales', 'reports', 'settings', 'admin']));
          stmt.finalize();
        }
      });

      // Seed Initial Admin and Test Users if not exists
      db.get('SELECT count(*) as count FROM users', (err, row) => {
        if (row && row.count === 0) {
          console.log('Seeding initial users...');
          const stmt = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
          const hash = bcrypt.hashSync('123456', 8);
          stmt.run('Ana (Básico)', 'ana@test.com', hash, 'basic');
          stmt.run('Luis (Avanzado)', 'luis@test.com', hash, 'advanced');
          stmt.run('Carlos (Completo)', 'carlos@test.com', hash, 'complete');
          stmt.run('Admin', 'admin@erp.com', hash, 'admin');
          stmt.finalize();
        }
      });

      // Seed Products if not exists
      db.get('SELECT count(*) as count FROM products', (err, row) => {
        if (row && row.count === 0) {
          console.log('Seeding products...');
          const stmt = db.prepare('INSERT INTO products (name, sku, price, stock) VALUES (?, ?, ?, ?)');
          const products = [
            ['Monitor LED 24"', 'MON-024', 199.99, 45],
            ['Teclado Mecánico RGB', 'TEC-MEC', 89.50, 120],
            ['Mouse Inalámbrico', 'MOU-WL', 29.99, 200],
            ['Silla Ergonómica', 'SIL-ERG', 249.00, 15],
            ['Escritorio Ajustable', 'ESC-ADJ', 399.00, 8]
          ];
          products.forEach(p => stmt.run(p));
          stmt.finalize();
        }
      });

      // Seed Customers if not exists
      db.get('SELECT count(*) as count FROM customers', (err, row) => {
        if (row && row.count === 0) {
          console.log('Seeding customers...');
          const stmt = db.prepare('INSERT INTO customers (name, email, company, status) VALUES (?, ?, ?, ?)');
          const customers = [
            ['Tech Solutions Inc', 'contacto@techsol.com', 'Tech Sol', 'Activo'],
            ['Global Imports', 'ventas@globalimp.com', 'GlobalImports', 'Activo'],
            ['Comercio Local SA', 'admin@comercioloc.com', 'Comercio Local', 'Inactivo']
          ];
          customers.forEach(c => stmt.run(c));
          stmt.finalize();
        }
      });
    });
  }
});

export default db;
