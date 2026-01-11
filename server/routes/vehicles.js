const express = require('express');
const multer = require('multer');
const path = require('path');
const Vehicle = require('../models/Vehicle');
const { requireAdmin } = require('../middleware/auth');

// Set up multer for vehicle image uploads
const vehicleImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'vehicle-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const vehicleImageUpload = multer({ storage: vehicleImageStorage });

const router = express.Router();

// Get all vehicles (public access)
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
  }
});

// Get a specific vehicle by ID
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ message: 'Error fetching vehicle', error: error.message });
  }
});

// Create a new vehicle (admin only)
router.post('/', requireAdmin, vehicleImageUpload.single('image'), async (req, res) => {
  try {
    const { vehicleId, make, model, manufacturedYear, registrationYear, specifications, mileage, engine, fuelType, gear, options, price, description } = req.body;
    
    // If there's an image uploaded, save the path
    let imageUrl = req.body.imageUrl; // fallback to imageUrl from body if no file uploaded
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    
    // Generate vehicle ID if not provided
    const finalVehicleId = vehicleId || `VEH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const vehicle = new Vehicle({
      vehicleId: finalVehicleId,
      make,
      model,
      manufacturedYear,
      registrationYear,
      specifications,
      mileage,
      engine,
      fuelType,
      gear,
      options,
      price,
      description,
      imageUrl
    });

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ message: 'Error creating vehicle', error: error.message });
  }
});

// Update a vehicle by ID (admin only)
router.put('/:id', requireAdmin, vehicleImageUpload.single('image'), async (req, res) => {
  try {
    const { make, model, manufacturedYear, registrationYear, specifications, mileage, engine, fuelType, gear, options, price, description, imageUrl } = req.body;
    
    // If there's an image uploaded, update the image path
    let updatedImageUrl = imageUrl;
    if (req.file) {
      updatedImageUrl = `/uploads/${req.file.filename}`;
    }
    
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { make, model, manufacturedYear, registrationYear, specifications, mileage, engine, fuelType, gear, options, price, description, imageUrl: updatedImageUrl },
      { new: true, runValidators: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ message: 'Error updating vehicle', error: error.message });
  }
});

// Delete a vehicle by ID (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
  }
});

module.exports = router;