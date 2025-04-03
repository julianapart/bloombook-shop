// Import the necessary modules and components
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'react-toastify';

const Header = () => {
  const { pathname } = useLocation();
  const { totalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Close menus when clicking outside or navigating
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen || isProfileMenuOpen) {
        const target = event.target as HTMLElement;
        // Check if the click is outside the menu
        if (!target.closest('.mobile-menu') && !target.closest('.profile-menu-button')) {
          setIsMenuOpen(false);
          setIsProfileMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, isProfileMenuOpen]);

  // Close menus on navigation
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // Simplified logout handler
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log("Logout button clicked");
      toast.info("Signing out...");
      
      // Call the logout function without any additional logic
      logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Navigation links
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <header className="bg-white border-b border-bloombook-100 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo and brand name */}
        <Link to="/" className="flex items-center">
          <span className="font-serif text-2xl font-medium text-bloombook-900">Bloom<span className="text-bloombook-600">Book</span></span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors ${
                pathname === link.to
                  ? 'text-bloombook-900 border-b-2 border-bloombook-600 pb-1'
                  : 'text-bloombook-600 hover:text-bloombook-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm" 
                className="flex items-center gap-2 text-bloombook-700 profile-menu-button"
                onClick={toggleProfileMenu}
              >
                <User className="h-4 w-4" />
                <span>{user?.user_metadata?.full_name || 'Account'}</span>
              </Button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-4 text-sm text-bloombook-900 border-b border-bloombook-100">
                    <p className="font-medium">
                      {user?.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-bloombook-500 mt-1 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-bloombook-700 hover:bg-bloombook-50 flex items-center"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-bloombook-700 hover:bg-bloombook-50 flex items-center"
                      >
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Admin Panel
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button asChild variant="default" size="sm" className="bg-bloombook-600 hover:bg-bloombook-700">
              <Link to="/login">Sign In</Link>
            </Button>
          )}

          <Link to="/cart" className="relative p-2 text-bloombook-700 hover:text-bloombook-900 transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-bloombook-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-3">
          <Link to="/cart" className="relative p-2 text-bloombook-700 hover:text-bloombook-900 transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-bloombook-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            className="text-bloombook-700 p-2"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white mobile-menu" onClick={(e) => e.stopPropagation()}>
          <div className="container mx-auto px-4 py-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                <span className="font-serif text-2xl font-medium text-bloombook-900">Bloom<span className="text-bloombook-600">Book</span></span>
              </Link>
              <button
                className="text-bloombook-700 p-2"
                onClick={toggleMenu}
                aria-label="Close Menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 flex flex-col">
              <nav className="flex flex-col space-y-4 mb-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-base py-2 font-medium transition-colors ${
                      pathname === link.to
                        ? 'text-bloombook-900 border-b-2 border-bloombook-600'
                        : 'text-bloombook-600 hover:text-bloombook-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {isAuthenticated ? (
                <div className="border-t border-bloombook-100 pt-6">
                  <div className="mb-4">
                    <p className="text-sm text-bloombook-500">Signed in as</p>
                    <p className="font-medium text-bloombook-900">{user?.user_metadata?.full_name || 'User'}</p>
                    <p className="text-sm text-bloombook-500 truncate">{user?.email}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button asChild variant="outline" size="sm" className="w-full justify-start">
                      <Link to="/profile">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </Button>
                    
                    {isAdmin && (
                      <Button asChild variant="outline" size="sm" className="w-full justify-start">
                        <Link to="/admin">
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-auto border-t border-bloombook-100 pt-6">
                  <Button asChild variant="default" size="lg" className="w-full bg-bloombook-600 hover:bg-bloombook-700">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <p className="text-center text-sm text-bloombook-500 mt-4">
                    Don't have an account?{' '}
                    <Link to="/login" className="text-bloombook-700 hover:text-bloombook-900" state={{ register: true }}>
                      Sign Up
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
