
import type { Database } from '@/integrations/supabase/types';

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
