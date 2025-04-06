import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';
import type { Profile, ExtendedProfile } from '@/types/profile';
import { useCart } from './CartContext';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const refreshAdminStatus = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .maybeSingle();
        
      if (!error && data) {
        const profile = data as Profile;
        setIsAdmin(profile.role === 'admin');
        console.log("User admin status refreshed:", profile.role === 'admin');
      }
    } catch (err) {
      console.error('Error refreshing admin status:', err);
    }
  };
  
  useEffect(() => {
    console.log("Setting up auth state change listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          setTimeout(async () => {
            try {
              const { data, error } = await supabase
                .from('profiles')
                .select()
                .eq('id', newSession.user.id)
                .maybeSingle();
                
              if (!error && data) {
                const profile = data as Profile;
                setIsAdmin(profile.role === 'admin');
                console.log("User profile loaded:", data);
              }
              
              setLoading(false);
            } catch (err) {
              console.error('Error checking admin status:', err);
              setLoading(false);
            }
          }, 0);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log("Existing session check:", existingSession?.user?.email);
      
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        supabase
          .from('profiles')
          .select()
          .eq('id', existingSession.user.id)
          .maybeSingle()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error checking admin status:', error);
              setIsAdmin(false);
            } else if (data) {
              const profile = data as Profile;
              setIsAdmin(profile.role === 'admin');
              console.log("User profile loaded:", data);
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        setLoading(false);
        throw error;
      }
      
      console.log("Login successful for:", data.user?.email);
    } catch (error: any) {
      toast.error(error.message || 'Failed to log in');
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log("Attempting signup for:", email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error.message);
        setLoading(false);
        throw error;
      }
      
      console.log("Signup response:", data);
      toast.success('Signup successful! Please check your email to confirm your account.');
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting to log out");
      setLoading(true);
      
      if (user?.id) {
        localStorage.removeItem(`cart_${user.id}`);
        localStorage.removeItem('cart_guest');
      }
      
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      await supabase.auth.signOut();
      
      console.log("Logout successful");
      toast.success('Signed out successfully');
      
      window.location.href = '/';
    } catch (error: any) {
      console.error("Error during logout:", error);
      toast.error('Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isAdmin,
    loading,
    login,
    signUp,
    logout,
    refreshAdminStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
