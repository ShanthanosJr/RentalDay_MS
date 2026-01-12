import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/BookingModal.css'; // Custom Dagestan styles

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  price: number;
  manufacturedYear?: number;
  fuelType?: string;
  gear?: string;
  mileage?: number;
  imageUrl?: string;
  [key: string]: any;
}


interface BookingModalProps {
  show: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  onBookingSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  show,
  onClose,
  vehicle,
  onBookingSuccess
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [totalDays, setTotalDays] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { user } = useAuth();

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end >= start) {
        const timeDiff = end.getTime() - start.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        setTotalDays(days);
        setTotalCost(days * vehicle.price);
        setError('');
      } else {
        setError('End date must be after start date');
      }
    } else {
      setTotalDays(0);
      setTotalCost(0);
    }
  }, [startDate, endDate, vehicle.price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user) {
        setError('You must be logged in to make a booking');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5003'}/api/rentals`,
        {
          vehicleId: vehicle._id,
          startDate,
          endDate
        },
        {
          headers: {
            'user-id': user._id,
            'user-role': user.role,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        onBookingSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="dagestan-modal-overlay" style={{ zIndex: 1050 }}>
      <div className="dagestan-modal-container">
        <div className="dagestan-modal-content">
          {/* Header */}
          <div className="dagestan-modal-header">
            <div className="dagestan-modal-title-wrapper">
              <span className="dagestan-section-label">Book Now</span>
              <h2 className="dagestan-modal-title">
                {vehicle.make} {vehicle.model}
              </h2>
              <h3 className="dagestan-modal-subtitle">
                Premium rental experience
              </h3>
            </div>
            <button className="dagestan-modal-close" onClick={onClose}>
              <i className="bi bi-x"></i>
            </button>
          </div>

          <div className="dagestan-modal-body">
            {/* Vehicle Showcase */}
            <div className="dagestan-vehicle-showcase">
              <div className="dagestan-vehicle-image-wrapper">
                <img
                  src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&fit=crop'}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="dagestan-vehicle-image"
                />
                <div className="dagestan-vehicle-badge">
                  ${vehicle.price}/day
                </div>
              </div>

              <div className="dagestan-vehicle-details">
                <div className="dagestan-vehicle-specs">
                  <div className="dagestan-spec-item">
                    <i className="bi bi-calendar3"></i>
                    <span>{vehicle.manufacturedYear || 'N/A'}</span>
                  </div>
                  <div className="dagestan-spec-item">
                    <i className="bi bi-fuel-pump"></i>
                    <span>{vehicle.fuelType || 'N/A'}</span>
                  </div>
                  <div className="dagestan-spec-item">
                    <i className="bi bi-gear"></i>
                    <span>{vehicle.gear || 'N/A'}</span>
                  </div>
                  <div className="dagestan-spec-item">
                    <i className="bi bi-speedometer"></i>
                    <span>{vehicle.mileage || 0} km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Form */}
            <div className="dagestan-rental-form">
              <div className="dagestan-form-section">
                <h4 className="dagestan-form-section-title">Rental Period</h4>
                <div className="dagestan-date-inputs">
                  <div className="dagestan-form-group">
                    <label className="dagestan-form-label">Start Date</label>
                    <div className="dagestan-input-wrapper">
                      <i className="bi bi-calendar-event input-icon"></i>
                      <input
                        type="date"
                        className="dagestan-input"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                  <div className="dagestan-form-group">
                    <label className="dagestan-form-label">End Date</label>
                    <div className="dagestan-input-wrapper">
                      <i className="bi bi-calendar-check input-icon"></i>
                      <input
                        type="date"
                        className="dagestan-input"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="dagestan-pricing-card">
                <div className="dagestan-pricing-header">
                  <h4>Pricing Summary</h4>
                </div>
                <div className="dagestan-pricing-items">
                  <div className="dagestan-pricing-item">
                    <span>Total Days</span>
                    <strong>{totalDays}</strong>
                  </div>
                  <div className="dagestan-pricing-item">
                    <span>Price per Day</span>
                    <strong>${vehicle.price}</strong>
                  </div>
                  <div className="dagestan-pricing-total">
                    <span>Total Cost</span>
                    <strong>${totalCost.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              {error && (
                <div className="dagestan-error">
                  <i className="bi bi-exclamation-triangle"></i>
                  {error}
                </div>
              )}

              {/* User Info Display */}
              {user && (
                <div className="dagestan-user-info">
                  <h4 className="dagestan-user-title">Your Details</h4>
                  <div className="dagestan-user-details">
                    <div className="dagestan-user-avatar">
                      {user.profileDetails?.firstName?.[0]}{user.profileDetails?.lastName?.[0] || 'U'}
                    </div>
                    <div className="dagestan-user-text">
                      <div className="dagestan-user-name">
                        {user.profileDetails?.firstName} {user.profileDetails?.lastName || user.username}
                      </div>
                      <div className="dagestan-user-email">{user.email}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="dagestan-modal-footer">
            <button className="dagestan-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="dagestan-btn-primary"
              onClick={handleSubmit}
              disabled={loading || !startDate || !endDate || totalCost <= 0 || !!error}
            >
              {loading ? (
                <>
                  <i className="bi bi-hourglass-split"></i>
                  Booking...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle"></i>
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
