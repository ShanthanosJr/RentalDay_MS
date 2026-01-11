import React from 'react';
import { Vehicle } from '../types/vehicle';
import styles from '../styles/VehicleAdmin.module.css';

interface EditVehicleModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onSubmit: (id: string, formData: FormData) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  vehicle,
  onClose,
  onSubmit,
  onInputChange,
  onImageChange
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(vehicle).forEach(([key, value]) => {
      if (key !== '_id' && key !== 'images' && key !== 'imageUrl') {
        formData.append(key, value as string | Blob);
      }
    });
    // Include any file that was selected
    onSubmit(vehicle._id, formData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <div>
              <span className={styles.sectionLabel}>Edit Vehicle</span>
              <h2 className={styles.modalTitle}>Update Vehicle</h2>
            </div>
            <button className={styles.modalClose} onClick={onClose}>
              <i className="bi bi-x"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className={styles.modalBody}>
            <div className={styles.formGrid}>
              {/* Basic Info */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Basic Information</h4>
                <div className={styles.inputGrid}>
                  <div className={styles.formGroup}>
                    <label>Vehicle ID</label>
                    <div className={styles.inputWrapper}>
                      <i className="bi bi-id-badge"></i>
                      <input
                        name="vehicleId"
                        value={vehicle.vehicleId}
                        onChange={onInputChange}
                        readOnly
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Make *</label>
                    <div className={styles.inputWrapper}>
                      <i className="bi bi-car-front"></i>
                      <input
                        name="make"
                        value={vehicle.make}
                        onChange={onInputChange}
                        required
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Model *</label>
                    <div className={styles.inputWrapper}>
                      <i className="bi bi-tag"></i>
                      <input
                        name="model"
                        value={vehicle.model}
                        onChange={onInputChange}
                        required
                        className={styles.input}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Specifications</h4>
                <div className={styles.inputGrid}>
                  <div className={styles.formGroup}>
                    <label>Manufactured Year</label>
                    <div className={styles.inputWrapper}>
                      <i className="bi bi-calendar3"></i>
                      <input
                        name="manufacturedYear"
                        type="number"
                        value={vehicle.manufacturedYear}
                        onChange={onInputChange}
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Mileage (km)</label>
                    <div className={styles.inputWrapper}>
                      <i className="bi bi-speedometer"></i>
                      <input
                        name="mileage"
                        type="number"
                        value={vehicle.mileage}
                        onChange={onInputChange}
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Fuel Type</label>
                    <div className={styles.inputWrapper}>
                      <i className="bi bi-fuel-pump"></i>
                      <input
                        name="fuelType"
                        value={vehicle.fuelType}
                        onChange={onInputChange}
                        className={styles.input}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Image */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Pricing & Image</h4>
                <div className={styles.inputGrid}>
                  <div className={styles.formGroup}>
                    <label>Price per Day ($)</label>
                    <div className={styles.inputWrapper}>
                      <i className="bi bi-currency-dollar"></i>
                      <input
                        name="price"
                        type="number"
                        value={vehicle.price}
                        onChange={onInputChange}
                        required
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Vehicle Image</label>
                    <div className={styles.inputWrapper}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onImageChange}
                        className={styles.fileInput}
                      />
                    </div>
                    {vehicle.imageUrl && (
                      <img src={vehicle.imageUrl} alt="Preview" className={styles.imagePreview} />
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button type="button" className={styles.secondaryBtn} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={styles.primaryBtn}>
                Update Vehicle
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditVehicleModal;