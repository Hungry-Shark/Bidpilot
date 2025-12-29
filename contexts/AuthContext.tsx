
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // If we are in demo mode, ignore firebase auth state updates to prevent overwriting our fake user
      if (!isDemo) {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [isDemo]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      // Handle Unauthorized Domain (common in preview environments)
      if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-allowed') {
         console.warn("Domain not authorized by Firebase. Switching to Demo Mode.");
         
         const demoUser = {
             uid: 'demo-user-123',
             email: 'demo@bidpilot.ai',
             displayName: 'Demo User',
             photoURL: null,
             emailVerified: true,
             isAnonymous: true,
             metadata: {},
             providerData: [],
             refreshToken: '',
             tenantId: null,
             delete: async () => {},
             getIdToken: async () => 'demo-token',
             getIdTokenResult: async () => ({} as any),
             reload: async () => {},
             toJSON: () => ({}),
             phoneNumber: null,
         } as unknown as User;

         setIsDemo(true);
         setUser(demoUser);
      } else {
        // Only log actual errors
        console.error("Error signing in", error);
        alert(`Login Failed: ${error.message}`);
      }
    }
  };

  const logout = async () => {
    if (isDemo) {
        setIsDemo(false);
        setUser(null);
    } else {
        await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, isDemo }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
