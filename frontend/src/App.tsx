import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import './styles/animations.css';
import Navigation from './components/Navigation';
import FoodCard from './components/FoodCard';
import FoodListingForm from './components/FoodListingForm';
import Notifications from './components/Notifications';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import QRCodeGenerator from './components/QRCodeGenerator';
// Using Firebase AuthModal instead of ApiAuthModal
import SidebarLayout from './components/SidebarLayout';
import SuccessNotification from './components/SuccessNotification';
import EditListingModal from './components/EditListingModal';
import RequestsModal from './components/RequestsModal';
// Using Firebase authentication instead of API auth
import { AnalyticsProvider } from './contexts/AnalyticsContext';


import { FoodItem, Notification } from './types';
import { calculateEnvironmentalImpact, generateId, getFreshnessStatus } from './utils/helpers';
import { User } from './types';
import toast from 'react-hot-toast';
import { Plus, Search, Filter } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });
  // Using Firebase authentication instead of API auth
  const [currentView, setCurrentView] = useState('home');
  // Removed API auth modal, using Firebase auth modal instead
  const [showListingForm, setShowListingForm] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showQRCode, setShowQRCode] = useState<FoodItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState<FoodItem | null>(null);
  const [showRequestsModal, setShowRequestsModal] = useState<FoodItem | null>(null);

  // Sample data
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    {
      id: '1',
      title: 'Fresh Vegetable Curry',
      type: 'Cooked Food',
      quantity: 5,
      unit: 'kg',
      provider: 'Central Canteen',
      providerId: 'canteen-1',
      location: 'Ground Floor, Main Building',
      safetyHours: 4,
      listedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      description: 'Fresh mixed vegetable curry with rice, enough for 10-12 people',
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'Available',
      tags: ['vegetarian', 'spicy', 'fresh'],
      allergens: ['gluten'],
      rating: 4.5,
      reviews: []
    },
    {
      id: '2',
      title: 'Sandwich Platter',
      type: 'Packaged',
      quantity: 20,
      unit: 'pieces',
      provider: 'Tech Fest Committee',
      providerId: 'event-1',
      location: 'Student Center, Room 101',
      safetyHours: 6,
      listedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000),
      description: 'Assorted sandwiches from event lunch, individually wrapped',
      imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'Available',
      tags: ['packaged', 'variety'],
      allergens: ['dairy', 'gluten'],
      rating: 4.2,
      reviews: []
    },
    {
      id: '3',
      title: 'Fresh Fruits',
      type: 'Raw Ingredients',
      quantity: 3,
      unit: 'kg',
      provider: 'Hostel B Cafeteria',
      providerId: 'hostel-1',
      location: 'Hostel B, Ground Floor',
      safetyHours: 24,
      listedAt: new Date(Date.now() - 30 * 60 * 1000),
      expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000),
      description: 'Mixed fresh fruits - apples, bananas, oranges',
      imageUrl: 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'Reserved',
      tags: ['fresh', 'healthy', 'raw'],
      allergens: [],
      rating: 4.8,
      reviews: []
    }
  ]);



  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Food Available',
      message: 'Fresh Vegetable Curry available at Central Canteen for the next 2 hours',
      type: 'food_available',
      foodId: '1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      priority: 'medium'
    },
    {
      id: '2',
      title: 'Pickup Reminder',
      message: 'Your reserved Fresh Fruits expires in 1 hour. Please collect soon.',
      type: 'pickup_reminder',
      foodId: '3',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      priority: 'high'
    }
  ]);



  // Auto-update food status and notifications - DISABLED to prevent refresh
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setFoodItems(prevItems => {
  //       const updatedItems = prevItems.map(item => {
  //         const freshness = getFreshnessStatus(item.expiresAt);
  //         if (freshness === 'expired' && item.status !== 'Expired') {
  //           // Create expiry notification
  //           const expiryNotification: Notification = {
  //             id: generateId(),
  //             title: 'Food Expired',
  //             message: `${item.title} has expired and been removed from listings`,
  //             type: 'expiry_warning',
  //             foodId: item.id,
  //             timestamp: new Date(),
  //             read: false,
  //             priority: 'medium'
  //           };
  //           setNotifications(prev => [expiryNotification, ...prev]);

  //           return { ...item, status: 'Expired' as const };
  //         }
  //         return item;
  //       });
  //       return updatedItems;
  //     });
  //   }, 60000); // Check every minute

  //   return () => clearInterval(interval);
  // }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setShowUserProfile(false);
    setCurrentView('home');
    toast.success('Logged out successfully');
  };

  const handleAddFood = (newFood: FoodItem) => {
    setFoodItems(prev => [newFood, ...prev]);

    // Create notification for new food
    const notification: Notification = {
      id: generateId(),
      title: 'New Food Listed',
      message: `${newFood.title} is now available for pickup at ${newFood.location}`,
      type: 'food_available',
      foodId: newFood.id,
      timestamp: new Date(),
      read: false,
      priority: 'medium'
    };
    setNotifications(prev => [notification, ...prev]);

    // Show success notification
    setSuccessMessage(`🎉 "${newFood.title}" has been successfully listed! Your food is now available for others to request.`);
    setShowSuccessNotification(true);
  };

  const handleReserveFood = (id: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setFoodItems(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'Reserved', reservedBy: currentUser.id } : item
    ));
    toast.success('Food item reserved successfully!');
  };

  const handleCollectFood = (id: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setFoodItems(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'Collected', collectedBy: currentUser.id } : item
    ));

    // Update user stats
    if (currentUser) {
      setCurrentUser(prev => prev ? {
        ...prev,
        stats: {
          ...prev.stats,
          foodCollected: prev.stats.foodCollected + 1
        },
        points: prev.points + 10
      } : null);
    }
    toast.success('Food item collected successfully!');
  };

  const handleRateFood = (id: string, rating: number) => {
    setFoodItems(prev => prev.map(item =>
      item.id === id ? { ...item, rating } : item
    ));
    toast.success('Thank you for your rating!');
  };

  const handleEditListing = (id: string) => {
    const listing = foodItems.find(item => item.id === id);
    if (listing) {
      setShowEditModal(listing);
    }
  };

  const handleDeleteListing = (id: string) => {
    const listing = foodItems.find(item => item.id === id);
    if (listing && window.confirm(`Are you sure you want to delete "${listing.title}"?`)) {
      setFoodItems(prev => prev.filter(item => item.id !== id));
      toast.success('Listing deleted successfully!');
    }
  };

  const handleViewRequests = (id: string) => {
    const listing = foodItems.find(item => item.id === id);
    if (listing) {
      setShowRequestsModal(listing);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleUpdateListing = (updatedListing: FoodItem) => {
    setFoodItems(prev => prev.map(item =>
      item.id === updatedListing.id ? updatedListing : item
    ));
    toast.success('Listing updated successfully!');
  };



  const filteredFoodItems = foodItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' ||
      (selectedFilter === 'available' && item.status === 'Available') ||
      (selectedFilter === 'fresh' && getFreshnessStatus(item.expiresAt) === 'fresh');
    return matchesSearch && matchesFilter;
  });

  const analytics = calculateEnvironmentalImpact(foodItems);
  const unreadCount = notifications.filter(n => !n.read).length;

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">


            {/* Hero Section */}
            <div className="text-center mb-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl -z-10"></div>
              <div className="py-16 px-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Smart Food Redistribution 🌱
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Connecting surplus food with those who need it. Reducing waste, building community,
                  and creating a sustainable campus ecosystem.
                </p>
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowListingForm(true)}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center shadow-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    List Surplus Food
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-all duration-200"
              >
                <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{analytics.foodSaved.toFixed(0)}kg</p>
                <p className="text-sm text-gray-600">Food Saved</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-all duration-200"
              >
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{analytics.peopleServed}</p>
                <p className="text-sm text-gray-600">People Served</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-all duration-200"
              >
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{foodItems.length}</p>
                <p className="text-sm text-gray-600">Total Listings</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-all duration-200"
              >
                <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">{foodItems.filter(f => f.status === 'Available').length}</p>
                <p className="text-sm text-gray-600">Available Now</p>
              </motion.div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search food or provider..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                >
                  <option value="all">All Items</option>
                  <option value="available">Available Only</option>
                  <option value="fresh">Fresh Only</option>
                </select>
              </div>
            </div>

            {/* Food Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoodItems.map(food => {
                const isOwnListing = food.providerId === currentUser?.id?.toString() || food.provider === currentUser?.name;
                return (
                  <FoodCard
                    key={food.id}
                    food={food}
                    onReserve={handleReserveFood}
                    onCollect={handleCollectFood}
                    onShowQR={setShowQRCode}
                    onRate={handleRateFood}
                    userRole={currentUser?.role}
                    isOwnListing={isOwnListing}
                    onEdit={handleEditListing}
                    onDelete={handleDeleteListing}
                    onViewRequests={handleViewRequests}
                  />
                );
              })}
            </div>

            {filteredFoodItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No food items match your criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedFilter('all');
                  }}
                  className="mt-4 text-green-600 hover:text-green-700 underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        );

      case 'list-food':
        setShowListingForm(true);
        setCurrentView('home');
        return null;

      case 'notifications':
        return (
          <Notifications
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDismiss={handleDismissNotification}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Main Content */}
      {currentUser ? (
        <AnalyticsProvider foodItems={filteredFoodItems}>
          <SidebarLayout
            onCreateListing={() => setShowListingForm(true)}
            foodItems={filteredFoodItems}
            onReserveFood={handleReserveFood}
            onCollectFood={handleCollectFood}
            onShowQR={setShowQRCode}
            onRateFood={handleRateFood}
            onEditListing={handleEditListing}
            onDeleteListing={handleDeleteListing}
            onViewRequests={handleViewRequests}
          />
        </AnalyticsProvider>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
          <Navigation
            currentView={currentView}
            onViewChange={setCurrentView}
            notificationCount={unreadCount}
            user={currentUser}
            onShowAuth={() => setShowAuthModal(true)}
            onShowProfile={() => setShowUserProfile(true)}
          />
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 float-animation"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 float-animation" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 float-animation" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 float-animation" style={{ animationDelay: '0.5s' }}></div>

          {/* Hero Section */}
          <div className="relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
            <div className="absolute inset-0 opacity-40">
              <div className="w-full h-full bg-gradient-to-br from-transparent via-blue-50/30 to-purple-50/30"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center">
                {/* Main Heading */}
                <div className="mb-8 fade-in-up">
                  <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 float-animation">
                    Food Waste
                  </h1>
                  <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Management System
                  </h2>
                </div>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto leading-relaxed">
                  🌍 Connecting surplus food with those in need
                </p>
                <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                  Join our mission to reduce food waste and fight hunger in your community
                </p>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Food Providers</h3>
                    <p className="text-gray-600">Share surplus food from restaurants, stores, and events</p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">NGOs & Volunteers</h3>
                    <p className="text-gray-600">Collect and distribute food to communities in need</p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👥</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Individuals</h3>
                    <p className="text-gray-600">Access fresh, quality food while reducing waste</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="space-y-4 fade-in-up">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="glow-button bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 pulse-animation"
                  >
                    🚀 Get Started - Login / Register
                  </button>
                  <p className="text-sm text-gray-500">
                    Join thousands making a difference in food waste reduction
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white/50 backdrop-blur-sm py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                  Our Impact So Far 📊
                </h3>
                <p className="text-gray-600">Making a real difference in communities worldwide</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    10K+
                  </div>
                  <div className="text-gray-600 font-medium">Meals Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    500+
                  </div>
                  <div className="text-gray-600 font-medium">Food Providers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    50+
                  </div>
                  <div className="text-gray-600 font-medium">NGO Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                    5K+
                  </div>
                  <div className="text-gray-600 font-medium">People Helped</div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent mb-4">
                  How It Works ⚡
                </h3>
                <p className="text-xl text-gray-600">Simple steps to make a big impact</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-3xl">📝</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">1. List Food</h4>
                  <p className="text-gray-600 text-lg">Food providers upload surplus food with photos and details</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">2. Browse & Request</h4>
                  <p className="text-gray-600 text-lg">NGOs and individuals find and request available food</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-3xl">🚚</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">3. Collect & Share</h4>
                  <p className="text-gray-600 text-lg">Food is collected and distributed to those who need it most</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Content Based on Current View */}
          {renderContent()}
        </div>
      )}

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        )}

        {showUserProfile && currentUser && (
          <UserProfile
            user={currentUser}
            onLogout={handleLogout}
            onClose={() => setShowUserProfile(false)}
          />
        )}

        {showQRCode && (
          <QRCodeGenerator
            food={showQRCode}
            onClose={() => setShowQRCode(null)}
          />
        )}
      </AnimatePresence>

      {showListingForm && (
        <FoodListingForm
          onAddFood={handleAddFood}
          onClose={() => setShowListingForm(false)}
        />
      )}

      {showEditModal && (
        <EditListingModal
          listing={showEditModal}
          onSave={handleUpdateListing}
          onClose={() => setShowEditModal(null)}
        />
      )}

      {showRequestsModal && (
        <RequestsModal
          listing={showRequestsModal}
          onClose={() => setShowRequestsModal(null)}
        />
      )}



      {/* Firebase Auth Modal is already included above */}

      {/* Success Notification */}
      <SuccessNotification
        show={showSuccessNotification}
        message={successMessage}
        onClose={() => setShowSuccessNotification(false)}
      />

      <Toaster position="top-right" />
    </div>
  );
}

export default App;