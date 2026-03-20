import { Settings as SettingsIcon, Bell, Lock, Globe, Database, Save } from 'lucide-react';

export const Settings = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', margin: 0 }}>
          <SettingsIcon color="var(--primary)" /> Configuración del Sistema
        </h1>
        <button className="btn btn-primary">
          <Save size={18} /> Guardar Cambios
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        
        {/* Settings Sidebar */}
        <div className="card" style={{ padding: '1rem', alignSelf: 'start', position: 'sticky', top: '20px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <button className="btn" style={{ width: '100%', justifyContent: 'flex-start', background: '#e9ecef', color: 'var(--primary)', fontWeight: 600 }}>
                <Globe size={18} /> General
              </button>
            </li>
            <li>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', border: 'none', textAlign: 'left' }}>
                <Lock size={18} /> Seguridad
              </button>
            </li>
            <li>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', border: 'none', textAlign: 'left' }}>
                <Bell size={18} /> Notificaciones
              </button>
            </li>
            <li>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', border: 'none', textAlign: 'left' }}>
                <Database size={18} /> Respaldo de Datos
              </button>
            </li>
          </ul>
        </div>

        {/* Settings Form Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Perfil Corporativo</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="input-group">
                <label>Nombre de la Empresa</label>
                <input type="text" defaultValue="TechCorp Solutions S.A." />
              </div>
              <div className="input-group">
                <label>RFC / Tax ID</label>
                <input type="text" defaultValue="TCS-102938-XA1" />
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label>Dirección Fiscal</label>
                <input type="text" defaultValue="Avenida de los Insurgentes Sur 1234, CDMX" />
              </div>
              <div className="input-group">
                <label>Lenguaje del Sistema</label>
                <select defaultValue="es">
                  <option value="es">Español (México)</option>
                  <option value="en">English (US)</option>
                </select>
              </div>
              <div className="input-group">
                <label>Zona Horaria</label>
                <select defaultValue="cst">
                  <option value="cst">Central Standard Time (CST)</option>
                  <option value="est">Eastern Standard Time (EST)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Preferencias de Interfaz</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                Mostrar notificaciones de escritorio para nuevas ventas
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                Activar Tema Oscuro (Beta)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                Colapsar automáticamente la barra lateral (Sidebar) en pantallas pequeñas
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
