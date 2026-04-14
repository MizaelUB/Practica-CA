import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/database.js';

const app = express();
const PORT = 3000;

// JWT Secret compartida entre todos los servicios
export const JWT_SECRET = 'super_secret_jwt_key_for_erp_modules';

app.use(cors());
app.use(express.json());

// Middleware to verify JWT
export const authenticateToken = (req, res, next) => {
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

// --- AUTH ROUTES ---

// Registro de usuario con selección de módulo
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, module } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Faltan campos' });

  // Validar módulo
  const validModules = ['sales', 'finance'];
  const selectedModule = module || 'sales';
  if (!validModules.includes(selectedModule)) {
    return res.status(400).json({ error: 'Módulo no válido' });
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

        // Asignar acceso al módulo seleccionado
        await new Promise((resolve) => {
          db.run('INSERT INTO user_module_access (user_id, module) VALUES (?, ?)', [userId, selectedModule], resolve);
        });

        const token = jwt.sign({
          id: userId,
          name,
          moduleAccess: [selectedModule]
        }, JWT_SECRET, { expiresIn: '2h' });

        res.json({
          token,
          user: {
            id: userId,
            name,
            email,
            moduleAccess: [selectedModule]
          }
        });
      }
    );
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Error interno' });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const moduleAccess = await getUserModuleAccess(user.id);
    const token = jwt.sign({
      id: user.id,
      name: user.name,
      moduleAccess
    }, JWT_SECRET, { expiresIn: '2h' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        moduleAccess
      }
    });
  });
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  db.get('SELECT id, name, email FROM users WHERE id = ?', [req.user.id], async (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const moduleAccess = await getUserModuleAccess(user.id);
    user.moduleAccess = moduleAccess;
    res.json({ user });
  });
});

// Validar token (para otros servicios)
app.post('/api/auth/validate', authenticateToken, async (req, res) => {
  const moduleAccess = await getUserModuleAccess(req.user.id);
  res.json({ valid: true, user: { ...req.user, moduleAccess } });
});

db.on('open', () => {
  app.listen(PORT, () => {
    console.log(`🔐 Auth Service running on http://localhost:${PORT}`);
  });
});
