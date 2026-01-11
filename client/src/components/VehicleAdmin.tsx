import React from 'react';
import { Vehicle } from '../types/vehicle';
import styles from '../styles/VehicleAdmin.module.css';
import AddVehicleModal from './AddVehicleModal';
import EditVehicleModal from '../components/EditVehicleModal';
//import axios from 'axios';

interface VehicleAdminProps {
  vehicles: Vehicle[];
  onAddVehicle: (vehicleData: FormData) => Promise<void>;
  onUpdateVehicle: (id: string, vehicleData: FormData) => Promise<void>;
  onDeleteVehicle: (id: string) => Promise<void>;
  generateVehicleId: () => string;
  loading: boolean;
}

const VehicleAdmin: React.FC<VehicleAdminProps> = ({
  vehicles,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  generateVehicleId}) => {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [, setEditingVehicle] = React.useState<Vehicle | null>(null);
  const [editingVehicleData, setEditingVehicleData] = React.useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = React.useState({
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
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [, setEditImageFile] = React.useState<File | null>(null);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newVehicle).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (imageFile) formData.append('image', imageFile);
    await onAddVehicle(formData);
    setShowAddModal(false);
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
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setEditingVehicleData(vehicle);
    setEditImageFile(null); // Reset edit image file
    setShowEditModal(true);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      await onDeleteVehicle(id);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setNewVehicle(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingVehicleData) {
      setEditingVehicleData(prev => ({
        ...prev!,
        [name]: value
      } as Vehicle));
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingVehicleData) {
      setEditImageFile(file);
      setEditingVehicleData(prev => ({
        ...prev!,
        imageUrl: URL.createObjectURL(file)
      } as Vehicle));
    }
  };

  return (
    <div className={styles.vehicleAdmin}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Vehicle Management</span>
        <div>
          <h2 className={styles.sectionTitle}>Fleet Inventory</h2>
          <h3 className={styles.sectionSubtitle}>Manage your premium vehicles</h3>
        </div>
      </div>

      {/* Add Vehicle Card */}
      <div className={styles.addVehicleCard}>
        <div className={styles.cardImageWrapper}>
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&fit=crop" 
            alt="Add Vehicle" 
            className={styles.cardImage}
          />
        </div>
        <div className={styles.cardContent}>
          <h4 className={styles.cardTitle}>Add New Vehicle</h4>
          <p className={styles.cardDesc}>Add premium vehicles to your rental fleet with full specifications.</p>
          <button 
            className={styles.primaryBtn}
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-circle"></i>
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Vehicle List Grid */}
      <div className={styles.vehiclesGrid}>
        {vehicles.map(vehicle => (
          <div key={vehicle._id} className={styles.vehicleCard}>
            <div className={styles.vehicleImageWrapper}>
              <img 
                src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&fit=crop'} 
                alt={`${vehicle.make} ${vehicle.model}`}
                className={styles.vehicleImage}
              />
              <div className={styles.vehicleBadge}>
                ${vehicle.price}/day
              </div>
            </div>
            <div className={styles.vehicleContent}>
              <h4 className={styles.vehicleTitle}>{vehicle.make} {vehicle.model}</h4>
              <div className={styles.vehicleSpecs}>
                <span>{vehicle.manufacturedYear}</span>
                <span>{vehicle.fuelType}</span>
                <span>{vehicle.mileage}km</span>
              </div>
              <div className={styles.vehicleActions}>
                <button 
                  className={styles.editBtn}
                  onClick={() => handleEditVehicle(vehicle)}
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteVehicle(vehicle._id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <AddVehicleModal
          vehicle={newVehicle}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddVehicle}
          onInputChange={handleInputChange}
          onImageChange={handleImageChange}
        />
      )}

      {/* Edit Vehicle Modal */}
      {showEditModal && editingVehicleData && (
        <EditVehicleModal
          vehicle={editingVehicleData}
          onClose={() => {
            setShowEditModal(false);
            setEditingVehicle(null);
            setEditingVehicleData(null);
          }}
          onSubmit={(id: string, formData: FormData) => onUpdateVehicle(id, formData)}
          onInputChange={handleEditInputChange}
          onImageChange={handleEditImageChange}
        />
      )}
    </div>
  );
};

export default VehicleAdmin;
