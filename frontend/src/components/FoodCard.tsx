import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Users, Tag, AlertTriangle, QrCode, Star, MessageCircle, Edit, Trash2, Eye } from 'lucide-react';
import { FoodItem } from '../types';
import { formatTimeRemaining, getFreshnessStatus } from '../utils/helpers';

interface FoodCardProps {
  food: FoodItem;
  onReserve: (id: string) => void;
  onCollect: (id: string) => void;
  onShowQR: (food: FoodItem) => void;
  onRate: (id: string, rating: number) => void;
  userRole?: string;
  isOwnListing?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewRequests?: (id: string) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onReserve,
  onCollect,
  onShowQR,
  onRate,
  userRole,
  isOwnListing = false,
  onEdit,
  onDelete,
  onViewRequests
}) => {
  const freshnessStatus = getFreshnessStatus(food.expiresAt);
  const timeRemaining = formatTimeRemaining(food.expiresAt);



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800';
      case 'Reserved': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800';
      case 'Collected': return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
      case 'Expired': return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
    }
  };

  const getFreshnessColor = () => {
    switch (freshnessStatus) {
      case 'fresh': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'expired': return 'text-red-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/20 backdrop-blur-sm"
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
        <img
          src={food.imageUrl}
          alt={food.title}
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 right-4 z-20">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`px-4 py-2 rounded-xl text-sm font-bold shadow-2xl backdrop-blur-sm border border-white/30 ${getStatusColor(food.status)}`}
          >
            {food.status}
          </motion.span>
        </div>
        {freshnessStatus === 'warning' && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 left-4"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-2 rounded-full shadow-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </motion.div>
        )}
        
        {/* QR Code Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onShowQR(food)}
          className="absolute bottom-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
        >
          <QrCode className="w-4 h-4 text-gray-700" />
        </motion.button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900">{food.title}</h3>
          <span className="text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            {food.quantity} {food.unit}
          </span>
        </div>

        {/* Rating */}
        {food.rating && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= food.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              ({food.reviews?.length || 0} reviews)
            </span>
          </div>
        )}
        <p className="text-gray-600 mb-4">{food.description}</p>

        {/* Allergens */}
        {food.allergens && food.allergens.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-red-600 mb-1">Allergens:</p>
            <div className="flex flex-wrap gap-1">
              {food.allergens.map(allergen => (
                <span key={allergen} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{food.location} • {food.provider}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2" />
            <span className={getFreshnessColor()}>
              {timeRemaining} • Safe for {food.safetyHours}h
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs rounded-full">
            {food.type}
          </span>
          {food.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Provider's own listing - show management buttons */}
        {isOwnListing && userRole === 'FoodProvider' && (
          <div className="space-y-3">
            {food.status === 'Available' && (
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEdit?.(food.id)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onViewRequests?.(food.id)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Requests
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDelete?.(food.id)}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-3 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            )}
            {food.status === 'Reserved' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCollect(food.id)}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md"
              >
                Mark as Collected
              </motion.button>
            )}
          </div>
        )}

        {/* Receiver's view - show reserve/collect buttons */}
        {!isOwnListing && food.status === 'Available' && freshnessStatus !== 'expired' && (
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onReserve(food.id)}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md"
            >
              Reserve
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCollect(food.id)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
            >
              Collect Now
            </motion.button>
          </div>
        )}

        {!isOwnListing && food.status === 'Reserved' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCollect(food.id)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
          >
            Mark as Collected
          </motion.button>
        )}

        {food.status === 'Collected' && (
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onRate(food.id, 5)}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-md flex items-center justify-center"
            >
              <Star className="w-4 h-4 mr-2" />
              Rate
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Review
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FoodCard;