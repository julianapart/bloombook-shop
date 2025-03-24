
// Define category types directly instead of using Database types
// since they're not properly reflected in the Supabase types

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface CategoryInsert {
  name: string;
  slug: string;
}

export interface CategoryUpdate {
  name?: string;
  slug?: string;
}
