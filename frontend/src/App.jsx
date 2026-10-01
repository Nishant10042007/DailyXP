import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Badges    from './pages/Badges';
import Navbar    from './components/Navbar';
import { Zap } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-brand-500/20 animate-spin border-t-brand-500" />
        <Zap className="absolute inset-0 m-auto w-6 h-6 text-brand-400" />
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen relative">
      {/* Background Orbs */}
      <div className="orb orb-purple" />
      <div className="orb orb-blue" />

      {/* Persistent Navbar for logged-in users */}
      {user && <Navbar />}

      {/* Page content */}
      <main className="relative z-10 container mx-auto px-4 max-w-6xl">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login"    element={!user ? <Login />    : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/badges"    element={<ProtectedRoute><Badges /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
