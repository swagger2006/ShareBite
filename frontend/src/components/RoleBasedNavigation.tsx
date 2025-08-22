import React from 'react';
import { 
  Home, 
  Plus, 
  Search, 
  Package, 
  Users, 
  BarChart3, 
  Truck,
  Settings,
  Heart
} from 'lucide-react';
import { useRoleAccess } from '../hooks/useRoleAccess';

interface RoleBasedNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const RoleBasedNavigation: React.FC<RoleBasedNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const { 
    hasPermission, 
    getRoleName, 
    getRoleDescription,
    getAvailableTabs,
    userRole 
  } = useRoleAccess();

  const getTabConfig = () => {
    const tabs: Array<{
      id: string;
      label: string;
      icon: React.ReactNode;
      description: string;
      permission?: keyof import('../hooks/useRoleAccess').RolePermissions;
    }> = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <Home size={20} />,
        description: 'Overview and statistics',
        permission: 'canViewDashboard'
      },
      {
        id: 'browse',
        label: userRole === 'FoodProvider' ? 'All Listings' : 'Browse Food',
        icon: <Search size={20} />,
        description: userRole === 'FoodProvider' 
          ? 'View all food listings' 
          : 'Find available food',
        permission: 'canViewAllListings'
      },
      {
        id: 'my-listings',
        label: 'My Listings',
        icon: <Package size={20} />,
        description: 'Manage your food listings',
        permission: 'canCreateFood'
      },
      {
        id: 'my-requests',
        label: userRole === 'NGO/Volunteer' ? 'Food Requests' : 'My Requests',
        icon: <Heart size={20} />,
        description: userRole === 'NGO/Volunteer' 
          ? 'Manage food requests for distribution'
          : 'Your food requests',
        permission: 'canRequestFood'
      },
      {
        id: 'distribution',
        label: 'Distribution',
        icon: <Truck size={20} />,
        description: 'Manage food distribution',
        permission: 'canDistributeFood'
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: <BarChart3 size={20} />,
        description: 'View statistics and reports',
        permission: 'canViewAnalytics'
      },
      {
        id: 'users',
        label: 'User Management',
        icon: <Users size={20} />,
        description: 'Manage system users',
        permission: 'canManageUsers'
      }
    ];

    return tabs.filter(tab => 
      !tab.permission || hasPermission(tab.permission)
    );
  };

  const availableTabs = getTabConfig();

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl backdrop-blur-md">
      {/* Role Header */}
      <div className="bg-white/10 backdrop-blur-sm px-6 py-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              {getRoleName()} Portal 🚀
            </h2>
            <p className="text-sm text-white/80">
              {getRoleDescription()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              userRole === 'FoodProvider' ? 'bg-blue-100 text-blue-800' :
              userRole === 'NGO/Volunteer' ? 'bg-green-100 text-green-800' :
              userRole === 'Individual' ? 'bg-purple-100 text-purple-800' :
              userRole === 'Admin' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {getRoleName()}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6">
        <nav className="flex space-x-8 overflow-x-auto">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              title={tab.description}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default RoleBasedNavigation;
