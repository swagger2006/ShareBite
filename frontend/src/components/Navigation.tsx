import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Home, Menu, User as UserIcon } from 'lucide-react';
import { User as UserType } from '../types';


interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  notificationCount: number;
  user: UserType | null;
  onShowAuth: () => void;
  onShowProfile: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  notificationCount,
  user,
  onShowAuth,
  onShowProfile
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'list-food', label: 'List Food', icon: Plus },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notificationCount },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl px-6 py-4 relative backdrop-blur-md">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30"
            >
              <Menu className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">🍽️ FoodShare Campus</h1>
          </div>
          
          <div className="flex space-x-6">
            {navItems.map(item => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 relative ${
                  currentView === item.id
                    ? 'bg-white/30 text-white shadow-lg backdrop-blur-sm border border-white/40'
                    : 'text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowProfile}
                className="flex items-center space-x-3 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
                title="View Profile"
              >
                {/* Profile Image or Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-lg font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* User Info */}
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-white/80">{user.role}</p>
                </div>

                {/* Profile Icon */}
                <UserIcon className="w-5 h-5 text-white/80" />
              </motion.button>
            ) : (
              <div className="text-white/80 text-sm">
                Welcome! Use "Get Started" below to login
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around">
          {navItems.map(item => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg relative transition-colors ${
                currentView === item.id
                  ? 'text-green-600'
                  : 'text-gray-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center shadow-lg"
                >
                  {item.badge > 9 ? '9+' : item.badge}
                </motion.span>
              )}
            </motion.button>
          ))}

          {/* Mobile Profile Icon */}
          {user && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onShowProfile}
              className="flex flex-col items-center space-y-1 p-2 rounded-lg relative transition-colors text-green-600"
            >
              <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">Profile</span>
            </motion.button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;