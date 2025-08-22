import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const FirebaseStatus: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [firestoreStatus, setFirestoreStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    // Monitor Auth connection
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setAuthStatus('connected');
    }, (error) => {
      console.error('Auth error:', error);
      setAuthStatus('disconnected');
    });

    // Monitor Firestore connection
    let unsubscribeFirestore: (() => void) | null = null;
    
    try {
      // Create a dummy document listener to test Firestore connectivity
      const testDocRef = doc(db, '_test', 'connection');
      unsubscribeFirestore = onSnapshot(
        testDocRef,
        () => {
          setFirestoreStatus('connected');
        },
        (error) => {
          console.warn('Firestore connection error:', error);
          setFirestoreStatus('disconnected');
        }
      );
    } catch (error) {
      console.warn('Failed to set up Firestore listener:', error);
      setFirestoreStatus('disconnected');
    }

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return '🟢';
      case 'disconnected': return '🔴';
      case 'checking': return '🟡';
      default: return '⚪';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'checking': return 'Checking...';
      default: return 'Unknown';
    }
  };

  return (
    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">🔥 Firebase Status</h4>
      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span>Authentication:</span>
          <span className="flex items-center">
            {getStatusIcon(authStatus)} {getStatusText(authStatus)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Firestore Database:</span>
          <span className="flex items-center">
            {getStatusIcon(firestoreStatus)} {getStatusText(firestoreStatus)}
          </span>
        </div>
      </div>
      
      {firestoreStatus === 'disconnected' && (
        <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
          <p className="text-yellow-800">
            ⚠️ Firestore is offline. Google sign-in will still work, but some features may be limited.
          </p>
        </div>
      )}
    </div>
  );
};

export default FirebaseStatus;
