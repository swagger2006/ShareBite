import React, { useState } from 'react';
import { User } from './types';
import AuthModal from './components/AuthModal';
import SidebarLayout from './components/SidebarLayout';
import { Toaster } from 'react-hot-toast';
import { AnalyticsProvider } from './contexts/AnalyticsContext';

function SimpleApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showListingForm, setShowListingForm] = useState(false);

  // Sample food items
  const [foodItems] = useState([
    {
      id: '1',
      title: 'Fresh Vegetables',
      description: 'Mixed vegetables from restaurant',
      quantity: 10,
      type: 'Fresh Produce',
      location: 'Downtown Restaurant',
      provider: 'Green Cafe',
      providerId: '1',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      listedAt: new Date(),
      status: 'Available' as const,
      imageUrl: '',
      allergens: [],
      tags: ['Vegetarian'],
      pickupInstructions: 'Call before pickup'
    }
  ]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {currentUser ? (
        <AnalyticsProvider foodItems={foodItems}>
          <SidebarLayout
            onCreateListing={() => setShowListingForm(true)}
            foodItems={foodItems}
            onReserveFood={() => {}}
            onCollectFood={() => {}}
            onShowQR={() => {}}
            onRateFood={() => {}}
            onEditListing={() => {}}
            onDeleteListing={() => {}}
            onViewRequests={() => {}}
          />
        </AnalyticsProvider>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">🍎 FoodShare</h1>
              <p className="text-gray-600">Reduce food waste, help your community</p>
            </div>
            
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              Join thousands of people reducing food waste
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default SimpleApp;
