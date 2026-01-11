import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Set the base URL for API requests - using proxy in vite.config.js
axios.defaults.baseURL = ''; // Empty string since we're using proxy for /api requests

interface User {
  _id: string;
  userId: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  profileDetails?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    licenseNumber?: string;
  };
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  register: (username: string, email: string, password: string, profileDetails?: any, avatar?: File) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Set axios defaults to include user info in headers
        axios.defaults.headers.common['user-id'] = parsedUser._id;
        axios.defaults.headers.common['user-role'] = parsedUser.role;
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const userData: User = response.data;
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Set axios defaults to include user info in headers
      axios.defaults.headers.common['user-id'] = userData._id;
      axios.defaults.headers.common['user-role'] = userData.role;
      
      return { success: true, user: userData };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (username: string, email: string, password: string, profileDetails?: any, avatar?: File) => {
    try {
      if (avatar) {
        // Use FormData to handle file upload
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('profileDetails', JSON.stringify(profileDetails));
        formData.append('avatar', avatar);
        
        const response = await axios.post('/api/auth/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        const userData: User = response.data;
        
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        // Set axios defaults to include user info in headers
        axios.defaults.headers.common['user-id'] = userData._id;
        axios.defaults.headers.common['user-role'] = userData.role;
        
        return { success: true, user: userData };
      } else {
        // Regular registration without avatar
        const response = await axios.post('/api/auth/register', { username, email, password, profileDetails });
        const userData: User = response.data;
        
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        // Set axios defaults to include user info in headers
        axios.defaults.headers.common['user-id'] = userData._id;
        axios.defaults.headers.common['user-role'] = userData.role;
        
        return { success: true, user: userData };
      }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    
    // Clear axios headers
    delete axios.defaults.headers.common['user-id'];
    delete axios.defaults.headers.common['user-role'];
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};