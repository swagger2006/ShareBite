import React, { useState } from 'react';
import { signInWithGoogle } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const GoogleAuthDebug: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const { setCurrentUser } = useAuth();

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const testGoogleAuth = async () => {
    setIsLoading(true);
    setDebugInfo([]);
    
    try {
      addDebugInfo('Starting Google authentication test...');
      
      // Check browser compatibility
      if (typeof window === 'undefined') {
        addDebugInfo('❌ Window object not available');
        return;
      }
      
      addDebugInfo('✅ Browser environment detected');
      
      // Check HTTPS/localhost
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      addDebugInfo(`${isSecure ? '✅' : '❌'} Secure context: ${window.location.protocol}//${window.location.hostname}`);
      
      // Check popup blocker
      addDebugInfo('🔍 Testing popup capability...');
      const testPopup = window.open('', '_blank', 'width=1,height=1');
      if (testPopup) {
        testPopup.close();
        addDebugInfo('✅ Popups are allowed');
      } else {
        addDebugInfo('❌ Popups may be blocked');
      }
      
      addDebugInfo('🚀 Attempting Google sign-in...');
      const user = await signInWithGoogle();
      
      addDebugInfo(`✅ Google sign-in successful: ${user.email}`);
      setCurrentUser(user);
      
    } catch (error: any) {
      addDebugInfo(`❌ Error: ${error.message}`);
      addDebugInfo(`❌ Error code: ${error.code || 'unknown'}`);
      console.error('Google Auth Debug Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearDebugInfo = () => {
    setDebugInfo([]);
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-blue-800 font-semibold mb-3">🔍 Google Auth Debug Tool</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testGoogleAuth}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Testing...' : 'Test Google Auth'}
        </button>
        
        <button
          onClick={clearDebugInfo}
          className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Clear Log
        </button>
      </div>

      {debugInfo.length > 0 && (
        <div className="bg-white p-3 rounded border max-h-40 overflow-y-auto">
          <h4 className="font-medium text-gray-700 mb-2">Debug Log:</h4>
          {debugInfo.map((info, index) => (
            <div key={index} className="text-sm text-gray-600 font-mono">
              {info}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-sm text-blue-700">
        <p><strong>Common Issues & Solutions:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Cross-Origin-Opener-Policy warnings:</strong> These are normal and don't affect functionality</li>
          <li><strong>Firestore offline errors:</strong> Check internet connection or try refreshing</li>
          <li><strong>Popup blockers:</strong> Allow popups for localhost in browser settings</li>
          <li><strong>Domain not authorized:</strong> Add localhost to Firebase authorized domains</li>
          <li><strong>Third-party cookies:</strong> Enable in browser privacy settings</li>
        </ul>

        <div className="mt-3 p-2 bg-blue-100 rounded">
          <p><strong>✅ Good News:</strong> If you see "Google sign-in successful" in the log, the authentication is working!
          Firestore errors are handled gracefully and won't prevent sign-in.</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthDebug;
