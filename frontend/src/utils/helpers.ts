import { FoodItem, AnalyticsData, User, Badge } from '../types';

export const formatTimeRemaining = (expiresAt: Date): string => {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  return `${minutes}m left`;
};

export const getFreshnessStatus = (expiresAt: Date): 'fresh' | 'warning' | 'expired' => {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  const hoursLeft = diff / (1000 * 60 * 60);
  
  if (hoursLeft <= 0) return 'expired';
  if (hoursLeft <= 2) return 'warning';
  return 'fresh';
};

export const calculateEnvironmentalImpact = (foodItems: FoodItem[]): AnalyticsData => {
  const collectedItems = foodItems.filter(item => item.status === 'Collected');
  const totalWeight = collectedItems.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    foodSaved: totalWeight,
    carbonFootprintReduced: totalWeight * 2.5,
    waterFootprintReduced: totalWeight * 1000,
    peopleServed: Math.floor(totalWeight / 0.5),
    wasteReduced: totalWeight,
    totalUsers: 0,
    activeNGOs: 0,
    monthlyGrowth: 15.2
  };
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const calculateUserLevel = (points: number): number => {
  return Math.floor(points / 100) + 1;
};

export const getNextLevelPoints = (currentPoints: number): number => {
  const currentLevel = calculateUserLevel(currentPoints);
  return currentLevel * 100;
};

export const generateQRCode = (foodId: string): string => {
  return `https://foodshare.campus/food/${foodId}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

export const getBadgeForAction = (action: string, count: number): Badge | null => {
  const badges = {
    'food_listed': [
      { threshold: 1, name: 'First Share', description: 'Listed your first food item', icon: '🌱', color: 'green' },
      { threshold: 10, name: 'Food Hero', description: 'Listed 10 food items', icon: '🦸', color: 'blue' },
      { threshold: 50, name: 'Waste Warrior', description: 'Listed 50 food items', icon: '⚔️', color: 'purple' },
    ],
    'food_collected': [
      { threshold: 1, name: 'First Rescue', description: 'Collected your first food item', icon: '🎯', color: 'orange' },
      { threshold: 25, name: 'Food Saver', description: 'Collected 25 food items', icon: '💚', color: 'green' },
      { threshold: 100, name: 'Community Champion', description: 'Collected 100 food items', icon: '👑', color: 'gold' },
    ]
  };

  const actionBadges = badges[action as keyof typeof badges];
  if (!actionBadges) return null;

  const earnedBadge = actionBadges
    .filter(badge => count >= badge.threshold)
    .pop();

  if (earnedBadge) {
    return {
      id: generateId(),
      name: earnedBadge.name,
      description: earnedBadge.description,
      icon: earnedBadge.icon,
      color: earnedBadge.color,
      earnedAt: new Date()
    };
  }

  return null;
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};