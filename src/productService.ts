
import { supabase, toast } from './services/base';
import type { Product, ProductInsert, ProductUpdate } from '@/types/product';

export const productService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      return [];
    }
    
    return data || [];
  },
  
  async getByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', categoryId);
    
    if (error) {
      console.error('Error fetching products by category:', error);
      toast.error('Failed to load products');
      return [];
    }
    
    return data || [];
  },
  
  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      toast.error('Failed to load product details');
      return null;
    }
    
    return data;
  },
  
  async create(product: ProductInsert): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
      return null;
    }
    
    toast.success('Product created successfully');
    return data;
  },
  
  async update(id: string, product: ProductUpdate): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating product with id ${id}:`, error);
      toast.error('Failed to update product');
      return null;
    }
    
    toast.success('Product updated successfully');
    return data;
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      toast.error('Failed to delete product');
      return false;
    }
    
    toast.success('Product deleted successfully');
    return true;
  }
};
