
// Define the Category types directly since they don't exist in the Supabase types
export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export type CategoryUpdate = {
  name?: string;
  slug?: string;
};

export type CategoryInsert = {
  name: string;
  slug: string;
};
