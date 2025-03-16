
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-bloombook-900 mb-8">About Bloombook</h1>
          
          <div className="prose prose-lg max-w-none text-bloombook-700 space-y-6">
            <p>
              Founded in 2023, Bloombook is dedicated to preserving your most cherished memories through beautifully crafted photo albums, memory boxes, and custom stationery.
            </p>
            
            <p>
              Our mission is to help you capture life's most meaningful moments in tangible keepsakes that can be shared and treasured for generations to come. In an increasingly digital world, we believe in the power of physical mementos that you can hold, flip through, and display.
            </p>
            
            <h2 className="text-2xl font-serif font-semibold text-bloombook-800 mt-10 mb-4">Our Story</h2>
            
            <p>
              Bloombook began with a simple idea: to create memory-keeping products that are as beautiful as the moments they preserve. Our founder, an avid photographer and memory keeper, was frustrated by the lack of high-quality, customizable photo albums that truly did justice to life's special moments.
            </p>
            
            <p>
              What started as a small passion project has grown into a business dedicated to helping people around the world preserve their memories in style. Today, we offer a wide range of products, from luxurious leather-bound photo albums to charming memory boxes perfect for storing keepsakes.
            </p>
            
            <h2 className="text-2xl font-serif font-semibold text-bloombook-800 mt-10 mb-4">Our Commitment</h2>
            
            <p>
              At Bloombook, we're committed to quality, sustainability, and exceptional customer service. We use only the finest materials, sourced responsibly, and work with skilled artisans to create products that are built to last.
            </p>
            
            <p>
              We believe that the vessels that hold your memories should be as special as the memories themselves. That's why we put so much care into every detail of our products, from the stitching on our albums to the finish on our memory boxes.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
