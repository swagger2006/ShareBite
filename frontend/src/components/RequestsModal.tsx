import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Clock, Phone, Mail, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { FoodItem } from '../types';

interface Request {
  id: string;
  userName: string;
  userType: 'NGO/Volunteer' | 'Individual';
  email: string;
  phone: string;
  requestedAt: Date;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  urgency: 'low' | 'medium' | 'high';
}

interface RequestsModalProps {
  listing: FoodItem | null;
  onClose: () => void;
}

const RequestsModal: React.FC<RequestsModalProps> = ({ listing, onClose }) => {
  // Sample requests data - in a real app, this would come from an API
  const sampleRequests: Request[] = [
    {
      id: '1',
      userName: 'Hope Foundation NGO',
      userType: 'NGO/Volunteer',
      email: 'contact@hopefoundation.org',
      phone: '+91 98765 43210',
      requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      message: 'We have 50 homeless people to feed tonight. This would be very helpful.',
      status: 'pending',
      urgency: 'high'
    },
    {
      id: '2',
      userName: 'Rajesh Kumar',
      userType: 'Individual',
      email: 'rajesh.kumar@email.com',
      phone: '+91 87654 32109',
      requestedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      message: 'I am a student and would really appreciate this food.',
      status: 'pending',
      urgency: 'medium'
    },
    {
      id: '3',
      userName: 'Seva Bharti',
      userType: 'NGO/Volunteer',
      email: 'info@sevabharti.org',
      phone: '+91 76543 21098',
      requestedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: 'pending',
      urgency: 'low'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUserTypeIcon = (userType: string) => {
    return userType === 'NGO/Volunteer' ? '🏢' : '👤';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  if (!listing) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Food Requests</h2>
                <p className="text-gray-600 mt-1">
                  Requests for "{listing.title}" • {sampleRequests.length} total requests
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {sampleRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                  <p className="text-gray-600 text-lg">
                    No requests yet for this listing.
                  </p>
                  <p className="text-gray-500 mt-2">
                    Requests will appear here when people are interested in your food.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {sampleRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {getUserTypeIcon(request.userType)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {request.userName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {request.userType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency} priority
                        </span>
                        <span className="text-sm text-gray-500">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {formatTimeAgo(request.requestedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {request.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {request.phone}
                      </div>
                    </div>

                    {request.message && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border">
                          <strong>Message:</strong> {request.message}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md flex items-center text-sm"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md flex items-center text-sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Approve requests based on urgency and your available quantity.
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RequestsModal;
