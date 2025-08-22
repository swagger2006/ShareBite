import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Plus, 
  Search, 
  Package, 
  Heart, 
  BarChart3, 
  Truck,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useRoleAccess } from '../hooks/useRoleAccess';



interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const { 
    hasPermission, 
    getRoleName, 
    getRoleDescription,
    userRole 
  } = useRoleAccess();
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

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

    return tabs.filter(tab => !tab.permission || hasPermission(tab.permission));
  };

  const availableTabs = getTabConfig();

  // Debug: Log available tabs
  console.log('Sidebar - Available tabs:', availableTabs.map(t => t.id));
  console.log('Sidebar - User role:', userRole);
  console.log('Sidebar - Current user:', currentUser?.name);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ width: isCollapsed ? 80 : 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 text-white shadow-2xl flex flex-col h-screen fixed left-0 top-0 z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">FoodShare</h1>
                <p className="text-xs text-blue-200">Campus</p>
              </div>
            </motion.div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleCollapse}
            className="p-2 rounded-lg bg-blue-700/50 hover:bg-blue-600/50 transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </motion.button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && currentUser && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-blue-800/30 border-b border-blue-700/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-blue-200 truncate">
                {getRoleName()}
              </p>
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                userRole === 'FoodProvider' ? 'bg-blue-100 text-blue-800' :
                userRole === 'NGO/Volunteer' ? 'bg-green-100 text-green-800' :
                userRole === 'Individual' ? 'bg-purple-100 text-purple-800' :
                'bg-red-100 text-red-800'
              }`}>
                {userRole}
              </div>
            </div>
          </div>
          <p className="text-xs text-blue-300 mt-2">
            {getRoleDescription()}
          </p>
        </motion.div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-2 px-3">
          {availableTabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg text-white'
                  : 'text-blue-100 hover:bg-blue-700/30 hover:text-white'
              }`}
            >
              <div className={`flex-shrink-0 ${
                activeTab === tab.id ? 'text-white' : 'text-blue-300 group-hover:text-white'
              }`}>
                {tab.icon}
              </div>
              
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{tab.label}</p>
                  <p className="text-xs opacity-75">{tab.description}</p>
                </div>
              )}
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-blue-700/50">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
