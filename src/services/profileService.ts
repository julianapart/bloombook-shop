
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import type { Profile, ProfileUpdate, ExtendedProfile } from '@/types/profile';

export const profileService = {
  async getCurrentProfile(): Promise<Profile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }
      
      console.log('Fetching profile for user ID:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching current profile:', error);
        toast.error('Failed to load your profile');
        return null;
      }
      
      console.log('Profile data retrieved:', data);
      return data;
    } catch (error) {
      console.error('Unexpected error in getCurrentProfile:', error);
      toast.error('An unexpected error occurred while loading your profile');
      return null;
    }
  },
  
  async updateProfile(profile: ProfileUpdate): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update your profile');
        return null;
      }
      
      toast.success('Profile updated successfully');
      return data;
    } catch (error) {
      console.error('Unexpected error in updateProfile:', error);
      toast.error('An unexpected error occurred while updating your profile');
      return null;
    }
  },
  
  async getAllProfiles(): Promise<ExtendedProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error('Error fetching all profiles:', error);
        toast.error('Failed to load user profiles');
        return [];
      }
      
      // Map profiles to extended profiles
      return (data || []).map(profile => ({
        ...profile,
        role: (profile.role as 'admin' | 'user') || 'user',
      }));
    } catch (error) {
      console.error('Unexpected error in getAllProfiles:', error);
      toast.error('An unexpected error occurred while loading profiles');
      return [];
    }
  },
  
  async setAdminRole(userId: string, isAdmin: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: isAdmin ? 'admin' : 'user' })
        .eq('id', userId);
      
      if (error) {
        console.error(`Error setting admin role for user ${userId}:`, error);
        toast.error('Failed to update user role');
        return false;
      }
      
      toast.success(`User role updated to ${isAdmin ? 'admin' : 'user'}`);
      return true;
    } catch (error) {
      console.error('Unexpected error in setAdminRole:', error);
      toast.error('An unexpected error occurred while updating user role');
      return false;
    }
  }
};
