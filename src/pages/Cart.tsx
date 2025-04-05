
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartItem from '@/components/CartItem';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!loading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
    }
  }, [isAuthenticated, loading, navigate]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="mb-6">
            <Link to="/shop/all" className="inline-flex items-center text-bloombook-600 hover:text-bloombook-800 transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-serif font-medium text-bloombook-900 mb-6 flex items-center">
            <ShoppingBag className="mr-3 h-6 w-6 text-bloombook-700" />
            Your Cart
            <span className="ml-4 text-sm font-normal text-bloombook-600">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
          </h1>
          
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-bloombook-100 overflow-hidden">
                  <div className="p-4 md:p-6">
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        price={item.price}
                        quantity={item.quantity}
                        imageSrc={item.imageSrc}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </div>
                  
                  <div className="p-4 md:p-6 bg-bloombook-50 border-t border-bloombook-100 flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={() => clearCart()}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-lg shadow-sm border border-bloombook-100 p-4 md:p-6 sticky top-24">
                  <h2 className="text-lg font-medium text-bloombook-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-bloombook-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-bloombook-600">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-bloombook-600">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-medium text-lg text-bloombook-900 mb-6">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-bloombook-600 hover:bg-bloombook-700"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <div className="mt-6 text-center">
                    <p className="text-xs text-bloombook-500">
                      Secure checkout powered by Stripe
                    </p>
                    <div className="flex justify-center space-x-2 mt-2">
                      <img src="/visa.svg" alt="Visa" className="h-6" />
                      <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
                      <img src="/amex.svg" alt="American Express" className="h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-bloombook-100 p-8 text-center">
              <div className="flex flex-col items-center">
                <ShoppingBag className="w-16 h-16 text-bloombook-300 mb-4" />
                <h2 className="text-xl font-medium text-bloombook-900 mb-2">Your cart is empty</h2>
                <p className="text-bloombook-600 mb-6">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Link to="/shop/all">
                  <Button className="bg-bloombook-600 hover:bg-bloombook-700">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
