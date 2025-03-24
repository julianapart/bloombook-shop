
import { supabase, toast } from './base';

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
