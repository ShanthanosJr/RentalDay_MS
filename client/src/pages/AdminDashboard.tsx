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
  profilePhoto?: string;
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
  role: 'admin' | 'user';
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  licenseNumber: string;
  address: string;
  profilePhoto: string;
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
  const [itemsPerPage, setItemsPerPage] = useState(5); // Show 5 items per list by default
  const [vehicleSearch, setVehicleSearch] = useState(''); // New search state
  const [userSearch, setUserSearch] = useState(''); // New user search state
  const [rentalSearch, setRentalSearch] = useState(''); // New rental search state

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
        setEditImageFile(null);
        fetchVehicles(); // Refresh the list
        // Close modal manually
        const modal = document.getElementById('editVehicleModal');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modal) {
          modal.classList.remove('show');
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
          modal.removeAttribute('aria-modal');
          modal.removeAttribute('role');
        }
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      } catch (error) {
        console.error('Error updating vehicle:', error);
      }
    }
  };

  // --- PAGINATION LOGIC HELPERS ---
  // 1. Get Current Vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const term = vehicleSearch.toLowerCase();
    return (
      vehicle.make.toLowerCase().includes(term) ||
      vehicle.model.toLowerCase().includes(term) ||
      vehicle.vehicleId.toLowerCase().includes(term) ||
      (vehicle.registrationYear && vehicle.registrationYear.toString().includes(term))
    );
  });

  const idxLastVehicle = vehiclePage * itemsPerPage;
  const idxFirstVehicle = idxLastVehicle - itemsPerPage;
  const currentVehicles = filteredVehicles.slice(idxFirstVehicle, idxLastVehicle);

  // 2. Get Current Users
  const filteredUsers = users.filter(user => {
    const term = userSearch.toLowerCase();
    return (
      (user.username && user.username.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term)) ||
      (user.userId && user.userId.toLowerCase().includes(term))
    );
  });

  const idxLastUser = userPage * itemsPerPage;
  const idxFirstUser = idxLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(idxFirstUser, idxLastUser);

  // 3. Get Current Rentals
  const filteredRentals = rentals.filter(rental => {
    const term = rentalSearch.toLowerCase();
    return (
      (rental.user?.username && rental.user.username.toLowerCase().includes(term)) ||
      (rental.vehicle?.make && rental.vehicle.make.toLowerCase().includes(term)) ||
      (rental.vehicle?.model && rental.vehicle.model.toLowerCase().includes(term)) ||
      (rental.status && rental.status.toLowerCase().includes(term))
    );
  });

  const idxLastRental = rentalPage * itemsPerPage;
  const idxFirstRental = idxLastRental - itemsPerPage;
  const currentRentals = filteredRentals.slice(idxFirstRental, idxLastRental);

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>Access Denied</div>;
  }

  return (
    <div className="container-fluid px-4">
      {/* Tabs for Vehicles and Users */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-3 mt-5">
        <h2 className="fw-bold mb-0">WELCOME TO THE ADMIN <span className="text-success">DASHBOARD</span></h2>
        <span className="badge bg-dark text-white p-2 font-monospace">V 1.0.5 BUILD</span>
      </div>

      {/* 3. UPDATED TAB NAVIGATION */}
      <ul className="nav nav-tabs border-bottom-0 mb-4 px-3">
        <li className="nav-item">
          <button
            className={`nav-link border-0 fw-bold ${activeTab === 'info' ? 'active text-success ' : 'text-muted'}`}
            onClick={() => setActiveTab('info')}
            style={{ background: 'transparent' }}
          >
            SYSTEM OVERVIEW
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link border-0 fw-bold ${activeTab === 'vehicles' ? 'active text-success ' : 'text-muted'}`}
            onClick={() => setActiveTab('vehicles')}
            style={{ background: 'transparent' }}
          >
            VEHICLE MANAGEMENT
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link border-0 fw-bold ${activeTab === 'users' ? 'active text-success ' : 'text-muted'}`}
            onClick={() => setActiveTab('users')}
            style={{ background: 'transparent' }}
          >
            USER GOVERNANCE
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link border-0 fw-bold ${activeTab === 'rentals' ? 'active text-success ' : 'text-muted'}`}
            onClick={() => setActiveTab('rentals')}
            style={{ background: 'transparent' }}
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
                      style={{ maxHeight: '150px' }}
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
                <div className="tech-card p-0 overflow-hidden">
                  <div className="p-4 border-bottom bg-light bg-opacity-10 d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                      <h4 className="mb-1 fw-bold">Current Inventory</h4>
                      <p className="text-muted small mb-0">Manage your fleet availability</p>
                    </div>
                    <div className="d-flex gap-2">
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><i className="fas fa-search text-muted"></i></span>
                        <input
                          type="text"
                          className="form-control border-start-0 ps-0"
                          placeholder="Search..."
                          value={vehicleSearch}
                          onChange={(e) => { setVehicleSearch(e.target.value); setVehiclePage(1); }}
                        />
                      </div>
                      <select
                        className="form-select w-auto"
                        value={itemsPerPage}
                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setVehiclePage(1); }}
                      >
                        <option value={5}>5 / page</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-0">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th className="ps-4 py-3">Vehicle</th>
                            <th className="py-3">Specs</th>
                            <th className="py-3">Status</th>
                            <th className="py-3">Price</th>
                            <th className="text-end pe-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentVehicles.length > 0 ? (
                            currentVehicles.map(vehicle => (
                              <tr key={vehicle._id}>
                                <td className="ps-4">
                                  <div className="d-flex align-items-center">
                                    <div className="position-relative me-3">
                                      {vehicle.imageUrl ? (
                                        <img
                                          src={vehicle.imageUrl}
                                          alt={vehicle.make}
                                          className="rounded-3 object-fit-cover shadow-sm"
                                          style={{ width: '48px', height: '48px' }}
                                        />
                                      ) : (
                                        <div className="rounded-3 bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                          <i className="fas fa-car text-muted"></i>
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <div className="fw-bold text-dark">{vehicle.make} {vehicle.model}</div>
                                      <div className="small text-muted font-monospace">{vehicle.vehicleId}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="small text-muted mb-1"><i className="fas fa-calendar-alt me-1"></i>{vehicle.manufacturedYear}</div>
                                  <div className="small text-muted"><i className="fas fa-tachometer-alt me-1"></i>{vehicle.mileage}km</div>
                                </td>
                                <td>
                                  <div className="d-flex flex-column gap-1">
                                    <span className="badge bg-light text-dark border fw-normal">
                                      {vehicle.fuelType}
                                    </span>
                                    <span className="badge bg-light text-dark border fw-normal">
                                      {vehicle.gear}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <div className="fw-bold text-success">${vehicle.price}</div>
                                  <div className="small text-muted">per day</div>
                                </td>
                                <td className="text-end pe-4">
                                  <div className="btn-group">
                                    <button
                                      className="btn btn-warning btn-sm me-1 text-white"
                                      onClick={() => handleEditVehicle(vehicle)}
                                      data-bs-toggle="modal"
                                      data-bs-target="#editVehicleModal"
                                      title="Edit Vehicle"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleDeleteVehicle(vehicle._id)}
                                      title="Delete Vehicle"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="text-center py-5 text-muted">
                                <i className="fas fa-search fa-2x mb-3 opacity-50"></i>
                                <p className="mb-0">No vehicles found matching "{vehicleSearch}"</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Footer Pagination */}
                  <div className="p-3 border-top bg-light bg-opacity-10">
                    <TechPagination
                      itemsPerPage={itemsPerPage}
                      totalItems={filteredVehicles.length}
                      paginate={setVehiclePage}
                      currentPage={vehiclePage}
                      prevPage={() => setVehiclePage(prev => Math.max(prev - 1, 1))}
                      nextPage={() => setVehiclePage(prev => Math.min(prev + 1, Math.ceil(filteredVehicles.length / itemsPerPage)))}
                    />
                  </div>
                </div>
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
                      style={{ maxHeight: '150px' }}
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
                <div className="tech-card p-0 overflow-hidden">
                  <div className="p-4 border-bottom bg-light bg-opacity-10 d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                      <h4 className="mb-1 fw-bold">User Governance</h4>
                      <p className="text-muted small mb-0">Manage system access and profiles</p>
                    </div>
                    <div className="d-flex gap-2">
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><i className="fas fa-search text-muted"></i></span>
                        <input
                          type="text"
                          className="form-control border-start-0 ps-0"
                          placeholder="Search users..."
                          value={userSearch}
                          onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                        />
                      </div>
                      <select
                        className="form-select w-auto"
                        value={itemsPerPage}
                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setUserPage(1); }}
                      >
                        <option value={5}>5 / page</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-0">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th className="ps-4 py-3">User</th>
                            <th className="py-3">Role</th>
                            <th className="py-3">Contact</th>
                            <th className="text-end pe-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers.length > 0 ? (
                            currentUsers.map(appUser => (
                              <tr key={appUser._id}>
                                <td className="ps-4">
                                  <div className="d-flex align-items-center">
                                    <div className="position-relative me-3">
                                      {appUser.avatar || appUser.profilePhoto ? (
                                        <img
                                          src={
                                            (appUser.avatar || appUser.profilePhoto || '').startsWith('http')
                                              ? (appUser.avatar || appUser.profilePhoto)
                                              : `/uploads/${(appUser.avatar || appUser.profilePhoto || '').split('/').pop()}`
                                          }
                                          alt={appUser.username}
                                          className="rounded-circle object-fit-cover shadow-sm"
                                          style={{ width: '40px', height: '40px' }}
                                          onError={(e) => {
                                            // Fallback to initial if image fails
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            if (target.nextElementSibling) {
                                              (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                            }
                                          }}
                                        />
                                      ) : null}
                                      {(!appUser.avatar && !appUser.profilePhoto) && (
                                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
                                          {appUser.username.charAt(0).toUpperCase()}
                                        </div>
                                      )}
                                      {/* Hidden fallback div for broken images 
                                      <div
                                        className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center shadow-sm"
                                        style={{ width: '40px', height: '40px', display: 'none' }}
                                      >
                                        {appUser.username.charAt(0).toUpperCase()}
                                      </div> */}
                                    </div>
                                    <div>
                                      <div className="fw-bold text-dark">{appUser.username}</div>
                                      <div className="small text-muted font-monospace">{appUser.userId}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span className={`badge ${appUser.role === 'admin' ? 'bg-danger' : 'bg-primary'} fw-normal`}>
                                    {appUser.role.toUpperCase()}
                                  </span>
                                </td>
                                <td>
                                  <div className="small">{appUser.email}</div>
                                  {appUser.profileDetails?.phone && (
                                    <div className="small text-muted"><i className="fas fa-phone-alt me-1"></i>{appUser.profileDetails.phone}</div>
                                  )}
                                </td>
                                <td className="text-end pe-4">
                                  <div className="btn-group">
                                    <button
                                      className="btn btn-warning btn-sm me-1 text-white"
                                      title="Edit User"
                                      // Assuming you might want an edit modal later, for now just a placeholder or delete
                                      onClick={() => {
                                        alert('Edit functionality not explicitly defined in requirements yet. Use delete to remove.');
                                      }}
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleDeleteUser(appUser._id)}
                                      title="Delete User"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center py-5 text-muted">
                                <i className="fas fa-users-slash fa-2x mb-3 opacity-50"></i>
                                <p className="mb-0">No users found matching "{userSearch}"</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Footer Pagination */}
                  <div className="p-3 border-top bg-light bg-opacity-10">
                    <TechPagination
                      itemsPerPage={itemsPerPage}
                      totalItems={filteredUsers.length}
                      paginate={setUserPage}
                      currentPage={userPage}
                      prevPage={() => setUserPage(prev => Math.max(prev - 1, 1))}
                      nextPage={() => setUserPage(prev => Math.min(prev + 1, Math.ceil(filteredUsers.length / itemsPerPage)))}
                    />
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
            </div >

          </div >
        )}

        {/* Rentals Tab */}
        {
          activeTab === 'rentals' && (
            <div className="tab-pane active fade-in p-3">
              <div className="tech-card p-0 overflow-hidden">
                <div className="p-4 border-bottom bg-light bg-opacity-10 d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div>
                    <h4 className="mb-1 fw-bold">Rental Operations</h4>
                    <p className="text-muted small mb-0">Monitor and manage booking statuses</p>
                  </div>
                  <div className="d-flex gap-2">
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0"><i className="fas fa-search text-muted"></i></span>
                      <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        placeholder="Search rentals..."
                        value={rentalSearch}
                        onChange={(e) => { setRentalSearch(e.target.value); setRentalPage(1); }}
                      />
                    </div>
                    <select
                      className="form-select w-auto"
                      value={itemsPerPage}
                      onChange={(e) => { setItemsPerPage(Number(e.target.value)); setRentalPage(1); }}
                    >
                      <option value={5}>5 / page</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                <div className="p-0">
                  {rentalsLoading ? (
                    <div className="d-flex justify-content-center p-5">
                      <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th className="ps-4 py-3">User Details</th>
                            <th className="py-3">Vehicle Info</th>
                            <th className="py-3">Trip Dates</th>
                            <th className="py-3">Status</th>
                            <th className="text-end pe-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRentals.length > 0 ? (
                            currentRentals.map(rental => (
                              <tr key={rental._id}>
                                <td className="ps-4">
                                  <div className="d-flex align-items-center">
                                    <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                      <i className="fas fa-user"></i>
                                    </div>
                                    <div>
                                      <div className="fw-bold text-dark">{rental.user?.username || 'Unknown User'}</div>
                                      <div className="small text-muted">{rental.user?.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="me-2 text-muted"><i className="fas fa-car"></i></div>
                                    <div>
                                      <div className="fw-bold">{rental.vehicle?.make} {rental.vehicle?.model}</div>
                                      <div className="small text-success">${rental.totalCost} total</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="small text-muted mb-1">
                                    <i className="fas fa-arrow-right me-1 text-success"></i>
                                    {new Date(rental.startDate).toLocaleDateString()}
                                  </div>
                                  <div className="small text-muted">
                                    <i className="fas fa-arrow-left me-1 text-danger"></i>
                                    {new Date(rental.endDate).toLocaleDateString()}
                                  </div>
                                </td>
                                <td>
                                  {/* Status Display - Handling case sensitivity and converting to common format */}
                                  {['pending', 'Pending'].includes(rental.status) && <span className="badge bg-warning text-dark">Pending</span>}
                                  {['approved', 'Approved'].includes(rental.status) && <span className="badge bg-success">Approved</span>}
                                  {['ongoing', 'Ongoing'].includes(rental.status) && <span className="badge bg-primary">Ongoing</span>}
                                  {['rejected', 'Rejected'].includes(rental.status) && <span className="badge bg-danger">Rejected</span>}
                                  {['completed', 'Completed'].includes(rental.status) && <span className="badge bg-info text-dark">Completed</span>}
                                  {['cancelled', 'Cancelled'].includes(rental.status) && <span className="badge bg-secondary">Cancelled</span>}
                                </td>
                                <td className="text-end pe-4">
                                  <div className="btn-group">
                                    {['pending', 'Pending'].includes(rental.status) && (
                                      <>
                                        <button
                                          className="btn btn-success btn-sm me-1"
                                          onClick={() => handleUpdateRentalStatus(rental._id, 'Approved')}
                                          title="Approve"
                                        >
                                          <i className="fas fa-check"></i>
                                        </button>
                                        <button
                                          className="btn btn-danger btn-sm"
                                          onClick={() => handleUpdateRentalStatus(rental._id, 'Rejected')}
                                          title="Reject"
                                        >
                                          <i className="fas fa-times"></i>
                                        </button>
                                      </>
                                    )}
                                    {['approved', 'Approved'].includes(rental.status) && (
                                      <button
                                        className="btn btn-primary btn-sm text-white"
                                        onClick={() => handleUpdateRentalStatus(rental._id, 'Ongoing')}
                                        title="Start Rental"
                                      >
                                        <i className="fas fa-play"></i>
                                      </button>
                                    )}
                                    {['ongoing', 'Ongoing'].includes(rental.status) && (
                                      <button
                                        className="btn btn-info btn-sm text-white"
                                        onClick={() => handleUpdateRentalStatus(rental._id, 'Completed')}
                                        title="Mark Complete"
                                      >
                                        <i className="fas fa-flag-checkered"></i>
                                      </button>
                                    )}
                                    {['rejected', 'Rejected', 'cancelled', 'Cancelled', 'completed', 'Completed'].includes(rental.status) && (
                                      <span className="text-muted small fst-italic">Archived</span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="text-center py-5 text-muted">
                                <i className="fas fa-calendar-times fa-2x mb-3 opacity-50"></i>
                                <p className="mb-0">No rentals found matching "{rentalSearch}"</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Footer Pagination */}
                  {!rentalsLoading && (
                    <div className="p-3 border-top bg-light bg-opacity-10">
                      <TechPagination
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredRentals.length}
                        paginate={setRentalPage}
                        currentPage={rentalPage}
                        prevPage={() => setRentalPage(prev => Math.max(prev - 1, 1))}
                        nextPage={() => setRentalPage(prev => Math.min(prev + 1, Math.ceil(filteredRentals.length / itemsPerPage)))}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default AdminDashboard;