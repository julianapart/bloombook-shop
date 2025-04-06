
import type { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

// Address structure with separate fields
export interface StructuredAddress {
  country: string;
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  postalCode: string;
  city: string;
}

// Country code structure for phone numbers
export interface CountryCode {
  code: string;
  name: string;
  flag: string;
}

// Modified to make id required for ProfileUpdate
export interface ProfileUpdate {
  id: string; // id is required
  full_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  address?: StructuredAddress | null;
  updated_at?: string | null;
  role?: string | null;
  country_code?: string | null;
}

// Extended profile type with strict role typing and structured address
export interface ExtendedProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: StructuredAddress | null;
  updated_at: string | null;
  role: 'admin' | 'user';
  country_code?: string | null;
  email?: string;
}
