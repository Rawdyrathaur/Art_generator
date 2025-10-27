import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing user session on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('authToken');
      
      if (storedUser && token) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear invalid data
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    }
    setLoading(false);
  };

  // Google OAuth login - Simulated implementation
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Simulate Google OAuth popup behavior
      const shouldProceed = window.confirm(
        'Google Sign-in Simulation\n\n' +
        'This will create a demo Google account for testing.\n' +
        'Click OK to continue or Cancel to use email login instead.'
      );
      
      if (!shouldProceed) {
        return { 
          success: false, 
          error: 'Google sign-in was cancelled. Please use email login.' 
        };
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate random demo Google user data for realistic testing
      const demoUsers = [
        { name: 'Alex Johnson', email: 'alex.johnson.demo@gmail.com' },
        { name: 'Sarah Williams', email: 'sarah.williams.demo@gmail.com' },
        { name: 'Mike Chen', email: 'mike.chen.demo@gmail.com' },
        { name: 'Emma Davis', email: 'emma.davis.demo@gmail.com' },
        { name: 'Google Demo User', email: 'demo.google.user@gmail.com' }
      ];
      
      const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];
      
      const demoGoogleUser = {
        id: generateUserId(),
        email: randomUser.email,
        name: randomUser.name,
        avatar: generateAvatar(randomUser.name),
        provider: 'google',
        joinDate: new Date().toISOString(),
        membership: Math.random() > 0.7 ? 'pro' : 'free', // 30% chance of pro membership
        preferences: {
          theme: 'dark',
          notifications: true,
          autoSave: true
        }
      };
      
      // Check if this Google user already exists
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      const userKey = demoGoogleUser.email.toLowerCase();
      
      // If user doesn't exist, register them
      if (!storedUsers[userKey]) {
        storedUsers[userKey] = {
          ...demoGoogleUser,
          password: 'google_oauth_user' // Special marker for Google users
        };
        localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
      }
      
      // Create user session
      const authToken = generateAuthToken();
      localStorage.setItem('user', JSON.stringify(demoGoogleUser));
      localStorage.setItem('authToken', authToken);
      
      setUser(demoGoogleUser);
      setIsAuthenticated(true);
      
      return { success: true, user: demoGoogleUser };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Email/Password login
  const loginWithEmail = async (email, password) => {
    try {
      setLoading(true);
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Check if user exists in localStorage
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      const userKey = email.toLowerCase();
      
      if (!storedUsers[userKey]) {
        throw new Error('No account found with this email. Please sign up first.');
      }
      
      const storedUser = storedUsers[userKey];
      
      // Verify password (in real app, this would be hashed)
      if (storedUser.password !== password) {
        throw new Error('Invalid password');
      }
      
      // Create user session
      const userData = {
        id: storedUser.id,
        email: storedUser.email,
        name: storedUser.name,
        avatar: storedUser.avatar || generateAvatar(storedUser.name),
        provider: 'email',
        joinDate: storedUser.joinDate,
        membership: storedUser.membership || 'free',
        preferences: storedUser.preferences || {
          theme: 'dark',
          notifications: true,
          autoSave: true
        }
      };
      
      // Store user session
      const authToken = generateAuthToken();
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', authToken);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Email login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email
  const signUpWithEmail = async (email, password, name) => {
    try {
      setLoading(true);
      
      // Validate input
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }
      
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      if (name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters');
      }
      
      // Check if user already exists
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      const userKey = email.toLowerCase();
      
      if (storedUsers[userKey]) {
        throw new Error('An account with this email already exists. Please sign in.');
      }
      
      // Create new user
      const userId = generateUserId();
      const newUser = {
        id: userId,
        email: email.toLowerCase(),
        name: name.trim(),
        password: password, // In real app, this would be hashed
        avatar: generateAvatar(name.trim()),
        provider: 'email',
        joinDate: new Date().toISOString(),
        membership: 'free',
        preferences: {
          theme: 'dark',
          notifications: true,
          autoSave: true
        }
      };
      
      // Store user in registered users
      storedUsers[userKey] = newUser;
      localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
      
      // Create user session
      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        avatar: newUser.avatar,
        provider: 'email',
        joinDate: newUser.joinDate,
        membership: newUser.membership,
        preferences: newUser.preferences
      };
      
      // Store user session
      const authToken = generateAuthToken();
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', authToken);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    try {
      // Clear all auth data
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const updatedUser = { ...user, ...updates };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    loginWithGoogle,
    loginWithEmail,
    signUpWithEmail,
    logout,
    updateProfile,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Utility functions for real authentication
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const generateUserId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const generateAuthToken = () => {
  return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
};

const generateAvatar = (name) => {
  // Generate avatar using UI Avatars service based on user's name
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&size=150&background=667eea&color=fff&font-size=0.6`;
};