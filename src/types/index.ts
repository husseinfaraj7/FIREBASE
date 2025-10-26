
import type { Timestamp } from 'firebase/firestore';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: "Benzina" | "Diesel" | "Elettrica" | "Ibrida" | "GPL" | "Metano";
  transmission: "Manuale" | "Automatica";
  description: string;
  category: string;
  images: string[];
  featured?: boolean;
  available?: boolean;
  maintenanceRecords?: boolean;
  warranty?: boolean;
  owners?: number;
  color?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ContactMessage {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  carId?: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: Timestamp;
}

export type Testimonial = {
  name: string;
  rating: number;
  review: string;
  image: string;
};

export type Service = {
  title: string;
  description: string;
  icon: React.ElementType;
};

export type Stat = {
  value: string;
  label: string;
};

export type TeamMember = {
  name: string;
  role: string;
  image: string;
};

export type WhyChooseUsItem = {
  title: string;
  description: string;
  icon: React.ElementType;
}

export type BusinessInfo = {
    name: string;
    address: string;
    phone: string;
    email: string;
    partitaIVA: string;
    codiceFiscale: string;
}
