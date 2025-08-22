import React from 'react';
import { motion } from 'framer-motion';
import { User, Award, TrendingUp, Star, Settings, LogOut, Mail, Phone, Building, Calendar } from 'lucide-react';
import { User as UserType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../services/authService';

interface UserProfileProps {
  user: UserType;
  onLogout: () => void;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onClose }) => {
  const currentLevel = Math.floor(user.points / 100) + 1;
  const nextLevelPoints = currentLevel * 100;
  const progressPercentage = ((user.points % 100) / 100) * 100;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        {/* User Info */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
          <p className="text-gray-600">{user.role}</p>
          {user.organization && (
            <p className="text-sm text-gray-500">{user.organization}</p>
          )}
          <div className="flex items-center justify-center mt-2">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Level {currentLevel}
            </span>
            {user.verified && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Level Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress to Level {currentLevel + 1}</span>
            <span className="text-sm text-gray-500">{user.points}/{nextLevelPoints}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* User Details */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500">Email Address</p>
            </div>
          </div>

          {user.phone && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                <p className="text-xs text-gray-500">Phone Number</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{formatDate(user.joinedAt)}</p>
              <p className="text-xs text-gray-500">Member Since</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{user.stats.foodListed}</p>
            <p className="text-xs text-gray-600">Listed</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{user.stats.foodCollected}</p>
            <p className="text-xs text-gray-600">Collected</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{user.stats.impactScore}</p>
            <p className="text-xs text-gray-600">Impact</p>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Achievements</h4>
          {user.badges.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {user.badges.map(badge => (
                <div key={badge.id} className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <p className="text-xs font-medium text-gray-900">{badge.name}</p>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No badges earned yet</p>
              <p className="text-xs">Start sharing food to earn achievements!</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;