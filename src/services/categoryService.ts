
import { supabase, toast } from './base';
import type { Category, CategoryInsert, CategoryUpdate } from '@/types/category';

// Since the categories table doesn't exist in the database schema, 
// we'll use a custom implementation that stores categories in products
export const categoryService = {
  async getAll(): Promise<Category[]> {
    // Get unique categories from products table
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .is('category', 'not.null');
    
    if (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Create category objects from product categories
    const uniqueCategories = [...new Set(data.map(item => item.category))];
    
    return uniqueCategories.map(categoryName => ({
      id: categoryName,
      name: categoryName,
      slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
      created_at: new Date().toISOString()
    }));
  },
  
  async getById(id: string): Promise<Category | null> {
    // Get products with matching category
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('category', id)
      .limit(1);
    
    if (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      toast.error('Failed to load category details');
      return null;
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    
    // Return category object
    return {
      id: id,
      name: data[0].category,
      slug: data[0].category.toLowerCase().replace(/\s+/g, '-'),
      created_at: new Date().toISOString()
    };
  },
  
  async create(category: CategoryInsert): Promise<Category | null> {
    // Since we don't have a categories table, we'll create a dummy product 
    // with this category to ensure it exists
    const { error } = await supabase
      .from('products')
      .insert({
        name: `Category ${category.name}`,
        description: `Products in ${category.name} category`,
        price: 0,
        category: category.name,
        images: []
      });
    
    if (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
      return null;
    }
    
    toast.success('Category created successfully');
    
    return {
      id: category.name,
      name: category.name,
      slug: category.slug,
      created_at: new Date().toISOString()
    };
  },
  
  async update(id: string, category: CategoryUpdate): Promise<Category | null> {
    // Update all products with the old category to use the new category name
    const { error } = await supabase
      .from('products')
      .update({ category: category.name })
      .eq('category', id);
    
    if (error) {
      console.error(`Error updating category with id ${id}:`, error);
      toast.error('Failed to update category');
      return null;
    }
    
    toast.success('Category updated successfully');
    
    return {
      id: category.name || id,
      name: category.name || id,
      slug: category.slug || id.toLowerCase().replace(/\s+/g, '-'),
      created_at: new Date().toISOString()
    };
  },
  
  async delete(id: string): Promise<boolean> {
    // Remove category from all products with this category
    const { error } = await supabase
      .from('products')
      .update({ category: null })
      .eq('category', id);
    
    if (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      toast.error('Failed to delete category');
      return false;
    }
    
    toast.success('Category deleted successfully');
    return true;
  }
};
