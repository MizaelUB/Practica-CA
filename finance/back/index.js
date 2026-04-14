import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3002;

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

// Verificar permisos de finanzas
const requireFinance = async (req, res, next) => {
  if (!hasModuleAccess(req.user, 'finance')) {
    return res.status(403).json({ error: 'Acceso denegado al módulo de finanzas' });
  }
  next();
};

// --- FINANCE ROUTES ---

// Obtener todas las facturas
app.get('/api/finance/invoices', authenticateToken, requireFinance, (req, res) => {
  db.all(`
    SELECT i.*, c.name as customer_name, c.company
    FROM invoices i
    JOIN customers c ON i.customer_id = c.id
    ORDER BY i.date DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    res.json(rows);
  });
});

// Obtener resumen financiero
app.get('/api/finance/summary', authenticateToken, requireFinance, (req, res) => {
  const summary = {};

  db.get('SELECT SUM(total) as total, COUNT(*) as count FROM invoices', (err, row) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    summary.totalRevenue = row.total || 0;
    summary.totalInvoices = row.count || 0;

    db.get('SELECT SUM(total) as pending FROM invoices WHERE status = \'pending\'', (err, row) => {
      if (err) return res.status(500).json({ error: 'DB Error' });
      summary.pendingAmount = row.pending || 0;

      db.get('SELECT SUM(total) as paid FROM invoices WHERE status = \'paid\'', (err, row) => {
        if (err) return res.status(500).json({ error: 'DB Error' });
        summary.paidAmount = row.paid || 0;
        res.json(summary);
      });
    });
  });
});

// Obtener ingresos por mes
app.get('/api/finance/monthly-revenue', authenticateToken, requireFinance, (req, res) => {
  db.all(`
    SELECT strftime('%Y-%m', date) as month, SUM(total) as revenue
    FROM invoices
    WHERE status = 'paid'
    GROUP BY month
    ORDER BY month DESC
    LIMIT 6
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    res.json(rows);
  });
});

// Crear factura
app.post('/api/finance/invoices', authenticateToken, requireFinance, (req, res) => {
  const { customer_id, total, status, date } = req.body;

  db.run(
    'INSERT INTO invoices (customer_id, total, status, date) VALUES (?, ?, ?, ?)',
    [customer_id, total, status, date],
    function(err) {
      if (err) return res.status(500).json({ error: 'Error al crear factura' });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Actualizar estado de factura
app.put('/api/finance/invoices/:id', authenticateToken, requireFinance, (req, res) => {
  const { status } = req.body;

  db.run('UPDATE invoices SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Error al actualizar factura' });
    res.json({ success: true });
  });
});

// Eliminar factura
app.delete('/api/finance/invoices/:id', authenticateToken, requireFinance, (req, res) => {
  db.run('DELETE FROM invoices WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Error al eliminar factura' });
    res.json({ success: true });
  });
});

// Obtener clientes
app.get('/api/finance/customers', authenticateToken, requireFinance, (req, res) => {
  db.all('SELECT * FROM customers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    res.json(rows);
  });
});

db.on('open', () => {
  app.listen(PORT, () => {
    console.log(`💰 Finance Backend running on http://localhost:${PORT}`);
  });
});
