import React, { useState, useRef } from 'react';
import { Plus, Upload, Clock, AlertCircle, Camera, X, Image as ImageIcon } from 'lucide-react';
import { FoodItem } from '../types';
import { generateId } from '../utils/helpers';
import { User } from '../types';
import { apiClient } from '../services/apiService';

import toast from 'react-hot-toast';

interface FoodListingFormProps {
  onAddFood: (food: FoodItem) => void;
  onClose: () => void;
}

const FoodListingForm: React.FC<FoodListingFormProps> = ({ onAddFood, onClose }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    quantity: 1,
    location: '',
    safetyHours: 4,
    description: '',
    category: 'Cooked Food',
    allergens: [] as string[],
    tags: [] as string[]
  });

  const foodImages = [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
  ];

  const categories = ['Cooked Food', 'Fresh Produce', 'Packaged Food', 'Beverages', 'Bakery Items', 'Dairy Products'];
  const allergenOptions = ['Nuts', 'Dairy', 'Gluten', 'Eggs', 'Soy', 'Shellfish', 'Fish'];
  const tagOptions = ['Vegetarian', 'Vegan', 'Organic', 'Halal', 'Kosher', 'Spicy', 'Sweet'];

  // Image upload functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Limit to 3 images
    const newFiles = files.slice(0, 3 - selectedImages.length);
    setSelectedImages(prev => [...prev, ...newFiles]);

    // Create previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      quantity: 1,
      location: '',
      safetyHours: 4,
      description: '',
      category: 'Cooked Food',
      allergens: [],
      tags: []
    });
    setSelectedImages([]);
    setImagePreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + (formData.safetyHours * 60 * 60 * 1000));

      // Try backend first if authenticated
      if (currentUser) {
        try {
          const backendData = {
            title: formData.title,
            description: formData.description,
            quantity: formData.quantity,
            location: formData.location,
            expiry_time: expiresAt.toISOString(),
          };

          const backendListing = await apiClient.createFoodListing(backendData);
          console.log('Backend response:', backendListing);

          // Convert backend response to frontend format
          const newFood: FoodItem = {
            id: backendListing.id ? backendListing.id.toString() : generateId(),
            title: backendListing.title,
            type: 'Cooked Food',
            quantity: backendListing.quantity,
            unit: 'kg',
            provider: currentUser.name,
            providerId: currentUser.id ? currentUser.id.toString() : 'unknown',
            location: backendListing.location,
            safetyHours: formData.safetyHours,
            listedAt: new Date(backendListing.created_at),
            expiresAt: new Date(backendListing.expiry_time),
            description: backendListing.description,
            imageUrl: imagePreviews.length > 0 ? imagePreviews[0] : foodImages[Math.floor(Math.random() * foodImages.length)],
            status: backendListing.status as any,
            tags: [],
            allergens: [],
            qrCode: `https://foodshare.campus/food/${backendListing.id}`
          };

          onAddFood(newFood);
          toast.success('🎉 Food listing created successfully in backend!');
          resetForm();

          // Close modal after a short delay to show success message
          setTimeout(() => {
            onClose();
          }, 1500);
          return;
        } catch (backendError: any) {
          console.error('Backend creation failed:', backendError);
          toast.error('Backend failed, creating locally: ' + backendError.message);
        }
      }

      // Fallback to local creation
      const newFood: FoodItem = {
        id: generateId(),
        title: formData.title,
        type: 'Cooked Food',
        quantity: formData.quantity,
        unit: 'kg',
        provider: currentUser?.name || 'Local User',
        providerId: currentUser?.id.toString() || 'local-user',
        location: formData.location,
        safetyHours: formData.safetyHours,
        listedAt: now,
        expiresAt: expiresAt,
        description: formData.description,
        imageUrl: imagePreviews.length > 0 ? imagePreviews[0] : foodImages[Math.floor(Math.random() * foodImages.length)],
        status: 'Available',
        tags: [],
        allergens: [],
        qrCode: `https://foodshare.campus/food/${generateId()}`
      };

      onAddFood(newFood);
      toast.success('🎉 Food listing created successfully!');
      resetForm();

      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error: any) {
      console.error('Error creating food listing:', error);
      toast.error(`❌ Failed to create food listing: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'safetyHours' ? Number(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">🍽️ List Your Food</h2>
              <p className="text-blue-100">Share your surplus food with those in need</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8">

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border-2 border-dashed border-blue-300">
              <div className="text-center">
                <div className="mb-4">
                  <Camera size={48} className="mx-auto text-blue-600 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Add Food Photos</h3>
                  <p className="text-sm text-gray-600">Upload up to 3 photos to showcase your food</p>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {selectedImages.length < 3 && (
                  <button
                    type="button"
                    onClick={triggerImageUpload}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Upload size={20} />
                    <span>Upload Photos</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Food Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Fresh Vegetable Curry"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe the food, ingredients, preparation method, taste, and any special notes..."
              />
            </div>

            {/* Safety Hours and Expiry */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
              <div className="flex items-center mb-4">
                <Clock className="text-orange-600 mr-3" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-800">Food Safety & Timing</h3>
                  <p className="text-sm text-gray-600">Set pickup timeframe for food safety</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Safety Hours *
                  </label>
                  <input
                    type="number"
                    name="safetyHours"
                    value={formData.safetyHours}
                    onChange={handleInputChange}
                    min="1"
                    max="48"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Hours until expiry"
                  />
                  <p className="text-xs text-gray-500 mt-1">How many hours is this food safe to consume?</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expires At
                  </label>
                  <div className="bg-gray-100 px-4 py-3 rounded-xl text-gray-700">
                    {new Date(Date.now() + formData.safetyHours * 60 * 60 * 1000).toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Calculated expiry time</p>
                </div>
              </div>
            </div>

            {/* Quantity and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity (kg) *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0.5"
                  step="0.5"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., 5.0"
                />
                <p className="text-xs text-gray-500 mt-1">Approximate weight in kilograms</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pickup Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Downtown Restaurant, Main Street"
                />
                <p className="text-xs text-gray-500 mt-1">Where can people pick up this food?</p>
              </div>
            </div>





            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Food Safety Guidelines:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Ensure proper packaging and storage</li>
                    <li>Set realistic safety hours based on food type</li>
                    <li>Include allergen information in description</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Listing...</span>
                  </>
                ) : (
                  <>
                    <Plus size={22} />
                    <span>🚀 List Food</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>


    </div>
  );
};

export default FoodListingForm;