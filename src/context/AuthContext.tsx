import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';
import type { Profile, ExtendedProfile } from '@/types/profile';

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
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user is admin
          const { data, error } = await supabase
            .from('profiles')
            .select()
            .eq('id', session.user.id)
            .maybeSingle();
              
          if (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
          } else if (data) {
            const profile = data as Profile;
            setIsAdmin(profile.role === 'admin');
            console.log("User profile loaded:", data);
          }
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Existing session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user is admin
        supabase
          .from('profiles')
          .select()
          .eq('id', session.user.id)
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        throw error;
      }
      
      console.log("Login successful for:", data.user?.email);
    } catch (error: any) {
      toast.error(error.message || 'Failed to log in');
      throw error;
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log("Attempting signup for:", email);
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
        throw error;
      }
      
      console.log("Signup response:", data);
      toast.success('Signup successful! Please check your email to confirm your account.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      throw error;
    }
  };

  // Completely revised logout function
  const logout = async () => {
    try {
      console.log("Attempting to log out");
      
      // Clear state first
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      // Simple approach - just sign out
      await supabase.auth.signOut();
      
      console.log("Logout successful, redirecting to home page");
      
      // Use direct window location change instead of navigate
      window.location.href = '/';
    } catch (error: any) {
      console.error("Error during logout:", error);
      toast.error('Failed to log out. Please try again.');
      
      // If there's an error, still try to force clear the session
      try {
        localStorage.removeItem('sb-xqqizxdgulmuhzdqwmyn-auth-token');
        window.location.href = '/';
      } catch (e) {
        console.error("Failed to manually clear session:", e);
      }
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
