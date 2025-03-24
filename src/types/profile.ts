
import type { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Extended profile type with strict role typing
export interface ExtendedProfile extends Omit<Profile, 'role'> {
  role: 'admin' | 'user';
  email?: string;
}
