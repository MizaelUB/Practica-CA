import { Shield, DollarSign, ShoppingCart, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();

  const modules = [
    {
      id: 'admin',
      name: 'Administración',
      description: 'Gestión de usuarios, permisos y configuración global.',
      icon: <Shield size={40} />,
      color: '#4f46e5',
      url: 'http://localhost:5173',
      permission: 'admin'
    },
    {
      id: 'finance',
      name: 'Finanzas',
      description: 'Facturación, reportes financieros y contabilidad.',
      icon: <DollarSign size={40} />,
      color: '#10b981',
      url: 'http://localhost:5174',
      permission: 'finance'
    },
    {
      id: 'sales',
      name: 'Ventas y CRM',
      description: 'Gestión de productos, clientes y órdenes de venta.',
      icon: <ShoppingCart size={40} />,
      color: '#f97316',
      url: 'http://localhost:5175',
      permission: 'sales'
    }
  ];

  const handleModuleClick = (url: string) => {
    // Sincronizar token en sessionStorage/localStorage del otro dominio si fuera necesario
    // Por ahora simplemente abrimos en pestaña nueva
    window.open(url, '_blank');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
          Portal ERP Modular
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
          Bienvenido, {user?.name}. Selecciona una aplicación para comenzar.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {modules.map((mod) => {
          const hasAccess = user?.moduleAccess?.includes(mod.permission);
          
          return (
            <div 
              key={mod.id}
              className="glass"
              style={{ 
                padding: '2.5rem', 
                borderRadius: '20px', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1.5rem',
                opacity: hasAccess ? 1 : 0.7,
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                cursor: hasAccess ? 'pointer' : 'not-allowed',
                border: `2px solid ${hasAccess ? 'transparent' : 'rgba(239, 68, 68, 0.2)'}`
              }}
              onClick={() => hasAccess && handleModuleClick(mod.url)}
              onMouseEnter={(e) => hasAccess && (e.currentTarget.style.transform = 'translateY(-10px)')}
              onMouseLeave={(e) => hasAccess && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '16px', 
                background: `${mod.color}15`, 
                color: mod.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {mod.icon}
              </div>

              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {mod.name}
                  {!hasAccess && <Lock size={18} color="#ef4444" />}
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {mod.description}
                </p>
              </div>

              {hasAccess ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: mod.color, marginTop: 'auto' }}>
                  Abrir Aplicación <ArrowRight size={18} />
                </div>
              ) : (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, marginTop: 'auto' }}>
                  Acceso restringido por el administrador
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

