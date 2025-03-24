
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

// Define a type for RPC function responses
export type CategoryRpcResponse = Category | Category[] | null;
