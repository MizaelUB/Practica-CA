import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'erp_shared.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.serialize(() => {
      // Create Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
      )`);

      // Create User Module Access table (for granular module access control)
      db.run(`CREATE TABLE IF NOT EXISTS user_module_access (
        user_id INTEGER,
        module TEXT,
        PRIMARY KEY (user_id, module),
        FOREIGN KEY(user_id) REFERENCES users(id)
      )`);

      // Create Products table (for Sales module)
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        sku TEXT UNIQUE,
        price REAL,
        stock INTEGER
      )`);

      // Create Customers table (for Sales module)
      db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        company TEXT,
        status TEXT
      )`);

      // Create Invoices table (for Finance module)
      db.run(`CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        total REAL,
        status TEXT,
        date TEXT,
        FOREIGN KEY(customer_id) REFERENCES customers(id)
      )`);

      // Create Financial Reports table (for Finance module)
      db.run(`CREATE TABLE IF NOT EXISTS financial_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_type TEXT,
        period TEXT,
        data TEXT,
        created_at TEXT
      )`);

      // Create Sales Orders table
      db.run(`CREATE TABLE IF NOT EXISTS sales_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        total REAL,
        status TEXT,
        date TEXT,
        FOREIGN KEY(customer_id) REFERENCES customers(id)
      )`);

      // Create Order Items table
      db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        price REAL,
        FOREIGN KEY(order_id) REFERENCES sales_orders(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
      )`);

      // Seed Initial Admin and Test Users if not exists
      db.get('SELECT count(*) as count FROM users', (err, row) => {
        if (row && row.count === 0) {
          console.log('Seeding initial users...');
          const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
          const hash = bcrypt.hashSync('123456', 8);
          stmt.run('Usuario Ventas', 'ventas@test.com', hash);
          stmt.run('Usuario Finanzas', 'finanzas@test.com', hash);
          stmt.run('Usuario Multi-Modulo', 'multi@test.com', hash);
          stmt.run('Admin', 'admin@erp.com', hash);
          stmt.finalize();

          // Seed user module access
          const accessStmt = db.prepare('INSERT OR IGNORE INTO user_module_access (user_id, module) VALUES (?, ?)');
          // Admin has access to all modules
          accessStmt.run(4, 'admin');
          accessStmt.run(4, 'finance');
          accessStmt.run(4, 'sales');
          // Usuario Ventas has access to sales only
          accessStmt.run(1, 'sales');
          // Usuario Finanzas has access to finance only
          accessStmt.run(2, 'finance');
          // Usuario Multi-Modulo has access to all modules
          accessStmt.run(3, 'admin');
          accessStmt.run(3, 'finance');
          accessStmt.run(3, 'sales');
          accessStmt.finalize();
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

      // Seed Invoices if not exists
      db.get('SELECT count(*) as count FROM invoices', (err, row) => {
        if (row && row.count === 0) {
          console.log('Seeding invoices...');
          const stmt = db.prepare('INSERT INTO invoices (customer_id, total, status, date) VALUES (?, ?, ?, ?)');
          const invoices = [
            [1, 1500.00, 'paid', '2025-01-15'],
            [2, 2300.50, 'pending', '2025-02-10'],
            [1, 890.00, 'paid', '2025-02-20'],
            [3, 3200.00, 'paid', '2025-03-05'],
            [2, 1750.25, 'cancelled', '2025-03-10']
          ];
          invoices.forEach(i => stmt.run(i));
          stmt.finalize();
        }
      });
    });
  }
});

export default db;
