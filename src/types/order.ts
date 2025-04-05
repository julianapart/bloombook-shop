
import type { Database } from '@/integrations/supabase/types';

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export type OrderItem = Database['public']['Tables']['order_items']['Row'] & {
  products?: {
    name?: string;
    images?: string[];
  }
};

export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];
export type OrderItemUpdate = Database['public']['Tables']['order_items']['Update'];

// Define the shipping address structure
export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Use Omit to exclude shipping_address from Order and then add it back with the correct type
export interface OrderWithItems extends Omit<Order, 'shipping_address'> {
  shipping_address: ShippingAddress;
  items: (OrderItem & {
    product_name: string;
    product_image: string;
  })[];
}
