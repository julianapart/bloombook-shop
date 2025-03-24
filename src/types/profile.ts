
import type { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Extended profile type with strict role typing
export interface ExtendedProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  updated_at: string | null;
  role: 'admin' | 'user';
  email?: string;
}
