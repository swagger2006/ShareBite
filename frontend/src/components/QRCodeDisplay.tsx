import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Copy, CheckCircle } from 'lucide-react';
import { FoodItem } from '../types';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  food: FoodItem;
  onClose: () => void;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ food, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');
  const [copied, setCopied] = React.useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code data
  const qrData = JSON.stringify({
    id: food.id,
    title: food.title,
    provider: food.provider,
    location: food.location,
    quantity: food.quantity,
    unit: food.unit,
    expiresAt: food.expiresAt,
    type: 'FOOD_COLLECTION',
    timestamp: new Date().toISOString()
  });

  React.useEffect(() => {
    generateQRCode();
  }, [food]);

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
      // Fallback: create a simple QR-like pattern
      createFallbackQR();
    }
  };

  const createFallbackQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    // Create a simple pattern as fallback
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 300, 300);
    
    ctx.fillStyle = '#1f2937';
    const size = 10;
    
    // Create a simple grid pattern
    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < 30; j++) {
        if ((i + j) % 3 === 0 || (i * j) % 7 === 0) {
          ctx.fillRect(i * size, j * size, size, size);
        }
      }
    }

    // Add corner markers
    ctx.fillRect(0, 0, 70, 70);
    ctx.fillRect(230, 0, 70, 70);
    ctx.fillRect(0, 230, 70, 70);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(20, 20, 30, 30);
    ctx.fillRect(250, 20, 30, 30);
    ctx.fillRect(20, 250, 30, 30);

    setQrCodeUrl(canvas.toDataURL());
  };

  const handleCopyData = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `qr-code-${food.title.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code for ${food.title}`,
          text: `Scan this QR code to collect: ${food.title}`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyData();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">📱 QR Code Generated</h2>
                <p className="text-blue-100 text-sm mt-1">For food collection</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Food Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">{food.title}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>📍 {food.location}</p>
                <p>⚖️ {food.quantity} {food.unit}</p>
                <p>👨‍🍳 {food.provider}</p>
                <p>⏰ Expires: {new Date(food.expiresAt).toLocaleString()}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-xl shadow-lg">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="w-64 h-64 mx-auto"
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-500">Generating QR Code...</div>
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Instructions */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📋 Instructions:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Share this QR code with receivers</li>
                <li>• They can scan it to get food details</li>
                <li>• Use for verification during pickup</li>
                <li>• QR code contains all food information</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                className="flex flex-col items-center p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Download className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Download</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="flex flex-col items-center p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Share2 className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Share</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyData}
                className="flex flex-col items-center p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">Copy Data</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full mt-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QRCodeDisplay;
