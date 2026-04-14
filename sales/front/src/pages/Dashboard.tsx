import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Package, LogOut, Plus, Edit, Trash2, Lock, Users, Receipt, ShoppingBag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  company: string;
  status: string;
}

type Tab = 'products' | 'customers' | 'orders';

export const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalStock: 0, totalCustomers: 0 });
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [cart, setCart] = useState<{product_id: number, quantity: number, price: number, name: string}[]>([]);

  // Check if user has access to sales module
  const hasAccess = user?.moduleAccess?.includes('sales');

  useEffect(() => {
    if (token && hasAccess) {
      fetchProducts();
      fetchCustomers();
      fetchOrders();
      fetchStats();
    }
  }, [token, hasAccess]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/sales/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error('Error fetching products');
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/sales/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (e) {
      console.error('Error fetching customers');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/sales/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Error fetching stats');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/sales/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Error fetching orders');
    }
  };

  const addToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.product_id === productId);
      if (existing) {
        return prev.map(item => 
          item.product_id === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product_id: product.id, quantity: 1, price: product.price, name: product.name }];
    });
  };

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart.length) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const customer_id = parseInt(formData.get('customer_id') as string);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = {
      customer_id,
      items: cart,
      total,
      date: new Date().toISOString().split('T')[0],
      status: 'Completado'
    };

    const res = await fetch('/api/sales/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(order)
    });

    if (res.ok) {
      setShowOrderForm(false);
      setCart([]);
      fetchOrders();
      fetchProducts();
      fetchStats();
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const product = {
      name: formData.get('name') as string,
      sku: formData.get('sku') as string,
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string)
    };

    const url = editingItem
      ? `/api/sales/products/${editingItem.id}`
      : '/api/sales/products';
    const method = editingItem ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });

    setShowProductForm(false);
    setEditingItem(null);
    fetchProducts();
    fetchStats();
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const customer = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      status: formData.get('status') as string || 'Activo'
    };

    const url = editingItem
      ? `/api/sales/customers/${editingItem.id}`
      : '/api/sales/customers';
    const method = editingItem ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(customer)
    });

    setShowCustomerForm(false);
    setEditingItem(null);
    fetchCustomers();
    fetchStats();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('¿Eliminar producto?')) return;
    await fetch(`/api/sales/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchProducts();
    fetchStats();
  };

  const deleteCustomer = async (id: number) => {
    if (!confirm('¿Eliminar cliente?')) return;
    await fetch(`/api/sales/customers/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchCustomers();
    fetchStats();
  };

  const editProduct = (product: Product) => {
    setEditingItem(product);
    setShowProductForm(true);
  };

  const editCustomer = (customer: Customer) => {
    setEditingItem(customer);
    setShowCustomerForm(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (!hasAccess) {
    return (
      <div style={styles.container}>
        <nav style={styles.navbar}>
          <div style={styles.navbarBrand}>
            <ShoppingCart size={28} color="#f97316" />
            <span style={styles.navbarTitle}>Ventas ERP</span>
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
            No tienes permiso para acceder al módulo de Ventas.
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
          <ShoppingCart size={28} color="#f97316" />
          <span style={styles.navbarTitle}>Ventas ERP</span>
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
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: '#ffedd5' }}><Package size={28} color="#f97316" /></div>
            <div>
              <div style={styles.statValue}>{stats.totalProducts}</div>
              <div style={styles.statLabel}>Productos</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: '#fef3c7' }}><ShoppingCart size={28} color="#f59e0b" /></div>
            <div>
              <div style={styles.statValue}>{stats.totalStock}</div>
              <div style={styles.statLabel}>Stock Total</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: '#dbeafe' }}><Users size={28} color="#3b82f6" /></div>
            <div>
              <div style={styles.statValue}>{stats.totalCustomers}</div>
              <div style={styles.statLabel}>Clientes</div>
            </div>
          </div>
        </div>

        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('products')}
            style={activeTab === 'products' ? styles.activeTab : styles.tab}
          >
            <Package size={18} /> Productos
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            style={activeTab === 'customers' ? styles.activeTab : styles.tab}
          >
            <Users size={18} /> Clientes
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={activeTab === 'orders' ? styles.activeTab : styles.tab}
          >
            <Receipt size={18} /> Pedidos
          </button>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              {activeTab === 'products' ? 'Inventario de Productos' : 'Cartera de Clientes'}
            </h2>
            <button
              onClick={() => {
                setEditingItem(null);
                if (activeTab === 'products') setShowProductForm(true);
                else if (activeTab === 'customers') setShowCustomerForm(true);
                else setShowOrderForm(true);
              }}
              style={styles.addBtn}
            >
              <Plus size={18} /> {activeTab === 'orders' ? 'Nueva Venta' : 'Agregar'}
            </button>
          </div>

          {activeTab === 'products' && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>SKU</th>
                  <th style={styles.th}>Precio</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td style={styles.td}>{p.name}</td>
                    <td style={styles.td}>{p.sku}</td>
                    <td style={styles.td}>{formatCurrency(p.price)}</td>
                    <td style={styles.td}>
                      <span style={p.stock < 20 ? styles.lowStock : styles.inStock}>
                        {p.stock}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button onClick={() => editProduct(p)} style={styles.editBtn}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => deleteProduct(p.id)} style={styles.deleteBtn}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'customers' && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Empresa</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td style={styles.td}>{c.name}</td>
                    <td style={styles.td}>{c.email}</td>
                    <td style={styles.td}>{c.company}</td>
                    <td style={styles.td}>
                      <span style={c.status === 'Activo' ? styles.activeStatus : styles.inactiveStatus}>
                        {c.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button onClick={() => editCustomer(c)} style={styles.editBtn}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => deleteCustomer(c.id)} style={styles.deleteBtn}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'orders' && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Cliente</th>
                  <th style={styles.th}>Empresa</th>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={styles.td}>#{o.id}</td>
                    <td style={styles.td}>{o.customer_name}</td>
                    <td style={styles.td}>{o.company}</td>
                    <td style={styles.td}>{o.date}</td>
                    <td style={styles.td}>{formatCurrency(o.total)}</td>
                    <td style={styles.td}>
                      <span style={styles.activeStatus}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Producto */}
      {showProductForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>{editingItem ? 'Editar' : 'Nuevo'} Producto</h3>
            <form onSubmit={handleSaveProduct} style={styles.form}>
              <input name="name" defaultValue={editingItem?.name} placeholder="Nombre" style={styles.input} required />
              <input name="sku" defaultValue={editingItem?.sku} placeholder="SKU" style={styles.input} required />
              <input name="price" type="number" step="0.01" defaultValue={editingItem?.price} placeholder="Precio" style={styles.input} required />
              <input name="stock" type="number" defaultValue={editingItem?.stock} placeholder="Stock" style={styles.input} required />
              <div style={styles.modalActions}>
                <button type="button" onClick={() => { setShowProductForm(false); setEditingItem(null); }} style={styles.cancelBtn}>Cancelar</button>
                <button type="submit" style={styles.saveBtn}>{editingItem ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cliente */}
      {showCustomerForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>{editingItem ? 'Editar' : 'Nuevo'} Cliente</h3>
            <form onSubmit={handleSaveCustomer} style={styles.form}>
              <input name="name" defaultValue={editingItem?.name} placeholder="Nombre" style={styles.input} required />
              <input name="email" type="email" defaultValue={editingItem?.email} placeholder="Email" style={styles.input} required />
              <input name="company" defaultValue={editingItem?.company} placeholder="Empresa" style={styles.input} required />
              <select name="status" defaultValue={editingItem?.status || 'Activo'} style={styles.input}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => { setShowCustomerForm(false); setEditingItem(null); }} style={styles.cancelBtn}>Cancelar</button>
                <button type="submit" style={styles.saveBtn}>{editingItem ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nueva Venta */}
      {showOrderForm && (
        <div style={styles.modal}>
          <div style={{ ...styles.modalContent, maxWidth: '600px' }}>
            <h3 style={styles.modalTitle}>Nueva Venta</h3>
            <form onSubmit={handleSaveOrder} style={styles.form}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h4 style={{ marginBottom: '1rem', fontSize: '14px' }}>1. Información del Cliente</h4>
                  <select name="customer_id" style={styles.input} required>
                    <option value="">Seleccionar cliente...</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>

                  <h4 style={{ margin: '1.5rem 0 1rem 0', fontSize: '14px' }}>2. Agregar Productos</h4>
                  <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {products.filter(p => p.stock > 0).map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
                        <span style={{ fontSize: '13px' }}>{p.name} ({formatCurrency(p.price)})</span>
                        <button type="button" onClick={() => addToCart(p.id)} style={{ padding: '4px 8px', background: '#f97316', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          <Plus size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                  <h4 style={{ marginBottom: '1rem', fontSize: '14px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                    <ShoppingBag size={16} /> Carrito
                  </h4>
                  {cart.length === 0 ? (
                    <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', marginTop: '2rem' }}>El carrito está vacío</p>
                  ) : (
                    <>
                      <div style={{ minHeight: '150px' }}>
                        {cart.map(item => (
                          <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                            <span>{item.quantity}x {item.name}</span>
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ borderTop: '2px solid #e5e7eb', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                        <span>Total:</span>
                        <span>{formatCurrency(cart.reduce((s, i) => s + (i.price * i.quantity), 0))}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => { setShowOrderForm(false); setCart([]); }} style={styles.cancelBtn}>Cancelar</button>
                <button type="submit" style={styles.saveBtn} disabled={cart.length === 0}>Finalizar Venta</button>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
  tabs: { display: 'flex', gap: '12px', marginBottom: '20px' },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    color: '#6b7280'
  },
  activeTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#f97316',
    color: 'white',
    border: '2px solid #f97316',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600
  },
  section: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: { fontSize: '20px', fontWeight: 600, color: '#1f2937' },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#f97316',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #e5e7eb', color: '#6b7280' },
  td: { padding: '12px', borderBottom: '1px solid #e5e7eb' },
  inStock: { padding: '4px 12px', background: '#d1fae5', color: '#065f46', borderRadius: '20px', fontSize: '13px' },
  lowStock: { padding: '4px 12px', background: '#fee2e2', color: '#dc2626', borderRadius: '20px', fontSize: '13px' },
  activeStatus: { padding: '4px 12px', background: '#d1fae5', color: '#065f46', borderRadius: '20px', fontSize: '13px' },
  inactiveStatus: { padding: '4px 12px', background: '#f3f4f6', color: '#6b7280', borderRadius: '20px', fontSize: '13px' },
  actionButtons: { display: 'flex', gap: '8px' },
  editBtn: {
    padding: '6px 12px',
    background: '#dbeafe',
    color: '#1e40af',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  deleteBtn: {
    padding: '6px 12px',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
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
    maxWidth: '400px'
  },
  modalTitle: { fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#1f2937' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  input: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px'
  },
  modalActions: { display: 'flex', gap: '12px', marginTop: '8px' },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    background: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600
  },
  saveBtn: {
    flex: 1,
    padding: '12px',
    background: '#f97316',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600
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
  }
};
