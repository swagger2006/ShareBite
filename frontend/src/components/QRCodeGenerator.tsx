import React from 'react';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';
import { Download, Share2, X } from 'lucide-react';
import { FoodItem } from '../types';

interface QRCodeGeneratorProps {
  food: FoodItem;
  onClose: () => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ food, onClose }) => {
  const qrValue = JSON.stringify({
    id: food.id,
    title: food.title,
    location: food.location,
    provider: food.provider,
    expiresAt: food.expiresAt.toISOString(),
    url: `https://foodshare.campus/food/${food.id}`
  });

  const downloadQR = () => {
    const svg = document.getElementById('qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `food-qr-${food.id}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Food Available: ${food.title}`,
          text: `${food.title} is available for pickup at ${food.location}`,
          url: `https://foodshare.campus/food/${food.id}`
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`https://foodshare.campus/food/${food.id}`);
    }
  };

  return (
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
        className="bg-white rounded-xl max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">QR Code</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
            <QRCode
              id="qr-code"
              value={qrValue}
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Scan to view food details and location
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-gray-900">{food.title}</h3>
            <p className="text-sm text-gray-600">{food.location}</p>
            <p className="text-sm text-gray-600">Provider: {food.provider}</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={downloadQR}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <button
              onClick={shareQR}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QRCodeGenerator;