import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthDagestan.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    
    if (result.success && result.user) {
      // Mock remember me (store in localStorage if implemented backend)
      if (rememberMe) localStorage.setItem('rememberMe', 'true');
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } else {
      setError(result.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-split-container fade-in">
      {/* VISUAL SIDE - Enhanced with Dagestan theme */}
      <div className="auth-visual-side">
        <img 
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop" 
          alt="Dagestan Mountain Landscape" 
          className="auth-img-bg"
        />
        <div className="auth-visual-overlay"></div>
        <div className="position-relative z-index-3 text-center px-4 py-5">
          <h1 className="display-4 fw-bold mb-3">RentalDay<span className="text-success"> RENTALS</span></h1>
          <p className="lead opacity-75 mb-4">Discover the beauty of rentalday with our premium vehicle fleet</p>
          <div className="border border-success d-inline-block px-4 py-2 rounded-pill">
            <small className="text-success fw-bold">EXPLORE • RENT • ADVENTURE</small>
          </div>
        </div>
      </div>

      {/* FORM SIDE - Added icons, toggle, remember me */}
      <div className="auth-form-side">
        <div className="w-100">
          <div className="card border-0 bg-white shadow-lg">
            <div className="card-body p-4 p-md-5">
              <div className="mb-4">
                <h3 className="fw-bold mb-1">Welcome Back</h3>
                <p className="text-muted small">Sign in to your account</p>
              </div>

              {error && <div className="alert alert-danger rounded-0 mb-4">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group-tech mb-4">
                  <label className="form-label small fw-bold text-muted">Email Address</label>
                  <div className="position-relative">
                    <i className="fas fa-envelope input-icon"></i>
                    <input
                      type="email"
                      className="form-control ps-5 rounded-0"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group-tech mb-4">
                  <label className="form-label small fw-bold text-muted">Password</label>
                  <div className="position-relative">
                    <i className="fas fa-lock input-icon"></i>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control ps-5 pe-5 rounded-0"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <i 
                      className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <div className="form-check">
                    <input 
                      type="checkbox" 
                      className="form-check-input" 
                      id="rememberMe" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label small text-muted" htmlFor="rememberMe">Remember me</label>
                  </div>
                  <Link to="/forgot-password" className="small text-success">Forgot Password?</Link>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg rounded-0 fw-bold" disabled={loading}>
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center border-top pt-4">
                <p className="text-muted small mb-1">Don't have an account?</p>
                <Link to="/register" className="btn btn-link text-success fw-bold text-decoration-none">
                  Create Account &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;