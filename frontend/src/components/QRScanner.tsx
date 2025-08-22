import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Camera, 
  Scan, 
  CheckCircle, 
  AlertCircle, 
  Upload,
  Flashlight,
  FlashlightOff
} from 'lucide-react';

interface QRScannerProps {
  onClose: () => void;
  onScanSuccess: (data: any) => void;
  onScanError?: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onClose, onScanSuccess, onScanError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        setHasPermission(true);
        
        // Simulate scanning after 3 seconds
        setTimeout(() => {
          simulateScan();
        }, 3000);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setHasPermission(false);
      onScanError?.('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const simulateScan = () => {
    // Simulate scanning a food QR code
    const mockFoodData = {
      id: 'food_001',
      title: 'Fresh Vegetables',
      provider: 'Raj Restaurant',
      location: 'Near Ruby Bus Stand',
      quantity: 5,
      unit: 'kg',
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      type: 'FOOD_COLLECTION',
      timestamp: new Date().toISOString()
    };

    setScanResult(mockFoodData);
    onScanSuccess(mockFoodData);
    
    // Continue scanning after showing result
    setTimeout(() => {
      setScanResult(null);
      if (isScanning) {
        setTimeout(simulateScan, 3000);
      }
    }, 3000);
  };

  const toggleFlash = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && 'torch' in track.getCapabilities()) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashOn } as any]
          });
          setFlashOn(!flashOn);
        } catch (error) {
          console.error('Flash not supported:', error);
        }
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate processing uploaded QR image
      const mockData = {
        id: 'food_002',
        title: 'Cooked Rice',
        provider: 'Home Kitchen',
        location: 'Sector 15',
        quantity: 3,
        unit: 'servings',
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        type: 'FOOD_COLLECTION',
        timestamp: new Date().toISOString()
      };
      
      setScanResult(mockData);
      onScanSuccess(mockData);
      
      setTimeout(() => setScanResult(null), 3000);
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden m-4"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">📱 Scan Food QR Code</h2>
                <p className="text-green-100 mt-1">Scan to get food details and collect</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Scanner Area */}
            <div className="flex-1 p-6 bg-gray-900 relative min-h-[400px]">
              <div className="relative h-full bg-black rounded-xl overflow-hidden">
                {hasPermission === null && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg mb-4">Ready to scan QR codes</p>
                      <button
                        onClick={startScanning}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
                      >
                        <Scan className="w-5 h-5 mr-2" />
                        Start Scanning
                      </button>
                    </div>
                  </div>
                )}

                {hasPermission === false && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                      <p className="text-lg mb-4">Camera access denied</p>
                      <p className="text-sm text-gray-400 mb-4">
                        Please allow camera permissions and try again
                      </p>
                      <button
                        onClick={startScanning}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}

                {isScanning && (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Scanning Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-64 h-64 border-4 border-green-500 rounded-2xl relative">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl"></div>
                          
                          {/* Scanning Line */}
                          <motion.div
                            className="absolute left-0 right-0 h-1 bg-green-500 shadow-lg"
                            animate={{ y: [0, 256, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                        <p className="text-white text-center mt-4 text-lg font-medium">
                          Position QR code within the frame
                        </p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                      <button
                        onClick={toggleFlash}
                        className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors"
                      >
                        {flashOn ? <FlashlightOff className="w-6 h-6" /> : <Flashlight className="w-6 h-6" />}
                      </button>
                      
                      <button
                        onClick={stopScanning}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Stop Scanning
                      </button>
                    </div>
                  </>
                )}

                {/* Scan Result Overlay */}
                {scanResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-20 left-4 right-4"
                  >
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                        <h4 className="font-semibold text-green-900">Food Found!</h4>
                      </div>
                      <div className="text-sm text-green-800">
                        <p className="font-medium">{scanResult.title}</p>
                        <p>📍 {scanResult.location}</p>
                        <p>⚖️ {scanResult.quantity} {scanResult.unit}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Side Panel */}
            <div className="w-full lg:w-80 p-6 bg-gray-50">
              <div className="space-y-6">
                {/* Upload Option */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📁 Upload QR Image</h3>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload QR Image
                  </button>
                </div>

                {/* Instructions */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">💡 How to scan:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Point camera at food QR code</li>
                    <li>• Keep code within the green frame</li>
                    <li>• Wait for automatic detection</li>
                    <li>• Or upload QR image file</li>
                    <li>• Get food details instantly</li>
                  </ul>
                </div>

                {/* Benefits */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">✨ Benefits:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Verify food authenticity</li>
                    <li>• Get exact location details</li>
                    <li>• Check expiry information</li>
                    <li>• Contact provider directly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QRScanner;
