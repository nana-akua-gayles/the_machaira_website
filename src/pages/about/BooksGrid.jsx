import React from 'react';
import { motion } from 'framer-motion';

export default function BooksGrid() {
  const books = [
    { title: 'Photizo', subtitle: 'Life-Transforming Teachings', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop' },
    { title: 'Machaira with Apostle Bennie (EDITION 1)', subtitle: "Walking in God's Power", image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop' },
    { title: 'Machaira with Apostle Bennie (EDITION 2)', subtitle: 'Discovering Your Divine Assignment', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-extrabold text-charcoal-text">
          A library where men are made
        </h2>
        {/* Short solid burgundy line styled like a long em dash */}
        <div className="w-12 h-0.5 bg-burgundy-primary my-2"></div>
        <div className="space-y-1">
          <p className="text-xs text-cool-gray">
            Unveil eternity stitched into words, the extraordinary, soul-reforming manuscripts
          </p>
          <p className="text-xs text-cool-gray">
            by Apostle Bennie.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {books.map((book, index) => (
          <div key={index} className="bg-white p-4 rounded-2xl shadow-md flex items-start space-x-4">
            <img 
              src={book.image} 
              alt={book.title} 
              className="w-20 h-20 shrink-0 object-cover rounded-none shadow-xs" 
            />
            
            <div className="flex flex-col space-y-3 flex-1">
              <div>
                <h3 className="text-sm font-extrabold text-charcoal-text leading-tight mb-1">{book.title}</h3>
                <p className="text-[10px] text-cool-gray leading-tight line-clamp-3">{book.subtitle}</p>
              </div>
              
              <button className="bg-white text-burgundy-primary border border-burgundy-primary px-3 py-1 rounded-md text-[10px] font-semibold hover:bg-red-50 transition-colors w-fit">
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}