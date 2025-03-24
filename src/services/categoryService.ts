
import { supabase, toast } from './base';
import type { Category, CategoryInsert, CategoryUpdate, PostgrestResponse } from '@/types/category';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    // Using RPC for categories
    const { data, error } = await supabase
      .from('categories')
      .select('*') as PostgrestResponse<Category[]>;
    
    if (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    return Array.isArray(data) ? data : [data];
  },
  
  async getById(id: string): Promise<Category | null> {
    // Using RPC for getting a single category
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id) as PostgrestResponse<Category[]>;
    
    if (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      toast.error('Failed to load category details');
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    // Handle possible array or single object response
    if (Array.isArray(data)) {
      return data.length > 0 ? data[0] : null;
    }
    
    return data as Category;
  },
  
  async create(category: CategoryInsert): Promise<Category | null> {
    // Using direct table insertion instead of RPC
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single() as PostgrestResponse<Category>;
    
    if (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    toast.success('Category created successfully');
    
    // Handle possible array or single object response
    if (Array.isArray(data)) {
      return data.length > 0 ? data[0] : null;
    }
    
    return data;
  },
  
  async update(id: string, category: CategoryUpdate): Promise<Category | null> {
    // Using direct table update instead of RPC
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single() as PostgrestResponse<Category>;
    
    if (error) {
      console.error(`Error updating category with id ${id}:`, error);
      toast.error('Failed to update category');
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    toast.success('Category updated successfully');
    
    // Handle possible array or single object response
    if (Array.isArray(data)) {
      return data.length > 0 ? data[0] : null;
    }
    
    return data;
  },
  
  async delete(id: string): Promise<boolean> {
    // Using direct table deletion instead of RPC
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      toast.error('Failed to delete category');
      return false;
    }
    
    toast.success('Category deleted successfully');
    return true;
  }
};
