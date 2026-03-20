import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { Profile } from './pages/Profile';
import { Unauthorized } from './pages/Unauthorized';
import { AdminDashboard } from './pages/Admin';
import { Sales } from './pages/Sales';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes (Authenticated users only) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                
                <Route element={<ProtectedRoute requiredPermission="dashboard" />}>
                  <Route path="/" element={<Dashboard />} />
                </Route>

                <Route element={<ProtectedRoute requiredPermission="crm" />}>
                  <Route path="/customers" element={<Customers />} />
                </Route>

                <Route element={<ProtectedRoute requiredPermission="sales" />}>
                  <Route path="/sales" element={<Sales />} />
                </Route>

                <Route element={<ProtectedRoute requiredPermission="reports" />}>
                  <Route path="/reports" element={<Reports />} />
                </Route>

                <Route element={<ProtectedRoute requiredPermission="settings" />}>
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* Always available to signed in users */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Admin Only Route */}
                <Route element={<ProtectedRoute requiredPermission="admin" />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              </Route>
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
