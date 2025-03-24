
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';

interface CartItemProps {
  id: string; // Changed from number to string
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
  onUpdateQuantity: (id: string, quantity: number) => void; // Changed from number to string
  onRemove: (id: string) => void; // Changed from number to string
}

const CartItem = ({ 
  id, 
  name, 
  price, 
  quantity, 
  imageSrc,
  onUpdateQuantity,
  onRemove
}: CartItemProps) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleIncrease = () => {
    onUpdateQuantity(id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(id, quantity - 1);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(id);
    }, 300);
  };

  return (
    <div 
      className={`flex items-center py-4 border-b border-bloombook-100 transition-opacity duration-300 ${
        isRemoving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Product Image */}
      <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
        <Link to={`/product/${id}`}>
          <img 
            src={imageSrc} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
      
      {/* Product details */}
      <div className="flex-grow ml-4">
        <h3 className="font-medium text-bloombook-900">
          <Link to={`/product/${id}`} className="hover:text-bloombook-700 transition-colors">
            {name}
          </Link>
        </h3>
        <div className="mt-1 text-bloombook-600 text-sm">
          {formatPrice(price)} each
        </div>
      </div>
      
      {/* Quantity controls */}
      <div className="flex items-center border border-bloombook-200 rounded-md">
        <button 
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="p-1 text-bloombook-500 hover:text-bloombook-700 disabled:opacity-50"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center text-bloombook-900">{quantity}</span>
        <button 
          onClick={handleIncrease}
          className="p-1 text-bloombook-500 hover:text-bloombook-700"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
      
      {/* Total price */}
      <div className="ml-4 min-w-[80px] text-right font-medium text-bloombook-900">
        {formatPrice(price * quantity)}
      </div>
      
      {/* Remove button */}
      <button 
        onClick={handleRemove}
        className="ml-4 p-2 text-bloombook-400 hover:text-red-500 transition-colors"
        aria-label="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;
