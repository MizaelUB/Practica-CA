import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        throw new Error('No se pudo conectar con el servidor (¿Está encendido el Backend en el puerto 3000?)');
      }

      if (!res.ok) throw new Error(data?.error || 'Error de inicio de sesión');
      
      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDemoLogin = (type: 'ana' | 'carlos' | 'admin') => {
    let creds = { email: '', password: '123456' };
    if (type === 'ana') creds.email = 'ana@test.com';
    if (type === 'carlos') creds.email = 'carlos@test.com';
    if (type === 'admin') creds.email = 'admin@erp.com';
    
    setEmail(creds.email);
    setPassword(creds.password);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem' }}>
      <div className="glass" style={{ padding: '3rem', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ marginBottom: '0.5rem', color: 'var(--primary)', textAlign: 'center' }}>Acceso ERP</h1>
        
        {error && <div style={{ background: 'var(--error)', color: 'white', padding: '0.5rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            <LogIn size={20} /> Entrar
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          ¿No tienes cuenta? <Link to="/register" style={{ color: 'var(--primary)' }}>Regístrate</Link>
        </p>

        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '2rem', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1rem' }}>Cuentas de demostración:</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem' }} onClick={() => handleDemoLogin('ana')}>Ana (Básico)</button>
            <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem' }} onClick={() => handleDemoLogin('carlos')}>Carlos (Premium)</button>
          </div>
        </div>
      </div>
    </div>
  );
};
