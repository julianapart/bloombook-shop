
import { supabase, toast } from './base';
import type { Category, CategoryInsert, CategoryUpdate, CategoryRpcResponse } from '@/types/category';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    // Using RPC for categories
    const { data, error } = await supabase
      .rpc('get_all_categories') as { data: CategoryRpcResponse, error: any };
    
    if (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    return Array.isArray(data) ? data as Category[] : [data as Category];
  },
  
  async getById(id: string): Promise<Category | null> {
    // Using RPC for getting a single category
    const { data, error } = await supabase
      .rpc('get_category_by_id', { category_id: id }) as { data: CategoryRpcResponse, error: any };
    
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
      return data.length > 0 ? (data[0] as Category) : null;
    }
    
    return data as Category;
  },
  
  async create(category: CategoryInsert): Promise<Category | null> {
    // Using RPC to create a category
    const { data, error } = await supabase
      .rpc('create_category', { 
        category_name: category.name,
        category_slug: category.slug
      }) as { data: CategoryRpcResponse, error: any };
    
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
      return data.length > 0 ? (data[0] as Category) : null;
    }
    
    return data as Category;
  },
  
  async update(id: string, category: CategoryUpdate): Promise<Category | null> {
    // Using RPC to update a category
    const { data, error } = await supabase
      .rpc('update_category', { 
        category_id: id,
        category_name: category.name || null,
        category_slug: category.slug || null
      }) as { data: CategoryRpcResponse, error: any };
    
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
      return data.length > 0 ? (data[0] as Category) : null;
    }
    
    return data as Category;
  },
  
  async delete(id: string): Promise<boolean> {
    // Using RPC to delete a category
    const { data, error } = await supabase
      .rpc('delete_category', { category_id: id }) as { data: boolean | null, error: any };
    
    if (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      toast.error('Failed to delete category');
      return false;
    }
    
    toast.success('Category deleted successfully');
    return !!data;
  }
};
