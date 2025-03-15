
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { getFeaturedProducts, getNewArrivals } from '@/data/products';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals(4);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Categories Section */}
      <section id="categories" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-bloombook-900 mb-3">
              Our Collections
            </h2>
            <p className="text-bloombook-600 max-w-2xl mx-auto">
              Explore our carefully crafted collections of photo albums, baby memory boxes,
              and beautiful handmade cards.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <CategoryCard
              title="Photo Albums"
              imageSrc="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
              link="/shop/photo-albums"
              className={`opacity-0 animate-fade-in ${isLoaded ? 'opacity-100' : ''}`}
              style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
            />
            <CategoryCard
              title="Baby Memory Boxes"
              imageSrc="/lovable-uploads/312bb6b3-7e31-43de-8d88-907b1647f6c9.png"
              link="/shop/baby-memory-boxes"
              className={`opacity-0 animate-fade-in ${isLoaded ? 'opacity-100' : ''}`}
              style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
            />
            <CategoryCard
              title="Cards"
              imageSrc="/lovable-uploads/154ba4b6-fd4d-4a51-8d97-605714049497.png"
              link="/shop/cards"
              className={`opacity-0 animate-fade-in ${isLoaded ? 'opacity-100' : ''}`}
              style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
            />
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-16 bg-bloombook-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="inline-block text-sm font-medium tracking-wider uppercase text-bloombook-700 mb-2">
              Featured Products
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-bloombook-900 mb-3">
              Our Bestsellers
            </h2>
            <p className="text-bloombook-600 max-w-2xl mx-auto">
              Discover our most loved handcrafted products and find the perfect gift or keepsake.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts.map((product, index) => (
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
                className={`opacity-0 animate-fade-in ${isLoaded ? 'opacity-100' : ''}`}
                style={{ 
                  animationDelay: `${0.1 + index * 0.2}s`, 
                  animationFillMode: 'forwards' 
                }}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/shop/all" 
              className="button-secondary inline-flex items-center"
            >
              View All Products
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block text-sm font-medium tracking-wider uppercase text-bloombook-700 mb-2">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-bloombook-900 mb-4">
                About Us
              </h2>
              <p className="text-bloombook-600 mb-4 leading-relaxed">
                Bloombook was founded in 2015 with a simple mission: to help people preserve their most precious memories
                in beautiful, handcrafted keepsakes that will last for generations.
              </p>
              <p className="text-bloombook-600 mb-6 leading-relaxed">
                Every item we create is made with sustainable materials and meticulous attention to detail.
                We believe that life's special moments deserve to be treasured in products that are as unique
                as the memories they hold.
              </p>
              <Link 
                to="/about" 
                className="button-secondary inline-flex items-center"
              >
                Learn More
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl transform transition-transform duration-500 hover:scale-[1.02]">
                <img 
                  src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" 
                  alt="Handcrafting process" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute top-8 -right-4 w-48 h-48 bg-bloombook-100 rounded-full -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-bloombook-200 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Promotion Section */}
      <section className="py-16 bg-bloombook-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/lovable-uploads/154ba4b6-fd4d-4a51-8d97-605714049497.png')] bg-repeat opacity-20"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">
              Buy online now & get 10% off!
            </h2>
            <p className="mb-8 text-white/80">
              Use code <span className="font-bold">BLOOM10</span> at checkout to receive 10% off your first order.
            </p>
            <Link 
              to="/shop/all" 
              className="inline-block bg-white hover:bg-gray-100 text-bloombook-800 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
      
      {/* New Arrivals Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="inline-block text-sm font-medium tracking-wider uppercase text-bloombook-700 mb-2">
              Just Arrived
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-bloombook-900 mb-3">
              New Arrivals
            </h2>
            <p className="text-bloombook-600 max-w-2xl mx-auto">
              Check out our latest handcrafted products, fresh from our workshop.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
            {newArrivals.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageSrc={product.images[0]}
                category={product.category}
                isNewArrival={true}
                isOnSale={product.isOnSale}
                salePrice={product.salePrice}
                className={`opacity-0 animate-fade-in ${isLoaded ? 'opacity-100' : ''}`}
                style={{ 
                  animationDelay: `${0.1 + index * 0.15}s`, 
                  animationFillMode: 'forwards' 
                }}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 bg-bloombook-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <span className="inline-block text-sm font-medium tracking-wider uppercase text-bloombook-700 mb-2">
                Get In Touch
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-bloombook-900 mb-4">
                Contact Us
              </h2>
              <p className="text-bloombook-600 mb-6 leading-relaxed">
                Have a question or need assistance with your order? We're here to help!
                Fill out the form and we'll get back to you as soon as possible.
              </p>
              
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-bloombook-100 flex items-center justify-center flex-shrink-0 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloombook-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-bloombook-900 mb-1">Email Us</h3>
                  <a href="mailto:hello@bloombook.com" className="text-bloombook-600 hover:text-bloombook-800 transition-colors">
                    hello@bloombook.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-bloombook-100 flex items-center justify-center flex-shrink-0 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloombook-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-bloombook-900 mb-1">Call Us</h3>
                  <a href="tel:+1234567890" className="text-bloombook-600 hover:text-bloombook-800 transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-bloombook-100 flex items-center justify-center flex-shrink-0 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloombook-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-bloombook-900 mb-1">Visit Us</h3>
                  <address className="text-bloombook-600 not-italic">
                    123 Craft Street<br />
                    Artisan District<br />
                    Creativeville, CV 12345
                  </address>
                </div>
              </div>
            </div>
            
            <div className="mt-8 md:mt-0">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
