import { supabase, toast } from './base';
import type { 
  Order, 
  OrderInsert, 
  OrderItem, 
  OrderItemInsert, 
  OrderWithItems,
  ShippingAddress 
} from '@/types/order';

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
    
    // Cast the shipping_address to our ShippingAddress type
    return {
      ...order,
      items: formattedItems,
      shipping_address: order.shipping_address as unknown as ShippingAddress
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
