import { User } from '../types';

export type UserRole = 'FoodProvider' | 'NGO/Volunteer' | 'Individual' | 'Admin';

export interface RolePermissions {
  canCreateFood: boolean;
  canRequestFood: boolean;
  canManageRequests: boolean;
  canViewAnalytics: boolean;
  canManageUsers: boolean;
  canViewAllListings: boolean;
  canDistributeFood: boolean;
  canViewDashboard: boolean;
}

export const useRoleAccess = () => {
  const currentUser: User | null = JSON.parse(localStorage.getItem('currentUser') || 'null');

  const userRole = currentUser?.role as UserRole;
  
  // Define permissions for each role
  const getPermissions = (role: UserRole): RolePermissions => {
    switch (role) {
      case 'FoodProvider':
        return {
          canCreateFood: true,        // Can list food
          canRequestFood: false,      // Cannot request food - STRICT SEPARATION
          canManageRequests: true,    // Can manage requests for their food
          canViewAnalytics: true,     // Can see their food stats
          canManageUsers: false,      // Cannot manage users
          canViewAllListings: true,   // Can see all listings to monitor market
          canDistributeFood: false,   // Cannot distribute - STRICT SEPARATION
          canViewDashboard: true,     // Provider dashboard
        };
        
      case 'NGO/Volunteer':
        return {
          canCreateFood: false,       // Cannot create food listings - STRICT SEPARATION
          canRequestFood: true,       // Can request food for distribution
          canManageRequests: true,    // Can manage their requests
          canViewAnalytics: true,     // Can see distribution stats
          canManageUsers: false,      // Cannot manage users
          canViewAllListings: true,   // Can see all available food
          canDistributeFood: true,    // Can distribute to beneficiaries
          canViewDashboard: true,     // NGO dashboard
        };
        
      case 'Individual':
        return {
          canCreateFood: false,       // Cannot create food listings - STRICT SEPARATION
          canRequestFood: true,       // Can request food for personal use
          canManageRequests: true,    // Can manage their own requests
          canViewAnalytics: true,     // Can see their impact stats
          canManageUsers: false,      // Cannot manage users
          canViewAllListings: true,   // Can browse available food
          canDistributeFood: false,   // Cannot distribute - STRICT SEPARATION
          canViewDashboard: true,     // Simple dashboard for individuals
        };
        
      case 'Admin':
        return {
          canCreateFood: true,        // Full access
          canRequestFood: true,       // Full access
          canManageRequests: true,    // Can manage all requests
          canViewAnalytics: true,     // Full analytics
          canManageUsers: true,       // Can manage all users
          canViewAllListings: true,   // Can see everything
          canDistributeFood: true,    // Full access
          canViewDashboard: true,     // Admin dashboard
        };
        
      default:
        return {
          canCreateFood: false,
          canRequestFood: false,
          canManageRequests: false,
          canViewAnalytics: false,
          canManageUsers: false,
          canViewAllListings: false,
          canDistributeFood: false,
          canViewDashboard: false,
        };
    }
  };
  
  const permissions = userRole ? getPermissions(userRole) : getPermissions('Individual');
  
  // Helper functions
  const hasPermission = (permission: keyof RolePermissions): boolean => {
    if (!currentUser) return false;
    return permissions[permission];
  };
  
  const getRoleName = (): string => {
    switch (userRole) {
      case 'FoodProvider': return 'Food Provider';
      case 'NGO/Volunteer': return 'NGO/Volunteer';
      case 'Individual': return 'Individual';
      case 'Admin': return 'Administrator';
      default: return 'Guest';
    }
  };
  
  const getRoleDescription = (): string => {
    switch (userRole) {
      case 'FoodProvider': 
        return 'List surplus food and manage distribution requests';
      case 'NGO/Volunteer': 
        return 'Request food for distribution to beneficiaries';
      case 'Individual': 
        return 'Browse and request available food items';
      case 'Admin': 
        return 'Full system administration and oversight';
      default: 
        return 'Browse available food items';
    }
  };
  
  const getAvailableTabs = (): string[] => {
    const tabs: string[] = [];
    
    if (hasPermission('canViewDashboard')) {
      tabs.push('dashboard');
    }
    
    if (hasPermission('canViewAllListings')) {
      tabs.push('browse');
    }
    
    if (hasPermission('canCreateFood')) {
      tabs.push('my-listings');
    }
    
    if (hasPermission('canRequestFood')) {
      tabs.push('my-requests');
    }
    
    if (hasPermission('canDistributeFood')) {
      tabs.push('distribution');
    }
    
    if (hasPermission('canViewAnalytics')) {
      tabs.push('analytics');
    }
    
    if (hasPermission('canManageUsers')) {
      tabs.push('users');
    }
    
    return tabs;
  };
  
  const getDefaultTab = (): string => {
    const availableTabs = getAvailableTabs();
    
    // Role-specific default tabs
    switch (userRole) {
      case 'FoodProvider': 
        return availableTabs.includes('my-listings') ? 'my-listings' : 'dashboard';
      case 'NGO/Volunteer': 
        return availableTabs.includes('browse') ? 'browse' : 'dashboard';
      case 'Individual': 
        return availableTabs.includes('browse') ? 'browse' : 'dashboard';
      case 'Admin': 
        return availableTabs.includes('dashboard') ? 'dashboard' : availableTabs[0];
      default: 
        return availableTabs[0] || 'browse';
    }
  };
  
  return {
    userRole,
    permissions,
    hasPermission,
    getRoleName,
    getRoleDescription,
    getAvailableTabs,
    getDefaultTab,
    isAuthenticated: !!currentUser,
    user: currentUser,
  };
};

export default useRoleAccess;
