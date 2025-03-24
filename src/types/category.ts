
// Type for database entity
export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

// Types for updating and inserting categories
export type CategoryUpdate = {
  name?: string;
  slug?: string;
};

export type CategoryInsert = {
  name: string;
  slug: string;
};

// Type for RPC function responses - needed to properly type Supabase RPC calls
export type PostgrestResponse<T> = {
  data: T | null;
  error: any;
};
