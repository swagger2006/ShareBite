import React from 'react';
import { Search, Heart, MapPin, Clock, Star, Scan } from 'lucide-react';

interface IndividualDashboardProps {
  onBrowseFood: () => void;
  onOpenScanner?: () => void;
}

const IndividualDashboard: React.FC<IndividualDashboardProps> = ({ onBrowseFood, onOpenScanner }) => {
  // Mock data - replace with real data from API
  const stats = {
    totalRequests: 3,
    approvedRequests: 2,
    totalKgReceived: 8.5,
    moneySaved: 450
  };

  const nearbyFood = [
    {
      id: 1,
      title: "Fresh Vegetables",
      provider: "Green Grocery Store",
      quantity: 3,
      location: "Downtown",
      expiresIn: "2 hours",
      distance: "0.8 km",
      rating: 4.8
    },
    {
      id: 2,
      title: "Bread & Pastries",
      provider: "Local Bakery",
      quantity: 5,
      location: "Near Park",
      expiresIn: "4 hours",
      distance: "1.5 km",
      rating: 4.9
    },
    {
      id: 3,
      title: "Cooked Meals",
      provider: "Community Kitchen",
      quantity: 2,
      location: "Central Area",
      expiresIn: "1 hour",
      distance: "2.1 km",
      rating: 4.7
    }
  ];

  const myRequests = [
    {
      id: 1,
      food: "Fresh Fruits",
      provider: "Fruit Market",
      quantity: 2,
      status: "Approved",
      pickupTime: "Today 6:00 PM"
    },
    {
      id: 2,
      food: "Vegetables",
      provider: "Green Store",
      quantity: 3,
      status: "Pending",
      requestedAt: "2 hours ago"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 text-white p-8 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3">Welcome! 🍎</h1>
            <p className="text-purple-100 text-lg mb-6 max-w-2xl">
              Find fresh, quality food from local providers and help reduce food waste.
              Save money while making a positive environmental impact.
            </p>
            <button
              onClick={onBrowseFood}
              className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Search size={22} />
              <span>Browse Available Food</span>
            </button>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Star size={64} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Food Received</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalKgReceived} kg</p>
              <p className="text-sm text-gray-600 mt-1">Fresh & quality food</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Money Saved</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">₹{stats.moneySaved}</p>
              <p className="text-sm text-gray-600 mt-1">On grocery expenses</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Impact Message */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 shadow-lg">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <Heart size={32} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-800">Your Impact 🌱</h3>
            <p className="text-green-700">Making a difference, one meal at a time</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-700 text-lg leading-relaxed">
            By requesting <span className="font-bold text-green-600">{stats.totalKgReceived} kg</span> of food,
            you've helped prevent food waste and saved approximately
            <span className="font-bold text-blue-600"> ₹{stats.moneySaved}</span> on groceries.
            <span className="block mt-3 text-green-800 font-semibold">
              Thank you for being part of the solution! 🙏
            </span>
          </p>
        </div>
      </div>

      {/* Nearby Food */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Available Food Near You</h3>
            <p className="text-sm text-gray-600 mt-1">Fresh options from local providers</p>
          </div>
          <button
            onClick={onBrowseFood}
            className="bg-purple-100 text-purple-700 hover:bg-purple-200 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
          >
            View All
          </button>
        </div>
        <div className="p-6 space-y-4">
          {nearbyFood.map((food) => (
            <div key={food.id} className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900 text-lg">{food.title}</h4>
                    <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-yellow-700">{food.rating}</span>
                    </div>
                  </div>
                  <p className="text-purple-600 font-medium mb-3">
                    by {food.provider}
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span className="flex items-center space-x-2 bg-white px-3 py-1 rounded-lg">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{food.location} • {food.distance}</span>
                    </span>
                    <span className="flex items-center space-x-2 bg-white px-3 py-1 rounded-lg">
                      <Clock size={16} className="text-gray-400" />
                      <span>Expires in {food.expiresIn}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right ml-6">
                  <div className="bg-white p-4 rounded-xl text-center mb-3">
                    <p className="text-2xl font-bold text-gray-900">{food.quantity}</p>
                    <p className="text-sm text-gray-600">kg available</p>
                  </div>
                  <button className="w-full bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg">
                    Request Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Requests */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">My Recent Requests</h3>
        </div>
        <div className="divide-y">
          {myRequests.map((request) => (
            <div key={request.id} className="p-6 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{request.food}</h4>
                <p className="text-sm text-gray-600">
                  {request.quantity} kg from {request.provider}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {request.status === 'Approved' 
                    ? `Pickup: ${request.pickupTime}`
                    : `Requested ${request.requestedAt}`
                  }
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                request.status === 'Approved' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {request.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={onBrowseFood}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Search className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Browse Food</h4>
            <p className="text-sm text-gray-600">Find available food near you</p>
          </button>

          <button
            onClick={onOpenScanner}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Scan className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Scan QR Code</h4>
            <p className="text-sm text-gray-600">Scan food QR codes to collect</p>
          </button>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Tips for Success</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>• Request only what you can consume to avoid waste</li>
          <li>• Be punctual for pickup times to help providers</li>
          <li>• Rate your experience to help other users</li>
          <li>• Check expiry times before requesting</li>
        </ul>
      </div>
    </div>
  );
};

export default IndividualDashboard;
