import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ViewDetailsModal from '../components/ViewDetailsModal';

interface Rental {
  _id: string;
  vehicle: {
    make: string;
    model: string;
    manufacturedYear?: number;
    fuelType?: string;
    gear?: string;
    mileage?: number;
    price?: number;
    imageUrl?: string;
  };
  startDate: string;
  endDate: string;
  totalCost: number;
  status: string;
  createdAt: string;
  user?: {
    username: string;
    email: string;
  };
}

const UserHome: React.FC = () => {
  const { user } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  useEffect(() => {
    const fetchUserRentals = async () => {
      try {
        if (!user) {
          throw new Error('User not authenticated');
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5003'}/api/rentals/my-rentals`,
          {
            headers: {
              'user-id': user._id,
              'user-role': user.role,
            }
          }
        );

        setRentals(response.data);
      } catch (error) {
        console.error('Error fetching user rentals:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserRentals();
    }
  }, [user]);

  const handleViewDetails = (rental: Rental) => {
    setSelectedRental(rental);
    setShowViewDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowViewDetailsModal(false);
    setSelectedRental(null);
  };

  if (!user || user.role !== 'user') {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>Access denied</div>;
  }

  // MOCK DATA for Photo Loop (Using placeholders)
  const galleryImages = [
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600"
  ];

  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* 1. HERO SECTION WITH VIDEO LOOP */}
      <section className="hero-section">
        <video className="hero-video" autoPlay loop muted playsInline>
          {/* Using a tech/city night drive placeholder video */}
          <source src="https://www.pexels.com/download/video/5309381/" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="">
          <div className="glass-panel tech-card border-0">
            <h5 className="text-success letter-spacing-2 mb-2">IDENTITY VERIFIED: {user.username.toUpperCase()}</h5>
            <h1 className="display-3 fw-bold text-white mb-4">INITIATE <span className="text-success">DRIVE</span></h1>
            <p className="lead text-light mb-5">
              Access the world's most advanced autonomous fleet. <br />
              Your next journey is calculated and ready.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/vehicles" className="btn btn-primary btn-lg rounded-0 px-5">BROWSE FLEET</Link>
              <Link to="/profile" className="btn btn-outline-light btn-lg rounded-0 px-5">PILOT PROFILE</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DESCRIPTION & STATS (Unique Split Design) */}
      <section className="container py-5 my-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="ps-lg-5">
              <h6 className="text-success fw-bold">THE FUTURE OF MOBILITY</h6>
              <h2 className="display-4 fw-bold mb-4">SEAMLESS.<br />AUTONOMOUS.<br /><span className="text-muted">YOURS.</span></h2>
              <p className="text-muted lead">
                Rental.OS isn't just a rental service. It's a key to the city.
                Experience Level 5 autonomy with zero latency. Our fleet reacts
                faster than human reflexes, ensuring a safety record that is
                mathematically perfect.
              </p>

              <div className="row mt-5 g-3">
                <div className="col-6">
                  <div className="border-start border-3 border-success ps-3">
                    <h3 className="fw-bold mb-0">0.02s</h3>
                    <small className="text-muted">Reaction Time</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border-start border-3 border-dark ps-3">
                    <h3 className="fw-bold mb-0">99.9%</h3>
                    <small className="text-muted">Uptime Guarantee</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mt-4 mt-lg-0">
            {/* Abstract Graphic Element */}
            <div className="tech-card bg-dark text-white p-5 position-relative overflow-hidden" style={{ minHeight: '400px' }}>
              <div className="position-absolute top-0 end-0 p-5 opacity-25">
                <i className="bi bi-cpu fs-1 display-1"></i>
              </div>
              <h3 className="fw-bold position-relative z-1">LIVE TELEMETRY</h3>
              <div className="mt-4 position-relative z-1">
                <div className="d-flex justify-content-between mb-2 border-bottom border-secondary pb-2">
                  <span>Network Latency</span>
                  <span className="text-success">12ms</span>
                </div>
                <div className="d-flex justify-content-between mb-2 border-bottom border-secondary pb-2">
                  <span>Fleet Availability</span>
                  <span className="text-success">84 Units</span>
                </div>
                <div className="d-flex justify-content-between mb-2 border-bottom border-secondary pb-2">
                  <span>Local Weather</span>
                  <span className="text-success">Clear / 24°C</span>
                </div>
              </div>
              <div className="mt-5">
                <button className="btn btn-outline-success w-100 rounded-0">VIEW FULL ANALYTICS</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LATEST DRIVES (Mission Logs) */}
      <section className="bg-light py-5 position-relative">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h6 className="text-success fw-bold">PILOT LOGS</h6>
              <h2 className="fw-bold mb-0">RECENT ACTIVITY</h2>
            </div>
            <button className="btn btn-link text-dark fw-bold text-decoration-none">VIEW ALL HISTORY &rarr;</button>
          </div>

          <div className="row g-4">
            {loading ? (
              <div className="col-12">
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            ) : rentals.length > 0 ? (
              rentals.slice(0, 3).map((rental) => (
                <div key={rental._id} className="col-md-4">
                  <div className="tech-card bg-white h-100">
                    <div className="d-flex justify-content-between mb-3">
                      <span className="badge bg-light text-dark border">
                        {new Date(rental.startDate).toLocaleDateString()}
                      </span>
                      <span className={`badge ${rental.status === 'Completed' ? 'bg-success' :
                          rental.status === 'Approved' ? 'bg-success' :
                            rental.status === 'Ongoing' ? 'bg-primary' :
                              'bg-warning text-dark'
                        }`}>
                        {rental.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="fw-bold">{rental.vehicle.make} {rental.vehicle.model}</h4>
                    <div className="d-flex flex-wrap gap-2 text-muted mt-3">
                      <div className="d-flex align-items-center gap-1">
                        <i className="bi bi-calendar"></i>
                        <span>
                          {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <i className="bi bi-fuel-pump"></i>
                        <span>{rental.vehicle?.fuelType || 'N/A'}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <i className="bi bi-gear"></i>
                        <span>{rental.vehicle?.gear || 'N/A'}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <i className="bi bi-speedometer"></i>
                        <span>{rental.vehicle?.mileage ? rental.vehicle.mileage + ' km' : 'N/A'}</span>
                      </div>
                    </div>
                    <hr className="my-4 opacity-10" />
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">${rental.totalCost.toFixed(2)}</span>
                      <button
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => handleViewDetails(rental)}
                      >
                        VIEW DETAILS
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="tech-card bg-white p-5 text-center">
                  <h4 className="text-muted">No rental history yet</h4>
                  <p className="text-muted">Book your first vehicle to see it here</p>
                  <Link to="/vehicles" className="btn btn-primary">BROWSE VEHICLES</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. INFINITE PHOTO LOOP (Right to Left) */}
      <section className="py-0">
        <div className="marquee-container">
          <div className="marquee-track">
            {/* We duplicate the images to create a seamless loop effect */}
            {[...galleryImages, ...galleryImages].map((img, index) => (
              <img key={index} src={img} className="marquee-item" alt="Vehicle Gallery" />
            ))}
          </div>
        </div>
      </section>

      {/* 5. MEMBERS / COMMUNITY SECTION */}
      <section className="container py-5 my-5">
        <div className="text-center mb-5">
          <h6 className="text-success fw-bold">COMMUNITY</h6>
          <h2 className="fw-bold">ELITE MEMBERS</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>
            Join the ranks of our top-tier pilots. Earn reputation points with every safe kilometer driven.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="col-md-6 col-lg-3">
              <div className="member-card tech-card text-center p-4 bg-white">
                <div className="position-relative d-inline-block mb-3">
                  <img
                    src={`https://randomuser.me/api/portraits/men/${item + 20}.jpg`}
                    alt="Member"
                    className="rounded-circle member-img"
                  />
                  <div className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-1" style={{ width: '20px', height: '20px' }}></div>
                </div>
                <h5 className="fw-bold mb-1">Pilot {item + 84}</h5>
                <p className="text-muted small mb-3">Rank: Commander</p>
                <div className="d-flex justify-content-center gap-2">
                  <span className="badge bg-light text-dark">5.0 ★</span>
                  <span className="badge bg-light text-dark">120 Trips</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="bg-dark text-white py-5 text-center">
        <div className="container">
          <h2 className="fw-bold mb-4">READY TO TAKE THE WHEEL?</h2>
          <Link to="/vehicles" className="btn btn-success btn-lg px-5 py-3 rounded-0 fw-bold">
            START ENGINE
          </Link>
        </div>
      </section>

      {/* View Details Modal */}
      {showViewDetailsModal && selectedRental && (
        <ViewDetailsModal
          show={showViewDetailsModal}
          onClose={handleCloseModal}
          rental={selectedRental}
        />
      )}
    </div>
  );
};

export default UserHome;