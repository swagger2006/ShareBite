import React from 'react';
import { TrendingUp, Users, Droplets, Leaf, Award, Calendar } from 'lucide-react';
import { AnalyticsData } from '../types';

interface DashboardProps {
  analytics: AnalyticsData;
}

const Dashboard: React.FC<DashboardProps> = ({ analytics }) => {
  const stats = [
    {
      label: 'Food Saved',
      value: `${analytics.foodSaved.toFixed(1)} kg`,
      icon: Leaf,
      color: 'text-green-600 bg-green-100',
      change: '+12%'
    },
    {
      label: 'People Served',
      value: analytics.peopleServed.toString(),
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
      change: '+8%'
    },
    {
      label: 'CO₂ Reduced',
      value: `${(analytics.carbonFootprintReduced / 1000).toFixed(1)}t`,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100',
      change: '+15%'
    },
    {
      label: 'Water Saved',
      value: `${(analytics.waterFootprintReduced / 1000).toFixed(1)}k L`,
      icon: Droplets,
      color: 'text-cyan-600 bg-cyan-100',
      change: '+10%'
    },
  ];

  const achievements = [
    { title: 'Waste Warrior', description: 'Saved 100kg+ of food', earned: true },
    { title: 'Community Hero', description: 'Served 200+ people', earned: analytics.peopleServed >= 200 },
    { title: 'Carbon Crusher', description: 'Reduced 1000kg+ CO₂', earned: analytics.carbonFootprintReduced >= 1000 },
    { title: 'Water Guardian', description: 'Saved 50,000L+ water', earned: analytics.waterFootprintReduced >= 50000 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Environmental Impact Dashboard</h1>
        <p className="text-gray-600">Track the positive impact of our food redistribution efforts</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Impact Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Impact Trend</h3>
          <div className="space-y-4">
            {[
              { month: 'Jan', value: 80, color: 'bg-green-500' },
              { month: 'Feb', value: 65, color: 'bg-green-500' },
              { month: 'Mar', value: 95, color: 'bg-green-600' },
              { month: 'Apr', value: 120, color: 'bg-green-700' },
              { month: 'May', value: 140, color: 'bg-green-800' },
            ].map((data) => (
              <div key={data.month} className="flex items-center">
                <span className="w-8 text-sm text-gray-600">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full ${data.color}`}
                      style={{ width: `${(data.value / 150) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{data.value}kg</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Food Type Distribution</h3>
          <div className="space-y-4">
            {[
              { type: 'Cooked Food', percentage: 45, color: 'bg-blue-500' },
              { type: 'Raw Ingredients', percentage: 25, color: 'bg-green-500' },
              { type: 'Packaged', percentage: 15, color: 'bg-yellow-500' },
              { type: 'Bakery', percentage: 10, color: 'bg-purple-500' },
              { type: 'Beverages', percentage: 5, color: 'bg-red-500' },
            ].map((data) => (
              <div key={data.type} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">{data.type}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${data.color}`}
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{data.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Sustainability Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.title}
              className={`p-4 rounded-lg border-2 ${
                achievement.earned
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center mb-2">
                <Award
                  className={`w-6 h-6 mr-2 ${
                    achievement.earned ? 'text-green-600' : 'text-gray-400'
                  }`}
                />
                <h4 className={`font-bold ${
                  achievement.earned ? 'text-green-900' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h4>
              </div>
              <p className={`text-sm ${
                achievement.earned ? 'text-green-700' : 'text-gray-500'
              }`}>
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;