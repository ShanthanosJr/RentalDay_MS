import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthDagestan.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    userId: `USER${Date.now()}`, // Auto-generated user ID
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    licenseNumber: '',
    dateOfBirth: '',
  });
  
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.id === 'userId') return;
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    setLoading(true);
    
    const registrationData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      profileDetails: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        licenseNumber: formData.licenseNumber,
        dateOfBirth: formData.dateOfBirth
      }
    };
    
    const result = await register(
      registrationData.username, 
      registrationData.email, 
      registrationData.password,
      registrationData.profileDetails,
      profilePhoto || undefined
    );
    
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-split-container fade-in">
      {/* FORM SIDE - Now with accordion for long form */}
      <div className="auth-form-side">
        <div className="w-100">
          <div className="card border-0 bg-white shadow-lg">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div>
                  <h3 className="fw-bold mb-1">Create Account</h3>
                  <p className="text-muted small mb-0">Join our community</p>
                </div>
                <div className="text-end d-none d-sm-block">
                  <small className="text-success fw-bold d-block">Step 1 of 1</small>
                  <span className="badge bg-dark rounded-0">Registration</span>
                </div>
              </div>

              {error && <div className="alert alert-danger rounded-0 mb-4">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="accordion accordion-flush accordion-tech" id="registerFormAccordion">
                  {/* Account Credentials Section */}
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#credentials" 
                        aria-expanded="true"
                      >
                        Account Credentials
                      </button>
                    </h2>
                    <div id="credentials" className="accordion-collapse collapse show">
                      <div className="accordion-body">
                        <div className="form-group-tech">
                          <label>User ID</label>
                          <div className="position-relative">
                            <i className="fas fa-id-card input-icon"></i>
                            <input type="text" className="form-control ps-5 rounded-0" id="userId" value={formData.userId} readOnly />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group-tech">
                              <label>Username</label>
                              <div className="position-relative">
                                <i className="fas fa-user input-icon"></i>
                                <input type="text" className="form-control ps-5 rounded-0" id="username" value={formData.username} onChange={handleChange} required />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group-tech">
                              <label>Password</label>
                              <div className="position-relative">
                                <i className="fas fa-lock input-icon"></i>
                                <input type="password" className="form-control ps-5 rounded-0" id="password" value={formData.password} onChange={handleChange} required />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group-tech">
                          <label>Email Address</label>
                          <div className="position-relative">
                            <i className="fas fa-envelope input-icon"></i>
                            <input type="email" className="form-control ps-5 rounded-0" id="email" value={formData.email} onChange={handleChange} required />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Dossier Section */}
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button collapsed" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#personal" 
                        aria-expanded="false"
                      >
                        Personal Dossier
                      </button>
                    </h2>
                    <div id="personal" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group-tech">
                              <label>First Name</label>
                              <div className="position-relative">
                                <i className="fas fa-user input-icon"></i>
                                <input type="text" className="form-control ps-5 rounded-0" id="firstName" value={formData.firstName} onChange={handleChange} required />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group-tech">
                              <label>Last Name</label>
                              <div className="position-relative">
                                <i className="fas fa-user input-icon"></i>
                                <input type="text" className="form-control ps-5 rounded-0" id="lastName" value={formData.lastName} onChange={handleChange} required />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group-tech">
                              <label>Phone Contact</label>
                              <div className="position-relative">
                                <i className="fas fa-phone input-icon"></i>
                                <input type="tel" className="form-control ps-5 rounded-0" id="phone" value={formData.phone} onChange={handleChange} required />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group-tech">
                              <label>Driver's License ID</label>
                              <div className="position-relative">
                                <i className="fas fa-id-badge input-icon"></i>
                                <input type="text" className="form-control ps-5 rounded-0" id="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group-tech">
                          <label>Date of Birth</label>
                          <div className="position-relative">
                            <i className="fas fa-calendar input-icon"></i>
                            <input type="date" className="form-control ps-5 rounded-0" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                          </div>
                        </div>
                        <div className="form-group-tech">
                          <label>Residential Address</label>
                          <div className="position-relative">
                            <i className="fas fa-home input-icon"></i>
                            <input type="text" className="form-control ps-5 rounded-0" id="address" value={formData.address} onChange={handleChange} required />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Photo Outside */}
                <div className="form-group-tech mt-4">
                  <label>Profile Photo</label>
                  <input type="file" className="form-control rounded-0" id="profilePhoto" accept="image/*" onChange={handleFileChange} />
                  {previewUrl && (
                    <div className="image-preview mt-2">
                      <img src={previewUrl} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className="form-check mt-3">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="agreeTerms" 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <label className="form-check-label small text-muted" htmlFor="agreeTerms">
                    I agree to the <Link to="/terms" className="text-success">Terms and Conditions</Link>
                  </label>
                </div>

                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary btn-lg rounded-0 fw-bold" disabled={loading || !agreeTerms}>
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </form>

             <div className="mt-4 text-center border-top pt-4">
                <p className="text-muted small mb-1">Already have an account?</p>
                <Link to="/login" className="btn btn-link text-success fw-bold text-decoration-none">
                  Sign In &rarr;
                </Link>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* VISUAL SIDE - Enhanced with Dagestan theme */}
      <div className="auth-visual-side">
        <img 
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop" 
          alt="Dagestan Mountain Landscape" 
          className="auth-img-bg"
        />
        <div className="auth-visual-overlay"></div>
        <div className="position-relative z-index-3 text-center px-4 py-5">
          <h2 className="display-5 fw-bold mb-3">JOIN <span className="text-success">RentalDay</span> ADVENTURES</h2>
          <p className="lead opacity-75 mb-4">Experience the breathtaking landscapes with our vehicle rentals.</p>
          <div className="d-flex justify-content-center gap-4">
            <div className="text-start border-start border-success ps-3">
              <h4 className="fw-bold mb-0">100+</h4>
              <small className="text-success">VEHICLES</small>
            </div>
            <div className="text-start border-start border-success ps-3">
              <h4 className="fw-bold mb-0">24/7</h4>
              <small className="text-success">SUPPORT</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;