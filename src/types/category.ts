
// Define the Category type as a simple interface without Supabase references
export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

// Define types for updating and inserting categories
export type CategoryUpdate = {
  name?: string;
  slug?: string;
};

export type CategoryInsert = {
  name: string;
  slug: string;
};
