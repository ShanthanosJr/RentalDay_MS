import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserHome from './pages/UserHome';
import VehicleList from './pages/VehicleList';
import Profile from './pages/Profile';
import Dagestan from './Dagestan/Dagestan';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import AdminVehicle from './Admin/VehicleAdmin/AdminVehicle';
import './App.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Protected Route Component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route Component
const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/user" replace />;
  }

  return children;
};

// User Route Component
const UserRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>Loading...</div>;
  }

  if (!user || user.role !== 'user') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

function AppContent() {
  const { user, loading } = useAuth();
  const location = useLocation(); // 1. Get the current route

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>Loading...</div>;
  }

  // 2. Define which pages should NOT have the shell (Navbar/Footer)
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/dagestan';

  return (
    <div className="App">
      {/* 3. Hide Navbar on auth pages */}
      {!isAuthPage && <Navbar />}
      
      {/* 4. Remove container padding on auth pages so they can be full width/height */}
      <div className={!isAuthPage ? "app-shell app-shell--wide" : ""}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/user" element={<UserRoute><UserHome /></UserRoute>} />
          <Route path="/dagestan" element={<Dagestan />} />
          <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace /> : <Navigate to="/login" replace />} />
          <Route path="/admin/vehicle" element={<AdminRoute><AdminVehicle /></AdminRoute>} />
        </Routes>
      </div>

      {/* 5. Hide Footer on auth pages */}
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;