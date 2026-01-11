import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/DagestanNavbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [avatarError, setAvatarError] = useState<Record<string, boolean>>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="dagestan-nav">
      <div className="dagestan-nav-inner">
        <Link className="dagestan-logo" to="/">
          RENTAL<span style={{ color: '#28a745' }}>DAY</span>
        </Link>
        
        <div className="dagestan-nav-links">
          {user && (
            <>
              <NavLink 
                to="/vehicles" 
                className={({ isActive }) => `dagestan-nav-link ${isActive ? 'active' : ''}`}
              >
                <i className="fas fa-car me-2"></i> Browse Vehicles
              </NavLink>
              {user.role === 'admin' && (
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => `dagestan-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="fas fa-cogs me-2"></i> Admin Portal
                </NavLink>
              )}
              {user.role === 'user' && (
                <NavLink 
                  to="/user" 
                  className={({ isActive }) => `dagestan-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="fas fa-tachometer-alt me-2"></i> Dashboard
                </NavLink>
              )}
            </>
          )}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => `dagestan-nav-link d-flex align-items-center ${isActive ? 'active' : ''}`}
              >
                {user.avatar && !avatarError[user._id] ? (
                  <img 
                    src={user.avatar.startsWith('http') ? user.avatar : `/uploads/${user.avatar}`}
                    alt="Profile" 
                    className="rounded-circle me-2" 
                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                    onError={() => setAvatarError(prev => ({ ...prev, [user._id]: true }))}
                  />
                ) : (
                  <i className="fas fa-user-circle me-2" style={{ fontSize: '30px' }}></i>
                )}
                <span className="fw-bold">Hi, {user.username}</span>
              </NavLink>
              <button className="dagestan-nav-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i> Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink 
                to="/login" 
                className={({ isActive }) => `dagestan-nav-link ${isActive ? 'active' : ''}`}
              >
                <i className="fas fa-sign-in-alt me-2"></i> Login
              </NavLink>
              <NavLink 
                to="/register" 
                className="dagestan-nav-btn"
              >
                <i className="fas fa-user-plus me-2"></i> Get Started
              </NavLink>
            </>
          )}
        </div>

        <button className="dagestan-mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className={`bi ${isMenuOpen ? 'bi-x' : 'bi-list'}`} style={{fontSize: '24px'}}></i>
        </button>
      </div>

      {isMenuOpen && (
        <div className="dagestan-mobile-menu">
          {user && (
            <>
              <NavLink 
                to="/vehicles" 
                className={({ isActive }) => `dagestan-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-car me-2"></i> Browse Vehicles
              </NavLink>
              {user.role === 'admin' && (
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => `dagestan-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-cogs me-2"></i> Admin Portal
                </NavLink>
              )}
              {user.role === 'user' && (
                <NavLink 
                  to="/user" 
                  className={({ isActive }) => `dagestan-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-tachometer-alt me-2"></i> Dashboard
                </NavLink>
              )}
              <NavLink 
                to="/profile" 
                className={({ isActive }) => `dagestan-nav-link d-flex align-items-center ${isActive ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {user.avatar && !avatarError[user._id] ? (
                  <img 
                    src={user.avatar.startsWith('http') ? user.avatar : `/uploads/${user.avatar}`}
                    alt="Profile" 
                    className="rounded-circle me-2" 
                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                    onError={() => setAvatarError(prev => ({ ...prev, [user._id]: true }))}
                  />
                ) : (
                  <i className="fas fa-user-circle me-2" style={{ fontSize: '30px' }}></i>
                )}
                <span className="fw-bold">Hi, {user.username}</span>
              </NavLink>
              <button className="dagestan-nav-btn" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                <i className="fas fa-sign-out-alt me-2"></i> Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <NavLink 
                to="/login" 
                className={({ isActive }) => `dagestan-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-sign-in-alt me-2"></i> Login
              </NavLink>
              <NavLink 
                to="/register" 
                className="dagestan-nav-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-user-plus me-2"></i> Get Started
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;