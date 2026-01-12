const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Create a new rental booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;
    
    // Validate required fields
    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Vehicle ID, start date, and end date are required' });
    }

    // Check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Calculate total days and cost (include both start and end dates)
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    const totalCost = vehicle.price * days;

    // Check if vehicle is already booked during this period
    const existingRental = await Rental.findOne({
      vehicle: vehicleId,
      status: { $in: ['Pending', 'Approved', 'Ongoing'] },
      $or: [
        {
          startDate: { $lte: end },
          endDate: { $gte: start }
        }
      ]
    });

    if (existingRental) {
      return res.status(400).json({ message: 'Vehicle is already booked for the selected dates' });
    }

    // Create new rental
    const rental = new Rental({
      user: req.user.id,
      vehicle: vehicleId,
      startDate: start,
      endDate: end,
      totalCost,
      status: 'Pending'
    });

    await rental.save();
    
    // Populate user and vehicle details for response
    const populatedRental = await Rental.findById(rental._id)
      .populate('user', 'username email')
      .populate('vehicle', 'make model manufacturedYear price images fuelType gear mileage');
    
    res.status(201).json(populatedRental);
  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get rentals for the logged-in user
router.get('/my-rentals', authenticateToken, async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.user.id })
      .populate('vehicle', 'make model manufacturedYear price images fuelType gear mileage')
      .sort({ createdAt: -1 });
    
    res.json(rentals);
  } catch (error) {
    console.error('Error fetching user rentals:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all rentals (admin only)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const rentals = await Rental.find()
      .populate('user', 'username email')
      .populate('vehicle', 'make model manufacturedYear price images fuelType gear mileage')
      .sort({ createdAt: -1 });
    
    res.json(rentals);
  } catch (error) {
    console.error('Error fetching all rentals:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update rental status (admin only)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Validate status
    const validStatuses = ['Pending', 'Approved', 'Ongoing', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const rental = await Rental.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user', 'username email')
      .populate('vehicle', 'make model manufacturedYear price images fuelType gear mileage');

    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    res.json(rental);
  } catch (error) {
    console.error('Error updating rental status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;