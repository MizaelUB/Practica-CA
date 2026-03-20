import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Shield, User, Settings } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="glass" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <Shield size={24} /> ERP Pro
            </h2>
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Inventario</Link>
          {(user.role === 'premium' || user.role === 'admin') && (
            <Link to="/customers" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Clientes (CRM)</Link>
          )}
          {user.role === 'admin' && (
            <Link to="/admin" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Panel Admin</Link>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '20px', textDecoration: 'none', color: 'inherit' }}>
          <User size={18} />
          <span>{user.name}</span>
          <span style={{ 
            fontSize: '0.75rem', 
            padding: '0.2rem 0.6rem', 
            borderRadius: '12px',
            backgroundColor: user.role === 'premium' ? 'rgba(234, 179, 8, 0.15)' : user.role === 'admin' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
            color: user.role === 'premium' ? '#fde047' : '#818cf8',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {user.role}
          </span>
          <Settings size={14} style={{ marginLeft: '0.25rem', opacity: 0.7 }} />
        </Link>
        <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};
