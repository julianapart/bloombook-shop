
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search for:', searchQuery);
  };

  return (
    <header className={cn(
      'header-fixed py-4 px-6 md:px-10 transition-all duration-300 ease-in-out',
      isScrolled ? 'header-scrolled' : 'bg-transparent'
    )}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-serif text-2xl font-semibold text-bloombook-900 transition-all hover:opacity-80">
            Bloombook
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn("header-link", location.pathname.includes("/shop") && "text-bloombook-600")}>
                    Shop
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[200px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/shop/all" 
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-bloombook-100 to-bloombook-200 p-4 no-underline outline-none focus:shadow-md"
                          >
                            <div className="text-lg font-medium text-bloombook-900">All Products</div>
                            <p className="text-sm text-bloombook-600">Browse our entire collection</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <Link 
                          to="/shop/photo-albums" 
                          className="block select-none space-y-1 rounded-md p-3 hover:bg-bloombook-100 transition-colors"
                        >
                          <div className="text-sm font-medium text-bloombook-900">Photo Albums</div>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/shop/memory-boxes" 
                          className="block select-none space-y-1 rounded-md p-3 hover:bg-bloombook-100 transition-colors"
                        >
                          <div className="text-sm font-medium text-bloombook-900">Memory Boxes</div>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/shop/post-cards" 
                          className="block select-none space-y-1 rounded-md p-3 hover:bg-bloombook-100 transition-colors"
                        >
                          <div className="text-sm font-medium text-bloombook-900">Post Cards</div>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link 
                    to="/about" 
                    className={cn("header-link", location.pathname === "/about" && "text-bloombook-600")}
                  >
                    About
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link 
                    to="/contact" 
                    className={cn("header-link", location.pathname === "/contact" && "text-bloombook-600")}
                  >
                    Contact
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Search, User and Cart */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[180px] lg:w-[240px] py-2 px-4 pr-10 rounded-full border border-bloombook-200 bg-white/70 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bloombook-500 text-sm placeholder:text-bloombook-400 transition-all"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bloombook-400 hover:text-bloombook-700"
              >
                <Search size={18} />
              </button>
            </form>
            
            <Link to="/login" className="relative p-2 rounded-full hover:bg-bloombook-100 transition-colors">
              <User size={20} className="text-bloombook-700" />
            </Link>
            
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-bloombook-100 transition-colors">
              <ShoppingCart size={20} className="text-bloombook-700" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-bloombook-600 rounded-full">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
