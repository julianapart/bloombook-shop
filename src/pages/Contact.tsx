
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-22">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-bloombook-900 mb-8">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-lg text-bloombook-700">
                We'd love to hear from you! Whether you have a question about our products, custom orders, or anything else, our team is ready to answer all your questions.
              </p>
              
              <div className="space-y-4 mt-8">
                <div>
                  <h3 className="text-xl font-medium text-bloombook-800">Email</h3>
                  <p className="text-bloombook-600">hello@bloombook.com</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-bloombook-800">Phone</h3>
                  <p className="text-bloombook-600">(555) 123-4567</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-bloombook-800">Address</h3>
                  <p className="text-bloombook-600">
                    123 Memory Lane<br />
                    San Francisco, CA 94103<br />
                    United States
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-bloombook-800">Hours</h3>
                  <p className="text-bloombook-600">
                    Monday - Friday: 9am - 6pm PST<br />
                    Saturday: 10am - 4pm PST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-bloombook-100">
              <h2 className="text-2xl font-serif font-semibold text-bloombook-800 mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
