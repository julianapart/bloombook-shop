import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Package, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import type { OrderWithItems, ShippingAddress } from '@/types/order';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/order/${id}` } } });
    }
  }, [isAuthenticated, authLoading, navigate, id]);

  // Fetch order when user is authenticated
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchOrder(id);
    }
  }, [isAuthenticated, id]);

  const fetchOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      const orderData = await orderService.getOrderWithItems(orderId);
      if (!orderData) {
        toast.error('Order not found');
        navigate('/my-orders');
        return;
      }
      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
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

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-bloombook-100 text-bloombook-800 border-bloombook-200';
    }
  };

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="mb-6">
            <Link to="/my-orders" className="inline-flex items-center text-bloombook-600 hover:text-bloombook-800 transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Orders
            </Link>
          </div>
          
          <div className="mb-8 flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-24" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="py-4 border-b last:border-0 flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-36" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-bloombook-300 mb-4" />
            <h2 className="text-xl font-medium text-bloombook-900 mb-2">Order not found</h2>
            <p className="text-bloombook-500 mb-6">The order you are looking for does not exist or you don't have permission to view it.</p>
            <Button asChild className="bg-bloombook-600 hover:bg-bloombook-700">
              <Link to="/my-orders">Return to My Orders</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // We now have a properly typed shipping_address
  const shippingAddress = order.shipping_address;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <Link to="/my-orders" className="inline-flex items-center text-bloombook-600 hover:text-bloombook-800 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Orders
          </Link>
        </div>
        
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-bloombook-900 flex items-center">
              Order #{order.id.substring(0, 8)}
            </h1>
            <p className="text-bloombook-500 mt-1">
              Placed on {order.created_at ? format(new Date(order.created_at), 'MMMM d, yyyy') : 'N/A'}
            </p>
          </div>
          
          <Badge className={`text-sm px-3 py-1 ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 border-b border-bloombook-100 last:border-0 flex items-center">
                    <div className="w-16 h-16 bg-bloombook-50 rounded mr-4 overflow-hidden">
                      {item.product_image ? (
                        <img 
                          src={item.product_image} 
                          alt={item.product_name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-full h-full p-3 text-bloombook-300" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-bloombook-900">{item.product_name}</h3>
                      <p className="text-sm text-bloombook-500">
                        Qty: {item.quantity} × {formatPrice(item.price_at_time)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium text-bloombook-900">
                        {formatPrice(item.price_at_time * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 pt-4 border-t border-bloombook-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-bloombook-500">Subtotal</span>
                    <span className="font-medium">{formatPrice(order.total_amount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-bloombook-500">Shipping</span>
                    <span className="font-medium">Included</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-bloombook-100">
                    <span className="font-medium text-lg">Total</span>
                    <span className="font-medium text-lg">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-bloombook-500 mb-1 flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> Order Status
                  </h3>
                  <p className="font-medium">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-bloombook-500 mb-1 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> Shipping Address
                  </h3>
                  {shippingAddress && (
                    <div>
                      <p className="font-medium">{shippingAddress.name}</p>
                      <p>{shippingAddress.street}</p>
                      <p>
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                      </p>
                      <p>{shippingAddress.country}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Button 
              variant="outline"
              className="w-full"
              asChild
            >
              <Link to="/contact">Need Help?</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
