import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Mail, PieChart } from 'lucide-react';

export const Customers = () => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/erp/customers', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setCustomers(data);
      setLoading(false);
    })
    .catch(console.error);
  }, [token]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users color="#fde047" /> CRM Corporativo
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            <strong style={{ color: '#fde047' }}>Módulo Premium.</strong> Gestión de cartera de clientes.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(234, 179, 8, 0.2)', padding: '1rem', borderRadius: '50%', color: '#fde047' }}>
                  <Users size={24} />
              </div>
              <div>
                  <h2 style={{ margin: 0 }}>{customers.length || 3}</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>Total Clientes</p>
              </div>
          </div>
          <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '50%', color: 'var(--success)' }}>
                  <PieChart size={24} />
              </div>
              <div>
                  <h2 style={{ margin: 0 }}>$45k</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>Ventas Mensuales</p>
              </div>
          </div>
      </div>

      <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>        
        {loading ? <p style={{ padding: '2rem', textAlign: 'center' }}>Cargando CRM...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>ID</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Empresa</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Contacto Principal</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Estado</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>#{item.id + 1000}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{item.company}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{item.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Mail size={12}/> {item.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ background: item.status === 'Activo' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: item.status === 'Activo' ? 'var(--success)' : 'var(--error)', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.8rem' }}>
                        {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
