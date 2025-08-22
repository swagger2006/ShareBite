export interface FoodItem {
  id: string;
  title: string;
  type: 'Cooked Food' | 'Raw Ingredients' | 'Packaged' | 'Bakery' | 'Beverages';
  quantity: number;
  unit: string;
  provider: string;
  providerId: string;
  location: string;
  safetyHours: number;
  listedAt: Date;
  expiresAt: Date;
  description: string;
  imageUrl: string;
  status: 'Available' | 'Reserved' | 'Collected' | 'Expired';
  tags: string[];
  allergens: string[];
  nutritionalInfo?: string;
  qrCode?: string;
  reservedBy?: string;
  collectedBy?: string;
  rating?: number;
  reviews?: Review[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'FoodProvider' | 'Individual' | 'NGO/Volunteer' | 'Admin';
  organization?: string;
  profileImage?: string;
  verified: boolean;
  joinedAt: Date;
  points: number;
  level: number;
  badges: Badge[];
  preferences: {
    dietary: string[];
    notifications: boolean;
    radius: number;
  };
  stats: {
    foodListed: number;
    foodCollected: number;
    impactScore: number;
  };
}

export interface NGO {
  id: string;
  name: string;
  description: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  verified: boolean;
  serviceAreas: string[];
  capacity: number;
  operatingHours: string;
  specializations: string[];
  rating: number;
  totalServed: number;
  registrationNumber: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'food_available' | 'pickup_reminder' | 'expiry_warning' | 'ngo_request' | 'achievement' | 'system';
  foodId?: string;
  userId?: string;
  ngoId?: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  date: Date;
  location: string;
  estimatedAttendees: number;
  organizer: string;
  organizerId: string;
  hasFood: boolean;
  foodLogged: boolean;
  expectedSurplus?: number;
  eventType: 'Conference' | 'Workshop' | 'Cultural' | 'Sports' | 'Academic' | 'Social';
}

export interface AnalyticsData {
  foodSaved: number;
  carbonFootprintReduced: number;
  waterFootprintReduced: number;
  peopleServed: number;
  wasteReduced: number;
  totalUsers: number;
  activeNGOs: number;
  monthlyGrowth: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  foodId?: string;
}

export interface FoodRequest {
  id: string;
  ngoId: string;
  ngoName: string;
  requestedItems: string[];
  quantity: number;
  urgency: 'low' | 'medium' | 'high';
  description: string;
  location: string;
  contactPerson: string;
  phone: string;
  status: 'pending' | 'matched' | 'fulfilled' | 'cancelled';
  createdAt: Date;
  deadline: Date;
}