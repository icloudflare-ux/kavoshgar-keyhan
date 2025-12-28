
import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import { User, SubscriptionTier } from '../types';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isSubscriptionModalOpen: boolean;
  openSubscriptionModal: () => void;
  closeSubscriptionModal: () => void;
  upgradeToPremium: () => void;
  isConfirmationVisible: boolean;
  closeConfirmation: () => void;
  sessionLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapSessionToAppUser = (session: Session): User => {
    const supabaseUser = session.user;
    // Mimic the previous special user logic for premium access
    const isSpecialUser = supabaseUser.email?.toLowerCase().includes('morteza');
    const subscriptionTier: SubscriptionTier = isSpecialUser ? 'premium' : 'free';
    
    return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        username: supabaseUser.email?.split('@')[0] || 'User',
        subscription: subscriptionTier
    };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);

  const isAuthenticated = !!user;
  const prevIsAuthenticated = useRef(isAuthenticated);

  useEffect(() => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          const appUser = session ? mapSessionToAppUser(session) : null;
          setUser(appUser);
          setSessionLoading(false);
      });

      // Check initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
          const appUser = session ? mapSessionToAppUser(session) : null;
          setUser(appUser);
          setSessionLoading(false);
      });

      return () => {
          subscription.unsubscribe();
      };
  }, []);

  // Effect to scroll to profile manager on login
  useEffect(() => {
    if (isAuthenticated && !prevIsAuthenticated.current) {
        setTimeout(() => {
            const profileManagerEl = document.getElementById('profile-manager-anchor');
            profileManagerEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add a highlight effect
            const cardElement = profileManagerEl?.firstElementChild;
            if (cardElement) {
                cardElement.classList.add('highlight-card-pulse');
                setTimeout(() => {
                    cardElement.classList.remove('highlight-card-pulse');
                }, 1500);
            }
        }, 800); // Delay to allow page to render
    }
    prevIsAuthenticated.current = isAuthenticated;
  }, [isAuthenticated]);

  const isPremium = true; // Temporary unlock as requested by user
  
  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin, // Redirect to the app's base URL
    });
    if (error) throw error;
  };

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);
  
  const openSubscriptionModal = () => {
    if (user?.username.toLowerCase() === 'morteza') {
        return;
    }
    setSubscriptionModalOpen(true);
  }
  const closeSubscriptionModal = () => setSubscriptionModalOpen(false);
  
  const upgradeToPremium = () => {
    if (user) {
        const upgradedUser = { ...user, subscription: 'premium' as SubscriptionTier };
        setUser(upgradedUser);
        closeSubscriptionModal();
        setConfirmationVisible(true);
    }
  };
  
  const closeConfirmation = () => setConfirmationVisible(false);

  return (
    <AuthContext.Provider value={{ 
        user, 
        isAuthenticated,
        isPremium,
        signInWithPassword,
        signUp,
        logout,
        resetPassword,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isSubscriptionModalOpen,
        openSubscriptionModal,
        closeSubscriptionModal,
        upgradeToPremium,
        isConfirmationVisible,
        closeConfirmation,
        sessionLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};