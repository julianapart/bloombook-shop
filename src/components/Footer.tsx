
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-bloombook-50 py-12 border-t border-bloombook-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="font-serif text-2xl font-semibold text-bloombook-900">
              Bloombook
            </Link>
            <p className="mt-4 text-bloombook-600 text-sm leading-relaxed">
              Handcrafted with love, our products celebrate life's precious moments through 
              thoughtfully designed photo albums, memory boxes, and cards.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-bloombook-600 hover:text-bloombook-800 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-bloombook-600 hover:text-bloombook-800 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-bloombook-600 hover:text-bloombook-800 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Shop */}
          <div className="col-span-1">
            <h3 className="font-medium text-bloombook-900 mb-4">Shop</h3>
            <ul className="space-y-2 text-bloombook-600">
              <li>
                <Link to="/shop/photo-albums" className="hover:text-bloombook-800 transition-colors">
                  Photo Albums
                </Link>
              </li>
              <li>
                <Link to="/shop/baby-memory-boxes" className="hover:text-bloombook-800 transition-colors">
                  Baby Memory Boxes
                </Link>
              </li>
              <li>
                <Link to="/shop/cards" className="hover:text-bloombook-800 transition-colors">
                  Cards
                </Link>
              </li>
              <li>
                <Link to="/shop/all" className="hover:text-bloombook-800 transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Information */}
          <div className="col-span-1">
            <h3 className="font-medium text-bloombook-900 mb-4">Information</h3>
            <ul className="space-y-2 text-bloombook-600">
              <li>
                <Link to="/about" className="hover:text-bloombook-800 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-bloombook-800 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-bloombook-800 transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-bloombook-800 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="font-medium text-bloombook-900 mb-4">Subscribe</h3>
            <p className="text-bloombook-600 text-sm mb-4">
              Subscribe to our newsletter for updates, promotions, and more.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-grow px-4 py-2 text-sm border border-bloombook-200 rounded-md focus:outline-none focus:ring-1 focus:ring-bloombook-500"
                required
              />
              <button 
                type="submit" 
                className="bg-bloombook-700 hover:bg-bloombook-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-bloombook-200 flex flex-col md:flex-row justify-between items-center text-sm text-bloombook-500">
          <p>© {currentYear} Bloombook. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/privacy" className="hover:text-bloombook-800 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-bloombook-800 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
