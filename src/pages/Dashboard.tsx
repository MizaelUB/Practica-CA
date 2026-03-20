import { PenTool, Layers, Settings, Users, ArrowUpRight } from 'lucide-react';

export const Dashboard = () => {

  const StatCard = ({ icon, title, value, color }: { icon: any, title: string, value: string, color: string }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', gap: '1.5rem', borderLeft: `4px solid ${color}` }}>
      <div style={{ color: color }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.5px' }}>{title}</p>
        <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 600 }}>{value}</h3>
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, color: 'var(--primary)', fontWeight: 600, fontSize: '1.5rem' }}>Dashboard 2</h1>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Home <span style={{ margin: '0 0.5rem' }}>&gt;</span> Dashboard 2
        </div>
      </div>

      {/* Top Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard icon={<PenTool size={36} />} title="Total Income" value="953,000" color="#1e88e5" />
        <StatCard icon={<Layers size={36} />} title="Total Expense" value="236,000" color="#1e88e5" />
        <StatCard icon={<Settings size={36} />} title="Total Assets" value="987,563" color="#1e88e5" />
        <StatCard icon={<Users size={36} />} title="Total Staff" value="987,563" color="#1e88e5" />
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        
        {/* Large Chart Area Placeholder */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>Sales Overview</h3>
            <select style={{ padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <option>January 2021</option>
            </select>
          </div>
          
          <div style={{ background: '#1e88e5', padding: '1.5rem', color: 'white', display: 'flex', gap: '4rem' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase' }}>Total Sales</p>
              <h2 style={{ margin: 0, fontWeight: 700 }}>$10,345</h2>
            </div>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase' }}>This Month</p>
              <h2 style={{ margin: 0, fontWeight: 700 }}>$7,589</h2>
            </div>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase' }}>This Week</p>
              <h2 style={{ margin: 0, fontWeight: 700 }}>$1,476</h2>
            </div>
          </div>

          <div style={{ padding: '2rem', flex: 1, minHeight: '350px', background: 'white' }}>
            {/* Mock Chart Area */}
            <div style={{ width: '100%', height: '100%', borderBottom: '2px solid var(--border-color)', borderLeft: '2px solid var(--border-color)', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '10%', left: '10%', color: 'var(--primary)' }}><ArrowUpRight size={100} strokeWidth={1} style={{ transform: 'rotate(15deg) scale(1.5)', transformOrigin: 'bottom left', opacity: 0.8 }} /></div>
              <div style={{ position: 'absolute', bottom: '40%', left: '33%', color: 'var(--primary)' }}><ArrowUpRight size={100} strokeWidth={1} style={{ transform: 'rotate(-5deg) scale(1.5)', transformOrigin: 'bottom left', opacity: 0.8 }} /></div>
              <div style={{ position: 'absolute', bottom: '30%', left: '55%', color: 'var(--primary)' }}><ArrowUpRight size={100} strokeWidth={1} style={{ transform: 'rotate(35deg) scale(1.5)', transformOrigin: 'bottom left', opacity: 0.8 }} /></div>
            </div>
          </div>
        </div>

        {/* Small Chart Area Placeholder */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 2rem 0', fontSize: '1.1rem', fontWeight: 500 }}>Visit Separation</h3>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Mock Donut */}
            <div style={{ 
              width: '180px', height: '180px', borderRadius: '50%', 
              border: '25px solid var(--primary)', 
              borderTopColor: '#26c6da', 
              borderRightColor: '#7460ee', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{ margin: 0, fontWeight: 700 }}>Visits</h2>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Mobile</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>38.5%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tablet</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>30.8%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Desktop</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>7.7%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Other</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>23.1%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
