import { ShoppingCart, TrendingUp, DollarSign, Calendar } from 'lucide-react';

export const Sales = () => {
  const transactions = [
    { id: 'TRX-1020', date: '2023-10-01', customer: 'Global Imports', total: '$1,250.00', status: 'Pagado' },
    { id: 'TRX-1021', date: '2023-10-02', customer: 'Tech Solutions Inc', total: '$3,400.00', status: 'Pendiente' },
    { id: 'TRX-1022', date: '2023-10-03', customer: 'Comercio Local SA', total: '$850.00', status: 'Pagado' },
    { id: 'TRX-1023', date: '2023-10-04', customer: 'Global Imports', total: '$2,100.00', status: 'Cancelado' },
    { id: 'TRX-1024', date: '2023-10-05', customer: 'Tech Solutions Inc', total: '$5,000.00', status: 'Pagado' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', margin: 0 }}>
          <ShoppingCart color="var(--primary)" /> Gestión de Ventas
        </h1>
        <button className="btn btn-primary">
          + Nueva Venta
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '3px solid var(--success)' }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>VENTAS DEL MES</p>
          <h2 style={{ margin: '0.5rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={24} color="var(--success)" /> $12,600.00
          </h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '3px solid var(--primary)' }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>TICKETS ABIERTOS</p>
          <h2 style={{ margin: '0.5rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={24} color="var(--primary)" /> 42 Órdenes
          </h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '3px solid var(--error)' }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>PAGOS ATRASADOS</p>
          <h2 style={{ margin: '0.5rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={24} color="var(--error)" /> 3 Facturas
          </h2>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: '#f9fafb' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Últimas Transacciones</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>ID Factura</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Fecha</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Cliente</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Total</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--primary)' }}>{t.id}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t.date}</td>
                <td style={{ padding: '1rem 1.5rem' }}>{t.customer}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{t.total}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    background: t.status === 'Pagado' ? '#e6f4ea' : (t.status === 'Pendiente' ? '#fff4ce' : '#fce8e6'),
                    color: t.status === 'Pagado' ? '#137333' : (t.status === 'Pendiente' ? '#b08b00' : '#c5221f')
                  }}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
