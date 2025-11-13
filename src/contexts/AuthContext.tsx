// import React, { createContext, useContext, useState, useEffect } from "react";
// import { User } from "../lib/types";
// import { authApi } from "../lib/mockApi";

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string, name: string) => Promise<void>;
//   logout: () => Promise<void>;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check for existing session
//     const initAuth = async () => {
//       try {
//         const savedToken = localStorage.getItem("wattwise_token");
//         if (savedToken) {
//           setToken(savedToken);
//           const currentUser = await authApi.getCurrentUser();
//           setUser(currentUser);
//         }
//       } catch (error) {
//         console.error("Auth initialization failed:", error);
//         localStorage.removeItem("wattwise_token");
//       } finally {
//         setLoading(false);
//       }
//     };

//     initAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const { user, token } = await authApi.login(email, password);
//       setUser(user);
//       setToken(token);
//       localStorage.setItem("wattwise_token", token);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const register = async (email: string, password: string, name: string) => {
//     try {
//       const { user, token } = await authApi.register(email, password, name);
//       setUser(user);
//       setToken(token);
//       localStorage.setItem("wattwise_token", token);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await authApi.logout();
//       setUser(null);
//       setToken(null);
//       localStorage.removeItem("wattwise_token");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   const value: AuthContextType = {
//     user,
//     token,
//     loading,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!user && !!token,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../lib/types";
import { authApi } from "../lib/mockApi";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void; // Allow partial updates
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on init
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem("wattwise_token");
        const savedUser = localStorage.getItem("wattwise_user");
        
        if (savedToken && savedUser) {
          setToken(savedToken);
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          // Verify token is still valid
          try {
            const currentUser = await authApi.getCurrentUser();
            setUser(currentUser);
            localStorage.setItem("wattwise_user", JSON.stringify(currentUser));
          } catch (error) {
            console.error("Token validation failed:", error);
            // Token is invalid, clear storage
            localStorage.removeItem("wattwise_token");
            localStorage.removeItem("wattwise_user");
            setUser(null);
            setToken(null);
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        localStorage.removeItem("wattwise_token");
        localStorage.removeItem("wattwise_user");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Update user function with partial updates support
  const updateUser = (updatedUser: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser;
      
      const newUser = { ...prevUser, ...updatedUser };
      
      // Update localStorage
      try {
        localStorage.setItem("wattwise_user", JSON.stringify(newUser));
      } catch (error) {
        console.error("Failed to update user in localStorage:", error);
      }
      
      return newUser;
    });
  };

  const login = async (email: string, password: string) => {
    try {
      const { user, token } = await authApi.login(email, password);
      setUser(user);
      setToken(token);
      localStorage.setItem("wattwise_token", token);
      localStorage.setItem("wattwise_user", JSON.stringify(user));
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { user, token } = await authApi.register(email, password, name);
      setUser(user);
      setToken(token);
      localStorage.setItem("wattwise_token", token);
      localStorage.setItem("wattwise_user", JSON.stringify(user));
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("wattwise_token");
      localStorage.removeItem("wattwise_user");
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};