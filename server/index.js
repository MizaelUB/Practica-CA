import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'super_secret_jwt_key_for_local_testing_only';

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Token no proveído' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Helper: Fetch user permissions from DB
const getUserPermissions = (role) => {
  return new Promise((resolve) => {
    db.get('SELECT permissions FROM plans WHERE name = ?', [role], (err, plan) => {
      if (err || !plan) resolve([]);
      else resolve(JSON.parse(plan.permissions));
    });
  });
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Faltan campos' });
  
  const hash = bcrypt.hashSync(password, 8);
  const stmt = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
  const defaultRole = 'basic';
  
  stmt.run(name, email, hash, defaultRole, async function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'El email ya existe' });
      return res.status(500).json({ error: 'Database error' });
    }
    
    const permissions = await getUserPermissions(defaultRole);
    const token = jwt.sign({ id: this.lastID, name, role: defaultRole }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { id: this.lastID, name: name, role: defaultRole, permissions } });
  });
  stmt.finalize();
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Error interno' });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Contraseña incorrecta' });
    
    const permissions = await getUserPermissions(user.role);
    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, permissions } });
  });
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  db.get('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id], async (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const permissions = await getUserPermissions(user.role);
    user.permissions = permissions;
    res.json({ user });
  });
});

// --- USER & PLAN ROUTES ---

app.put('/api/users/role', authenticateToken, async (req, res) => {
  const { role } = req.body; // e.g., 'basic', 'advanced', 'complete'
  if (!['basic', 'advanced', 'complete'].includes(role)) {
    return res.status(400).json({ error: 'Plan no válido' });
  }

  db.run("UPDATE users SET role = ? WHERE id = ?", [role, req.user.id], async function(err) {
    if (err) return res.status(500).json({ error: 'Could not change plan' });
    const perms = await getUserPermissions(role);
    res.json({ success: true, newRole: role, permissions: perms });
  });
});

// --- ERP ROUTES ---

app.get('/api/erp/products', authenticateToken, (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    res.json(rows);
  });
});

app.get('/api/erp/customers', authenticateToken, async (req, res) => {
  const perms = await getUserPermissions(req.user.role);
  if (!perms.includes('crm') && !perms.includes('admin')) {
    return res.status(403).json({ error: 'Permiso de CRM requerido' });
  }

  db.all('SELECT * FROM customers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    res.json(rows);
  });
});

// --- ADMIN ROUTES ---

app.get('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Solo administradores' });
  db.all('SELECT id, name, email, role FROM users', [], (err, rows) => {
    res.json(rows);
  });
});

app.put('/api/admin/users/:id/role', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Solo administradores' });
  const { role } = req.body;
  db.run("UPDATE users SET role = ? WHERE id = ?", [role, req.params.id], function(err) {
    res.json({ success: true, newRole: role });
  });
});

app.get('/api/admin/plans', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Solo administradores' });
  db.all('SELECT * FROM plans', [], (err, rows) => {
    res.json(rows);
  });
});

app.put('/api/admin/plans/:name', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Solo administradores' });
  const { permissions } = req.body; // should be array of strings
  db.run("UPDATE plans SET permissions = ? WHERE name = ?", [JSON.stringify(permissions), req.params.name], function(err) {
    res.json({ success: true });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`ERP Backend running on http://localhost:${PORT}`);
});
