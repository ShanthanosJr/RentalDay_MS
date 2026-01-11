import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import InfoTab from './InfoTab'; // <--- 1. IMPORT THE NEW FILE
import TechPagination from '../components/TechPagination'; // <--- IMPORT

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
  imageUrl: string;
}

interface User {
  _id: string;
  userId: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  profileDetails?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    licenseNumber?: string;
  };
  avatar?: string;
}

interface Rental {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  vehicle: {
    _id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    images?: string[];
  };
  startDate: string;
  endDate: string;
  totalCost: number;
  status: string;
  createdAt: string;
}

interface NewVehicle {
  vehicleId: string;
  make: string;
  model: string;
  manufacturedYear: string;
  registrationYear: string;
  specifications: string;
  mileage: string;
  engine: string;
  fuelType: string;
  gear: string;
  options: string;
  price: string;
  description: string;
  imageUrl: string;
}

interface EditVehicle {
  _id: string;
  vehicleId: string;
  make: string;
  model: string;
  manufacturedYear: string;
  registrationYear: string;
  specifications: string;
  mileage: string;
  engine: string;
  fuelType: string;
  gear: string;
  options: string;
  price: string;
  description: string;
  imageUrl: string;
}

interface NewUser {
  userId: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  licenseNumber?: string;
  address?: string;
  profilePhoto?: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [rentalsLoading, setRentalsLoading] = useState(true);
  const generateVehicleId = () => {
    return `VEH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const [newVehicle, setNewVehicle] = useState<NewVehicle>({
    vehicleId: generateVehicleId(),
    make: '',
    model: '',
    manufacturedYear: '',
    registrationYear: '',
    specifications: '',
    mileage: '',
    engine: '',
    fuelType: '',
    gear: '',
    options: '',
    price: '',
    description: '',
    imageUrl: ''
  });
  
  // State to store the actual image file
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({
    userId: `USER${Date.now()}`, // Auto-generate user ID
    username: '',
    email: '',
    password: '',
    role: 'user',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    licenseNumber: '',
    address: '',
    profilePhoto: ''
  });
  const [editVehicle, setEditVehicle] = useState<EditVehicle | null>(null);
  
  // State to store the edit image file
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  
  // <--- 2. UPDATE ACTIVE TAB STATE
  // Change default from 'vehicles' to 'info' so the dashboard opens on the new page
  const [activeTab, setActiveTab] = useState<'info' | 'vehicles' | 'users' | 'rentals'>('info');
  const [loading, setLoading] = useState(true);

  // --- PAGINATION STATES ---
  const [vehiclePage, setVehiclePage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [rentalPage, setRentalPage] = useState(1);
  const itemsPerPage = 6; // Show 6 items per list

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchVehicles();
      fetchUsers();
      fetchRentals();
      setLoading(false);
    }
  }, [user]);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('/api/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRentals = async () => {
    try {
      setRentalsLoading(true);
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5003'}/api/rentals/all`,
        {
          headers: {
            'user-id': user._id,
            'user-role': user.role,
          }
        }
      );
      setRentals(response.data);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setRentalsLoading(false);
    }
  };

  const handleUpdateRentalStatus = async (rentalId: string, newStatus: string) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5003'}/api/rentals/${rentalId}/status`,
        { status: newStatus },
        {
          headers: {
            'user-id': user._id,
            'user-role': user.role,
          }
        }
      );
      
      // Refresh rentals list
      fetchRentals();
    } catch (error) {
      console.error('Error updating rental status:', error);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Add all vehicle fields to form data
      formData.append('vehicleId', newVehicle.vehicleId);
      formData.append('make', newVehicle.make);
      formData.append('model', newVehicle.model);
      formData.append('manufacturedYear', newVehicle.manufacturedYear);
      formData.append('registrationYear', newVehicle.registrationYear);
      formData.append('specifications', newVehicle.specifications);
      formData.append('mileage', newVehicle.mileage);
      formData.append('engine', newVehicle.engine);
      formData.append('fuelType', newVehicle.fuelType);
      formData.append('gear', newVehicle.gear);
      formData.append('options', newVehicle.options);
      formData.append('price', newVehicle.price);
      formData.append('description', newVehicle.description);
      
      // If there's an image file, append it to the form data
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      await axios.post('/api/vehicles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNewVehicle({
        vehicleId: generateVehicleId(), // Generate a new ID for the next vehicle
        make: '',
        model: '',
        manufacturedYear: '',
        registrationYear: '',
        specifications: '',
        mileage: '',
        engine: '',
        fuelType: '',
        gear: '',
        options: '',
        price: '',
        description: '',
        imageUrl: ''
      });
      setImageFile(null); // Reset the image file
      fetchVehicles(); // Refresh the list
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare user data with profile details
      const userData = {
        ...newUser,
        profileDetails: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone,
          dateOfBirth: newUser.dateOfBirth,
          licenseNumber: newUser.licenseNumber,
          address: newUser.address,
        }
      };
      
      await axios.post('/api/users', userData);
      setNewUser({
        userId: `USER${Date.now()}`, // Auto-generate new user ID
        username: '',
        email: '',
        password: '',
        role: 'user',
        firstName: '',
        lastName: '',
        phone: '',
        dateOfBirth: '',
        licenseNumber: '',
        address: '',
        profilePhoto: ''
      });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await axios.delete(`/api/vehicles/${id}`);
        fetchVehicles(); // Refresh the list
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${id}`);
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleVehicleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewVehicle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVehicleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // Store the actual file
      setNewVehicle(prev => ({
        ...prev,
        imageUrl: URL.createObjectURL(file) // This creates a temporary URL for preview
      }));
    }
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Prevent changing userId since it's auto-generated
    if (name === 'userId') return;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditVehicle({
      _id: vehicle._id,
      vehicleId: vehicle.vehicleId,
      make: vehicle.make,
      model: vehicle.model,
      manufacturedYear: vehicle.manufacturedYear.toString(),
      registrationYear: vehicle.registrationYear.toString(),
      specifications: vehicle.specifications,
      mileage: vehicle.mileage.toString(),
      engine: vehicle.engine,
      fuelType: vehicle.fuelType,
      gear: vehicle.gear,
      options: vehicle.options,
      price: vehicle.price.toString(),
      description: vehicle.description,
      imageUrl: vehicle.imageUrl
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editVehicle) {
      setEditVehicle(prev => ({
        ...prev!,
        [name]: value
      }));
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editVehicle) {
      setEditImageFile(file); // Store the actual file
      setEditVehicle(prev => ({
        ...prev!,
        imageUrl: URL.createObjectURL(file) // This creates a temporary URL for preview
      }));
    }
  };

  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editVehicle) {
      try {
        const formData = new FormData();
        
        // Add all vehicle fields to form data
        formData.append('vehicleId', editVehicle.vehicleId);
        formData.append('make', editVehicle.make);
        formData.append('model', editVehicle.model);
        formData.append('manufacturedYear', editVehicle.manufacturedYear);
        formData.append('registrationYear', editVehicle.registrationYear);
        formData.append('specifications', editVehicle.specifications);
        formData.append('mileage', editVehicle.mileage);
        formData.append('engine', editVehicle.engine);
        formData.append('fuelType', editVehicle.fuelType);
        formData.append('gear', editVehicle.gear);
        formData.append('options', editVehicle.options);
        formData.append('price', editVehicle.price);
        formData.append('description', editVehicle.description);
        // Only append image file if one was selected
        if (editImageFile) {
          formData.append('image', editImageFile);
        }
        
        await axios.put(`/api/vehicles/${editVehicle._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEditVehicle(null);
        fetchVehicles(); // Refresh the list
      } catch (error) {
        console.error('Error updating vehicle:', error);
      }
    }
  };

  {/*const handleCancelEdit = () => {
    setEditVehicle(null);
  };*/}

  // --- PAGINATION LOGIC HELPERS ---
  // 1. Get Current Vehicles
  const idxLastVehicle = vehiclePage * itemsPerPage;
  const idxFirstVehicle = idxLastVehicle - itemsPerPage;
  const currentVehicles = vehicles.slice(idxFirstVehicle, idxLastVehicle);

  // 2. Get Current Users
  const idxLastUser = userPage * itemsPerPage;
  const idxFirstUser = idxLastUser - itemsPerPage;
  const currentUsers = users.slice(idxFirstUser, idxLastUser);

  // 3. Get Current Rentals
  const idxLastRental = rentalPage * itemsPerPage;
  const idxFirstRental = idxLastRental - itemsPerPage;
  const currentRentals = rentals.slice(idxFirstRental, idxLastRental);

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>Access Denied</div>;
  }

  return (
    <div className="container-fluid px-4" style={{ marginTop: '100px' }}>
            {/* Tabs for Vehicles and Users */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
         <h2 className="fw-bold mb-0">WELCOME TO THE ADMIN <span className="text-success">DASHBOARD</span></h2>
         <span className="badge bg-dark text-white p-2 font-monospace">V 1.0.5 BUILD</span>
      </div>
      
      {/* 3. UPDATED TAB NAVIGATION */}
      <ul className="nav nav-tabs border-bottom-0 mb-4 px-3">
        <li className="nav-item">
          <button 
            className={`nav-link border-0 fw-bold ${activeTab === 'info' ? 'active text-success ' : 'text-muted'}`} 
            onClick={() => setActiveTab('info')}
            style={{background: 'transparent'}}
          >
            SYSTEM OVERVIEW
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link border-0 fw-bold ${activeTab === 'vehicles' ? 'active text-success ' : 'text-muted'}`} 
            onClick={() => setActiveTab('vehicles')}
            style={{background: 'transparent'}}
          >
            VEHICLE MANAGEMENT
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link border-0 fw-bold ${activeTab === 'users' ? 'active text-success ' : 'text-muted'}`} 
            onClick={() => setActiveTab('users')}
            style={{background: 'transparent'}}
          >
            USER GOVERNANCE
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link border-0 fw-bold ${activeTab === 'rentals' ? 'active text-success ' : 'text-muted'}`} 
            onClick={() => setActiveTab('rentals')}
            style={{background: 'transparent'}}
          >
            RENTAL OPERATIONS
          </button>
        </li>
      </ul>
      
      {/* Tab Content */}
      <div className="tab-content px-3">
        
        {/* <--- 4. ADD THE NEW INFO TAB HERE */}
        {activeTab === 'info' && (
           <InfoTab 
              vehicleCount={vehicles.length} 
              userCount={users.length} 
              rentals={rentals}
              setActiveTab={setActiveTab} // We pass this so buttons in InfoTab can switch tabs!
           />
        )}
        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="tab-pane active fade-in p-3"> {/* Added fade-in for magic */}
            <div className="row mt-4 mb-4">
              <div className="col-md-6">
                <div className="tech-card">
                  <h4 className="mb-4">Add New Vehicle</h4>
                  <div className="text-center mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                      alt="Vehicle Management" 
                      className="img-fluid rounded"
                      style={{maxHeight: '150px'}}
                    />
                  </div>
                  <div className="mb-4">RentalDay vehicle management system offers a streamlined way to manage your vehicles. Add, edit, and delete vehicles easily. 
                    Effortlessly track vehicle details and maintain an organized inventory. As an admin, you can easily manage your vehicles. Add, edit, and delete vehicles with ease.</div>
                  <button 
                    type="button" 
                    className="btn btn-success w-100"
                    onClick={() => {
                      setNewVehicle({
                        vehicleId: generateVehicleId(),
                        make: '',
                        model: '',
                        manufacturedYear: '',
                        registrationYear: '',
                        specifications: '',
                        mileage: '',
                        engine: '',
                        fuelType: '',
                        gear: '',
                        options: '',
                        price: '',
                        description: '',
                        imageUrl: ''
                      });
                      setImageFile(null);
                      setEditVehicle(null);
                    }}
                    data-bs-toggle="modal" 
                    data-bs-target="#addVehicleModal"
                  >
                    <i className="fas fa-plus me-2"></i>Add New Vehicle
                  </button>
                </div>
              </div>
            
            {/* Add Vehicle Modal */}
            <div className="modal fade" id="addVehicleModal" tabIndex={-1} aria-labelledby="addVehicleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="addVehicleModalLabel">Add New Vehicle</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <form id="addVehicleForm" onSubmit={handleAddVehicle}>
                      <div className="accordion accordion-flush accordion-tech" id="vehicleFormAccordion"> {/* New wrapper with your enhanced class */}
                                          
                        {/* Basic Information Section - Open by default */}
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button 
                              className="accordion-button" 
                              type="button" 
                              data-bs-toggle="collapse" 
                              data-bs-target="#basicInfo" 
                              aria-expanded="true" 
                              aria-controls="basicInfo"
                            >
                              Basic Information
                            </button>
                          </h2>
                          <div 
                            id="basicInfo" 
                            className="accordion-collapse collapse show" // 'show' makes it open by default
                            // No data-bs-parent for always-open
                          >
                            <div className="accordion-body">
                              <div className="form-group-tech">
                                <label htmlFor="vehicleId">Vehicle ID</label>
                                <div className="position-relative">
                                  <i className="fas fa-id-badge input-icon"></i> {/* Icon for magic */}
                                  <input
                                    type="text"
                                    className="form-control ps-5"
                                    id="vehicleId"
                                    name="vehicleId"
                                    value={newVehicle.vehicleId}
                                    onChange={handleVehicleInputChange}
                                    placeholder="Auto-generated"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-6">
                                  <div className="form-group-tech">
                                    <label htmlFor="make">Make</label>
                                    <div className="position-relative">
                                      <i className="fas fa-car input-icon"></i>
                                      <input
                                        type="text"
                                        className="form-control ps-5"
                                        id="make"
                                        name="make"
                                        value={newVehicle.make}
                                        onChange={handleVehicleInputChange}
                                        placeholder='EX: Mitsubishi'
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="form-group-tech">
                                    <label htmlFor="model">Model</label>
                                    <div className="position-relative">
                                      <i className="fas fa-tag input-icon"></i>
                                      <input
                                        type="text"
                                        className="form-control ps-5"
                                        id="model"
                                        name="model"
                                        value={newVehicle.model}
                                        onChange={handleVehicleInputChange}
                                        placeholder='EX: Outlander'
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-6">
                                  <div className="form-group-tech">
                                    <label htmlFor="manufacturedYear">Manufactured Year</label>
                                    <div className="position-relative">
                                      <i className="fas fa-calendar input-icon"></i>
                                      <input
                                        type="number"
                                        className="form-control ps-5"
                                        id="manufacturedYear"
                                        name="manufacturedYear"
                                        value={newVehicle.manufacturedYear}
                                        onChange={handleVehicleInputChange}
                                        placeholder='EX: 2020'
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="form-group-tech">
                                    <label htmlFor="registrationYear">Registration Year</label>
                                    <div className="position-relative">
                                      <i className="fas fa-calendar-check input-icon"></i>
                                      <input
                                        type="number"
                                        className="form-control ps-5"
                                        id="registrationYear"
                                        name="registrationYear"
                                        value={newVehicle.registrationYear}
                                        onChange={handleVehicleInputChange}
                                        placeholder='EX: 2020'
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      {/* Specifications Section - Collapsed by default */}
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button 
                            className="accordion-button collapsed" // 'collapsed' for closed state
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#specificationsSection" 
                            aria-expanded="false" 
                            aria-controls="specificationsSection"
                          >
                            Specifications
                          </button>
                        </h2>
                        <div 
                          id="specificationsSection" 
                          className="accordion-collapse collapse" // No 'show' = collapsed
                        >
                          <div className="accordion-body">
                            <div className="form-group-tech">
                              <label htmlFor="specifications">Specifications</label>
                              <div className="position-relative">
                                <i className="fas fa-list input-icon"></i>
                                <textarea
                                  className="form-control ps-5"
                                  id="specifications"
                                  name="specifications"
                                  value={editVehicle ? editVehicle.specifications : newVehicle.specifications}
                                  onChange={editVehicle ? handleEditInputChange : handleVehicleInputChange}
                                  placeholder='EX: Automatic transmission, 4 doors, 5 seats'
                                  required
                                ></textarea>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <div className="form-group-tech">
                                  <label htmlFor="mileage">Mileage (km)</label>
                                  <div className="position-relative">
                                    <i className="fas fa-tachometer-alt input-icon"></i>
                                    <input
                                      type="number"
                                      className="form-control ps-5"
                                      id="mileage"
                                      name="mileage"
                                      value={editVehicle ? editVehicle.mileage : newVehicle.mileage}
                                      onChange={editVehicle ? handleEditInputChange : handleVehicleInputChange}
                                      placeholder='EX: 150000KM'
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="form-group-tech">
                                  <label htmlFor="engine">Engine</label>
                                  <div className="position-relative">
                                    <i className="fas fa-cogs input-icon"></i>
                                    <input
                                      type="text"
                                      className="form-control ps-5"
                                      id="engine"
                                      name="engine"
                                      value={editVehicle ? editVehicle.engine : newVehicle.engine}
                                      onChange={editVehicle ? handleEditInputChange : handleVehicleInputChange}
                                      placeholder='EX: 2.0L'
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <div className="form-group-tech">
                                  <label htmlFor="fuelType">Fuel Type</label>
                                  <div className="position-relative">
                                    <i className="fas fa-gas-pump input-icon"></i>
                                    <input
                                      type="text"
                                      className="form-control ps-5"
                                      id="fuelType"
                                      name="fuelType"
                                      value={editVehicle ? editVehicle.fuelType : newVehicle.fuelType}
                                      onChange={editVehicle ? handleEditInputChange : handleVehicleInputChange}
                                      placeholder='EX: Petrol'
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="form-group-tech">
                                  <label htmlFor="gear">Gear</label>
                                  <div className="position-relative">
                                    <i className="fas fa-cog input-icon"></i>
                                    <input
                                      type="text"
                                      className="form-control ps-5"
                                      id="gear"
                                      name="gear"
                                      value={editVehicle ? editVehicle.gear : newVehicle.gear}
                                      onChange={editVehicle ? handleEditInputChange : handleVehicleInputChange}
                                      placeholder='EX: Manual'
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-group-tech">
                              <label htmlFor="options">Options</label>
                              <div className="position-relative">
                                <i className="fas fa-tools input-icon"></i>
                                <input
                                  type="text"
                                  className="form-control ps-5"
                                  id="options"
                                  name="options"
                                  value={editVehicle ? editVehicle.options : newVehicle.options}
                                  onChange={editVehicle ? handleEditInputChange : handleVehicleInputChange}
                                  placeholder='EX: Air conditioning, GPS, Alloy wheels'
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Description Section - Collapsed by default */}
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button 
                            className="accordion-button collapsed"
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#pricingSection" 
                            aria-expanded="false" 
                            aria-controls="pricingSection"
                          >
                            Pricing & Description
                          </button>
                        </h2>
                        <div 
                          id="pricingSection" 
                          className="accordion-collapse collapse"
                        >
                          <div className="accordion-body">
                            <div className="form-group-tech">
                              <label htmlFor="price">Price per Day</label>
                              <div className="position-relative">
                                <i className="fas fa-dollar-sign input-icon"></i>
                                <input
                                  type="number"
                                  className="form-control ps-5"
                                  id="price"
                                  name="price"
                                  value={editVehicle ? editVehicle.price : newVehicle.price}
                                  onChange={editVehicle ? handleEditInputChange : handleVehicleInputChange}
                                  placeholder='EX: $50'
                                  required
                                />
                              </div>
                            </div>
                            <div className="form-group-tech">
                              <label htmlFor="description">Description</label>
                              <div className="position-relative">
                                <i className="fas fa-file-alt input-icon"></i>
                                <textarea
                                  className="form-control ps-5"
                                  id="description"
                                  name="description"
                                  value={editVehicle ? editVehicle.description : newVehicle.description}
                                  onChange={editVehicle ? handleEditInputChange : handleVehicleInputChange}
                                  placeholder='EX: This is a great vehicle for its price'
                                  required
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Image Upload Section - Collapsed by default */}
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button 
                            className="accordion-button collapsed"
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#imageSection" 
                            aria-expanded="false" 
                            aria-controls="imageSection"
                          >
                            Image Upload
                          </button>
                        </h2>
                        <div 
                          id="imageSection" 
                          className="accordion-collapse collapse"
                        >
                          <div className="accordion-body">
                            <div className="form-group-tech">
                              <label htmlFor="imageUrl">Vehicle Image</label>
                              <input
                                type="file"
                                className="form-control"
                                id="imageUrl"
                                name="imageUrl"
                                accept="image/*"
                                onChange={editVehicle ? handleEditImageChange : handleVehicleImageChange}
                              />
                              <div className={`image-preview ${!(editVehicle ? editVehicle.imageUrl : newVehicle.imageUrl) ? 'empty' : ''}`}>
                                {(editVehicle ? editVehicle.imageUrl : newVehicle.imageUrl) && (
                                  <img 
                                    src={editVehicle ? editVehicle.imageUrl.startsWith('blob:') ? editVehicle.imageUrl : `/uploads/${editVehicle.imageUrl.split('/').pop()}` : newVehicle.imageUrl.startsWith('blob:') ? newVehicle.imageUrl : `/uploads/${newVehicle.imageUrl.split('/').pop()}`} 
                                    alt="Preview" 
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={() => document.getElementById('addVehicleForm')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                  >
                    Add Vehicle
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add User Modal */}
          <div className="modal fade" id="addUserModal" tabIndex={-1} aria-labelledby="addUserModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="addUserModalLabel">Add New User</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form id="addUserForm" onSubmit={handleAddUser}>
                    <div className="accordion accordion-flush accordion-tech" id="userFormAccordion">
                      {/* Account Credentials Section - Open by default */}
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button 
                            className="accordion-button" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#accountCredentials" 
                            aria-expanded="true" 
                            aria-controls="accountCredentials"
                          >
                            Account Credentials
                          </button>
                        </h2>
                        <div 
                          id="accountCredentials" 
                          className="accordion-collapse collapse show"
                        >
                          <div className="accordion-body">
                            <div className="form-group-tech">
                              <label htmlFor="userId">User ID</label>
                              <div className="position-relative">
                                <i className="fas fa-id-card input-icon"></i>
                                <input
                                  type="text"
                                  className="form-control ps-5"
                                  id="userId"
                                  name="userId"
                                  value={newUser.userId}
                                  onChange={handleUserInputChange}
                                  placeholder="Auto-generated"
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="form-group-tech">
                              <label htmlFor="username">Username</label>
                              <div className="position-relative">
                                <i className="fas fa-user input-icon"></i>
                                <input
                                  type="text"
                                  className="form-control ps-5"
                                  id="username"
                                  name="username"
                                  value={newUser.username}
                                  onChange={handleUserInputChange}
                                  placeholder="EX: johndoe"
                                  required
                                />
                              </div>
                            </div>
                            <div className="form-group-tech">
                              <label htmlFor="email">Email</label>
                              <div className="position-relative">
                                <i className="fas fa-envelope input-icon"></i>
                                <input
                                  type="email"
                                  className="form-control ps-5"
                                  id="email"
                                  name="email"
                                  value={newUser.email}
                                  onChange={handleUserInputChange}
                                  placeholder="EX: johndoe@example.com"
                                  required
                                />
                              </div>
                            </div>
                            <div className="form-group-tech">
                              <label htmlFor="password">Password</label>
                              <div className="position-relative">
                                <i className="fas fa-lock input-icon"></i>
                                <input
                                  type="password"
                                  className="form-control ps-5"
                                  id="password"
                                  name="password"
                                  value={newUser.password}
                                  onChange={handleUserInputChange}
                                  placeholder="EX: **********"
                                  required
                                />
                              </div>
                            </div>
                            <div className="form-group-tech">
                              <label htmlFor="role">Role</label>
                              <div className="position-relative">
                                <i className="fas fa-user-shield input-icon"></i>
                                <select
                                  className="form-control ps-5"
                                  id="role"
                                  name="role"
                                  value={newUser.role}
                                  onChange={handleUserInputChange}
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Personal Dossier Section - Collapsed by default */}
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button 
                            className="accordion-button collapsed" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#personalDossier" 
                            aria-expanded="false" 
                            aria-controls="personalDossier"
                          >
                            Personal Dossier
                          </button>
                        </h2>
                        <div 
                          id="personalDossier" 
                          className="accordion-collapse collapse"
                        >
                          <div className="accordion-body">
                            <div className="row">
                              <div className="col-6">
                                <div className="form-group-tech">
                                  <label htmlFor="firstName">First Name</label>
                                  <div className="position-relative">
                                    <i className="fas fa-user input-icon"></i>
                                    <input
                                      type="text"
                                      className="form-control ps-5"
                                      id="firstName"
                                      name="firstName"
                                      value={newUser.firstName || ''}
                                      placeholder="EX: John"
                                      onChange={handleUserInputChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="form-group-tech">
                                  <label htmlFor="lastName">Last Name</label>
                                  <div className="position-relative">
                                    <i className="fas fa-user input-icon"></i>
                                    <input
                                      type="text"
                                      className="form-control ps-5"
                                      id="lastName"
                                      name="lastName"
                                      value={newUser.lastName || ''}
                                      placeholder="EX: Doe"
                                      onChange={handleUserInputChange}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-group-tech">
                              <label htmlFor="phone">Phone</label>
                              <div className="position-relative">
                                <i className="fas fa-phone input-icon"></i>
                                <input
                                  type="tel"
                                  className="form-control ps-5"
                                  id="phone"
                                  name="phone"
                                  value={newUser.phone || ''}
                                  placeholder="EX: 123-456-7890"
                                  onChange={handleUserInputChange}
                                />
                              </div>
                            </div>
                            <div className="form-group-tech">
                              <label htmlFor="dateOfBirth">Date of Birth</label>
                              <div className="position-relative">
                                <i className="fas fa-calendar input-icon"></i>
                                <input
                                  type="date"
                                  className="form-control ps-5"
                                  id="dateOfBirth"
                                  name="dateOfBirth"
                                  value={newUser.dateOfBirth || ''}
                                  placeholder="EX: 1990-01-01"
                                  onChange={handleUserInputChange}
                                />
                              </div>
                            </div>
                            <div className="form-group-tech">
                              <label htmlFor="licenseNumber">Driver's License Number</label>
                              <div className="position-relative">
                                <i className="fas fa-id-badge input-icon"></i>
                                <input
                                  type="text"
                                  className="form-control ps-5"
                                  id="licenseNumber"
                                  name="licenseNumber"
                                  value={newUser.licenseNumber || ''}
                                  placeholder="EX: 123456789"
                                  onChange={handleUserInputChange}
                                />
                              </div>
                            </div>
                            <div className="form-group-tech">
                              <label htmlFor="address">Address</label>
                              <div className="position-relative">
                                <i className="fas fa-home input-icon"></i>
                                <input
                                  type="text"
                                  className="form-control ps-5"
                                  id="address"
                                  name="address"
                                  value={newUser.address || ''}
                                  onChange={handleUserInputChange}
                                  placeholder="EX: 123 Main St"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={() => document.getElementById('addUserForm')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                  >
                    Add User
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Edit Vehicle Modal */}
          <div className="modal fade" id="editVehicleModal" tabIndex={-1} aria-labelledby="editVehicleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="editVehicleModalLabel">Edit Vehicle</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form id="editVehicleForm" onSubmit={handleUpdateVehicle}>
                    <div className="accordion accordion-flush accordion-tech" id="editVehicleFormAccordion">
                      
                      {/* Basic Information Section - Open by default */}
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button 
                            className="accordion-button" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#editBasicInfo" 
                            aria-expanded="true" 
                            aria-controls="editBasicInfo"
                          >
                            Basic Information
                          </button>
                        </h2>
                        <div 
                          id="editBasicInfo" 
                          className="accordion-collapse collapse show"
                        >
                          <div className="accordion-body">
                            <div className="form-group-tech">
                              <label htmlFor="editVehicleId">Vehicle ID</label>
                              <div className="position-relative">
                                <i className="fas fa-id-badge input-icon"></i>
                                <input
                                  type="text"
                                  className="form-control ps-5"
                                  id="editVehicleId"
                                  name="vehicleId"
                                  value={editVehicle?.vehicleId || ''}
                                  onChange={handleEditInputChange}
                                  placeholder="Auto-generated"
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <div className="form-group-tech">
                                  <label htmlFor="editMake">Make</label>
                                  <div className="position-relative">
                                    <i className="fas fa-car input-icon"></i>
                                    <input
                                      type="text"
                                      className="form-control ps-5"
                                      id="editMake"
                                      name="make"
                                      value={editVehicle?.make || ''}
                                      onChange={handleEditInputChange}
                                      placeholder='EX: Mitsubishi'
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="form-group-tech">
                                  <label htmlFor="editModel">Model</label>
                                  <div className="position-relative">
                                    <i className="fas fa-tag input-icon"></i>
                                    <input
                                      type="text"
                                      className="form-control ps-5"
                                      id="editModel"
                                      name="model"
                                      value={editVehicle?.model || ''}
                                      onChange={handleEditInputChange}
                                      placeholder='EX: Outlander'
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <div className="form-group-tech">
                                  <label htmlFor="editManufacturedYear">Manufactured Year</label>
                                  <div className="position-relative">
                                    <i className="fas fa-calendar input-icon"></i>
                                    <input
                                      type="number"
                                      className="form-control ps-5"
                                      id="editManufacturedYear"
                                      name="manufacturedYear"
                                      value={editVehicle?.manufacturedYear || ''}
                                      onChange={handleEditInputChange}
                                      placeholder='EX: 2020'
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="form-group-tech">
                                  <label htmlFor="editRegistrationYear">Registration Year</label>
                                  <div className="position-relative">
                                    <i className="fas fa-calendar-check input-icon"></i>
                                    <input
                                      type="number"
                                      className="form-control ps-5"
                                      id="editRegistrationYear"
                                      name="registrationYear"
                                      value={editVehicle?.registrationYear || ''}
                                      onChange={handleEditInputChange}
                                      placeholder='EX: 2020'
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Specifications Section - Collapsed by default */}
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button 
                            className="accordion-button collapsed"
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#editSpecificationsSection" 
                            aria-expanded="false" 
                            aria-controls="editSpecificationsSection"
                          >
                            Specifications
                          </button>
                        </h2>
                        <div 
                          id="editSpecificationsSection" 
                          className="accordion-collapse collapse"
                        >
                          <div className="accordion-body">
                            <div className="form-group-tech">
                              <label htmlFor="editSpecifications">Specifications</label>
                              <div className="position-relative">
                                <i className="fas fa-list input-icon"></i>
                                <textarea
                                  className="form-control ps-5"
                                  id="editSpecifications"
                                  name="specifications"
                                  value={editVehicle?.specifications || ''}
                                  onChange={handleEditInputChange}
                                  placeholder='EX: Automatic transmission, 4 doors, 5 seats'
                                  required
                                ></textarea>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <div className="form-group-tech">
                                  <label htmlFor="editMileage">Mileage (km)</label>
                                  <div className="position-relative">
                                    <i className="fas fa-tachometer-alt input-icon"></i>
                                    <input
                                      type="number"
                                      className="form-control ps-5"
                                      id="editMileage"
                                      name="mileage"
                                      value={editVehicle?.mileage || ''}
                                      onChange={handleEditInputChange}
                                      placeholder='EX: 150000KM'
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="form-group-tech">
                                  <label htmlFor="editEngine">Engine</label>
                                  <div className="position-relative">
                                    <i className="fas fa-cogs input-icon"></i>
                                    <input
                                      type="text"
                                      className="form-control ps-5"
                                      id="editEngine"
                                      name="engine"
                                      value={editVehicle?.engine || ''}
                                      onChange={handleEditInputChange}
                                      placeholder='EX: 2.0L'
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <div className="form-group-tech">
                                  <label htmlFor="editFuelType">Fuel Type</label>
                                  <div className="position-relative">
                                    <i className="fas fa-gas-pump input-icon"></i>
                                    <input
                                      type="text"
                                      className="form-control ps-5"
                                      id="editFuelType"
                                      name="fuelType"
                                      value={editVehicle?.fuelType || ''}
                                      onChange={handleEditInputChange}
                                      placeholder='EX: Petrol'
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="form-group-tech">
                                  <label htmlFor="editGear">Gear</label>
                                  <div className="position-relative">
                                    <i className="fas fa-cog input-icon"></i>
                                    <input
                                      type="text"
                                      className="form-control ps-5"
                                      id="editGear"
                                      name="gear"
                                      value={editVehicle?.gear || ''}
                                      onChange={handleEditInputChange}
                                      placeholder='EX: Manual'
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-group-tech">
                              <label htmlFor="editOptions">Options</label>
                              <div className="position-relative">
                                <i className="fas fa-tools input-icon"></i>
                                <input
                                  type="text"
                                  className="form-control ps-5"
                                  id="editOptions"
                                  name="options"
                                  value={editVehicle?.options || ''}
                                  onChange={handleEditInputChange}
                                  placeholder='EX: Air conditioning, GPS, Alloy wheels'
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Pricing & Description Section - Collapsed by default */}
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button 
                            className="accordion-button collapsed"
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#editPricingSection" 
                            aria-expanded="false" 
                            aria-controls="editPricingSection"
                          >
                            Pricing & Description
                          </button>
                        </h2>
                        <div 
                          id="editPricingSection" 
                          className="accordion-collapse collapse"
                        >
                          <div className="accordion-body">
                            <div className="form-group-tech">
                              <label htmlFor="editPrice">Price per Day</label>
                              <div className="position-relative">
                                <i className="fas fa-dollar-sign input-icon"></i>
                                <input
                                  type="number"
                                  className="form-control ps-5"
                                  id="editPrice"
                                  name="price"
                                  value={editVehicle?.price || ''}
                                  onChange={handleEditInputChange}
                                  placeholder='EX: $50'
                                  required
                                />
                              </div>
                            </div>
                            <div className="form-group-tech">
                              <label htmlFor="editDescription">Description</label>
                              <div className="position-relative">
                                <i className="fas fa-file-alt input-icon"></i>
                                <textarea
                                  className="form-control ps-5"
                                  id="editDescription"
                                  name="description"
                                  value={editVehicle?.description || ''}
                                  onChange={handleEditInputChange}
                                  placeholder='EX: This is a great vehicle for its price'
                                  required
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Image Upload Section - Collapsed by default */}
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button 
                            className="accordion-button collapsed"
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#editImageSection" 
                            aria-expanded="false" 
                            aria-controls="editImageSection"
                          >
                            Image Upload
                          </button>
                        </h2>
                        <div 
                          id="editImageSection" 
                          className="accordion-collapse collapse"
                        >
                          <div className="accordion-body">
                            <div className="form-group-tech">
                              <label htmlFor="editImageUrl">Vehicle Image</label>
                              <input
                                type="file"
                                className="form-control"
                                id="editImageUrl"
                                name="image"
                                accept="image/*"
                                onChange={handleEditImageChange}
                              />
                              <div className={`image-preview ${!(editVehicle?.imageUrl) ? 'empty' : ''}`}>
                                {editVehicle?.imageUrl && (
                                  <img 
                                    src={editVehicle?.imageUrl.startsWith('blob:') ? editVehicle?.imageUrl : `/uploads/${editVehicle?.imageUrl.split('/').pop()}`} 
                                    alt="Preview" 
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={() => document.getElementById('editVehicleForm')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                  >
                    Update Vehicle
                  </button>
                </div>
              </div>
            </div>
          </div>
          
              <div className="col-md-6">
                <div className="tech-card p-0"> {/* Premium card wrapper */}
                  <div className="p-4 border-bottom">
                    <h4 className="mb-0">Current Vehicles</h4>
                  </div>
                  <div className="p-3">
                    <div className="table-responsive">
                      <table className="tech-table"> {/* New tech table class */}
                        <thead>
                          <tr>
                            <th>Vehicle</th>
                            <th>Year</th>
                            <th>Specs</th>
                            <th>Price</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentVehicles.map(vehicle => (
                            <tr key={vehicle._id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  {vehicle.imageUrl && (
                                    <img 
                                      src={vehicle.imageUrl} 
                                      alt={vehicle.make} 
                                      className="me-2" 
                                      style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}}
                                    />
                                  )}
                                  <div className="text-truncate" style={{maxWidth: '100px'}}>
                                    <div className="fw-bold">{vehicle.make} {vehicle.model}</div>
                                    <small className="text-muted">{vehicle.vehicleId}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>{vehicle.manufacturedYear}</div>
                                <small className="text-muted">{vehicle.registrationYear}</small>
                              </td>
                              <td>
                                <div className="text-truncate" style={{maxWidth: '120px'}}>
                                  {vehicle.fuelType} | {vehicle.gear} | {vehicle.mileage} km
                                </div>
                              </td>
                              <td>${vehicle.price}/day</td>
                              <td>
                                <div className="btn-group" role="group">
                                  <button 
                                    className="btn btn-sm btn-warning me-1" 
                                    onClick={() => handleEditVehicle(vehicle)}
                                    data-bs-toggle="modal" 
                                    data-bs-target="#editVehicleModal"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-danger" 
                                    onClick={() => handleDeleteVehicle(vehicle._id)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* PAGINATION CONTROLS */}
                <TechPagination 
                    itemsPerPage={itemsPerPage}
                    totalItems={vehicles.length}
                    paginate={setVehiclePage}
                    currentPage={vehiclePage}
                    prevPage={() => setVehiclePage(prev => Math.max(prev - 1, 1))}
                    nextPage={() => setVehiclePage(prev => Math.min(prev + 1, Math.ceil(vehicles.length / itemsPerPage)))}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="tab-pane active fade-in p-3"> {/* Added fade-in for magic */}
            <div className="row mt-4 mb-4">
              <div className="col-md-6">
                <div className="tech-card">
                  <h4 className="mb-4">Add New User</h4>
                  <div className="text-center mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                      alt="User Management" 
                      className="img-fluid rounded"
                      style={{maxHeight: '150px'}}
                    />
                    <div className="mb-4 mt-4">RentalDay user management system offers a streamlined way to manage your users. Add, edit, and delete users easily. 
                      Effortlessly track user details and maintain an organized inventory. As an admin, you can easily manage your users. Add, edit, and delete users with ease.</div>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-success w-100"
                    onClick={() => {
                      setNewUser({
                        userId: `USER${Date.now()}`,
                        username: '',
                        email: '',
                        password: '',
                        role: 'user',
                        firstName: '',
                        lastName: '',
                        phone: '',
                        dateOfBirth: '',
                        licenseNumber: '',
                        address: '',
                        profilePhoto: '',
                      });
                    }}
                    data-bs-toggle="modal" 
                    data-bs-target="#addUserModal"
                  >
                    <i className="fas fa-plus me-2"></i>Add New User
                  </button>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="tech-card"> {/* Wrapped in tech-card */}
                  <h4 className="mb-4">Current Users</h4>
                  <div className="table-responsive">
                    <table className="tech-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>DOB</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUsers.map(userItem => (
                          <tr key={userItem._id}>
                            <td>
                              <div className="text-truncate" style={{maxWidth: '120px'}}>
                                <div className="fw-bold">{userItem.username}</div>
                                <small className="text-muted">{userItem.userId}</small>
                              </div>
                            </td>
                            <td>
                              <div className="text-truncate" style={{maxWidth: '150px'}}>
                                {userItem.email}
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${userItem.role === 'admin' ? 'bg-warning' : 'bg-info'}`}>
                                {userItem.role}
                              </span>
                            </td>
                            <td>
                              {userItem.profileDetails?.dateOfBirth ? new Date(userItem.profileDetails.dateOfBirth).toLocaleDateString() : 'N/A'}
                            </td>
                            <td>
                              <button 
                                className="btn btn-danger btn-sm" 
                                onClick={() => handleDeleteUser(userItem._id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination remains unchanged */}
                  <TechPagination 
                    itemsPerPage={itemsPerPage}
                    totalItems={users.length}
                    paginate={setUserPage}
                    currentPage={userPage}
                    prevPage={() => setUserPage(prev => Math.max(prev - 1, 1))}
                    nextPage={() => setUserPage(prev => Math.min(prev + 1, Math.ceil(users.length / itemsPerPage)))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rentals Tab */}
        {activeTab === 'rentals' && (
          <div className="tab-pane active fade-in p-3">
            <div className="tech-card">
              <div className="p-4 border-bottom">
                <h4 className="mb-0">RENTAL OPERATIONS</h4>
              </div>
              <div className="p-3">
                {rentalsLoading ? (
                  <div className="d-flex justify-content-center">
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="tech-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Vehicle</th>
                          <th>Dates</th>
                          <th>Cost</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRentals.map(rental => (
                          <tr key={rental._id}>
                            <td>
                              <div className="text-truncate" style={{maxWidth: '120px'}}>
                                <div className="fw-bold">{rental.user.username}</div>
                                <small className="text-muted">{rental.user.email}</small>
                              </div>
                            </td>
                            <td>
                              <div className="text-truncate" style={{maxWidth: '120px'}}>
                                <div className="fw-bold">{rental.vehicle.make} {rental.vehicle.model}</div>
                                <small className="text-muted">Year: {rental.vehicle.year}</small>
                              </div>
                            </td>
                            <td>
                              <div>{new Date(rental.startDate).toLocaleDateString()}</div>
                              <small className="text-muted">to {new Date(rental.endDate).toLocaleDateString()}</small>
                            </td>
                            <td>${rental.totalCost.toFixed(2)}</td>
                            <td>
                              <span className={`badge ${
                                rental.status === 'Completed' ? 'bg-success' : 
                                rental.status === 'Approved' ? 'bg-success' : 
                                rental.status === 'Ongoing' ? 'bg-primary' : 
                                rental.status === 'Pending' ? 'bg-warning text-dark' : 
                                'bg-danger'
                              }`}>
                                {rental.status}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                {rental.status === 'Pending' && (
                                  <>
                                    <button 
                                      className="btn btn-sm btn-success me-1" 
                                      onClick={() => handleUpdateRentalStatus(rental._id, 'Approved')}
                                      title="Approve"
                                    >
                                      <i className="fas fa-check"></i>
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-danger me-1" 
                                      onClick={() => handleUpdateRentalStatus(rental._id, 'Cancelled')}
                                      title="Cancel"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </>
                                )}
                                {rental.status === 'Approved' && (
                                  <button 
                                    className="btn btn-sm btn-primary me-1" 
                                    onClick={() => handleUpdateRentalStatus(rental._id, 'Ongoing')}
                                    title="Start"
                                  >
                                    <i className="fas fa-play"></i>
                                  </button>
                                )}
                                {rental.status === 'Ongoing' && (
                                  <button 
                                    className="btn btn-sm btn-success me-1" 
                                    onClick={() => handleUpdateRentalStatus(rental._id, 'Completed')}
                                    title="Complete"
                                  >
                                    <i className="fas fa-check-circle"></i>
                                  </button>
                                )}
                                {rental.status === 'Completed' && (
                                  <button 
                                    className="btn btn-sm btn-secondary" 
                                    disabled
                                    title="Completed"
                                  >
                                    <i className="fas fa-check-circle"></i>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            {/* PAGINATION CONTROLS */}
            <TechPagination 
              itemsPerPage={itemsPerPage}
              totalItems={rentals.length}
              paginate={setRentalPage}
              currentPage={rentalPage}
              prevPage={() => setRentalPage(prev => Math.max(prev - 1, 1))}
              nextPage={() => setRentalPage(prev => Math.min(prev + 1, Math.ceil(rentals.length / itemsPerPage)))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;