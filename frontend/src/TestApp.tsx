import React, { useState } from 'react';
import { User } from './types';

function TestApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = () => {
    const userData = {
      id: Date.now().toString(),
      name: 'Test User',
      email: 'test@example.com',
      phone: '',
      role: 'Individual',
      organization: '',
      verified: true,
      joinedAt: new Date(),
      points: 0,
      level: 1,
      badges: [],
      preferences: {
        dietary: [],
        notifications: true,
        radius: 5
      },
      stats: {
        foodListed: 0,
        foodCollected: 0,
        impactScore: 0
      }
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Food Waste App - Test</h1>
      
      {currentUser ? (
        <div>
          <h2>Welcome {currentUser.name}!</h2>
          <p>Email: {currentUser.email}</p>
          <p>Role: {currentUser.role}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Please Login</h2>
          <button onClick={handleLogin}>Test Login</button>
        </div>
      )}
    </div>
  );
}

export default TestApp;
