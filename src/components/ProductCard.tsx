
import { useState, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageSrc: string;
  category: string;
  isNewArrival?: boolean;
  isOnSale?: boolean;
  salePrice?: number;
  className?: string;
  style?: CSSProperties;
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  imageSrc, 
  category, 
  isNewArrival = false, 
  isOnSale = false, 
  salePrice, 
  className,
  style 
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleAddToCart = () => {
    const productPrice = isOnSale && salePrice ? salePrice : price;
    
    addToCart({
      id,
      name,
      price: productPrice,
      quantity: 1,
      imageSrc
    });
  };

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-lg card-hover",
        className
      )}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link to={`/product/${id}`} className="block aspect-square overflow-hidden">
        <img 
          src={imageSrc} 
          alt={name} 
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
            isHovered && "scale-105"
          )}
        />
      </Link>
      
      {/* Labels */}
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {isNewArrival && (
          <span className="inline-block bg-teal-500 text-white text-xs font-medium px-2 py-1 rounded">
            New
          </span>
        )}
        {isOnSale && (
          <span className="inline-block bg-pink-500 text-white text-xs font-medium px-2 py-1 rounded">
            Sale
          </span>
        )}
      </div>
      
      {/* Wishlist button */}
      <button 
        className={cn(
          "absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 text-pink-600 hover:text-pink-700",
          "opacity-0 group-hover:opacity-100"
        )}
        aria-label="Add to wishlist"
      >
        <Heart size={18} />
      </button>
      
      {/* Add to cart button */}
      <div 
        className={cn(
          "absolute inset-x-0 bottom-0 p-3 bg-white/90 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        )}
      >
        <button 
          className="w-full py-2 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded transition-colors duration-300"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={16} />
          Add to cart
        </button>
      </div>
      
      {/* Product info */}
      <div className="p-4 bg-beige-50/50">
        <Link to={`/shop/${category.toLowerCase()}`} className="text-xs text-teal-600 hover:text-teal-700 transition-colors">
          {category}
        </Link>
        <h3 className="mt-1 font-medium">
          <Link to={`/product/${id}`} className="text-pink-900 hover:text-pink-700 transition-colors">
            {name}
          </Link>
        </h3>
        <div className="mt-1 flex items-center">
          {isOnSale && salePrice ? (
            <>
              <span className="text-pink-600 font-medium">{formatPrice(salePrice)}</span>
              <span className="ml-2 text-beige-400 text-sm line-through">{formatPrice(price)}</span>
            </>
          ) : (
            <span className="text-pink-800 font-medium">{formatPrice(price)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
