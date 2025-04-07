import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import type { Profile, ProfileUpdate, ExtendedProfile, StructuredAddress } from '@/types/profile';

export const profileService = {
  async getCurrentProfile(): Promise<Profile | null> {
    try {
      // Get the current user directly from auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }
      
      const userId = user.id;
      console.log('Fetching profile for user ID:', userId);
      
      // Use single to get a single profile record
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        // If the error is "No rows found", it means the profile doesn't exist yet
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile');
          
          // Create a basic profile for the user
          // Note: id is required and non-optional when inserting
          const newProfile = {
            id: userId,
            full_name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url || null,
            role: 'user',
            address: null, // Initialize with null
            country_code: null // Add country code field
          };
          
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();
          
          if (createError) {
            console.error('Error creating profile:', createError);
            toast.error('Failed to create your profile');
            return null;
          }
          
          return { ...createdProfile, country_code: null, email: user.email };
        }
        
        console.error('Error fetching current profile:', error);
        toast.error('Failed to load your profile');
        return null;
      }
      
      console.log('Profile data retrieved:', data);
      
      // Handle address field conversion if needed
      const fetchedProfile = data as Profile;
      
      // Convert address string to structured format if needed
      if (fetchedProfile.address) {
        if (typeof fetchedProfile.address === 'string') {
          try {
            // Try to parse it as JSON if it's stored that way
            const parsedAddress = JSON.parse(fetchedProfile.address as string);
            fetchedProfile.address = parsedAddress as unknown as any;
          } catch (e) {
            // If parsing fails, create an empty structured address
            fetchedProfile.address = {
              country: "",
              street: "",
              houseNumber: "",
              postalCode: "",
              city: ""
            } as unknown as any;
          }
        }
      }
      
      return { ...fetchedProfile, country_code: fetchedProfile.country_code, email: user.email };
    } catch (error) {
      console.error('Unexpected error in getCurrentProfile:', error);
      toast.error('An unexpected error occurred while loading your profile');
      return null;
    }
  },
  
  async updateProfile(profile: ProfileUpdate): Promise<Profile | null> {
    try {
      // Ensure id is provided and is not optional for the update operation
      if (!profile.id) {
        console.error('Profile ID is required for updating');
        toast.error('Cannot update profile: Missing ID');
        return null;
      }

      // Create a copy of the profile object to manipulate before sending to Supabase
      const profileToUpdate: any = { ...profile };
      
      // For Supabase, we need to convert the structured address to a string or JSON
      if (profileToUpdate.address && typeof profileToUpdate.address === 'object') {
        profileToUpdate.address = JSON.stringify(profileToUpdate.address);
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(profileToUpdate)
        .eq('id', profile.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update your profile');
        return null;
      }
      
      // Convert address back to structured format if it's a string
      const updatedProfile = data as Profile;
      if (updatedProfile && updatedProfile.address && typeof updatedProfile.address === 'string') {
        try {
          updatedProfile.address = JSON.parse(updatedProfile.address) as unknown as any;
        } catch (e) {
          // If parsing fails, keep as is
        }
      }
      
      toast.success('Profile updated successfully');
      return { ...updatedProfile, country_code: updatedProfile.country_code };
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
      
      // Map profiles to extended profiles with proper typing
      return (data || []).map(profile => {
        // Convert address to structured format if needed
        let structuredAddress: StructuredAddress | null = null;
        
        if (profile.address) {
          if (typeof profile.address === 'string') {
            try {
              // Try to parse it as JSON if it's stored that way
              structuredAddress = JSON.parse(profile.address) as StructuredAddress;
            } catch (e) {
              // If parsing fails, create an empty structured address
              structuredAddress = {
                country: "",
                street: "",
                houseNumber: "",
                postalCode: "",
                city: ""
              };
            }
          } else if (typeof profile.address === 'object') {
            // It's already an object, just cast it
            structuredAddress = profile.address as unknown as StructuredAddress;
          }
        }
        
        const typedProfile = profile as Profile;
        return {
          id: typedProfile.id,
          full_name: typedProfile.full_name,
          avatar_url: typedProfile.avatar_url,
          phone: typedProfile.phone,
          address: structuredAddress,
          updated_at: typedProfile.updated_at,
          role: (typedProfile.role as 'admin' | 'user') || 'user',
          country_code: typedProfile.country_code,
          email: typedProfile.email
        } as ExtendedProfile;
      });
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
  },
  
  async checkIfAdminExists(): Promise<boolean> {
    try {
      console.log("Checking if any admin user exists...");
      
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('role', 'admin')
        .limit(1);
        
      if (error) {
        console.error('Error checking if admin exists:', error);
        return true; // Default to true on error to prevent unnecessary admin promotion
      }
      
      // Log the result for debugging
      console.log(`Admin check result: found ${count} admins, returning ${(count ?? 0) > 0}`);
      
      // If at least one admin is found, return true
      return (count ?? 0) > 0;
    } catch (error) {
      console.error('Unexpected error in checkIfAdminExists:', error);
      return true; // Default to true on error to prevent unnecessary admin promotion
    }
  }
};
