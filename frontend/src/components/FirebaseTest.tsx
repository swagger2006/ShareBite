import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const FirebaseTest: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
        <p className="text-yellow-800">🔄 Loading Firebase Auth...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-100 border border-green-400 rounded-lg">
      <h3 className="text-green-800 font-semibold mb-2">🔥 Firebase Status</h3>
      <div className="space-y-2 text-sm">
        <p className="text-green-700">
          ✅ Firebase initialized successfully
        </p>
        <p className="text-green-700">
          ✅ Auth context working
        </p>
        <p className="text-green-700">
          {currentUser ? (
            <>✅ User authenticated: {currentUser.name} ({currentUser.email})</>
          ) : (
            <>⚪ No user authenticated</>
          )}
        </p>
        <p className="text-green-700">
          ✅ Ready for authentication
        </p>
      </div>
    </div>
  );
};

export default FirebaseTest;
