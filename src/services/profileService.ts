
import { supabase, toast } from './base';
import type { Profile, ProfileUpdate, ExtendedProfile } from '@/types/profile';

export const profileService = {
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
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
    
    return data;
  },
  
  async updateProfile(profile: ProfileUpdate): Promise<Profile | null> {
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
  },
  
  async getAllProfiles(): Promise<ExtendedProfile[]> {
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
  },
  
  async setAdminRole(userId: string, isAdmin: boolean): Promise<boolean> {
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
  }
};
