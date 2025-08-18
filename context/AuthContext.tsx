import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  getCurrentUser, 
  subscribeToAuthChanges,
  logOut
} from '../services/auth';

// Define the context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isRegistrationInProgress: boolean;
  signOut: () => Promise<boolean>;
  setRegistrationInProgress: (inProgress: boolean) => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isRegistrationInProgress: false,
  signOut: async () => false,
  setRegistrationInProgress: () => {},
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistrationInProgress, setRegistrationInProgress] = useState(false);

  useEffect(() => {
    // Check for existing user session on mount
    const initialUser = getCurrentUser();
    if (initialUser) {
      setUser(initialUser);
    }

    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges((authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });

    // Set loading to false after a short delay if no user is found
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Clean up subscription and timeout
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Sign out function
  const signOut = async (): Promise<boolean> => {
    try {
      const success = await logOut();
      if (success) {
        setUser(null);
      }
      return success;
    } catch (error) {
      console.error('Error in sign out:', error);
      return false;
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isRegistrationInProgress,
    setRegistrationInProgress,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
