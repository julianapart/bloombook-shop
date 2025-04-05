
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, Truck, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Separator } from "@/components/ui/separator";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types/order';

const MyOrders = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/my-orders' } } });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch orders when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const orderData = await orderService.getMyOrders();
      setOrders(orderData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load your orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Format price
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get appropriate status icon and color
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'processing':
        return { icon: <Package className="h-4 w-4" />, color: 'bg-blue-500' };
      case 'shipped':
        return { icon: <Truck className="h-4 w-4" />, color: 'bg-indigo-500' };
      case 'delivered':
        return { icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-500' };
      case 'cancelled':
        return { icon: <AlertCircle className="h-4 w-4" />, color: 'bg-red-500' };
      default:
        return { icon: <Package className="h-4 w-4" />, color: 'bg-bloombook-500' };
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading authentication status...</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Authenticated but order loading state
  if (isAuthenticated && isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl font-serif font-medium text-bloombook-900 mb-6 flex items-center">
            <ShoppingBag className="mr-3 h-6 w-6 text-bloombook-700" />
            My Orders
          </h1>
          <Separator className="mb-6" />
          
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="bg-bloombook-50">
                  <div className="flex flex-wrap justify-between gap-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-serif font-medium text-bloombook-900 mb-6 flex items-center">
          <ShoppingBag className="mr-3 h-6 w-6 text-bloombook-700" />
          My Orders
        </h1>
        <Separator className="mb-6" />
        
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusIndicator(order.status);
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-bloombook-50">
                    <div className="flex flex-wrap justify-between gap-4">
                      <div>
                        <p className="text-sm text-bloombook-500">Order ID</p>
                        <p className="font-medium">{order.id.substring(0, 8)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-bloombook-500">Date Placed</p>
                        <p className="font-medium">
                          {order.created_at ? format(new Date(order.created_at), 'MMM d, yyyy') : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-bloombook-500">Status</p>
                        <Badge 
                          className="mt-1"
                          variant="outline"
                        >
                          <span className={`w-2 h-2 rounded-full ${statusInfo.color} mr-2`} />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-bloombook-500 text-sm">Order Total</p>
                        <p className="text-lg font-medium text-bloombook-900">{formatPrice(order.total_amount)}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-bloombook-300 mb-4" />
            <h2 className="text-xl font-medium text-bloombook-900 mb-2">No orders yet</h2>
            <p className="text-bloombook-500 mb-6">When you place orders, they will appear here.</p>
            <Button asChild className="bg-bloombook-600 hover:bg-bloombook-700">
              <a href="/shop">Start Shopping</a>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
