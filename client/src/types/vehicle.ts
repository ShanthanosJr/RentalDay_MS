export interface Vehicle {
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