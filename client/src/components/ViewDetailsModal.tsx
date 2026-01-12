import React, { useState, useEffect } from 'react';
//import axios from 'axios';

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

interface ViewDetailsModalProps {
  show: boolean;
  onClose: () => void;
  rental: Rental;
}

const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({
  show,
  onClose,
  rental
}) => {
  const [completeRental] = useState(rental);
  const [, setIsLoading] = useState(false);

  if (!show) return null;

  console.log('Rental data received:', rental); // Debug log
  console.log('Vehicle data:', rental.vehicle); // Debug log

  // Check if vehicle details are missing and fetch them if needed
  useEffect(() => {
    const checkAndFetchVehicleDetails = async () => {
      // Check if essential vehicle details are missing
      if (!rental.vehicle?.fuelType || !rental.vehicle?.gear || !rental.vehicle?.mileage) {
        setIsLoading(true);
        try {
          // Since we can't determine user id reliably from the rental object here,
          // we'll just log a message suggesting to refresh the parent data
          console.log('Vehicle details missing, please ensure the rental data is refreshed from parent component');
        } catch (error) {
          console.error('Error checking vehicle details:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (show) {
      checkAndFetchVehicleDetails();
    }
  }, [show, rental]);

  // Use the complete rental data if available, otherwise fall back to original
  const displayRental = completeRental || rental;

  // Calculate rental duration
  const start = new Date(displayRental.startDate);
  const end = new Date(displayRental.endDate);
  const timeDiff = end.getTime() - start.getTime();
  const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

  // Calculate daily rate
  const dailyRate = displayRental.totalCost / totalDays;

  return (
    <div className="dagestan-modal-overlay" style={{ zIndex: 1050 }}>
      <div className="dagestan-modal-container">
        <div className="dagestan-modal-content">
          {/* Header */}
          <div className="dagestan-modal-header">
            <div className="dagestan-modal-title-wrapper">
              <span className="dagestan-section-label">Rental Details</span>
              <h2 className="dagestan-modal-title">
                {displayRental.vehicle.make} {displayRental.vehicle.model}
              </h2>
              <h3 className="dagestan-modal-subtitle">
                Booking ID: {displayRental._id.substring(0, 8)}
              </h3>
            </div>
            <button className="dagestan-modal-close" onClick={onClose}>
              <i className="bi bi-x"></i>
            </button>
          </div>

          <div className="dagestan-modal-body">
            {/* Vehicle Showcase */}
            <div className="dagestan-vehicle-showcase mb-4">
              <div className="dagestan-vehicle-image-wrapper">
                <img
                  src={displayRental.vehicle.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&fit=crop'}
                  alt={`${displayRental.vehicle.make} ${displayRental.vehicle.model}`}
                  className="dagestan-vehicle-image"
                />
                <div className="dagestan-vehicle-badge">
                  ${displayRental.vehicle.price || 0}/day
                </div>
              </div>

              <div className="dagestan-vehicle-details">
                <div className="dagestan-vehicle-specs">
                  <div className="dagestan-spec-item">
                    <i className="bi bi-calendar3"></i>
                    <span>{displayRental.vehicle.manufacturedYear || 'N/A'}</span>
                  </div>
                  <div className="dagestan-spec-item">
                    <i className="bi bi-fuel-pump"></i>
                    <span>{displayRental.vehicle?.fuelType ? displayRental.vehicle.fuelType : 'N/A'}</span>
                  </div>
                  <div className="dagestan-spec-item">
                    <i className="bi bi-gear"></i>
                    <span>{displayRental.vehicle?.gear ? displayRental.vehicle.gear : 'N/A'}</span>
                  </div>
                  <div className="dagestan-spec-item">
                    <i className="bi bi-speedometer"></i>
                    <span>{displayRental.vehicle?.mileage ? displayRental.vehicle.mileage + ' km' : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Period */}
            <div className="dagestan-form-section mb-4">
              <h4 className="dagestan-form-section-title">Rental Period</h4>
              <div className="dagestan-date-display">
                <div className="dagestan-date-item">
                  <label className="dagestan-form-label">Start Date</label>
                  <div className="dagestan-input">
                    {new Date(displayRental.startDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="dagestan-date-item">
                  <label className="dagestan-form-label">End Date</label>
                  <div className="dagestan-input">
                    {new Date(displayRental.endDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="dagestan-date-item">
                  <label className="dagestan-form-label">Duration</label>
                  <div className="dagestan-input">
                    {totalDays} day{totalDays !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="dagestan-pricing-card mb-4" style={{ minWidth: '500px' }}>
              <div className="dagestan-pricing-header">
                <h4>Payment Summary</h4>
              </div>
              <div className="dagestan-pricing-items">
                <div className="dagestan-pricing-item">
                  <span>Duration</span>
                  <strong>{totalDays} day{totalDays !== 1 ? 's' : ''}</strong>
                </div>
                <div className="dagestan-pricing-item">
                  <span>Daily Rate</span>
                  <strong>${dailyRate.toFixed(2)}</strong>
                </div>
                <div className="dagestan-pricing-item">
                  <span>Subtotal</span>
                  <strong>${displayRental.totalCost.toFixed(2)}</strong>
                </div>
                <div className="dagestan-pricing-item">
                  <span>Tax (10%)</span>
                  <strong>${(displayRental.totalCost * 0.1).toFixed(2)}</strong>
                </div>
                <div className="dagestan-pricing-total" style={{ textAlign: 'center' }}>
                  <span>Total Paid  </span>
                  <strong>${(displayRental.totalCost * 1.1).toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Status and Booking Info */}
            <div className="dagestan-form-section mb-4">
              <h4 className="dagestan-form-section-title">Booking Information</h4>
              <div className="dagestan-booking-info">
                <div className="dagestan-info-item">
                  <label className="dagestan-form-label">Status</label>
                  <div className={`dagestan-status-badge status-${displayRental.status.toLowerCase()}`}>
                    {displayRental.status}
                  </div>
                </div>
                <div className="dagestan-info-item">
                  <label className="dagestan-form-label">Booking Date</label>
                  <div className="dagestan-input">
                    {new Date(displayRental.createdAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="dagestan-info-item">
                  <label className="dagestan-form-label">Booking ID</label>
                  <div className="dagestan-input">
                    {displayRental._id}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="dagestan-modal-footer">
            <button className="dagestan-btn-primary w-100" onClick={onClose}>
              <i className="bi bi-check-circle"></i>
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;