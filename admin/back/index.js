import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3001;

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

// Helper: Fetch user module access from DB
const getUserModuleAccess = (userId) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT module FROM user_module_access WHERE user_id = ?', [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows ? rows.map(r => r.module) : []);
    });
  });
};

// Helper: Generate new JWT token for user
const generateToken = async (userId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, name, email FROM users WHERE id = ?', [userId], async (err, user) => {
      if (err) reject(err);
      if (!user) reject(new Error('User not found'));

      const moduleAccess = await getUserModuleAccess(userId);
      const token = jwt.sign({
        id: user.id,
        name: user.name,
        moduleAccess
      }, JWT_SECRET, { expiresIn: '2h' });

      resolve({ token, user: { ...user, moduleAccess } });
    });
  });
};

// Verificar si tiene acceso al módulo admin
const requireAdmin = (req, res, next) => {
  if (!req.user.moduleAccess || !req.user.moduleAccess.includes('admin')) {
    return res.status(403).json({ error: 'Solo administradores' });
  }
  next();
};

// --- ADMIN ROUTES ---

// Obtener todos los usuarios
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  db.all('SELECT id, name, email FROM users', [], async (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB Error' });

    // Add module access to each user
    const usersWithAccess = await Promise.all(rows.map(async (user) => {
      const moduleAccess = await getUserModuleAccess(user.id);
      return { ...user, moduleAccess };
    }));

    res.json(usersWithAccess);
  });
});

// Actualizar módulos de un usuario
app.put('/api/admin/users/:id/modules', authenticateToken, requireAdmin, async (req, res) => {
  const { modules } = req.body;
  if (!Array.isArray(modules)) {
    return res.status(400).json({ error: 'Modules debe ser un array' });
  }

  try {
    await new Promise((resolve, reject) => {
      db.run("DELETE FROM user_module_access WHERE user_id = ?", [req.params.id], (err) => {
        if (err) reject(err);
        else resolve(null);
      });
    });

    if (modules.length > 0) {
      const stmt = db.prepare("INSERT INTO user_module_access (user_id, module) VALUES (?, ?)");
      modules.forEach(module => {
        stmt.run(req.params.id, module);
      });
      stmt.finalize();
    }

    // Generar nuevo token con los módulos actualizados
    const { token, user } = await generateToken(parseInt(req.params.id));

    res.json({
      success: true,
      modules,
      token,
      user
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar módulos' });
  }
});

// Crear usuario
app.post('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  const { name, email, password, modules } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existing) => {
    if (err) return res.status(500).json({ error: 'Error interno' });
    if (existing) return res.status(400).json({ error: 'El email ya existe' });

    const hash = bcrypt.hashSync(password, 8);

    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hash],
      async function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });

        const userId = this.lastID;

        // Insert module access
        const modulesToInsert = modules || ['sales'];
        const stmt = db.prepare("INSERT INTO user_module_access (user_id, module) VALUES (?, ?)");
        modulesToInsert.forEach(module => {
          stmt.run(userId, module);
        });
        stmt.finalize();

        res.json({ success: true, id: userId });
      }
    );
  });
});

// Eliminar usuario
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Error al eliminar usuario' });
    res.json({ success: true });
  });
});

// Estadísticas de usuarios y sistema
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  const stats = {};
  
  db.get('SELECT COUNT(*) as total FROM users', (err, row) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    stats.totalUsers = row.total;
    
    db.get('SELECT COUNT(*) as total, SUM(total) as revenue FROM invoices WHERE status = "paid"', (err, row) => {
      if (err) return res.status(500).json({ error: 'DB Error' });
      stats.totalInvoices = row.total;
      stats.totalRevenue = row.revenue || 0;
      
      db.get('SELECT COUNT(*) as total FROM products', (err, row) => {
        if (err) return res.status(500).json({ error: 'DB Error' });
        stats.totalProducts = row.total;
        
        db.get('SELECT COUNT(*) as total FROM customers', (err, row) => {
          if (err) return res.status(500).json({ error: 'DB Error' });
          stats.totalCustomers = row.total;
          res.json(stats);
        });
      });
    });
  });
});

db.on('open', () => {
  app.listen(PORT, () => {
    console.log(`👤 Admin Backend running on http://localhost:${PORT}`);
  });
});
