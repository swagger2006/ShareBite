import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Building, Shield, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '../types';
import { validateEmail, validatePhone } from '../utils/helpers';
import { apiClient, TokenManager } from '../services/apiService';

import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Individual' as UserType['role'],
    organization: '',
    address: '',
    registrationNumber: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      else if (!validatePhone(formData.phone)) newErrors.phone = 'Invalid phone number';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (formData.role === 'NGO/Volunteer' && !formData.registrationNumber?.trim()) {
        newErrors.registrationNumber = 'Registration number is required for NGOs';
      }
    }

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address';
    
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (!isLogin && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submission started', { isLogin, formData: { ...formData, password: '[HIDDEN]' } });

    if (!validateForm()) {
      console.log('Form validation failed', errors);
      return;
    }

    console.log('Form validation passed');
    setIsLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting login...');

        // Login with Django backend
        const response = await apiClient.login({
          email: formData.email,
          password: formData.password
        });

        // Convert Django user to frontend format
        const userData = {
          id: response.user.id.toString(),
          name: response.user.full_name,
          email: response.user.email,
          phone: response.user.phone || '',
          role: response.user.role as UserType['role'],
          organization: response.user.organization || '',
          verified: response.user.is_email_verified,
          joinedAt: new Date(response.user.created_at),
          points: 0,
          level: 1,
          badges: [],
          preferences: {
            dietary: [],
            notifications: true,
            radius: 5
          },
          stats: {
            foodListed: 0,
            foodCollected: 0,
            impactScore: 0
          }
        };

        localStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('Login successful');
        toast.success('Welcome back!');
      } else {
        console.log('Attempting registration...');
        console.log('Form data role:', formData.role);

        const registrationData = {
          email: formData.email,
          username: formData.email, // Use email as username
          password: formData.password,
          password_confirm: formData.confirmPassword,
          full_name: formData.name,
          role: formData.role as 'FoodProvider' | 'NGO/Volunteer' | 'Individual' | 'Admin',
          organization: formData.organization || undefined,
          phone: formData.phone || undefined,
          address: formData.address || undefined
        };

        console.log('Registration data being sent:', registrationData);

        // Register with Django backend
        const response = await apiClient.register(registrationData);

        // Convert Django user to frontend format
        const userData = {
          id: response.user.id.toString(),
          name: response.user.full_name,
          email: response.user.email,
          phone: response.user.phone || '',
          role: response.user.role as UserType['role'],
          organization: response.user.organization || '',
          verified: response.user.is_email_verified,
          joinedAt: new Date(response.user.created_at),
          points: 0,
          level: 1,
          badges: [],
          preferences: {
            dietary: [],
            notifications: true,
            radius: 5
          },
          stats: {
            foodListed: 0,
            foodCollected: 0,
            impactScore: 0
          }
        };

        localStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('Registration successful');
        toast.success('Account created successfully!');
      }

      // Refresh page to load user
      window.location.reload();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Authentication error:', error);

      // Better error handling
      let errorMessage = 'Authentication failed. Please try again.';

      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email. Please register first.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format.';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'An account with this email already exists.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters long.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please check your credentials.';
            break;
          default:
            errorMessage = error.message || 'Authentication failed. Please try again.';
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast('Password reset feature coming soon!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'Individual' as UserType['role'],
      organization: '',
      address: '',
      registrationNumber: ''
    });
    setErrors({});
  };

  const roleOptions = [
    { value: 'FoodProvider', label: 'Food Provider', icon: '🍽️', description: 'Restaurants, canteens, events with surplus food' },
    { value: 'Individual', label: 'Individual', icon: '🤲', description: 'Individuals or families in need of food' },
    { value: 'NGO/Volunteer', label: 'NGO/Volunteer', icon: '🤝', description: 'Non-profit organizations and volunteers' },
    { value: 'Admin', label: 'Administrator', icon: '👨‍💼', description: 'Platform administrators' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isLogin ? 'Welcome Back' : 'Join FoodShare'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                            errors.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value as UserType['role']})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {roleOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.icon} {option.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {roleOptions.find(opt => opt.value === formData.role)?.description}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                            errors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {(formData.role === 'FoodProvider' || formData.role === 'NGO/Volunteer' || formData.role === 'Admin') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organization Name
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={formData.organization}
                            onChange={(e) => setFormData({...formData, organization: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter organization name"
                          />
                        </div>
                      </div>
                    )}

                    {formData.role === 'NGO/Volunteer' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Registration Number
                        </label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={formData.registrationNumber}
                            onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                              errors.registrationNumber ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="NGO registration number"
                          />
                        </div>
                        {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Confirm your password"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </motion.button>

                {isLogin && (
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-green-600 hover:text-green-700 underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </form>



              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        password: '',
                        confirmPassword: '',
                        role: 'Individual',
                        organization: '',
                        address: '',
                        registrationNumber: ''
                      });
                    }}
                    className="ml-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;