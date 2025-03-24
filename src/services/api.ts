
import { supabase } from '@/integrations/supabase/client';
import type { Product, ProductInsert, ProductUpdate } from '@/types/product';
import type { Category, CategoryInsert, CategoryUpdate } from '@/types/category';
import type { Order, OrderInsert, OrderItem, OrderItemInsert, OrderWithItems } from '@/types/order';
import type { Profile, ProfileUpdate, ExtendedProfile } from '@/types/profile';
import { toast } from 'sonner';

// Product services
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
      .eq('category_id', categoryId);
    
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

// Category services - Using RPC functions instead of direct table access
export const categoryService = {
  async getAll(): Promise<Category[]> {
    // Using RPC for categories
    const { data, error } = await supabase
      .rpc('get_all_categories');
    
    if (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      return [];
    }
    
    return (data || []) as Category[];
  },
  
  async getById(id: string): Promise<Category | null> {
    // Using RPC for getting a single category
    const { data, error } = await supabase
      .rpc('get_category_by_id', { category_id: id });
    
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
      });
    
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
      });
    
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
      .rpc('delete_category', { category_id: id });
    
    if (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      toast.error('Failed to delete category');
      return false;
    }
    
    toast.success('Category deleted successfully');
    return !!data;
  }
};

// Order services
export const orderService = {
  async getMyOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching my orders:', error);
      toast.error('Failed to load your orders');
      return [];
    }
    
    return data || [];
  },
  
  async getOrderWithItems(orderId: string): Promise<OrderWithItems | null> {
    // First get the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (orderError) {
      console.error(`Error fetching order with id ${orderId}:`, orderError);
      toast.error('Failed to load order details');
      return null;
    }
    
    // Then get the order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products (
          name,
          images
        )
      `)
      .eq('order_id', orderId);
    
    if (itemsError) {
      console.error(`Error fetching items for order ${orderId}:`, itemsError);
      toast.error('Failed to load order items');
      return null;
    }
    
    // Format the items to include product details
    const formattedItems = (orderItems || []).map(item => ({
      ...item,
      product_name: item.products?.name || '',
      product_image: item.products?.images?.[0] || ''
    }));
    
    return {
      ...order,
      items: formattedItems
    };
  },
  
  async createOrder(
    orderData: Omit<OrderInsert, 'id' | 'created_at'>,
    orderItems: Omit<OrderItemInsert, 'id' | 'created_at' | 'order_id'>[]
  ): Promise<Order | null> {
    // Start a transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    
    if (orderError) {
      console.error('Error creating order:', orderError);
      toast.error('Failed to create your order');
      return null;
    }
    
    // Insert order items
    const itemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);
    
    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      toast.error('Failed to add items to your order');
      
      // Try to clean up the order
      await supabase.from('orders').delete().eq('id', order.id);
      return null;
    }
    
    toast.success('Order placed successfully!');
    return order;
  },
  
  async updateOrderStatus(orderId: string, status: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating status for order ${orderId}:`, error);
      toast.error('Failed to update order status');
      return null;
    }
    
    toast.success(`Order status updated to ${status}`);
    return data;
  }
};

// Profile services
export const profileService = {
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching current profile:', error);
      toast.error('Failed to load your profile');
      return null;
    }
    
    return data;
  },
  
  async updateProfile(profile: ProfileUpdate): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update your profile');
      return null;
    }
    
    toast.success('Profile updated successfully');
    return data;
  },
  
  async getAllProfiles(): Promise<ExtendedProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) {
      console.error('Error fetching all profiles:', error);
      toast.error('Failed to load user profiles');
      return [];
    }
    
    // Map profiles to extended profiles
    return (data || []).map(profile => ({
      ...profile,
      role: (profile.role as 'admin' | 'user') || 'user',
    }));
  },
  
  async setAdminRole(userId: string, isAdmin: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({ role: isAdmin ? 'admin' : 'user' })
      .eq('id', userId);
    
    if (error) {
      console.error(`Error setting admin role for user ${userId}:`, error);
      toast.error('Failed to update user role');
      return false;
    }
    
    toast.success(`User role updated to ${isAdmin ? 'admin' : 'user'}`);
    return true;
  }
};

// Create a payment processing edge function
export const paymentService = {
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<{ clientSecret: string } | null> {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: { amount, currency }
    });
    
    if (error) {
      console.error('Error creating payment intent:', error);
      toast.error('Failed to initialize payment');
      return null;
    }
    
    return data;
  }
};
