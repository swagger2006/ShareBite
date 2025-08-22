import React, { useState, useEffect } from 'react';
import { Plus, Package, Clock, CheckCircle, AlertCircle, RefreshCw, TrendingUp, Users } from 'lucide-react';
import { useAnalytics } from '../../contexts/AnalyticsContext';

interface FoodProviderDashboardProps {
  onCreateListing: () => void;
}

const FoodProviderDashboard: React.FC<FoodProviderDashboardProps> = ({
  onCreateListing
}) => {
  const { analytics, isLoading, lastUpdated, refreshAnalytics } = useAnalytics();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleManualRefresh = () => {
    refreshAnalytics();
    setRefreshKey(prev => prev + 1);
  };

  const recentListings = [
    {
      id: 1,
      title: "Fresh Vegetables",
      quantity: 5,
      status: "Available",
      requests: 2,
      expiresIn: "2 hours"
    },
    {
      id: 2,
      title: "Cooked Rice",
      quantity: 10,
      status: "Requested",
      requests: 1,
      expiresIn: "4 hours"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white p-8 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3">Welcome, Food Provider! 🍽️</h1>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl">
              Help reduce food waste by sharing your surplus food with those in need.
              Every listing makes a difference in someone's life.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleManualRefresh}
                className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-xl font-medium hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2"
                title="Refresh Dashboard"
              >
                <RefreshCw size={20} />
                <span>Refresh</span>
              </button>
              <button
                onClick={onCreateListing}
                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Plus size={22} />
                <span>Create New Listing</span>
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Package size={64} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated Info */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Live Data</span>
            <span className="text-sm text-gray-500">• Updates every 30s</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Today's Metrics */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">📅 Today's Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600">{analytics.todayListings}</div>
            <div className="text-sm text-blue-800">New Listings</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <div className="text-2xl font-bold text-green-600">{analytics.todayCollections}</div>
            <div className="text-sm text-green-800">Collections</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <div className="text-2xl font-bold text-purple-600">{analytics.activeUsers}</div>
            <div className="text-sm text-purple-800">Active Users</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Listings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalListings}</p>
              <p className="text-sm text-gray-600 mt-1">All time</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active Listings</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{analytics.activeListings}</p>
              <p className="text-sm text-gray-600 mt-1">Currently available</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pending Requests</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{analytics.pendingRequests}</p>
              <p className="text-sm text-gray-600 mt-1">Awaiting response</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 shadow-lg">
        <div className="flex items-center mb-6">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-800">Your Impact 🌟</h3>
            <p className="text-green-700">Making a difference in the community</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl font-bold text-green-600 mb-2">{analytics.totalKgDonated} kg</div>
            <div className="text-lg font-semibold text-green-800">Food Donated</div>
            <div className="text-sm text-green-600 mt-1">Prevented from waste</div>
          </div>
          <div className="text-center bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl font-bold text-green-600 mb-2">{analytics.peopleHelped}</div>
            <div className="text-lg font-semibold text-green-800">People Helped</div>
            <div className="text-sm text-green-600 mt-1">Lives touched</div>
          </div>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Listings</h3>
        </div>
        <div className="divide-y">
          {recentListings.map((listing) => (
            <div key={listing.id} className="p-6 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{listing.title}</h4>
                <p className="text-sm text-gray-600">
                  {listing.quantity} kg • Expires in {listing.expiresIn}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  listing.status === 'Available' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {listing.status}
                </span>
                <span className="text-sm text-gray-600">
                  {listing.requests} requests
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={onCreateListing}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Plus className="h-6 w-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Add New Listing</h4>
            <p className="text-sm text-gray-600">List surplus food for donation</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Manage Requests</h4>
            <p className="text-sm text-gray-600">Review and approve requests</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodProviderDashboard;
