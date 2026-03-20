import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, UserCog } from 'lucide-react';

export const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const availableModules = ['dashboard', 'crm', 'sales', 'reports', 'settings'];

  const fetchData = async () => {
    try {
      const [usersRes, plansRes] = await Promise.all([
        fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/plans', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (!usersRes.ok || !plansRes.ok) throw new Error('Not authorized');
      
      const usersData = await usersRes.json();
      const plansData = await plansRes.json();
      
      setUsers(usersData);
      setPlans(plansData.map((p: any) => ({ ...p, permissions: JSON.parse(p.permissions) })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleUserRoleChange = async (userId: number, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePlanPermissionToggle = async (planName: string, module: string) => {
    const plan = plans.find(p => p.name === planName);
    if (!plan) return;

    const currentPerms = new Set(plan.permissions);
    if (currentPerms.has(module)) currentPerms.delete(module);
    else currentPerms.add(module);

    const newPermsArray = Array.from(currentPerms);

    try {
      const res = await fetch(`/api/admin/plans/${planName}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: newPermsArray })
      });
      if (res.ok) {
        setPlans(plans.map(p => p.name === planName ? { ...p, permissions: newPermsArray } : p));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!user?.permissions?.includes('admin')) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <ShieldAlert size={48} color="var(--error)" style={{ marginBottom: '1rem' }} />
        <h1>Acceso Restringido</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '0', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCog color="var(--primary)" /> Panel de Administración Activo
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            Configura los planes de suscripción y los usuarios del ERP.
          </p>
        </div>
      </div>

      {loading ? <p>Cargando datos...</p> : (
        <>
          {/* PLAN MANAGEMENT */}
          <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>Configuración de Planes (Módulos de Acceso)</h3>
          <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '3rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: '#f9fafb', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 500 }}>Plan</th>
                  {availableModules.map(mod => <th key={mod} style={{ padding: '1rem', fontWeight: 500, textTransform: 'capitalize' }}>{mod}</th>)}
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.name} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase' }}>{plan.name}</td>
                    {availableModules.map(mod => (
                      <td key={mod} style={{ padding: '1rem' }}>
                        <input 
                          type="checkbox" 
                          checked={plan.permissions.includes(mod)}
                          onChange={() => handlePlanPermissionToggle(plan.name, mod)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* USER MANAGEMENT */}
          <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>Directorio de Usuarios</h3>
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: '#f9fafb', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>ID</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Nombre</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Correo</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Plan Asignado</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{item.id}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{item.name}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{item.email}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <select 
                        value={item.role} 
                        onChange={(e) => handleUserRoleChange(item.id, e.target.value)}
                        style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                        disabled={item.role === 'admin'}
                      >
                        <option value="basic">Basic</option>
                        <option value="advanced">Advanced</option>
                        <option value="complete">Complete</option>
                        {item.role === 'admin' && <option value="admin">Admin</option>}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
