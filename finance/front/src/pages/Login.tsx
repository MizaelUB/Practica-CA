import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DollarSign } from 'lucide-react';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      login(data.token, data.user);
      navigate('/');
    } catch {
      setError('Error de conexión');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, module: 'finance' })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al registrar');
        return;
      }

      // Registro exitoso - mostrar mensaje y redirigir al login
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setIsLogin(true);
      setName('');
      setEmail('');
      setPassword('');
    } catch {
      setError('Error de conexión');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>
          <DollarSign size={48} color="#10b981" />
        </div>
        <h1 style={styles.title}>Finanzas ERP</h1>
        <p style={styles.subtitle}>Gestión Financiera y Reportes</p>

        {isLogin ? (
          <form onSubmit={handleLogin} style={styles.form}>
            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>{success}</div>}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="admin@erp.com"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="••••••"
                required
              />
            </div>

            <button type="submit" style={styles.button}>
              Iniciar Sesión
            </button>

            <div style={styles.switchText}>
              ¿No tienes cuenta?{' '}
              <button type="button" onClick={() => setIsLogin(false)} style={styles.switchLink}>
                Regístrate
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={styles.form}>
            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                placeholder="Tu nombre"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="••••••"
                required
              />
            </div>

            <button type="submit" style={styles.button}>
              Registrarse
            </button>

            <div style={styles.switchText}>
              ¿Ya tienes cuenta?{' '}
              <button type="button" onClick={() => setIsLogin(true)} style={styles.switchLink}>
                Inicia Sesión
              </button>
            </div>
          </form>
        )}

        {isLogin && (
          <div style={styles.demoInfo}>
            <p style={styles.demoText}>Demo: <strong>admin@erp.com</strong> / <strong>123456</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: '400px'
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  title: {
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: '8px',
    fontSize: '28px'
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '30px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontWeight: 600,
    color: '#374151'
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  },
  button: {
    padding: '14px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '10px'
  },
  error: {
    padding: '12px',
    background: '#fee2e2',
    color: '#dc2626',
    borderRadius: '8px',
    fontSize: '14px'
  },
  success: {
    padding: '12px',
    background: '#d1fae5',
    color: '#065f46',
    borderRadius: '8px',
    fontSize: '14px'
  },
  demoInfo: {
    marginTop: '20px',
    padding: '12px',
    background: '#f3f4f6',
    borderRadius: '8px',
    textAlign: 'center'
  },
  demoText: {
    fontSize: '13px',
    color: '#6b7280'
  },
  switchText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '10px'
  },
  switchLink: {
    background: 'none',
    border: 'none',
    color: '#10b981',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px'
  }
};
