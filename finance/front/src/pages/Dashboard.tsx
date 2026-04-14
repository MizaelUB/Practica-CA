import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DollarSign, FileText, CheckCircle, Clock, XCircle, LogOut, Lock, Plus } from 'lucide-react';

interface Invoice {
  id: number;
  customer_name: string;
  company: string;
  total: number;
  status: string;
  date: string;
}

interface Summary {
  totalRevenue: number;
  totalInvoices: number;
  pendingAmount: number;
  paidAmount: number;
}

export const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Check if user has access to finance module
  const hasAccess = user?.moduleAccess?.includes('finance');

  useEffect(() => {
    if (token && hasAccess) {
      fetchInvoices();
      fetchSummary();
      fetchMonthlyRevenue();
      fetchCustomers();
    }
  }, [token, hasAccess]);

  const fetchInvoices = async () => {
    const res = await fetch('/api/finance/invoices', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setInvoices(data);
  };

  const fetchSummary = async () => {
    const res = await fetch('/api/finance/summary', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setSummary(data);
  };

  const fetchMonthlyRevenue = async () => {
    const res = await fetch('/api/finance/monthly-revenue', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setMonthlyRevenue(data);
  };

  const updateInvoiceStatus = async (id: number, status: string) => {
    await fetch(`/api/finance/invoices/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    fetchInvoices();
    fetchSummary();
  };

  const deleteInvoice = async (id: number) => {
    if (!confirm('¿Eliminar factura?')) return;
    await fetch(`/api/finance/invoices/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchInvoices();
    fetchSummary();
  };
  
  const fetchCustomers = async () => {
    const res = await fetch('/api/finance/customers', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setCustomers(data);
  };

  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const invoice = {
      customer_id: parseInt(formData.get('customer_id') as string),
      total: parseFloat(formData.get('total') as string),
      date: formData.get('date') as string,
      status: formData.get('status') as string
    };

    await fetch('/api/finance/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(invoice)
    });

    setShowInvoiceForm(false);
    fetchInvoices();
    fetchSummary();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={18} color="#10b981" />;
      case 'pending': return <Clock size={18} color="#f59e0b" />;
      case 'cancelled': return <XCircle size={18} color="#ef4444" />;
      default: return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (!hasAccess) {
    return (
      <div style={styles.container}>
        <nav style={styles.navbar}>
          <div style={styles.navbarBrand}>
            <DollarSign size={28} color="#10b981" />
            <span style={styles.navbarTitle}>Finanzas ERP</span>
          </div>
          <div style={styles.navbarRight}>
            <span style={styles.userName}>{user?.name}</span>
            <button onClick={logout} style={styles.logoutBtn}>
              <LogOut size={18} />
              Salir
            </button>
          </div>
        </nav>
        <div style={styles.accessDenied}>
          <Lock size={64} color="#ef4444" />
          <h1 style={styles.accessDeniedTitle}>Acceso Denegado</h1>
          <p style={styles.accessDeniedText}>
            No tienes permiso para acceder al módulo de Finanzas.
          </p>
          <p style={styles.accessDeniedSubtext}>
            Contacta al administrador para solicitar acceso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.navbarBrand}>
          <DollarSign size={28} color="#10b981" />
          <span style={styles.navbarTitle}>Finanzas ERP</span>
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
        {summary && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: '#d1fae5' }}><DollarSign size={28} color="#10b981" /></div>
              <div>
                <div style={styles.statValue}>{formatCurrency(summary.totalRevenue)}</div>
                <div style={styles.statLabel}>Ingresos Totales</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: '#dbeafe' }}><FileText size={28} color="#3b82f6" /></div>
              <div>
                <div style={styles.statValue}>{summary.totalInvoices}</div>
                <div style={styles.statLabel}>Facturas</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: '#fef3c7' }}><Clock size={28} color="#f59e0b" /></div>
              <div>
                <div style={styles.statValue}>{formatCurrency(summary.pendingAmount)}</div>
                <div style={styles.statLabel}>Pendiente</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: '#d1fae5' }}><CheckCircle size={28} color="#10b981" /></div>
              <div>
                <div style={styles.statValue}>{formatCurrency(summary.paidAmount)}</div>
                <div style={styles.statLabel}>Pagado</div>
              </div>
            </div>
          </div>
        )}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Ingresos Mensuales</h2>
          <div style={styles.chartContainer}>
            {monthlyRevenue.map((month) => (
              <div key={month.month} style={styles.barChart}>
                <div style={styles.barLabel}>{month.month}</div>
                <div style={styles.barWrapper}>
                  <div
                    style={{
                      ...styles.bar,
                      height: `${Math.min((month.revenue / 5000) * 100, 100)}%`
                    }}
                  />
                </div>
                <div style={styles.barValue}>{formatCurrency(month.revenue)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Facturas</h2>
            <button 
              onClick={() => {
                setEditingItem(null);
                setShowInvoiceForm(true);
              }}
              style={styles.addBtn}
            >
              <Plus size={18} /> Nueva Factura
            </button>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Empresa</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Monto</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td style={styles.td}>{inv.customer_name}</td>
                  <td style={styles.td}>{inv.company}</td>
                  <td style={styles.td}>{inv.date}</td>
                  <td style={styles.td}>{formatCurrency(inv.total)}</td>
                  <td style={styles.td}>
                    <div style={styles.statusBadge}>
                      {getStatusIcon(inv.status)}
                      <span style={{ marginLeft: '6px' }}>{inv.status}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      {inv.status === 'pending' && (
                        <button
                          onClick={() => updateInvoiceStatus(inv.id, 'paid')}
                          style={styles.approveBtn}
                        >
                          Pagar
                        </button>
                      )}
                      {inv.status !== 'cancelled' && (
                        <button
                          onClick={() => updateInvoiceStatus(inv.id, 'cancelled')}
                          style={styles.cancelBtn}
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        onClick={() => deleteInvoice(inv.id)}
                        style={styles.deleteBtn}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Factura */}
      {showInvoiceForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Nueva Factura</h3>
            <form onSubmit={handleSaveInvoice} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Cliente</label>
                <select name="customer_id" style={styles.input} required>
                  <option value="">Seleccionar cliente...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Monto Total</label>
                <input name="total" type="number" step="0.01" placeholder="0.00" style={styles.input} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Fecha</label>
                <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} style={styles.input} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Estado Inicial</label>
                <select name="status" style={styles.input}>
                  <option value="pending">Pendiente</option>
                  <option value="paid">Pagado</option>
                </select>
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowInvoiceForm(false)} style={styles.secondaryBtn}>Cancelar</button>
                <button type="submit" style={styles.primaryBtn}>Crear Factura</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '24px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  statIcon: {
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px'
  },
  statValue: { fontSize: '24px', fontWeight: 700, color: '#1f2937' },
  statLabel: { color: '#6b7280', fontSize: '14px' },
  section: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sectionTitle: { fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#1f2937' },
  chartContainer: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-end',
    height: '200px',
    padding: '20px',
    background: '#f9fafb',
    borderRadius: '8px'
  },
  barChart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1
  },
  barLabel: { fontSize: '12px', color: '#6b7280', marginBottom: '8px' },
  barWrapper: {
    width: '60px',
    height: '150px',
    background: '#e5e7eb',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  bar: {
    width: '100%',
    background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
    borderRadius: '6px',
    transition: 'height 0.3s'
  },
  barValue: { fontSize: '11px', color: '#374151', marginTop: '8px', textAlign: 'center' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #e5e7eb', color: '#6b7280' },
  td: { padding: '12px', borderBottom: '1px solid #e5e7eb' },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px',
    background: '#f3f4f6',
    borderRadius: '20px',
    width: 'fit-content',
    fontSize: '13px'
  },
  actionButtons: { display: 'flex', gap: '8px' },
  approveBtn: {
    padding: '6px 12px',
    background: '#d1fae5',
    color: '#065f46',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px'
  },
  cancelBtn: {
    padding: '6px 12px',
    background: '#fef3c7',
    color: '#92400e',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px'
  },
  deleteBtn: {
    padding: '6px 12px',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px'
  },
  accessDenied: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center'
  },
  accessDeniedTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1f2937',
    marginTop: '24px',
    marginBottom: '16px'
  },
  accessDeniedText: {
    fontSize: '18px',
    color: '#6b7280',
    marginBottom: '8px'
  },
  accessDeniedSubtext: {
    fontSize: '14px',
    color: '#9ca3af'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '430px'
  },
  modalTitle: { fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#1f2937' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: 600, color: '#374151' },
  input: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px'
  },
  modalActions: { display: 'flex', gap: '12px', marginTop: '12px' },
  secondaryBtn: {
    flex: 1,
    padding: '12px',
    background: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600
  },
  primaryBtn: {
    flex: 1,
    padding: '12px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600
  }
};
