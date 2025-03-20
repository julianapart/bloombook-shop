import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, Filter, ArrowUpDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProductsByCategory } from '@/data/products';
import { cn } from '@/lib/utils';

// Define filter types
type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';
type GenderFilter = 'all' | 'boy' | 'girl' | 'unisex';

const Shop = () => {
  const { category = 'all' } = useParams<{ category: string }>();
  const [products, setProducts] = useState(getProductsByCategory(category));
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  // Filter products when parameters change
  useEffect(() => {
    let filteredProducts = getProductsByCategory(category);
    
    // Apply price filter
    filteredProducts = filteredProducts.filter(
      product => 
        product.price >= priceRange[0] && 
        (product.isOnSale ? (product.salePrice || 0) : product.price) <= priceRange[1]
    );
    
    // Apply gender filter
    if (genderFilter !== 'all') {
      filteredProducts = filteredProducts.filter(
        product => product.gender?.toLowerCase() === genderFilter
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        // Assuming newer products have higher IDs
        filteredProducts.sort((a, b) => b.id - a.id);
        break;
      case 'price-asc':
        filteredProducts.sort((a, b) => {
          const aPrice = a.isOnSale ? (a.salePrice || 0) : a.price;
          const bPrice = b.isOnSale ? (b.salePrice || 0) : b.price;
          return aPrice - bPrice;
        });
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => {
          const aPrice = a.isOnSale ? (a.salePrice || 0) : a.price;
          const bPrice = b.isOnSale ? (b.salePrice || 0) : b.price;
          return bPrice - aPrice;
        });
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    setProducts(filteredProducts);
  }, [category, priceRange, genderFilter, sortBy]);

  const getCategoryName = (categorySlug: string) => {
    switch (categorySlug) {
      case 'photo-albums':
        return 'Photo Albums';
      case 'digital-products':
        return 'Digital Products';
      case 'cards':
        return 'Cards';
      case 'all':
      default:
        return 'All Products';
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    navigate(`/shop/${newCategory}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm mb-6 text-bloombook-500">
            <Link to="/" className="hover:text-bloombook-700 transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="font-medium text-bloombook-900">
              {getCategoryName(category)}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filter Sidebar - Desktop */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <div className="bg-white rounded-lg shadow-sm border border-bloombook-100 p-6">
                  <h2 className="font-medium text-xl text-bloombook-900 mb-6">Filter by Categories</h2>
                  
                  <div className="mb-6">
                    <ul className="space-y-3">
                      <li>
                        <Link 
                          to="/shop/all"
                          className={cn(
                            "block w-full text-left py-1 transition-colors text-base",
                            category === 'all' 
                              ? "text-bloombook-700 font-medium" 
                              : "text-bloombook-600 hover:text-bloombook-800"
                          )}
                        >
                          All Products
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/shop/photo-albums"
                          className={cn(
                            "block w-full text-left py-1 transition-colors text-base",
                            category === 'photo-albums' 
                              ? "text-bloombook-700 font-medium" 
                              : "text-bloombook-600 hover:text-bloombook-800"
                          )}
                        >
                          Photo Albums
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/shop/digital-products"
                          className={cn(
                            "block w-full text-left py-1 transition-colors text-base",
                            category === 'digital-products' 
                              ? "text-bloombook-700 font-medium" 
                              : "text-bloombook-600 hover:text-bloombook-800"
                          )}
                        >
                          Digital Products
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/shop/cards"
                          className={cn(
                            "block w-full text-left py-1 transition-colors text-base",
                            category === 'cards' 
                              ? "text-bloombook-700 font-medium" 
                              : "text-bloombook-600 hover:text-bloombook-800"
                          )}
                        >
                          Cards
                        </Link>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-lg text-bloombook-900 mb-4">Price range</h3>
                    <Slider
                      value={priceRange}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-3"
                    />
                    <div className="flex justify-between text-sm text-bloombook-700">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg text-bloombook-900 mb-4">Gender</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Checkbox 
                          id="gender-all" 
                          checked={genderFilter === 'all'} 
                          onCheckedChange={() => setGenderFilter('all')}
                          className="rounded-sm"
                        />
                        <label 
                          htmlFor="gender-all" 
                          className="ml-2 text-bloombook-700 text-base cursor-pointer"
                        >
                          All
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox 
                          id="gender-boy" 
                          checked={genderFilter === 'boy'} 
                          onCheckedChange={() => setGenderFilter('boy')}
                          className="rounded-sm"
                        />
                        <label 
                          htmlFor="gender-boy" 
                          className="ml-2 text-bloombook-700 text-base cursor-pointer"
                        >
                          Boy
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox 
                          id="gender-girl" 
                          checked={genderFilter === 'girl'} 
                          onCheckedChange={() => setGenderFilter('girl')}
                          className="rounded-sm"
                        />
                        <label 
                          htmlFor="gender-girl" 
                          className="ml-2 text-bloombook-700 text-base cursor-pointer"
                        >
                          Girl
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox 
                          id="gender-unisex" 
                          checked={genderFilter === 'unisex'} 
                          onCheckedChange={() => setGenderFilter('unisex')}
                          className="rounded-sm"
                        />
                        <label 
                          htmlFor="gender-unisex" 
                          className="ml-2 text-bloombook-700 text-base cursor-pointer"
                        >
                          Unisex
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
            
            {/* Mobile filter toggle */}
            <div className="md:hidden mb-4">
              <button 
                onClick={toggleFilters}
                className="flex items-center px-4 py-2 bg-white border border-bloombook-200 rounded-md text-bloombook-700 text-sm"
              >
                <Filter size={16} className="mr-2" />
                {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
              
              {isFilterOpen && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-bloombook-100">
                  <h3 className="font-medium text-xl text-bloombook-900 mb-6">Filter by Categories</h3>
                
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-2">
                      <Link 
                        to="/shop/all"
                        className={cn(
                          "px-3 py-2 rounded-md text-sm text-center",
                          category === 'all' 
                            ? "bg-bloombook-100 text-bloombook-800 font-medium" 
                            : "bg-white border border-bloombook-200 text-bloombook-600"
                        )}
                      >
                        All Products
                      </Link>
                      <Link 
                        to="/shop/photo-albums"
                        className={cn(
                          "px-3 py-2 rounded-md text-sm text-center",
                          category === 'photo-albums' 
                            ? "bg-bloombook-100 text-bloombook-800 font-medium" 
                            : "bg-white border border-bloombook-200 text-bloombook-600"
                        )}
                      >
                        Photo Albums
                      </Link>
                      <Link 
                        to="/shop/digital-products"
                        className={cn(
                          "px-3 py-2 rounded-md text-sm text-center",
                          category === 'digital-products' 
                            ? "bg-bloombook-100 text-bloombook-800 font-medium" 
                            : "bg-white border border-bloombook-200 text-bloombook-600"
                        )}
                      >
                        Digital Products
                      </Link>
                      <Link 
                        to="/shop/cards"
                        className={cn(
                          "px-3 py-2 rounded-md text-sm text-center",
                          category === 'cards' 
                            ? "bg-bloombook-100 text-bloombook-800 font-medium" 
                            : "bg-white border border-bloombook-200 text-bloombook-600"
                        )}
                      >
                        Cards
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-lg text-bloombook-900 mb-4">Price range</h3>
                    <Slider
                      value={priceRange}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-3"
                    />
                    <div className="flex justify-between text-sm text-bloombook-700">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg text-bloombook-900 mb-4">Gender</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <Checkbox 
                          id="mobile-gender-all" 
                          checked={genderFilter === 'all'} 
                          onCheckedChange={() => setGenderFilter('all')}
                          className="rounded-sm"
                        />
                        <label 
                          htmlFor="mobile-gender-all" 
                          className="ml-2 text-bloombook-700 text-base cursor-pointer"
                        >
                          All
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox 
                          id="mobile-gender-boy" 
                          checked={genderFilter === 'boy'} 
                          onCheckedChange={() => setGenderFilter('boy')}
                          className="rounded-sm"
                        />
                        <label 
                          htmlFor="mobile-gender-boy" 
                          className="ml-2 text-bloombook-700 text-base cursor-pointer"
                        >
                          Boy
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox 
                          id="mobile-gender-girl" 
                          checked={genderFilter === 'girl'} 
                          onCheckedChange={() => setGenderFilter('girl')}
                          className="rounded-sm"
                        />
                        <label 
                          htmlFor="mobile-gender-girl" 
                          className="ml-2 text-bloombook-700 text-base cursor-pointer"
                        >
                          Girl
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox 
                          id="mobile-gender-unisex" 
                          checked={genderFilter === 'unisex'} 
                          onCheckedChange={() => setGenderFilter('unisex')}
                          className="rounded-sm"
                        />
                        <label 
                          htmlFor="mobile-gender-unisex" 
                          className="ml-2 text-bloombook-700 text-base cursor-pointer"
                        >
                          Unisex
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Products Grid */}
            <div className="flex-grow">
              <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h1 className="text-2xl md:text-3xl font-serif font-medium text-bloombook-900">
                    {getCategoryName(category)}
                  </h1>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <ArrowUpDown size={16} className="text-bloombook-500 mr-2" />
                      <select 
                        value={sortBy}
                        onChange={handleSortChange}
                        className="text-sm border-none focus:ring-0 py-1 pr-8 bg-transparent text-bloombook-900"
                      >
                        <option value="newest">Newest</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name">Name: A to Z</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 text-bloombook-600 text-sm">
                  <p>
                    {products.length === 1 
                      ? '1 product' 
                      : `${products.length} products`
                    }
                  </p>
                </div>
              </div>
              
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
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
              ) : (
                <div className="text-center py-12 bg-bloombook-50 rounded-lg">
                  <h3 className="text-lg font-medium text-bloombook-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-bloombook-600 mb-6">
                    Try changing your filters or browse our categories
                  </p>
                  <button 
                    onClick={() => {
                      setPriceRange([0, 100]);
                      setGenderFilter('all');
                      setSortBy('newest');
                    }}
                    className="button-secondary"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;

