
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();

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

  const handleCartClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: { pathname: '/cart' } } });
    }
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

          {/* Navigation - positioned in the center with more spacing */}
          <div className="hidden md:flex flex-1 justify-center">
            <nav className="flex items-center w-full max-w-md justify-center">
              <NavigationMenu className="mx-auto">
                <NavigationMenuList className="space-x-12">
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
                      className={cn("header-link px-4 py-2", location.pathname === "/about" && "text-bloombook-600")}
                    >
                      About
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link 
                      to="/contact" 
                      className={cn("header-link px-4 py-2", location.pathname === "/contact" && "text-bloombook-600")}
                    >
                      Contact
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

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
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="relative p-2 rounded-full hover:bg-bloombook-100 transition-colors">
                  <User size={20} className="text-bloombook-700" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.name}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="relative p-2 rounded-full hover:bg-bloombook-100 transition-colors">
                <User size={20} className="text-bloombook-700" />
              </Link>
            )}
            
            <Link 
              to={isAuthenticated ? "/cart" : "#"} 
              className="relative p-2 rounded-full hover:bg-bloombook-100 transition-colors"
              onClick={handleCartClick}
            >
              <ShoppingCart size={20} className="text-bloombook-700" />
              {isAuthenticated && totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-bloombook-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu trigger */}
            <Sheet>
              <SheetTrigger className="md:hidden p-2 rounded-full hover:bg-bloombook-100 transition-colors">
                <Menu size={20} className="text-bloombook-700" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="py-4 flex flex-col h-full">
                  <div className="mb-8">
                    <Link to="/" className="font-serif text-xl font-semibold text-bloombook-900 hover:text-bloombook-700">
                      Bloombook
                    </Link>
                  </div>

                  <form onSubmit={handleSearchSubmit} className="relative mb-6">
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2 px-4 pr-10 rounded-full border border-bloombook-200 bg-white focus:outline-none focus:ring-1 focus:ring-bloombook-500 text-sm placeholder:text-bloombook-400"
                    />
                    <button 
                      type="submit" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bloombook-400 hover:text-bloombook-700"
                    >
                      <Search size={18} />
                    </button>
                  </form>

                  <nav className="flex-1">
                    <ul className="space-y-4">
                      <li>
                        <SheetClose asChild>
                          <Link 
                            to="/shop/all"
                            className={cn(
                              "block p-2 rounded-md hover:bg-bloombook-50",
                              location.pathname.includes("/shop") && "text-bloombook-600 bg-bloombook-50"
                            )}
                          >
                            Shop
                          </Link>
                        </SheetClose>
                        <ul className="pl-4 mt-2 space-y-2 border-l border-bloombook-100">
                          <li>
                            <SheetClose asChild>
                              <Link 
                                to="/shop/all"
                                className="block p-2 text-sm rounded-md hover:bg-bloombook-50"
                              >
                                All Products
                              </Link>
                            </SheetClose>
                          </li>
                          <li>
                            <SheetClose asChild>
                              <Link 
                                to="/shop/photo-albums"
                                className="block p-2 text-sm rounded-md hover:bg-bloombook-50"
                              >
                                Photo Albums
                              </Link>
                            </SheetClose>
                          </li>
                          <li>
                            <SheetClose asChild>
                              <Link 
                                to="/shop/memory-boxes"
                                className="block p-2 text-sm rounded-md hover:bg-bloombook-50"
                              >
                                Memory Boxes
                              </Link>
                            </SheetClose>
                          </li>
                          <li>
                            <SheetClose asChild>
                              <Link 
                                to="/shop/post-cards"
                                className="block p-2 text-sm rounded-md hover:bg-bloombook-50"
                              >
                                Post Cards
                              </Link>
                            </SheetClose>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link 
                            to="/about"
                            className={cn(
                              "block p-2 rounded-md hover:bg-bloombook-50",
                              location.pathname === "/about" && "text-bloombook-600 bg-bloombook-50"
                            )}
                          >
                            About
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link 
                            to="/contact"
                            className={cn(
                              "block p-2 rounded-md hover:bg-bloombook-50",
                              location.pathname === "/contact" && "text-bloombook-600 bg-bloombook-50"
                            )}
                          >
                            Contact
                          </Link>
                        </SheetClose>
                      </li>
                    </ul>
                  </nav>

                  <div className="pt-6 border-t border-bloombook-100 mt-auto">
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-bloombook-100 flex items-center justify-center mr-3">
                            <User size={16} className="text-bloombook-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-xs text-bloombook-500">{user?.email}</p>
                          </div>
                        </div>
                        <SheetClose asChild>
                          <Link 
                            to="/cart"
                            className="flex items-center p-2 text-sm rounded-md hover:bg-bloombook-50"
                          >
                            <ShoppingCart size={16} className="mr-3 text-bloombook-700" />
                            My Cart ({totalItems})
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link 
                            to="/profile"
                            className="flex items-center p-2 text-sm rounded-md hover:bg-bloombook-50"
                          >
                            <User size={16} className="mr-3 text-bloombook-700" />
                            My Profile
                          </Link>
                        </SheetClose>
                        <button 
                          onClick={logout}
                          className="flex items-center p-2 text-sm rounded-md text-red-500 hover:bg-red-50 w-full text-left"
                        >
                          <LogOut size={16} className="mr-3" />
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <SheetClose asChild>
                          <Link 
                            to="/login"
                            className="block w-full py-2 px-4 text-center bg-bloombook-600 hover:bg-bloombook-700 text-white rounded-md transition-colors"
                          >
                            Login
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link 
                            to="/login"
                            state={{ register: true }}
                            className="block w-full py-2 px-4 text-center border border-bloombook-200 hover:bg-bloombook-50 rounded-md transition-colors"
                          >
                            Create Account
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
