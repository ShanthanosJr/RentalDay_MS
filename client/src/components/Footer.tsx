import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer-tech">
      <div className="container">
        <div className="row g-5">
          
          {/* BRAND COLUMN */}
          <div className="col-lg-4">
            <h3 className="fw-bold mb-3">RENTAL<span className="text-success">Day</span></h3>
            <p className="text-secondary small">
              The world's most advanced autonomous vehicle rental platform. 
              Secure, efficient, and AI-driven mobility for the modern era.
            </p>
            <div className="d-flex gap-3 mt-4">
              {/* Social Placeholders (Bootstrap Icons) */}
              <div className="text-secondary"><i className="bi bi-twitter fs-5"></i></div>
              <div className="text-secondary"><i className="bi bi-linkedin fs-5"></i></div>
              <div className="text-secondary"><i className="bi bi-instagram fs-5"></i></div>
            </div>
          </div>

          {/* LINKS */}
          <div className="col-lg-2 col-6">
            <h6 className="text-success fw-bold mb-3 small">PLATFORM</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/vehicles" className="footer-link">Browse Fleet</Link></li>
              <li><Link to="/login" className="footer-link">Pilot Access</Link></li>
              <li><Link to="/register" className="footer-link">Registration</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div className="col-lg-2 col-6">
             <h6 className="text-success fw-bold mb-3 small">LEGAL</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><span className="footer-link" style={{cursor:'pointer'}}>Privacy Policy</span></li>
              <li><span className="footer-link" style={{cursor:'pointer'}}>Terms of Service</span></li>
              <li><span className="footer-link" style={{cursor:'pointer'}}>Liability</span></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="col-lg-4">
            <h6 className="text-success fw-bold mb-3 small">SYSTEM UPDATES</h6>
            <p className="small text-secondary">Subscribe for fleet updates and security patches.</p>
            <div className="input-group">
              <input type="text" className="form-control footer-input" placeholder="Enter email..." />
              <button className="btn btn-primary rounded-0">JOIN</button>
            </div>
          </div>

        </div>

        <hr className="border-secondary my-5 opacity-25" />

        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <small className="text-secondary">&copy; 2025 RENTAL.OS SYSTEM. ALL RIGHTS RESERVED.</small>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success bg-opacity-10 text-success border border-success rounded-0">SYSTEM ONLINE</span>
            <span className="small text-secondary">V 1.0.6</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;