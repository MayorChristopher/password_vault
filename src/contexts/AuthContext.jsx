import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('vault_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('vault_user');
      }
    }
    setLoading(false);
  }, []);

  // Helper function to get registered users
  const getRegisteredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('vault_registered_users') || '[]');
    } catch (error) {
      return [];
    }
  };

  // Helper function to save registered users
  const saveRegisteredUsers = (users) => {
    localStorage.setItem('vault_registered_users', JSON.stringify(users));
  };

  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get registered users
      const registeredUsers = getRegisteredUsers();

      // Find user by email
      const user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        throw new Error('User not found. Please register first.');
      }

      // Validate password (in a real app, this would be hashed)
      if (user.password !== password) {
        throw new Error('Invalid password.');
      }

      // Create user session data (without password)
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        twoFactorEnabled: user.twoFactorEnabled || false,
        createdAt: user.createdAt
      };

      setUser(userData);
      localStorage.setItem('vault_user', JSON.stringify(userData));

      // Log activity
      const activities = JSON.parse(localStorage.getItem('vault_activities') || '[]');
      activities.unshift({
        id: Date.now().toString(),
        action: 'Login',
        details: 'User logged in successfully',
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.1',
        userAgent: navigator.userAgent.substring(0, 50) + '...'
      });
      localStorage.setItem('vault_activities', JSON.stringify(activities.slice(0, 100)));

      toast({
        title: "Login Successful",
        description: "Welcome back to SecureVault",
      });

      return { success: true };
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, confirmPassword) => {
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get existing users
      const registeredUsers = getRegisteredUsers();

      // Check if user already exists
      const existingUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        password: password, // In a real app, this would be hashed
        name: email.split('@')[0],
        twoFactorEnabled: false,
        createdAt: new Date().toISOString()
      };

      // Add to registered users
      registeredUsers.push(newUser);
      saveRegisteredUsers(registeredUsers);

      // Create user session data (without password)
      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        twoFactorEnabled: newUser.twoFactorEnabled,
        createdAt: newUser.createdAt
      };

      setUser(userData);
      localStorage.setItem('vault_user', JSON.stringify(userData));

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully",
      });

      return { success: true };
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vault_user');

    // Log activity
    const activities = JSON.parse(localStorage.getItem('vault_activities') || '[]');
    activities.unshift({
      id: Date.now().toString(),
      action: 'Logout',
      details: 'User logged out',
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1',
      userAgent: navigator.userAgent.substring(0, 50) + '...'
    });
    localStorage.setItem('vault_activities', JSON.stringify(activities.slice(0, 100)));

    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const forgotPassword = async (email) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists
      const registeredUsers = getRegisteredUsers();
      const user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        throw new Error('No account found with this email address');
      }

      toast({
        title: "Reset Link Sent",
        description: "Password reset instructions have been sent to your email",
      });

      return { success: true };
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}