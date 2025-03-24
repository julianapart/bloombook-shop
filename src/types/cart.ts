
import type { Database } from '@/integrations/supabase/types';
import type { Product } from './product';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}
