import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/DagestanNavbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [avatarError, setAvatarError] = useState<Record<string, boolean>>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
                  <i className="fas fa-cogs me-2"></i>Admin Panel
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
            <div className="dagestan-user-menu">
              <div className="dagestan-dropdown-container" ref={userDropdownRef}>
                <button
                  className="dagestan-user-dropdown-btn"
                  type="button"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  {user.avatar && !avatarError[user._id] ? (
                    <img
                      src={
                        user.avatar.startsWith('http') ? user.avatar :
                          user.avatar.startsWith('/uploads') || user.avatar.startsWith('/') ? user.avatar :
                            `/uploads/${user.avatar}`
                      }
                      alt="Profile"
                      className="rounded-circle"
                      style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                      onError={() => setAvatarError(prev => ({ ...prev, [user._id]: true }))}
                    />
                  ) : (
                    <div className="dagestan-user-initial">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="dagestan-user-name">{user.username}</span>
                  <i className={`fas fa-chevron-down ms-2 ${isUserDropdownOpen ? 'rotated' : ''}`}></i>
                </button>

                {isUserDropdownOpen && (
                  <div className="dagestan-dropdown-menu">
                    <NavLink
                      to="/profile"
                      className="dagestan-dropdown-item"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <i className="fas fa-user me-2"></i> My Profile
                    </NavLink>
                    <NavLink
                      to="/user"
                      className="dagestan-dropdown-item"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <i className="fas fa-tachometer-alt me-2"></i> Dashboard
                    </NavLink>
                    {user.role === 'admin' && (
                      <NavLink
                        to="/admin"
                        className="dagestan-dropdown-item"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <i className="fas fa-cogs me-2"></i> Admin Panel
                      </NavLink>
                    )}
                    <div className="dagestan-dropdown-divider"></div>
                    <button className="dagestan-dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i> Logout
                    </button>
                  </div>
                )}
              </div>
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
          <i className={`bi ${isMenuOpen ? 'bi-x' : 'bi-list'}`} style={{ fontSize: '24px' }}></i>
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
                className={({ isActive }) => `dagestan-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-user me-2"></i> My Profile
              </NavLink>
              <NavLink
                to="/user"
                className={({ isActive }) => `dagestan-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-tachometer-alt me-2"></i> Dashboard
              </NavLink>
              {user.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `dagestan-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-cogs me-2"></i> Admin Panel
                </NavLink>
              )}
              <button className="dagestan-nav-btn dagestan-logout-btn" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
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