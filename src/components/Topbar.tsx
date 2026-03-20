import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Search, Bell, Mail, Grid, LogOut } from 'lucide-react';

export const Topbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ 
      height: '70px', 
      backgroundColor: 'var(--card-bg)', 
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      
      {/* Left side: Brand + Menu Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.3rem' }}>
          <div style={{ width: '28px', height: '28px', background: 'var(--text-main)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '12px', height: '12px', background: 'white', borderRadius: '50%' }}></div>
          </div>
          AdminPro
        </h2>
        <Menu size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
      </div>

      {/* Right side: Icons + Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <Search size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
        
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={18} color="var(--text-muted)" />
          <span style={{ position: 'absolute', top: -3, right: -3, width: '8px', height: '8px', background: 'var(--error)', borderRadius: '50%' }}></span>
        </div>

        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Mail size={18} color="var(--text-muted)" />
          <span style={{ position: 'absolute', top: -3, right: -3, width: '8px', height: '8px', background: 'var(--error)', borderRadius: '50%' }}></span>
        </div>

        <Grid size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />

        {/* User Dropdown Profile Simulation */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.25rem', marginLeft: '0.5rem' }}>
           <button onClick={handleLogout} className="btn" style={{ padding: '0.3rem', color: 'var(--text-muted)' }} title="Cerrar Sesión">
             <LogOut size={18} />
           </button>
        </div>
      </div>
    </header>
  );
}
