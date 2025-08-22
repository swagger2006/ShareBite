import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  MapPin,
  Star
} from 'lucide-react';
import { useAnalytics } from '../contexts/AnalyticsContext';

const RealTimeAnalytics: React.FC = () => {
  const { analytics, isLoading, lastUpdated, refreshAnalytics } = useAnalytics();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    trend, 
    subtitle 
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    trend?: number;
    subtitle?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center">
          <TrendingUp className={`w-4 h-4 mr-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last week</span>
        </div>
      )}
    </motion.div>
  );

  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </motion.div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 Real-Time Analytics</h1>
          <p className="text-gray-600 mt-1">Live insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {formatTime(lastUpdated)}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshAnalytics}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Live Data • Updates every 30 seconds</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Listings"
          value={analytics.totalListings}
          icon={Package}
          color="bg-blue-500"
          trend={12}
          subtitle="All time"
        />
        <StatCard
          title="Active Listings"
          value={analytics.activeListings}
          icon={Activity}
          color="bg-green-500"
          trend={8}
          subtitle="Currently available"
        />
        <StatCard
          title="Food Saved"
          value={`${analytics.totalKgSaved} kg`}
          icon={CheckCircle}
          color="bg-purple-500"
          trend={15}
          subtitle="Total weight"
        />
        <StatCard
          title="People Helped"
          value={analytics.peopleHelped}
          icon={Users}
          color="bg-orange-500"
          trend={20}
          subtitle="Estimated reach"
        />
      </div>

      {/* Today's Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Today's Listings"
          value={analytics.todayListings}
          icon={Calendar}
          color="bg-indigo-500"
          subtitle="New today"
        />
        <StatCard
          title="Today's Collections"
          value={analytics.todayCollections}
          icon={CheckCircle}
          color="bg-green-500"
          subtitle="Completed today"
        />
        <StatCard
          title="Active Users"
          value={analytics.activeUsers}
          icon={Users}
          color="bg-pink-500"
          subtitle="Online now"
        />
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Trends */}
        <ChartCard title="📈 Weekly Trends">
          <div className="space-y-4">
            {analytics.weeklyTrends.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">{day.listings} listings</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">{day.collections} collected</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Category Breakdown */}
        <ChartCard title="🥘 Food Categories">
          <div className="space-y-3">
            {analytics.categoryStats.map((category) => (
              <div key={category.category} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{category.category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Average Rating"
          value={analytics.averageRating > 0 ? `${analytics.averageRating}/5` : 'N/A'}
          icon={Star}
          color="bg-yellow-500"
          subtitle="User feedback"
        />
        <StatCard
          title="Pending Requests"
          value={analytics.pendingRequests}
          icon={Clock}
          color="bg-orange-500"
          subtitle="Awaiting approval"
        />
        <StatCard
          title="Waste Reduced"
          value={`${analytics.wasteReduced} kg CO₂`}
          icon={AlertTriangle}
          color="bg-green-600"
          subtitle="Environmental impact"
        />
        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={Users}
          color="bg-purple-600"
          subtitle="Platform wide"
        />
      </div>

      {/* Top Locations */}
      <ChartCard title="📍 Top Pickup Locations">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.locationStats.map((location, index) => (
            <div key={location.location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                }`}>
                  {index + 1}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{location.location}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-700">{location.count} items</span>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default RealTimeAnalytics;
