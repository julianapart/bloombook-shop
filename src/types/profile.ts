
import type { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

// Modified to make id required for ProfileUpdate
export interface ProfileUpdate {
  id: string; // id is required
  full_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  address?: string | null;
  updated_at?: string | null;
  role?: string | null;
}

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
