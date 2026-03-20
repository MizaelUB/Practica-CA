import { useAuth } from '../context/AuthContext';
import { User, Shield, Check } from 'lucide-react';

export const Profile = () => {
  const { user, token, updateUser } = useAuth();

  const handlePlanChange = async (newPlan: string) => {
    try {
      const res = await fetch('/api/users/role', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newPlan })
      });
      
      const data = await res.json();
      if (res.ok) {
        updateUser({ ...user!, role: data.newRole, permissions: data.permissions });
        alert(`Plan actualizado a ${newPlan.toUpperCase()} con éxito.`);
      } else {
        alert(data.error || 'Error al actualizar el plan');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión');
    }
  };

  const PlanCard = ({ title, price, planId, active, features }: { title: string, price: string, planId: string, active: boolean, features: string[] }) => (
    <div className="card" style={{ 
      flex: 1, 
      padding: '2rem', 
      display: 'flex', 
      flexDirection: 'column',
      border: active ? '2px solid var(--primary)' : '1px solid var(--border-color)',
      position: 'relative',
      minWidth: '280px'
    }}>
      {active && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--primary)', color: 'white', fontSize: '0.75rem', textAlign: 'center', padding: '0.25rem', fontWeight: 600, letterSpacing: '1px' }}>PLAN ACTUAL</div>}
      <h3 style={{ margin: '1rem 0 0.5rem 0', fontWeight: 600 }}>{title}</h3>
      <h2 style={{ fontSize: '2.5rem', margin: '0 0 1.5rem 0', color: 'var(--primary)' }}>${price} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span></h2>
      
      <div style={{ flex: 1, marginBottom: '2rem' }}>
        {features.map((f, i) => (
          <p key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.75rem 0', fontSize: '0.9rem' }}>
            <Check size={16} color="var(--success)" /> {f}
          </p>
        ))}
      </div>

      <button 
        className={active ? 'btn btn-outline' : 'btn btn-primary'}
        style={{ width: '100%' }}
        disabled={active || user?.role === 'admin'}
        onClick={() => handlePlanChange(planId)}
      >
        {active ? 'Plan Actual' : (user?.role === 'admin' ? 'No disponible para Administradores' : 'Elegir Plan')}
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <User color="var(--primary)" /> Mi Perfil
      </h1>
      
      <div className="card" style={{ padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
          {user?.name.charAt(0)}
        </div>
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>{user?.name}</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>{user?.email}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', padding: '0.3rem 0.8rem', background: '#ebf5ff', color: 'var(--primary)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
            <Shield size={14} /> Plan Activo: {user?.role.toUpperCase()}
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>Suscripción y Módulos</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Selecciona el plan que mejor se adapte a tus necesidades corporativas. Nota: los módulos de cada plan pueden ser ajustados por el administrador de sistemas.</p>
      
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <PlanCard 
          title="Basic" 
          price="0" 
          planId="basic" 
          active={user?.role === 'basic'}
          features={['Dashboard e Inventario']} 
        />
        <PlanCard 
          title="Advanced" 
          price="29" 
          planId="advanced" 
          active={user?.role === 'advanced'}
          features={['Dashboard e Inventario', 'Clientes (CRM) Automático', 'Módulo de Ventas Básico']} 
        />
        <PlanCard 
          title="Complete" 
          price="99" 
          planId="complete" 
          active={user?.role === 'complete'}
          features={['Dashboard e Inventario', 'Clientes (CRM) Completo', 'Módulo de Ventas Ilimitado', 'Reportes Avanzados', 'Configuración de Sistema']} 
        />
      </div>
    </div>
  );
};
