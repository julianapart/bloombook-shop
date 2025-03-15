
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/154ba4b6-fd4d-4a51-8d97-605714049497.png')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200/40 to-teal-200/30 backdrop-blur-xs"></div>
      </div>

      {/* Content Container */}
      <div className="container relative z-10 px-6 py-12 mx-auto text-center">
        <div 
          className={`transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block mb-2 text-sm font-medium tracking-wider uppercase bg-beige-200/80 text-pink-800 px-3 py-1 rounded-full backdrop-blur-sm">
            Est. 2015
          </span>
          <h1 className="mt-2 mb-6 text-5xl md:text-7xl font-semibold text-pink-900 font-serif">
            Bloombook
          </h1>
          <p className="mx-auto mb-8 text-xl font-handwriting text-teal-800 max-w-xl">
            Bringing you joy
          </p>
          <Link 
            to="/shop" 
            className="button-primary inline-block"
          >
            Shop Now
          </Link>
        </div>

        {/* Scroll Indicator */}
        <button 
          onClick={scrollToCategories}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-pink-700 hover:text-pink-900 transition-colors animate-pulse"
          aria-label="Scroll to categories"
        >
          <span className="mb-2 text-sm font-medium">Discover</span>
          <ChevronDown size={24} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
