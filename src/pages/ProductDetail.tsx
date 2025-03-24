
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Minus, Plus, Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductById, getRelatedProducts } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const productId = parseInt(id || '0', 10);
  const product = getProductById(productId);
  const relatedProducts = getRelatedProducts(productId);
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-bloombook-900 mb-4">Product Not Found</h1>
            <p className="text-bloombook-600 mb-6">The product you're looking for doesn't seem to exist.</p>
            <Link to="/shop" className="button-primary">
              Return to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart({
      id: product.id.toString(), // Convert number to string
      name: product.name,
      price: product.isOnSale && product.salePrice ? product.salePrice : product.price,
      imageSrc: product.images[0],
      quantity
    });
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleWishlistClick = () => {
    toast.success("Added to wishlist");
  };
  
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm mb-8 text-bloombook-500">
            <Link to="/" className="hover:text-bloombook-700 transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/shop" className="hover:text-bloombook-700 transition-colors">
              Shop
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <Link 
              to={`/shop/${product.category.toLowerCase().replace(' ', '-')}`} 
              className="hover:text-bloombook-700 transition-colors"
            >
              {product.category}
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="font-medium text-bloombook-900">
              {product.name}
            </span>
          </div>
          
          {/* Product Detail */}
          <div className="grid md:grid-cols-2 gap-10 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-white border border-bloombook-100">
                <img 
                  src={product.images[activeImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`aspect-square rounded-md overflow-hidden border ${
                        activeImageIndex === index 
                          ? 'border-pink-600' 
                          : 'border-bloombook-100'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} - View ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-serif font-medium text-bloombook-900 mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={i < Math.floor(product.rating) 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-bloombook-200"
                      } 
                    />
                  ))}
                </div>
                <span className="text-sm text-bloombook-600">
                  {product.reviews} {product.reviews === 1 ? 'review' : 'reviews'}
                </span>
              </div>
              
              <div className="mb-6">
                {product.isOnSale && product.salePrice ? (
                  <div className="flex items-center">
                    <span className="text-2xl font-medium text-pink-600 mr-3">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-bloombook-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-medium text-bloombook-900">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              <p className="text-bloombook-700 mb-8">
                {product.description}
              </p>
              
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="flex items-center mr-6">
                    <button 
                      onClick={decrementQuantity}
                      className="w-10 h-10 flex items-center justify-center border border-bloombook-200 rounded-l-md hover:bg-bloombook-50"
                    >
                      <Minus size={16} className="text-bloombook-600" />
                    </button>
                    <div className="w-14 h-10 flex items-center justify-center border-t border-b border-bloombook-200">
                      <span className="text-bloombook-900">{quantity}</span>
                    </div>
                    <button 
                      onClick={incrementQuantity}
                      className="w-10 h-10 flex items-center justify-center border border-bloombook-200 rounded-r-md hover:bg-bloombook-50"
                    >
                      <Plus size={16} className="text-bloombook-600" />
                    </button>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      product.inStock 
                        ? 'bg-teal-100 text-teal-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-grow md:flex-grow-0 min-w-[180px] py-3 px-8 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:bg-bloombook-300 text-white font-medium rounded-md transition-colors"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  
                  <button 
                    onClick={handleWishlistClick}
                    className="py-3 px-6 flex items-center justify-center gap-2 border border-bloombook-200 hover:bg-bloombook-50 text-bloombook-900 font-medium rounded-md transition-colors"
                  >
                    <Heart size={18} />
                    Add to Wishlist
                  </button>
                </div>
              </div>
              
              <div className="border-t border-bloombook-100 pt-6">
                <div className="flex items-start gap-x-4 text-sm">
                  <div className="flex-none text-bloombook-500">Category:</div>
                  <div className="text-bloombook-900">{product.category}</div>
                </div>
                
                {product.gender && (
                  <div className="flex items-start gap-x-4 text-sm mt-2">
                    <div className="flex-none text-bloombook-500">Gender:</div>
                    <div className="text-bloombook-900">{product.gender}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <div className="mb-16">
            <Tabs defaultValue="description">
              <TabsList className="border-b border-bloombook-100 w-full justify-start">
                <TabsTrigger value="description" className="text-base">Description</TabsTrigger>
                <TabsTrigger value="reviews" className="text-base">Reviews ({product.reviews})</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-6">
                <div className="prose prose-bloombook max-w-none">
                  <p>{product.description}</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet vestibulum ex. Etiam ullamcorper laoreet nisi, vitae malesuada ipsum posuere at. Donec euismod, nulla vel ullamcorper tempor, dolor sapien elementum nisl, vitae fringilla magna nunc id augue.</p>
                  <p>Features:</p>
                  <ul>
                    <li>Premium quality materials</li>
                    <li>Handcrafted with care</li>
                    <li>Acid-free pages (for photo albums)</li>
                    <li>Perfect for preserving memories</li>
                    <li>Makes an excellent gift</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-bloombook-200 flex items-center justify-center text-bloombook-700 font-medium">
                      JD
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="font-medium text-bloombook-900 mr-3">Jane Doe</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={i < 5 ? "text-yellow-400 fill-yellow-400" : "text-bloombook-200"} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-bloombook-500 mb-2">Verified Purchase | 3 months ago</p>
                      <p className="text-bloombook-700">
                        Absolutely love this! The quality is exceptional and it's exactly as described. 
                        Would definitely purchase again for gifts.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-bloombook-200 flex items-center justify-center text-bloombook-700 font-medium">
                      JS
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="font-medium text-bloombook-900 mr-3">John Smith</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={i < 4 ? "text-yellow-400 fill-yellow-400" : "text-bloombook-200"} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-bloombook-500 mb-2">Verified Purchase | 1 month ago</p>
                      <p className="text-bloombook-700">
                        Great product, shipped quickly and looks beautiful. Would recommend!
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-serif font-medium text-bloombook-900 mb-8">
                You might also like
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    imageSrc={product.images[0]}
                    category={product.category}
                    isNewArrival={product.isNewArrival}
                    isOnSale={product.isOnSale}
                    salePrice={product.salePrice}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
