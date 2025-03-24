
// Define the Category types directly since they don't exist in the Supabase types
export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export type CategoryUpdate = Partial<Omit<Category, 'id' | 'created_at'>>;
export type CategoryInsert = Omit<Category, 'id' | 'created_at'>;
