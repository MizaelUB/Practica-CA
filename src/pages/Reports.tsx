import { Activity, BarChart2, PieChart, TrendingUp, DownloadCloud } from 'lucide-react';

export const Reports = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', margin: 0 }}>
          <Activity color="var(--primary)" /> Módulo de Reportes
        </h1>
        <button className="btn btn-outline">
          <DownloadCloud size={18} /> Exportar PDF
        </button>
      </div>

      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Visualiza el rendimiento general de la empresa. Este módulo ofrece métricas avanzadas (Datos de demostración).
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Placeholder Bar Chart */}
        <div className="card" style={{ padding: '2rem', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            <BarChart2 color="var(--primary)" /> Crecimiento de Ingresos
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '1rem', paddingTop: '2rem', borderBottom: '2px solid var(--border-color)', position: 'relative' }}>
            {/* Axis marks */}
            <div style={{ position: 'absolute', bottom: '25%', left: 0, right: 0, borderBottom: '1px dashed #e9ecef', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', bottom: '50%', left: 0, right: 0, borderBottom: '1px dashed #e9ecef', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', bottom: '75%', left: 0, right: 0, borderBottom: '1px dashed #e9ecef', zIndex: 0 }}></div>

            {/* Bars */}
            <div style={{ width: '40px', height: '30%', background: '#b2dfdb', borderRadius: '4px 4px 0 0', zIndex: 1 }}></div>
            <div style={{ width: '40px', height: '45%', background: '#80cbc4', borderRadius: '4px 4px 0 0', zIndex: 1 }}></div>
            <div style={{ width: '40px', height: '60%', background: '#4db6ac', borderRadius: '4px 4px 0 0', zIndex: 1 }}></div>
            <div style={{ width: '40px', height: '40%', background: '#26a69a', borderRadius: '4px 4px 0 0', zIndex: 1 }}></div>
            <div style={{ width: '40px', height: '80%', background: 'var(--primary)', borderRadius: '4px 4px 0 0', zIndex: 1, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-25px', left: '-50%', right: '-50%', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>Actual</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>
            <span>Ene</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Abr</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>May</span>
          </div>
        </div>

        {/* Placeholder Traffic Sources */}
        <div className="card" style={{ padding: '2rem', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            <PieChart color="var(--primary)" /> Fuentes de Adquisición
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ 
              width: '180px', height: '180px', borderRadius: '50%', 
              background: 'conic-gradient(var(--primary) 0% 45%, #26c6da 45% 75%, #fc4b6c 75% 90%, #e9ecef 90% 100%)',
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{ width: '120px', height: '120px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Leads</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>4,208</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 500 }}><span style={{ width: 12, height: 12, background: 'var(--primary)', borderRadius: '2px' }}></span> Orgánico (45%)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 500 }}><span style={{ width: 12, height: 12, background: '#26c6da', borderRadius: '2px' }}></span> Referidos (30%)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 500 }}><span style={{ width: 12, height: 12, background: '#fc4b6c', borderRadius: '2px' }}></span> Social (15%)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 500 }}><span style={{ width: 12, height: 12, background: '#e9ecef', borderRadius: '2px' }}></span> Directo (10%)</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <TrendingUp color="var(--primary)" /> Resumen KPls
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>El rendimiento general del sistema se encuentra un 12.5% por encima del objetivo trimestral. Los reportes detallados requieren extracción manual por correo.</p>
      </div>

    </div>
  );
};
