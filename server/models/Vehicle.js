const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  make: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  manufacturedYear: {
    type: Number,
    required: true
  },
  registrationYear: {
    type: Number,
    required: true
  },
  specifications: {
    type: String,
    required: true
  },
  mileage: {
    type: Number,
    required: true
  },
  engine: {
    type: String,
    required: true
  },
  fuelType: {
    type: String,
    required: true
  },
  gear: {
    type: String,
    required: true
  },
  options: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);