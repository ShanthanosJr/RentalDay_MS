import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TechPagination from '../components/TechPagination'; // <--- IMPORT THIS
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext'; // Import AuthContext

interface Vehicle {
  _id: string;
  vehicleId: string;
  make: string;
  model: string;
  manufacturedYear: number;
  registrationYear: number;
  specifications: string;
  mileage: number;
  engine: string;
  fuelType: string;
  gear: string;
  options: string;
  price: number;
  description: string;
  images?: string[];
  imageUrl: string;
}

const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const { user } = useAuth(); // Get user from AuthContext

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Show 6 vehicles per page

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('/api/vehicles');
      setVehicles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };
// --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVehicles = vehicles.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(vehicles.length / itemsPerPage)));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>;
  }

  const handleBookingSuccess = () => {
    // Optionally refresh the vehicle list or show a success message
    alert('Booking created successfully!');
  };

  return (
    <>
      <div className="py-5">
        <div className="row mb-5 align-items-end">
          <div className="col-md-8">

          </div>
          <div className="col-md-4 text-md-end">
             <span className="badge bg-dark text-success p-2 fs-6 rounded-0">LIVE INVENTORY</span>
          </div>
        </div>

        <div className="row g-4">
          {currentVehicles.map((vehicle) => (
            <div key={vehicle._id} className="col-md-6 col-lg-4">
              {/* APPLYING THE NEW TECH-CARD CLASS HERE */}
              <div className="card tech-card h-100 border-0">
                <div className="position-relative mb-3">
                  <img 
                    src={vehicle.images && vehicle.images.length > 0 
                      ? vehicle.images[0].startsWith('/uploads') 
                        ? `http://localhost:5003${vehicle.images[0]}` 
                        : vehicle.images[0]
                      : vehicle.imageUrl && vehicle.imageUrl.startsWith('/uploads') 
                        ? `http://localhost:5003${vehicle.imageUrl}` 
                        : vehicle.imageUrl || "https://via.placeholder.com/400x300"} 
                    className="img-fluid" 
                    alt={vehicle.make}
                    style={{ height: '220px', width: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }} 
                  />
                  <div className="position-absolute top-0 start-0 bg-success text-white px-3 py-1 fw-bold small">
                    {vehicle.vehicleId}
                  </div>
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0 fw-bold">{vehicle.make} <span className="text-muted fw-light">{vehicle.model}</span></h4>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted">Year: {vehicle.manufacturedYear}</small>
                    <small className="text-muted">Mileage: {vehicle.mileage || 'N/A'} km</small>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted">Engine: {vehicle.engine}</small>
                    <small className="text-muted">Fuel: {vehicle.fuelType}</small>
                  </div>
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">Gear: {vehicle.gear}</small>
                    <small className="text-muted">Reg: {vehicle.registrationYear}</small>
                  </div>
                </div>
                
                <p className="text-muted small mb-4" style={{minHeight: '60px'}}>{vehicle.description}</p>
                
                <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                  <div>
                    <small className="d-block text-muted text-uppercase" style={{fontSize: '0.7rem'}}>Daily Rate</small>
                    <span className="fs-3 fw-bold text-dark">${vehicle.price}</span>
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      if (user) {
                        setSelectedVehicle(vehicle);
                        setShowBookingModal(true);
                      } else {
                        alert('Please log in to make a booking');
                      }
                    }}
                  >
                    INITIATE BOOKING
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* --- ADD PAGINATION COMPONENT --- */}
          <TechPagination 
            itemsPerPage={itemsPerPage}
            totalItems={vehicles.length}
            paginate={paginate}
            currentPage={currentPage}
            prevPage={prevPage}
            nextPage={nextPage}
          />
      </div>
      
      {selectedVehicle && (
        <BookingModal 
          show={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          vehicle={selectedVehicle!} // Non-null assertion since we check selectedVehicle above
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
};

export default VehicleList;