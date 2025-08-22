import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import FoodCard from './FoodCard';
import RealTimeAnalytics from './RealTimeAnalytics';
import QRScanner from './QRScanner';
import QRCodeDisplay from './QRCodeDisplay';
import { useRoleAccess } from '../hooks/useRoleAccess';
import { FoodItem } from '../types';

interface SidebarLayoutProps {
  onCreateListing: () => void;
  foodItems?: FoodItem[];
  onReserveFood?: (id: string) => void;
  onCollectFood?: (id: string) => void;
  onShowQR?: (food: FoodItem) => void;
  onRateFood?: (id: string, rating: number) => void;
  onEditListing?: (id: string) => void;
  onDeleteListing?: (id: string) => void;
  onViewRequests?: (id: string) => void;
  children?: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  onCreateListing,
  foodItems = [],
  onReserveFood,
  onCollectFood,
  onShowQR,
  onRateFood,
  onEditListing,
  onDeleteListing,
  onViewRequests,
  children
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showQRCode, setShowQRCode] = useState<FoodItem | null>(null);
  const { userRole, hasPermission } = useRoleAccess();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderContent = () => {
    console.log('SidebarLayout - Rendering content for:', { activeTab, userRole, currentUser: currentUser?.name });

    // Force dashboard if no active tab
    const currentTab = activeTab || 'dashboard';

    switch (currentTab) {
      case 'dashboard':
        console.log('Rendering dashboard for role:', userRole);
        // Main dashboard with real-time analytics and food grid
        return (
          <div className="p-8">
            {/* Real-time Analytics */}
            <RealTimeAnalytics />

            {/* Food Grid Section */}
            <div className="mt-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">🍎 Available Food</h2>
                    <p className="text-gray-600">Fresh food items available for pickup</p>
                  </div>
                  {userRole === 'FoodProvider' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onCreateListing}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      + Add New Listing
                    </motion.button>
                  )}
                </div>

                {/* Food Items Grid */}
                {foodItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {foodItems.map(food => {
                      const isOwnListing = food.providerId === currentUser?.id?.toString() || food.provider === currentUser?.name;
                      return (
                        <FoodCard
                          key={food.id}
                          food={food}
                          onReserve={onReserveFood}
                          onCollect={onCollectFood}
                          onShowQR={handleShowQR}
                          onRate={onRateFood}
                          userRole={userRole}
                          isOwnListing={isOwnListing}
                          onEdit={onEditListing}
                          onDelete={onDeleteListing}
                          onViewRequests={onViewRequests}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No food items available</h3>
                    <p className="text-gray-500 mb-6">Be the first to share food with your community!</p>
                    {userRole === 'FoodProvider' && (
                      <button
                        onClick={onCreateListing}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200"
                      >
                        Add First Listing
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'browse':
        const availableFoodItems = foodItems.filter(food => food.status === 'Available');

        return (
          <div className="p-8 space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold mb-2">🔍 Browse Available Food</h1>
                  <p className="text-blue-100 text-lg">
                    {userRole === 'FoodProvider'
                      ? 'View all food listings in the system'
                      : 'Find fresh food near you and help reduce waste'
                    }
                  </p>
                  <div className="flex items-center space-x-6 mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{availableFoodItems.length}</p>
                      <p className="text-blue-200 text-sm">Available Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{availableFoodItems.reduce((sum, food) => sum + food.quantity, 0)}</p>
                      <p className="text-blue-200 text-sm">Total Servings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{new Set(availableFoodItems.map(f => f.provider)).size}</p>
                      <p className="text-blue-200 text-sm">Providers</p>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-6xl">🍎</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search food items, providers, or locations..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>All Types</option>
                    <option>Cooked Food</option>
                    <option>Raw Ingredients</option>
                    <option>Packaged</option>
                    <option>Bakery</option>
                    <option>Beverages</option>
                  </select>
                  <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>All Locations</option>
                    <option>Near Me</option>
                    <option>Within 5km</option>
                    <option>Within 10km</option>
                  </select>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Filter
                  </button>
                </div>
              </div>
            </div>

            {/* Food Grid */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {availableFoodItems.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Available Food Items</h2>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">Grid View</button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">List View</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableFoodItems.map(food => {
                      const isOwnListing = food.providerId === currentUser?.id?.toString() || food.provider === currentUser?.name;
                      return (
                        <motion.div
                          key={food.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
                        >
                          {/* Food Image */}
                          <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
                            {food.imageUrl ? (
                              <img src={food.imageUrl} alt={food.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-6xl">🍽️</span>
                              </div>
                            )}
                            <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              Available
                            </div>
                            <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium">
                              {food.quantity} servings
                            </div>
                          </div>

                          {/* Food Details */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{food.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{food.description}</p>

                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Provider:</span>
                                <span className="font-medium">{food.provider}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Location:</span>
                                <span className="font-medium">{food.location}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Type:</span>
                                <span className="font-medium">{food.type}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Expires:</span>
                                <span className="font-medium text-red-600">
                                  {new Date(food.expiresAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            {!isOwnListing && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => onReserveFood?.(food.id)}
                                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                  Reserve Now
                                </button>
                                <button className="bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                                  View Details
                                </button>
                              </div>
                            )}
                            {isOwnListing && (
                              <div className="bg-gray-100 text-gray-600 py-2 px-3 rounded-lg text-sm text-center">
                                Your Listing
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6">🍽️</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">No food available right now</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    {userRole === 'FoodProvider' && 'Create your first listing to get started!'}
                    {userRole === 'NGO/Volunteer' && 'Check back later for new food donations from providers.'}
                    {userRole === 'Individual' && 'Check back later for available food or contact local providers.'}
                  </p>
                  {userRole === 'FoodProvider' && (
                    <button
                      onClick={onCreateListing}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Create First Listing
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'my-listings':
        if (!hasPermission('canCreateFood')) {
          return (
            <div className="p-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
                <p className="text-red-600">
                  Only Food Providers can create and manage food listings.
                </p>
              </div>
            </div>
          );
        }

        const userListings = foodItems.filter(food =>
          food.providerId === currentUser?.id?.toString() || food.provider === currentUser?.name
        );

        return (
          <div className="p-8 space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold mb-2">🍎 My Food Listings</h1>
                  <p className="text-green-100 text-lg">Manage your food donations and help reduce waste</p>
                  <div className="flex items-center space-x-6 mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{userListings.length}</p>
                      <p className="text-green-200 text-sm">Total Listings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{userListings.filter(f => f.status === 'Available').length}</p>
                      <p className="text-green-200 text-sm">Available</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{userListings.filter(f => f.status === 'Reserved').length}</p>
                      <p className="text-green-200 text-sm">Reserved</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{userListings.filter(f => f.status === 'Collected').length}</p>
                      <p className="text-green-200 text-sm">Collected</p>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCreateListing}
                  className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3"
                >
                  <span className="text-2xl">+</span>
                  <span>Add New Listing</span>
                </motion.button>
              </div>
            </div>

            {/* Listings Grid */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {userListings.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Your Food Listings</h2>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">All</button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">Available</button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">Reserved</button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">Collected</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userListings.map(food => (
                      <motion.div
                        key={food.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
                      >
                        {/* Food Image */}
                        <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200">
                          {food.imageUrl ? (
                            <img src={food.imageUrl} alt={food.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-6xl">🍽️</span>
                            </div>
                          )}
                          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                            food.status === 'Available' ? 'bg-green-500 text-white' :
                            food.status === 'Reserved' ? 'bg-yellow-500 text-white' :
                            food.status === 'Collected' ? 'bg-blue-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {food.status}
                          </div>
                        </div>

                        {/* Food Details */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{food.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{food.description}</p>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Quantity:</span>
                              <span className="font-medium">{food.quantity} servings</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Type:</span>
                              <span className="font-medium">{food.type}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Expires:</span>
                              <span className="font-medium text-red-600">
                                {new Date(food.expiresAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => onViewRequests?.(food.id)}
                              className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                            >
                              View Requests
                            </button>
                            <button
                              onClick={() => onEditListing?.(food.id)}
                              className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDeleteListing?.(food.id)}
                              className="bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6">🍽️</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">No food listings yet</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Start making a difference by sharing your excess food with those in need.
                    Create your first listing and help reduce food waste!
                  </p>
                  <button
                    onClick={onCreateListing}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Create Your First Listing
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'my-requests':
        if (!hasPermission('canRequestFood')) {
          return (
            <div className="p-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
                <p className="text-red-600">
                  Food Providers cannot request food. You can only provide food.
                </p>
              </div>
            </div>
          );
        }
        return (
          <div className="p-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                 {userRole === 'NGO/Volunteer' ? 'Food Requests' : 'My Requests'}
              </h2>
              <p className="text-gray-600 mb-8">
                {userRole === 'NGO/Volunteer' 
                  ? 'Manage food requests for distribution to beneficiaries'
                  : 'Track your food requests and pickup status'
                }
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-green-800">
                  {userRole === 'NGO/Volunteer' 
                    ? 'Your food requests for distribution will be displayed here.'
                    : 'Your personal food requests will be displayed here.'
                  }
                </p>
              </div>
            </div>
          </div>
        );

      case 'distribution':
        if (!hasPermission('canDistributeFood')) {
          return (
            <div className="p-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
                <p className="text-red-600">
                  Only NGOs/Volunteers can manage food distribution.
                </p>
              </div>
            </div>
          );
        }
        return (
          <div className="p-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">🚚 Food Distribution</h2>
              <p className="text-gray-600 mb-8">
                Manage food distribution to beneficiaries and track delivery status
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <p className="text-purple-800">
                  Distribution management tools will be implemented here.
                </p>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        if (!hasPermission('canViewAnalytics')) {
          return (
            <div className="p-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
                <p className="text-red-600">
                  You don't have permission to view analytics.
                </p>
              </div>
            </div>
          );
        }

        const analyticsListings = foodItems.filter(food =>
          food.providerId === currentUser?.id?.toString() || food.provider === currentUser?.name
        );

        const totalListings = analyticsListings.length;
        const availableListings = analyticsListings.filter(f => f.status === 'Available').length;
        const reservedListings = analyticsListings.filter(f => f.status === 'Reserved').length;
        const collectedListings = analyticsListings.filter(f => f.status === 'Collected').length;
        const totalQuantity = analyticsListings.reduce((sum, food) => sum + food.quantity, 0);
        const collectedQuantity = analyticsListings.filter(f => f.status === 'Collected').reduce((sum, food) => sum + food.quantity, 0);

        return (
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl p-8">
              <h1 className="text-4xl font-bold mb-2">📊 Analytics Dashboard</h1>
              <p className="text-purple-100 text-lg">Track your impact and food donation performance</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Total Listings</p>
                    <p className="text-3xl font-bold text-gray-800">{totalListings}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <span className="text-2xl">📦</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2">All time food listings</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Food Collected</p>
                    <p className="text-3xl font-bold text-gray-800">{collectedListings}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2">Successfully distributed</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">Servings Saved</p>
                    <p className="text-3xl font-bold text-gray-800">{collectedQuantity}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <span className="text-2xl">🍽️</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2">Total servings distributed</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">Success Rate</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {totalListings > 0 ? Math.round((collectedListings / totalListings) * 100) : 0}%
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <span className="text-2xl">📈</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2">Collection success rate</p>
              </div>
            </div>

            {/* Impact Summary */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">🌍 Your Environmental Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{(collectedQuantity * 0.5).toFixed(1)} kg</p>
                  <p className="text-gray-600">Food waste prevented</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{(collectedQuantity * 2.5).toFixed(1)} kg</p>
                  <p className="text-gray-600">CO₂ emissions saved</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{collectedQuantity}</p>
                  <p className="text-gray-600">People helped</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        if (!hasPermission('canManageUsers')) {
          return (
            <div className="p-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
                <p className="text-red-600">
                  Only Administrators can manage users.
                </p>
              </div>
            </div>
          );
        }
        return (
          <div className="p-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">👥 User Management</h2>
              <p className="text-gray-600 mb-8">
                Manage system users, roles, and permissions
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800">
                  User management interface will be implemented here.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return children || (
          <div className="p-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to FoodShare! 🍎</h2>
              <p className="text-gray-600 mb-6">Your role: {userRole}</p>
              <p className="text-gray-600 mb-6">Active tab: {currentTab}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setActiveTab('browse')}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200"
                >
                  <h3 className="text-xl font-semibold mb-2">Browse Food</h3>
                  <p>Find available food items</p>
                </button>
                <button
                  onClick={onCreateListing}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  <h3 className="text-xl font-semibold mb-2">Add Food</h3>
                  <p>List food for donation</p>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  const handleShowQR = (food: FoodItem) => {
    setShowQRCode(food);
  };

  const handleScanSuccess = (data: any) => {
    console.log('Scanned food data:', data);
    // You can add logic here to handle the scanned food data
    // For example, show food details, add to cart, etc.
    setShowScanner(false);
  };

  const handleScanError = (error: string) => {
    console.error('Scan error:', error);
    // You can show a toast notification here
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <motion.main
        initial={{ marginLeft: isCollapsed ? 80 : 280 }}
        animate={{ marginLeft: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 overflow-y-auto flex flex-col"
      >
        {/* Top Header Bar for Provider Actions */}
        {userRole === 'FoodProvider' && (
          <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Provider Dashboard</h2>
                <p className="text-sm text-gray-600">Manage your food listings and help reduce waste</p>
              </div>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCreateListing}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                >
                  <span className="text-lg">+</span>
                  <span>Add New Listing</span>
                </motion.button>
                <button
                  onClick={() => setActiveTab('my-listings')}
                  className="bg-blue-100 text-blue-700 px-4 py-3 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                >
                  My Listings
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="bg-purple-100 text-purple-700 px-4 py-3 rounded-lg font-medium hover:bg-purple-200 transition-colors"
                >
                  Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </motion.main>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onClose={() => setShowScanner(false)}
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
        />
      )}

      {/* QR Code Display Modal */}
      {showQRCode && (
        <QRCodeDisplay
          food={showQRCode}
          onClose={() => setShowQRCode(null)}
        />
      )}
    </div>
  );
};

export default SidebarLayout;
