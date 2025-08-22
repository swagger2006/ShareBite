import React, { useState } from 'react';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { strong } from 'framer-motion/client';

const FirebaseSetupChecker: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const checkFirebaseSetup = async () => {
    setIsChecking(true);
    setResults([]);

    try {
      addResult('🔍 Starting Firebase setup check...');

      // Check Firebase Auth
      addResult('✅ Firebase Auth initialized');
      addResult(`📧 Auth domain: ${auth.app.options.authDomain}`);
      addResult(`🆔 Project ID: ${auth.app.options.projectId}`);

      // Check Firestore
      if (db) {
        addResult('✅ Firestore initialized');
        
        // Try to create a test document
        try {
          const testDocRef = doc(db, 'test', 'setup-check');
          await setDoc(testDocRef, {
            timestamp: new Date(),
            message: 'Setup check test'
          });
          addResult('✅ Firestore write test successful');

          // Try to read the document
          const docSnap = await getDoc(testDocRef);
          if (docSnap.exists()) {
            addResult('✅ Firestore read test successful');
            addResult('🎉 Firestore is working correctly!');
          } else {
            addResult('❌ Firestore read test failed - document not found');
          }
        } catch (firestoreError: any) {
          addResult(`❌ Firestore test failed: ${firestoreError.message}`);
          addResult(`❌ Error code: ${firestoreError.code}`);
          
          if (firestoreError.code === 'permission-denied') {
            addResult('💡 Solution: Update Firestore security rules');
          } else if (firestoreError.code === 'not-found') {
            addResult('💡 Solution: Create Firestore database in Firebase Console');
          } else if (firestoreError.message.includes('400')) {
            addResult('💡 Solution: Check if Firestore database exists in Firebase Console');
          }
        }
      } else {
        addResult('❌ Firestore not initialized');
      }

      // Check project configuration
      const projectId = auth.app.options.projectId;
      if (projectId === 'sharebite-d8f8e') {
        addResult('✅ Project ID matches configuration');
      } else {
        addResult(`⚠️ Project ID mismatch: ${projectId}`);
      }

    } catch (error: any) {
      addResult(`❌ Setup check failed: ${error.message}`);
    } finally {
      setIsChecking(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-red-800 font-semibold mb-3">🔧 Firebase Setup Checker</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={checkFirebaseSetup}
          disabled={isChecking}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isChecking ? 'Checking...' : 'Check Firebase Setup'}
        </button>
        
        <button
          onClick={clearResults}
          className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>

      {results.length > 0 && (
        <div className="bg-white p-3 rounded border max-h-60 overflow-y-auto">
          <h4 className="font-medium text-gray-700 mb-2">Setup Check Results:</h4>
          {results.map((result, index) => (
            <div key={index} className="text-sm text-gray-600 font-mono mb-1">
              {result}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-sm text-red-700">
        <p><strong>Common Firestore Issues:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Database not created:</strong> Go to Firebase Console → Firestore Database → Create database</li>
          <li><strong>Security rules:</strong> Set rules to allow read/write for authenticated users</li>
          <li><strong>Project mismatch:</strong> Verify project ID in Firebase config</li>
          <li><strong>Network issues:</strong> Check internet connection and firewall settings</li>
        </ul>
        
        <div className="mt-3 p-2 bg-red-100 rounded">
          <p><strong>Quick Fix:</strong> If Firestore is not working, registration will still work using local storage as fallback!</p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetupChecker;
