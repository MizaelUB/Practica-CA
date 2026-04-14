import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3003;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JWT Secret compartida
const JWT_SECRET = 'super_secret_jwt_key_for_erp_modules';

// Conexión a DB compartida
const dbPath = path.resolve(__dirname, '../../shared/db/erp_shared.sqlite');
const db = new sqlite3.Database(dbPath);

app.use(cors());
app.use(express.json());

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token no proveído' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
    req.user = user;
    next();
  });
};

// Helper: Check if user has module access
const hasModuleAccess = (user, moduleName) => {
  // Check moduleAccess array from JWT token
  return user.moduleAccess && user.moduleAccess.includes(moduleName);
};

// Verificar permisos de ventas
const requireSales = async (req, res, next) => {
  if (!hasModuleAccess(req.user, 'sales')) {
    return res.status(403).json({ error: 'Acceso denegado al módulo de ventas' });
  }
  next();
};

// Verificar permisos de CRM
const requireCrm = async (req, res, next) => {
  if (!hasModuleAccess(req.user, 'sales')) {
    return res.status(403).json({ error: 'Acceso denegado al módulo de CRM' });
  }
  next();
};

// --- SALES ROUTES ---

// Obtener productos
app.get('/api/sales/products', authenticateToken, requireSales, (req, res) => {
  db.all('SELECT * FROM products ORDER BY name', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    res.json(rows);
  });
});

// Crear producto
app.post('/api/sales/products', authenticateToken, requireSales, (req, res) => {
  const { name, sku, price, stock } = req.body;

  db.run(
    'INSERT INTO products (name, sku, price, stock) VALUES (?, ?, ?, ?)',
    [name, sku, price, stock],
    function(err) {
      if (err) return res.status(500).json({ error: 'Error al crear producto' });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Actualizar producto
app.put('/api/sales/products/:id', authenticateToken, requireSales, (req, res) => {
  const { name, sku, price, stock } = req.body;

  db.run(
    'UPDATE products SET name = ?, sku = ?, price = ?, stock = ? WHERE id = ?',
    [name, sku, price, stock, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Error al actualizar producto' });
      res.json({ success: true });
    }
  );
});

// Eliminar producto
app.delete('/api/sales/products/:id', authenticateToken, requireSales, (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Error al eliminar producto' });
    res.json({ success: true });
  });
});

// Obtener clientes (CRM)
app.get('/api/sales/customers', authenticateToken, requireCrm, (req, res) => {
  db.all('SELECT * FROM customers ORDER BY name', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    res.json(rows);
  });
});

// Crear cliente
app.post('/api/sales/customers', authenticateToken, requireCrm, (req, res) => {
  const { name, email, company, status } = req.body;

  db.run(
    'INSERT INTO customers (name, email, company, status) VALUES (?, ?, ?, ?)',
    [name, email, company, status || 'Activo'],
    function(err) {
      if (err) return res.status(500).json({ error: 'Error al crear cliente' });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Actualizar cliente
app.put('/api/sales/customers/:id', authenticateToken, requireCrm, (req, res) => {
  const { name, email, company, status } = req.body;

  db.run(
    'UPDATE customers SET name = ?, email = ?, company = ?, status = ? WHERE id = ?',
    [name, email, company, status, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Error al actualizar cliente' });
      res.json({ success: true });
    }
  );
});

// Eliminar cliente
app.delete('/api/sales/customers/:id', authenticateToken, requireCrm, (req, res) => {
  db.run('DELETE FROM customers WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Error al eliminar cliente' });
    res.json({ success: true });
  });
});

// Estadísticas de ventas
app.get('/api/sales/stats', authenticateToken, requireSales, (req, res) => {
  const stats = {};

  db.get('SELECT COUNT(*) as total, SUM(stock) as totalStock FROM products', (err, row) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    stats.totalProducts = row.total;
    stats.totalStock = row.totalStock || 0;

    db.get('SELECT COUNT(*) as total FROM customers', (err, row) => {
      if (err) return res.status(500).json({ error: 'DB Error' });
      stats.totalCustomers = row.total;
      res.json(stats);
    });
  });
});

// --- ORDERS ROUTES ---

// Obtener pedidos
app.get('/api/sales/orders', authenticateToken, requireSales, (req, res) => {
  db.all(`
    SELECT o.*, c.name as customer_name, c.company
    FROM sales_orders o
    JOIN customers c ON o.customer_id = c.id
    ORDER BY o.date DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    res.json(rows);
  });
});

// Crear pedido (Venta)
app.post('/api/sales/orders', authenticateToken, requireSales, (req, res) => {
  const { customer_id, items, total, date, status } = req.body;

  if (!customer_id || !items || !items.length) {
    return res.status(400).json({ error: 'Datos de pedido incompletos' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    const orderStmt = db.prepare('INSERT INTO sales_orders (customer_id, total, status, date) VALUES (?, ?, ?, ?)');
    orderStmt.run(customer_id, total, status || 'Completado', date || new Date().toISOString().split('T')[0], function(err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Error al crear pedido' });
      }

      const orderId = this.lastID;
      const itemStmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
      const stockStmt = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

      try {
        items.forEach(item => {
          itemStmt.run(orderId, item.product_id, item.quantity, item.price);
          stockStmt.run(item.quantity, item.product_id);
        });

        itemStmt.finalize();
        stockStmt.finalize();
        db.run('COMMIT');
        res.json({ success: true, id: orderId });
      } catch (e) {
        db.run('ROLLBACK');
        res.status(500).json({ error: 'Error al procesar items del pedido' });
      }
    });
  });
});

db.on('open', () => {
  app.listen(PORT, () => {
    console.log(`🛒 Sales Backend running on http://localhost:${PORT}`);
  });
});
