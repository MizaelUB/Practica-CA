import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem' }}>
      <div className="glass" style={{ padding: '3rem', maxWidth: '500px', width: '100%', textAlign: 'center', borderTop: '4px solid var(--error)' }}>
        <div style={{ margin: '0 auto 1.5rem auto', display: 'inline-flex', background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
          <ShieldAlert size={48} color="var(--error)" />
        </div>
        <h1 style={{ marginBottom: '1rem', color: 'var(--error)' }}>Acceso Denegado</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Lo sentimos, no tienes los permisos suficientes para acceder a este módulo.
          Esta sección está restringida únicamente para usuarios con suscripción Premium.
        </p>
        
        <button 
          className="btn btn-outline"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} /> Volver al Inicio
        </button>
      </div>
    </div>
  );
};
