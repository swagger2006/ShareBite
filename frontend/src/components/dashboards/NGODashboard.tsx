import React from 'react';
import { Search, Heart, Truck, Users, MapPin, Clock, Scan } from 'lucide-react';

interface NGODashboardProps {
  onBrowseFood: () => void;
  onOpenScanner?: () => void;
}

const NGODashboard: React.FC<NGODashboardProps> = ({ onBrowseFood, onOpenScanner }) => {
  // Mock data - replace with real data from API
  const stats = {
    totalRequests: 8,
    approvedRequests: 5,
    pendingRequests: 3,
    beneficiariesServed: 45,
    totalKgCollected: 67.5,
    activeDistributions: 2
  };

  const availableFood = [
    {
      id: 1,
      title: "Fresh Vegetables",
      provider: "Green Grocery Store",
      quantity: 15,
      location: "Downtown",
      expiresIn: "3 hours",
      distance: "2.5 km"
    },
    {
      id: 2,
      title: "Cooked Meals",
      provider: "City Restaurant",
      quantity: 25,
      location: "Central Area",
      expiresIn: "1 hour",
      distance: "1.2 km"
    }
  ];

  const recentDistributions = [
    {
      id: 1,
      food: "Rice & Vegetables",
      quantity: 20,
      beneficiaries: 15,
      date: "Today",
      status: "Completed"
    },
    {
      id: 2,
      food: "Fresh Fruits",
      quantity: 10,
      beneficiaries: 8,
      date: "Yesterday",
      status: "Completed"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 text-white p-8 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3">Welcome, NGO/Volunteer! 🤝</h1>
            <p className="text-green-100 text-lg mb-6 max-w-2xl">
              Help distribute food to those in need and make a difference in your community.
              Together, we can fight hunger and reduce waste.
            </p>
            <button
              onClick={onBrowseFood}
              className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Search size={22} />
              <span>Browse Available Food</span>
            </button>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Heart size={64} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
            </div>
            <Heart className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Distributions</p>
              <p className="text-2xl font-bold text-blue-600">{stats.activeDistributions}</p>
            </div>
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200 shadow-lg">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Users size={32} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-blue-800">Your Impact 💙</h3>
            <p className="text-blue-700">Serving the community with compassion</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.beneficiariesServed}</div>
            <div className="text-lg font-semibold text-blue-800">Beneficiaries Served</div>
            <div className="text-sm text-blue-600 mt-1">Lives impacted</div>
          </div>
          <div className="text-center bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalKgCollected} kg</div>
            <div className="text-lg font-semibold text-blue-800">Food Collected</div>
            <div className="text-sm text-blue-600 mt-1">Successfully distributed</div>
          </div>
        </div>
      </div>

      {/* Available Food */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Available Food Near You</h3>
          <button
            onClick={onBrowseFood}
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            View All
          </button>
        </div>
        <div className="divide-y">
          {availableFood.map((food) => (
            <div key={food.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{food.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    by {food.provider}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span>{food.location} • {food.distance}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>Expires in {food.expiresIn}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{food.quantity} kg</p>
                  <button className="mt-2 bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                    Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Distributions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Distributions</h3>
        </div>
        <div className="divide-y">
          {recentDistributions.map((distribution) => (
            <div key={distribution.id} className="p-6 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{distribution.food}</h4>
                <p className="text-sm text-gray-600">
                  {distribution.quantity} kg • {distribution.beneficiaries} beneficiaries • {distribution.date}
                </p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {distribution.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onBrowseFood}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Search className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Browse Food</h4>
            <p className="text-sm text-gray-600">Find available food for distribution</p>
          </button>

          <button
            onClick={onOpenScanner}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Scan className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Scan QR Code</h4>
            <p className="text-sm text-gray-600">Scan food QR codes to collect</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Users className="h-6 w-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Manage Beneficiaries</h4>
            <p className="text-sm text-gray-600">Track distribution recipients</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
