import React, { useState } from 'react';
import { registerWithEmailAndPassword, RegisterData } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const RegistrationDebug: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const { setCurrentUser } = useAuth();

  const [testData, setTestData] = useState<RegisterData>({
    email: 'test@example.com',
    password: 'test123456',
    name: 'Test User',
    phone: '+1234567890',
    role: 'Receiver',
    organization: ''
  });

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const testRegistration = async () => {
    setIsLoading(true);
    setDebugInfo([]);
    
    try {
      addDebugInfo('Starting registration test...');
      
      // Validate form data
      if (!testData.email || !testData.password || !testData.name) {
        addDebugInfo('❌ Missing required fields');
        return;
      }
      
      addDebugInfo('✅ Form data validated');
      addDebugInfo(`📧 Email: ${testData.email}`);
      addDebugInfo(`👤 Name: ${testData.name}`);
      addDebugInfo(`📱 Phone: ${testData.phone}`);
      addDebugInfo(`🏷️ Role: ${testData.role}`);
      
      addDebugInfo('🚀 Calling registerWithEmailAndPassword...');
      const user = await registerWithEmailAndPassword(testData);
      
      addDebugInfo(`✅ Registration successful: ${user.email}`);
      addDebugInfo(`✅ User ID: ${user.id}`);
      addDebugInfo(`✅ User Role: ${user.role}`);
      
      setCurrentUser(user);
      
    } catch (error: any) {
      addDebugInfo(`❌ Registration failed: ${error.message}`);
      addDebugInfo(`❌ Error code: ${error.code || 'unknown'}`);
      console.error('Registration Debug Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearDebugInfo = () => {
    setDebugInfo([]);
  };

  const generateRandomEmail = () => {
    const timestamp = Date.now();
    setTestData(prev => ({
      ...prev,
      email: `test${timestamp}@example.com`
    }));
  };

  return (
    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
      <h3 className="text-purple-800 font-semibold mb-3">🧪 Registration Debug Tool</h3>
      
      {/* Test Data Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={testData.email}
            onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={testData.password}
            onChange={(e) => setTestData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={testData.name}
            onChange={(e) => setTestData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={testData.phone}
            onChange={(e) => setTestData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
          <select
            value={testData.role}
            onChange={(e) => setTestData(prev => ({ ...prev, role: e.target.value as any }))}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          >
            <option value="Provider">Provider</option>
            <option value="Receiver">Receiver</option>
            <option value="Donor">Donor</option>
            <option value="NGO">NGO</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Organization</label>
          <input
            type="text"
            value={testData.organization || ''}
            onChange={(e) => setTestData(prev => ({ ...prev, organization: e.target.value }))}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 mb-4">
        <div className="flex gap-2">
          <button
            onClick={testRegistration}
            disabled={isLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? 'Testing...' : 'Test Registration'}
          </button>
          
          <button
            onClick={generateRandomEmail}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm"
          >
            Random Email
          </button>
          
          <button
            onClick={clearDebugInfo}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm"
          >
            Clear Log
          </button>
        </div>
      </div>

      {/* Debug Log */}
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

      <div className="mt-4 text-sm text-purple-700">
        <p><strong>Test Steps:</strong></p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Click "Random Email" to generate unique email</li>
          <li>Modify test data if needed</li>
          <li>Click "Test Registration"</li>
          <li>Check debug log for detailed steps</li>
          <li>Check browser console for additional errors</li>
        </ol>
      </div>
    </div>
  );
};

export default RegistrationDebug;
