const mongoose = require('mongoose');
require('dotenv').config();

// Import the Vehicle model
const Vehicle = require('./models/Vehicle');

// Sample vehicle data
const sampleVehicles = [
  {
    vehicleId: 'VD001',
    make: 'Toyota',
    model: 'Camry',
    manufacturedYear: 2022,
    registrationYear: 2022,
    specifications: '4-cylinder, 2.5L engine, Automatic transmission',
    mileage: 15000,
    engine: '2.5L 4-cylinder',
    fuelType: 'Petrol',
    gear: 'Automatic',
    options: 'Air conditioning, Power windows, Bluetooth, Backup camera',
    price: 45000,
    description: 'Reliable sedan with excellent fuel efficiency and modern features.',
    imageUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    vehicleId: 'VD002',
    make: 'Honda',
    model: 'Civic',
    manufacturedYear: 2023,
    registrationYear: 2023,
    specifications: '4-cylinder, 1.5L turbo engine, CVT transmission',
    mileage: 8000,
    engine: '1.5L Turbo 4-cylinder',
    fuelType: 'Petrol',
    gear: 'CVT',
    options: 'Apple CarPlay, Android Auto, Lane Assist, Keyless Entry',
    price: 32000,
    description: 'Sporty compact car with advanced safety features and great handling.',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e7f8d69c0d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    vehicleId: 'VD003',
    make: 'Ford',
    model: 'F-150',
    manufacturedYear: 2021,
    registrationYear: 2021,
    specifications: 'V6, 3.5L EcoBoost engine, 10-speed automatic',
    mileage: 25000,
    engine: '3.5L V6 EcoBoost',
    fuelType: 'Petrol',
    gear: 'Automatic',
    options: 'Towing package, Power liftgate, Heated seats',
    price: 55000,
    description: 'Powerful pickup truck with impressive towing capacity and modern amenities.',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    vehicleId: 'VD004',
    make: 'BMW',
    model: 'X5',
    manufacturedYear: 2022,
    registrationYear: 2022,
    specifications: 'V6, 3.0L turbo engine, 8-speed automatic',
    mileage: 12000,
    engine: '3.0L V6 Turbo',
    fuelType: 'Petrol',
    gear: 'Automatic',
    options: 'Leather interior, Panoramic sunroof, Navigation system',
    price: 75000,
    description: 'Luxury SUV with premium features and exceptional performance.',
    imageUrl: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    vehicleId: 'VD005',
    make: 'Tesla',
    model: 'Model 3',
    manufacturedYear: 2023,
    registrationYear: 2023,
    specifications: 'Electric, Dual motor AWD, 358 hp',
    mileage: 5000,
    engine: 'Electric Motor',
    fuelType: 'Electric',
    gear: 'Automatic',
    options: 'Autopilot, Premium interior, Supercharging',
    price: 48000,
    description: 'Electric sedan with cutting-edge technology and impressive range.',
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    vehicleId: 'VD006',
    make: 'Audi',
    model: 'A4',
    manufacturedYear: 2021,
    registrationYear: 2021,
    specifications: '4-cylinder, 2.0L turbo engine, 7-speed automatic',
    mileage: 18000,
    engine: '2.0L 4-cylinder Turbo',
    fuelType: 'Petrol',
    gear: 'Automatic',
    options: 'Virtual cockpit, LED headlights, Parking sensors',
    price: 42000,
    description: 'Elegant sedan with premium build quality and advanced technology.',
    imageUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    vehicleId: 'VD007',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    manufacturedYear: 2022,
    registrationYear: 2022,
    specifications: '4-cylinder, 2.0L turbo engine, 9-speed automatic',
    mileage: 10000,
    engine: '2.0L 4-cylinder Turbo',
    fuelType: 'Petrol',
    gear: 'Automatic',
    options: 'MBUX infotainment, Heated steering wheel, Premium sound',
    price: 52000,
    description: 'Luxury sedan with sophisticated design and cutting-edge features.',
    imageUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    vehicleId: 'VD008',
    make: 'Nissan',
    model: 'Altima',
    manufacturedYear: 2020,
    registrationYear: 2020,
    specifications: '4-cylinder, 2.5L engine, CVT transmission',
    mileage: 30000,
    engine: '2.5L 4-cylinder',
    fuelType: 'Petrol',
    gear: 'CVT',
    options: 'ProPILOT Assist, Apple CarPlay, Remote start',
    price: 28000,
    description: 'Comfortable midsize sedan with advanced safety features.',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d5773c8d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    vehicleId: 'VD009',
    make: 'Hyundai',
    model: 'Tucson',
    manufacturedYear: 2023,
    registrationYear: 2023,
    specifications: '4-cylinder, 1.6L turbo engine, 8-speed automatic',
    mileage: 6000,
    engine: '1.6L Turbo 4-cylinder',
    fuelType: 'Petrol',
    gear: 'Automatic',
    options: 'Smart Cruise Control, Wireless charging, Surround view',
    price: 35000,
    description: 'Modern SUV with excellent warranty and advanced technology features.',
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    vehicleId: 'VD010',
    make: 'Subaru',
    model: 'Outback',
    manufacturedYear: 2022,
    registrationYear: 2022,
    specifications: '4-cylinder, 2.5L boxer engine, CVT transmission',
    mileage: 14000,
    engine: '2.5L Boxer 4-cylinder',
    fuelType: 'Petrol',
    gear: 'CVT',
    options: 'All-wheel drive, EyeSight safety, Power liftgate',
    price: 38000,
    description: 'Versatile wagon with standard all-wheel drive and excellent safety ratings.',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

// Function to seed the database
async function seedVehicles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rentalday');
    console.log('Connected to MongoDB');

    // Clear existing vehicles
    await Vehicle.deleteMany({});
    console.log('Cleared existing vehicles');

    // Insert sample vehicles
    await Vehicle.insertMany(sampleVehicles);
    console.log('Sample vehicles added successfully');

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding vehicles:', error);
    process.exit(1);
  }
}

// Run the seed function
seedVehicles();