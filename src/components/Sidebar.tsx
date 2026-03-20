import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, User, UserCog, Briefcase, Activity, Calendar, MessageSquare, Phone, Settings } from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Render navigation link item
  const NavItem = ({ to, icon, label, badge }: { to: string, icon: any, label: string, badge?: string }) => {
    const active = isActive(to);
    return (
      <Link 
        to={to} 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.8rem 1.5rem',
          color: active ? 'white' : 'var(--sidebar-text)',
          textDecoration: 'none',
          backgroundColor: active ? 'var(--sidebar-hover)' : 'transparent',
          borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
          transition: 'all 0.2s',
          fontSize: '0.9rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {icon}
          <span>{label}</span>
        </div>
        {badge && (
          <span style={{ background: 'var(--primary)', color: 'white', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
            {badge}
          </span>
        )}
      </Link>
    );
  };

  const hasPermission = (perm: string) => user?.permissions?.includes(perm) || user?.permissions?.includes('admin');

  return (
    <aside style={{ 
      width: '260px', 
      backgroundColor: 'var(--sidebar-bg)', 
      color: 'var(--sidebar-text)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      {/* User Info Header in Sidebar */}
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          {user?.name.charAt(0)}
        </div>
        <div>
          <h4 style={{ margin: 0, color: 'white', fontSize: '0.95rem' }}>{user?.name}</h4>
          <p style={{ margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)' }}>{user?.role}</p>
        </div>
      </div>

      {/* Navigation List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
        <p style={{ padding: '0 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 600 }}>Personal</p>
        
        {hasPermission('dashboard') && (
          <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" badge="4" />
        )}
        
        {hasPermission('crm') && (
           <NavItem to="/customers" icon={<Users size={18} />} label="Analytical (CRM)" />
        )}

        {hasPermission('sales') && (
           <NavItem to="/sales" icon={<Briefcase size={18} />} label="Ventas" />
        )}

        {hasPermission('reports') && (
           <NavItem to="/reports" icon={<Activity size={18} />} label="Reportes" />
        )}

        {hasPermission('settings') && (
           <NavItem to="/settings" icon={<Settings size={18} />} label="Configuración" />
        )}

        <NavItem to="/profile" icon={<User size={18} />} label="Perfil" />
        
        {hasPermission('admin') && (
          <NavItem to="/admin" icon={<UserCog size={18} />} label="Control Admin" />
        )}

        <p style={{ padding: '0 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '1.5rem 0 0.5rem 0', fontWeight: 600 }}>Apps</p>
        <NavItem to="#" icon={<Calendar size={18} />} label="Calendar" />
        <NavItem to="#" icon={<MessageSquare size={18} />} label="Chat Apps" />
        <NavItem to="#" icon={<Phone size={18} />} label="Contact" />
      </div>
    </aside>
  );
};
