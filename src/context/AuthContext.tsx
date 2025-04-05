
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';
import type { Profile, ExtendedProfile } from '@/types/profile';
import { useCart } from './CartContext'; // Import useCart to access the cart clearing functionality

// Types
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check auth status and set up listener on mount
  useEffect(() => {
    console.log("Setting up auth state change listener");
    
    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);
        
        // Update state based on session
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Don't check profile inside the listener to avoid potential deadlock
        // Instead, we'll use a setTimeout to defer this operation
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

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log("Existing session check:", existingSession?.user?.email);
      
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        // Check if user is admin
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

  // Login function
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

  // Sign up function
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

  // Logout function
  const logout = async () => {
    try {
      console.log("Attempting to log out");
      setLoading(true);
      
      // If a user is logged in, clear their cart in localStorage
      if (user?.id) {
        localStorage.removeItem(`cart_${user.id}`);
        // Also clear guest cart to prevent showing it after logout
        localStorage.removeItem('cart_guest');
      }
      
      // Clear the auth state first
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      console.log("Logout successful");
      toast.success('Signed out successfully');
      
      // Redirect to home page
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
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
