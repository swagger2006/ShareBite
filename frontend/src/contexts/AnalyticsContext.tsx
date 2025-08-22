import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FoodItem } from '../types';
import { User } from '../types';

interface AnalyticsData {
  // Food Provider Analytics
  totalListings: number;
  activeListings: number;
  completedListings: number;
  expiredListings: number;
  pendingRequests: number;
  totalKgDonated: number;
  peopleHelped: number;
  averageRating: number;
  
  // NGO/Volunteer Analytics
  totalRequests: number;
  approvedRequests: number;
  collectedItems: number;
  totalKgReceived: number;
  
  // Individual Analytics
  itemsCollected: number;
  kgCollected: number;
  
  // General Analytics
  totalUsers: number;
  totalFoodItems: number;
  totalKgSaved: number;
  wasteReduced: number;
  
  // Real-time metrics
  todayListings: number;
  todayCollections: number;
  activeUsers: number;
  
  // Trends (last 7 days)
  weeklyTrends: {
    date: string;
    listings: number;
    collections: number;
    users: number;
  }[];
  
  // Category breakdown
  categoryStats: {
    category: string;
    count: number;
    percentage: number;
  }[];
  
  // Location stats
  locationStats: {
    location: string;
    count: number;
  }[];
}

interface AnalyticsContextType {
  analytics: AnalyticsData;
  isLoading: boolean;
  lastUpdated: Date;
  refreshAnalytics: () => void;
  updateAnalytics: (foodItems: FoodItem[]) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
  foodItems: FoodItem[];
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children, foodItems }) => {
  const currentUser: User | null = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalListings: 0,
    activeListings: 0,
    completedListings: 0,
    expiredListings: 0,
    pendingRequests: 0,
    totalKgDonated: 0,
    peopleHelped: 0,
    averageRating: 0,
    totalRequests: 0,
    approvedRequests: 0,
    collectedItems: 0,
    totalKgReceived: 0,
    itemsCollected: 0,
    kgCollected: 0,
    totalUsers: 0,
    totalFoodItems: 0,
    totalKgSaved: 0,
    wasteReduced: 0,
    todayListings: 0,
    todayCollections: 0,
    activeUsers: 0,
    weeklyTrends: [],
    categoryStats: [],
    locationStats: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const calculateAnalytics = (items: FoodItem[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // User-specific filtering
    const userItems = currentUser?.role === 'FoodProvider'
      ? items.filter(item => item.providerId === currentUser?.id?.toString() || item.provider === currentUser?.name)
      : items;
    
    // Basic counts
    const totalListings = userItems.length;
    const activeListings = userItems.filter(item => item.status === 'Available').length;
    const completedListings = userItems.filter(item => item.status === 'Collected').length;
    const expiredListings = userItems.filter(item => item.status === 'Expired').length;
    
    // Today's metrics
    const todayListings = userItems.filter(item => {
      const itemDate = new Date(item.createdAt || now);
      return itemDate >= today;
    }).length;
    
    const todayCollections = userItems.filter(item => {
      const itemDate = new Date(item.collectedAt || now);
      return item.status === 'Collected' && itemDate >= today;
    }).length;
    
    // Weight calculations
    const totalKgDonated = userItems.reduce((sum, item) => {
      if (item.unit === 'kg') return sum + item.quantity;
      if (item.unit === 'pieces') return sum + (item.quantity * 0.2); // Estimate 200g per piece
      if (item.unit === 'servings') return sum + (item.quantity * 0.3); // Estimate 300g per serving
      return sum + item.quantity;
    }, 0);
    
    // Category breakdown
    const categoryCount: { [key: string]: number } = {};
    userItems.forEach(item => {
      categoryCount[item.type] = (categoryCount[item.type] || 0) + 1;
    });
    
    const categoryStats = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / totalListings) * 100) || 0
    }));
    
    // Location breakdown
    const locationCount: { [key: string]: number } = {};
    userItems.forEach(item => {
      locationCount[item.location] = (locationCount[item.location] || 0) + 1;
    });
    
    const locationStats = Object.entries(locationCount).map(([location, count]) => ({
      location,
      count
    })).slice(0, 5); // Top 5 locations
    
    // Weekly trends (mock data for now)
    const weeklyTrends = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        listings: Math.floor(Math.random() * 10) + 1,
        collections: Math.floor(Math.random() * 8) + 1,
        users: Math.floor(Math.random() * 20) + 10
      };
    });
    
    // Average rating
    const ratedItems = userItems.filter(item => item.rating);
    const averageRating = ratedItems.length > 0 
      ? ratedItems.reduce((sum, item) => sum + (item.rating || 0), 0) / ratedItems.length 
      : 0;
    
    return {
      totalListings,
      activeListings,
      completedListings,
      expiredListings,
      pendingRequests: Math.floor(Math.random() * 5) + 1, // Mock data
      totalKgDonated: Math.round(totalKgDonated * 10) / 10,
      peopleHelped: completedListings * 3, // Estimate 3 people per completed listing
      averageRating: Math.round(averageRating * 10) / 10,
      totalRequests: Math.floor(Math.random() * 20) + 5, // Mock data
      approvedRequests: Math.floor(Math.random() * 15) + 3, // Mock data
      collectedItems: completedListings,
      totalKgReceived: Math.round(totalKgDonated * 0.8 * 10) / 10, // 80% of donated
      itemsCollected: completedListings,
      kgCollected: Math.round(totalKgDonated * 0.8 * 10) / 10,
      totalUsers: 150 + Math.floor(Math.random() * 50), // Mock data
      totalFoodItems: items.length,
      totalKgSaved: Math.round(totalKgDonated * 10) / 10,
      wasteReduced: Math.round(totalKgDonated * 2.5 * 10) / 10, // CO2 equivalent
      todayListings,
      todayCollections,
      activeUsers: 25 + Math.floor(Math.random() * 15), // Mock data
      weeklyTrends,
      categoryStats,
      locationStats
    };
  };

  const updateAnalytics = (items: FoodItem[]) => {
    setIsLoading(true);
    const newAnalytics = calculateAnalytics(items);
    setAnalytics(newAnalytics);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const refreshAnalytics = () => {
    updateAnalytics(foodItems);
  };

  // Auto-refresh disabled to prevent dashboard refresh
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     updateAnalytics(foodItems);
  //   }, 30000);

  //   return () => clearInterval(interval);
  // }, [foodItems]);

  // Update analytics when foodItems change
  useEffect(() => {
    updateAnalytics(foodItems);
  }, [foodItems.length]); // Only update when number of items changes

  const value = {
    analytics,
    isLoading,
    lastUpdated,
    refreshAnalytics,
    updateAnalytics
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
