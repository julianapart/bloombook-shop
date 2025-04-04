
import { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

// Define types for cart items and context
export interface CartItem {
  id: string; // Changed from number to string to match product_id in OrderItemInsert
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface CartContextType extends CartState {
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void; // Changed from number to string
  updateQuantity: (id: string, quantity: number) => void; // Changed from number to string
  clearCart: () => void;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Types for our reducer actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string } // Changed from number to string
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } } // Changed from number to string
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartState };

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  return items.reduce(
    (totals, item) => {
      return {
        totalItems: totals.totalItems + item.quantity,
        totalPrice: totals.totalPrice + item.price * item.quantity
      };
    },
    { totalItems: 0, totalPrice: 0 }
  );
};

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + action.payload.quantity
            };
          }
          return item;
        });
      } else {
        // Add new item
        updatedItems = [...state.items, action.payload];
      }

      const { totalItems, totalPrice } = calculateTotals(updatedItems);

      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      
      const { totalItems, totalPrice } = calculateTotals(updatedItems);

      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map((item) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            quantity: action.payload.quantity
          };
        }
        return item;
      });
      
      const { totalItems, totalPrice } = calculateTotals(updatedItems);

      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'SET_CART':
      return action.payload;

    default:
      return state;
  }
};

// Provider component
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Track authentication status changes
  useEffect(() => {
    // When authentication status changes, we'll handle cart data accordingly
    if (isAuthenticated && user?.id) {
      const cartKey = `cart_${user.id}`;
      const savedCart = localStorage.getItem(cartKey);
      
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'SET_CART', payload: parsedCart });
        } catch (error) {
          console.error('Failed to parse saved cart:', error);
          localStorage.removeItem(cartKey);
        }
      } else {
        // If no saved cart for this user, clear the cart to prevent showing guest cart
        dispatch({ type: 'CLEAR_CART' });
      }
    } else {
      // For users logging out, clear the cart in memory
      dispatch({ type: 'CLEAR_CART' });
      
      // Then check for a guest cart only if we're not coming from a logout
      // (which would have a non-null user but isAuthenticated false)
      const savedCart = localStorage.getItem('cart_guest');
      
      if (!user && savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'SET_CART', payload: parsedCart });
        } catch (error) {
          console.error('Failed to parse saved cart:', error);
          localStorage.removeItem('cart_guest');
        }
      }
    }
  }, [isAuthenticated, user?.id]);

  // Save cart to localStorage when state changes
  useEffect(() => {
    // Only save the cart if we're authenticated or truly a guest (not during logout transition)
    if (isAuthenticated && user?.id) {
      const cartKey = `cart_${user.id}`;
      localStorage.setItem(cartKey, JSON.stringify(state));
    } else if (!user) {
      localStorage.setItem('cart_guest', JSON.stringify(state));
    }
  }, [state, isAuthenticated, user]);

  // Action functions
  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (id: string) => { // Changed from number to string
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (id: string, quantity: number) => { // Changed from number to string
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const value = {
    items: state.items,
    totalItems: state.totalItems,
    totalPrice: state.totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};
