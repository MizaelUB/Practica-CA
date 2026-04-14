import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, BarChart3, LogOut, UserPlus, Database, Activity, Package } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  moduleAccess?: string[];
}

interface NewUser {
  name: string;
  email: string;
  password: string;
  modules: string[];
}

export const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    password: '',
    modules: ['sales']
  });

  const availableModules = [
    { id: 'admin', name: 'Administración', icon: Shield },
    { id: 'finance', name: 'Finanzas', icon: BarChart3 },
    { id: 'sales', name: 'Ventas', icon: Users }
  ];

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchStats();
    }
  }, [token]);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setUsers(data);
  };

  const fetchStats = async () => {
    const res = await fetch('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setStats(data);
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newUser)
    });
    setShowCreateUser(false);
    setNewUser({ name: '', email: '', password: '', modules: ['sales'] });
    fetchUsers();
  };

  const toggleUserModule = (userId: number, module: string) => {
    const u = users.find(u => u.id === userId);
    if (!u) return;

    const currentModules = u.moduleAccess || [];
    const newModules = currentModules.includes(module)
      ? currentModules.filter(m => m !== module)
      : [...currentModules, module];

    update_user_modules(userId, newModules);
  };

  const update_user_modules = async (userId: number, modules: string[]) => {
    const res = await fetch(`/api/admin/users/${userId}/modules`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ modules })
    });

    const data = await res.json();

    // Si se actualizaron los módulos del usuario actual, actualizar solo el token
    // El user data se refresca automáticamente desde el backend
    if (data.success && userId === user?.id) {
      localStorage.setItem('erp_token', data.token);
    }

    fetchUsers();
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('¿Eliminar usuario?')) return;
    await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchUsers();
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.navbarBrand}>
          <Shield size={28} color="#4f46e5" />
          <span style={styles.navbarTitle}>Admin ERP</span>
        </div>
        <div style={styles.navbarRight}>
          <span style={styles.userName}>{user?.name}</span>
          <button onClick={logout} style={styles.logoutBtn}>
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        {stats && (
          <div style={styles.statsRow}>
            <div style={styles.miniStat}>
              <Users size={20} color="#4f46e5" />
              <div>
                <div style={styles.miniStatValue}>{stats.totalUsers}</div>
                <div style={styles.miniStatLabel}>Usuarios</div>
              </div>
            </div>
            <div style={styles.miniStat}>
              <Activity size={20} color="#10b981" />
              <div>
                <div style={styles.miniStatValue}>{stats.totalInvoices}</div>
                <div style={styles.miniStatLabel}>Ventas Realizadas</div>
              </div>
            </div>
            <div style={styles.miniStat}>
              <Package size={20} color="#f97316" />
              <div>
                <div style={styles.miniStatValue}>{stats.totalProducts}</div>
                <div style={styles.miniStatLabel}>Productos</div>
              </div>
            </div>
            <div style={styles.miniStat}>
              <Database size={20} color="#3b82f6" />
              <div>
                <div style={styles.miniStatValue}>{stats.totalCustomers}</div>
                <div style={styles.miniStatLabel}>Clientes</div>
              </div>
            </div>
          </div>
        )}

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Gestión de Usuarios</h2>
            <button onClick={() => setShowCreateUser(!showCreateUser)} style={styles.createBtn}>
              <UserPlus size={18} />
              {showCreateUser ? 'Cancelar' : 'Nuevo Usuario'}
            </button>
          </div>

          {showCreateUser && (
            <form onSubmit={createUser} style={styles.createForm}>
              <div style={styles.formGrid}>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  style={styles.input}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  style={styles.input}
                  required
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.modulesSelector}>
                <label style={styles.modulesLabel}>Módulos:</label>
                <div style={styles.modulesCheckboxes}>
                  {availableModules.map(mod => (
                    <label key={mod.id} style={styles.moduleCheckbox}>
                      <input
                        type="checkbox"
                        checked={newUser.modules.includes(mod.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewUser({ ...newUser, modules: [...newUser.modules, mod.id] });
                          } else {
                            setNewUser({ ...newUser, modules: newUser.modules.filter(m => m !== mod.id) });
                          }
                        }}
                      />
                      <mod.icon size={16} />
                      {mod.name}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" style={styles.submitBtn}>Crear Usuario</button>
            </form>
          )}

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Módulos</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={styles.td}>{u.name}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <div style={styles.moduleBadges}>
                      {availableModules.map(mod => (
                        <button
                          key={mod.id}
                          onClick={() => toggleUserModule(u.id, mod.id)}
                          style={{
                            ...styles.moduleBadge,
                            background: (u.moduleAccess || []).includes(mod.id) ? '#4f46e5' : '#e5e7eb',
                            color: (u.moduleAccess || []).includes(mod.id) ? 'white' : '#6b7280'
                          }}
                          title={`Click para ${((u.moduleAccess || []).includes(mod.id) ? 'quitar' : 'agregar')} ${mod.name}`}
                        >
                          <mod.icon size={12} />
                        </button>
                      ))}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => deleteUser(u.id)}
                      style={styles.deleteBtn}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', background: '#f5f7fa' },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    background: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  navbarBrand: { display: 'flex', alignItems: 'center', gap: '12px' },
  navbarTitle: { fontSize: '20px', fontWeight: 700, color: '#1f2937' },
  navbarRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  userName: { color: '#6b7280' },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  content: { padding: '32px', maxWidth: '1400px', margin: '0 auto' },
  section: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: { fontSize: '20px', fontWeight: 600, color: '#1f2937' },
  createBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500
  },
  createForm: {
    padding: '20px',
    background: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px'
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px'
  },
  modulesSelector: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  modulesLabel: {
    fontWeight: 600,
    color: '#374151',
    fontSize: '14px'
  },
  modulesCheckboxes: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  moduleCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#6b7280'
  },
  submitBtn: {
    padding: '10px 20px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #e5e7eb', color: '#6b7280' },
  td: { padding: '12px', borderBottom: '1px solid #e5e7eb' },
  deleteBtn: {
    padding: '6px 12px',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  moduleBadges: {
    display: 'flex',
    gap: '6px'
  },
  moduleBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '24px'
  },
  miniStat: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  miniStatValue: { fontSize: '18px', fontWeight: 700, color: '#1f2937' },
  miniStatLabel: { fontSize: '12px', color: '#6b7280' }
};
