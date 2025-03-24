
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

export interface OrderWithItems extends Order {
  items: (OrderItem & {
    product_name: string;
    product_image: string;
  })[];
}
