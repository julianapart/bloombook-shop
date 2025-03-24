
export interface Product {
  id: string; // Changed from number to string
  name: string;
  description: string;
  price: number;
  category: 'Photo Albums' | 'Digital Products' | 'Cards';
  gender?: 'Boy' | 'Girl' | 'Unisex';
  images: string[];
  isNewArrival?: boolean;
  isOnSale?: boolean;
  salePrice?: number;
  inStock: boolean;
  rating: number;
  reviews: number;
  featuredOrder?: number;
}

const products: Product[] = [
  {
    id: '1', // Changed from number to string
    name: 'Linen Photo Album',
    description: 'A beautiful handcrafted photo album with linen cover and acid-free pages. Perfect for preserving your precious memories.',
    price: 49.99,
    category: 'Photo Albums',
    gender: 'Unisex',
    images: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      'https://images.unsplash.com/photo-1518770660439-4636190af475'
    ],
    isNewArrival: true,
    inStock: true,
    rating: 4.8,
    reviews: 24,
    featuredOrder: 1
  },
  {
    id: '2', // Changed from number to string
    name: 'Classic Leather Photo Album',
    description: 'A timeless leather-bound photo album with elegant stitching and 50 acid-free pages.',
    price: 69.99,
    category: 'Photo Albums',
    gender: 'Unisex',
    images: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
    ],
    inStock: true,
    rating: 4.9,
    reviews: 36
  },
  {
    id: '3', // Changed from number to string
    name: 'Blue Digital Template',
    description: 'A professionally designed digital template for your baby boy\'s treasured keepsakes, including first tooth, lock of hair, and more.',
    price: 59.99,
    category: 'Digital Products',
    gender: 'Boy',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
    ],
    inStock: true,
    rating: 4.7,
    reviews: 18,
    featuredOrder: 2
  },
  {
    id: 4,
    name: 'Pink Digital Template',
    description: 'A beautifully decorated digital template for your baby girl\'s special moments and keepsakes.',
    price: 59.99,
    category: 'Digital Products',
    gender: 'Girl',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
    ],
    isOnSale: true,
    salePrice: 49.99,
    inStock: true,
    rating: 4.6,
    reviews: 14
  },
  {
    id: 5,
    name: 'Neutral Digital Template',
    description: 'A gender-neutral digital template with compartments for all your baby\'s precious first items.',
    price: 54.99,
    category: 'Digital Products',
    gender: 'Unisex',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
    ],
    inStock: true,
    rating: 4.5,
    reviews: 12
  },
  {
    id: 6,
    name: 'Birthday Card Collection',
    description: 'A set of 5 handmade birthday cards with envelopes. Each card is unique and beautifully crafted.',
    price: 19.99,
    category: 'Cards',
    gender: 'Unisex',
    images: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
    ],
    isNewArrival: true,
    inStock: true,
    rating: 4.9,
    reviews: 28,
    featuredOrder: 3
  },
  {
    id: 7,
    name: 'Wedding Congratulations Card',
    description: 'A beautifully handcrafted wedding card with elegant calligraphy and intricate design.',
    price: 8.99,
    category: 'Cards',
    gender: 'Unisex',
    images: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
    ],
    inStock: true,
    rating: 4.8,
    reviews: 15
  },
  {
    id: 8,
    name: 'Baby Shower Card Set',
    description: 'A set of 3 handmade baby shower cards with envelopes, perfect for celebrating new arrivals.',
    price: 14.99,
    category: 'Cards',
    gender: 'Unisex',
    images: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
    ],
    isOnSale: true,
    salePrice: 12.99,
    inStock: true,
    rating: 4.7,
    reviews: 9
  },
  {
    id: 9,
    name: 'Vintage Style Photo Album',
    description: 'A vintage-inspired photo album with decorative elements and 40 acid-free pages.',
    price: 45.99,
    category: 'Photo Albums',
    gender: 'Unisex',
    images: [
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
    ],
    inStock: true,
    rating: 4.6,
    reviews: 11
  },
  {
    id: 10,
    name: 'Thank You Card Set',
    description: 'A set of 10 elegant thank you cards with matching envelopes.',
    price: 24.99,
    category: 'Cards',
    gender: 'Unisex',
    images: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9'
    ],
    inStock: true,
    rating: 4.9,
    reviews: 32
  },
  {
    id: 11,
    name: 'Deluxe Baby Memory Box',
    description: 'Our most premium baby memory box with multiple compartments, a photo frame, and space for baby\'s first shoes.',
    price: 79.99,
    category: 'Digital Products',
    gender: 'Unisex',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
    ],
    inStock: true,
    rating: 5.0,
    reviews: 42
  },
  {
    id: 12,
    name: 'Anniversary Card',
    description: 'A special handcrafted card to celebrate anniversaries, with beautiful calligraphy and design.',
    price: 9.99,
    category: 'Cards',
    gender: 'Unisex',
    images: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9'
    ],
    inStock: true,
    rating: 4.8,
    reviews: 19
  }
];

export const getFeaturedProducts = () => {
  return products
    .filter(product => product.featuredOrder !== undefined)
    .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
};

export const getProductsByCategory = (category: string) => {
  if (category === 'all') {
    return products;
  }
  return products.filter(
    product => product.category.toLowerCase() === category.toLowerCase()
  );
};

export const getProductById = (id: number | string) => {
  // Allow lookup by either number or string id
  const stringId = id.toString();
  return products.find(product => product.id === stringId);
};

export const getRelatedProducts = (id: number | string, limit = 4) => {
  const stringId = id.toString();
  const product = getProductById(stringId);
  if (!product) return [];
  
  return products
    .filter(p => p.category === product.category && p.id !== stringId)
    .slice(0, limit);
};

export const getNewArrivals = (limit = 4) => {
  return products
    .filter(product => product.isNewArrival)
    .slice(0, limit);
};

export const getOnSaleProducts = (limit = 4) => {
  return products
    .filter(product => product.isOnSale)
    .slice(0, limit);
};

export default products;
