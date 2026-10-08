import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BooksGrid() {
  const books = [
    {
      slug: 'photizo',
      title: 'Photizo',
      subtitle: 'Life-Transforming Teachings',
      price: '$35.00',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop',
      body: 'Where divine light shatters ignorance and ignites the human spirit. Dive deep into foundational revelations designed to renew your mind and anchor your daily walk in absolute truth.\n\nTrue transformation begins the moment the Word shifts from a mere concept into a living reality within your spirit. As you walk through these pages, let the light of God dismantle every stronghold and rebuild your perspective according to His eternal architecture.',
    },
    {
      slug: 'machaira-edition-1',
      title: 'Machaira with Apostle Bennie',
      subtitle: "Walking in God's Power",
      price: '$40.00',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=700&auto=format&fit=crop',
      body: 'Equipping believers to wield the sword of the Spirit with absolute dominion. This edition unlocks the practical dynamics of spiritual authority, prayer, and supernatural living.\n\nThe sword (Machaira) given to the believer is not fashioned of earthly steel, but of living breath and absolute authority. Learn how to align your tongue, your prayers, and your posture with the prevailing power of heaven.',
    },
    {
      slug: 'machaira-edition-2',
      title: 'Machaira with Apostle Bennie',
      subtitle: 'Discovering Your Divine Assignment',
      price: '$45.00',
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=700&auto=format&fit=crop',
      description: 'Unlocking the blueprint of eternity encoded in your unique calling. Learn how to align your gifts, recognize divine seasons, and fulfill your God-given assignment with clarity.',
      body: 'Unlocking the blueprint of eternity encoded in your unique calling. Learn how to align your gifts, recognize divine seasons, and fulfill your God-given assignment with clarity.\n\nYour existence is not a cosmic accident. Before the foundations of the world were laid, an explicit assignment was prepared for your hands. Step into the revelation of your purpose and run your race with precision.',
    },
  ];

  const [activeBookIndex, setActiveBookIndex] = useState(null);
  const [activeStory, setActiveStory] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [orderState, setOrderState] = useState('idle'); // 'idle' | 'processing' | 'success'

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isExpanded]);

  const handleBookClick = (book) => {
    setActiveStory(book);
    setQuantity(1);
    setOrderState('idle');
    setIsExpanded(true);
  };

  const handleCloseReader = () => {
    setIsExpanded(false);
    setActiveStory(null);
  };

  const handleOrder = () => {
    setOrderState('processing');
    setTimeout(() => {
      setOrderState('success');
    }, 1200);
  };

  const formatDualDropCapText = (text) => {
    const cleanText = text ? text.replace(/\\n/g, '\n') : "";
    if (!cleanText) return { part1Letter: "", part1Rest: "", part2Letter: "", part2Rest: "" };

    const midpoint = Math.floor(cleanText.length / 2);
    let breakIndex = cleanText.indexOf('.', midpoint);
    if (breakIndex === -1) breakIndex = midpoint;

    const firstChunk = cleanText.slice(0, breakIndex + 1).trim();
    const secondChunk = cleanText.slice(breakIndex + 1).trim();

    return {
      part1Letter: firstChunk.charAt(0),
      part1Rest: firstChunk.slice(1),
      part2Letter: secondChunk.length > 0 ? secondChunk.charAt(0) : "",
      part2Rest: secondChunk.length > 0 ? secondChunk.slice(1) : "",
    };
  };

  const articleTextParts = activeStory ? formatDualDropCapText(activeStory.body) : { part1Letter: "", part1Rest: "", part2Letter: "", part2Rest: "" };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="mx-auto max-w-360 px-6 lg:px-12">

        {/* Intro */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-navy-dark sm:text-4xl lg:text-5xl">
            A library where <span className="italic text-burgundy-primary">men are made.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-[#6d6260] sm:text-sm">
            Unveil eternity stitched into words, the extraordinary, soul-reforming manuscripts by Apostle Bennie.
          </p>
        </div>

        {/* Books Grid */}
        <div className="mt-12 grid items-start gap-8 sm:grid-cols-3 sm:gap-6 lg:mt-16 lg:gap-10">
          {books.map((book, index) => {
            const isActive = activeBookIndex === index;
            const isInactive = activeBookIndex !== null && !isActive;

            return (
              <motion.div
                key={book.slug}
                onMouseEnter={() => setActiveBookIndex(index)}
                onMouseLeave={() => setActiveBookIndex(null)}
                onClick={() => handleBookClick(book)}
                animate={{
                  y: isActive ? -8 : 0,
                  opacity: isInactive ? 0.7 : 1,
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="group cursor-pointer"
              >
                {/* Book Image Frame */}
                <div className="relative overflow-hidden rounded-2xl bg-[#eee7e1] shadow-md transition-all duration-300 group-hover:shadow-2xl">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-navy-dark shadow-xs">
                    {book.price}
                  </div>
                </div>

                {/* Details */}
                <div className="mt-5">
                  {book.edition && (
                    <span className="mb-1 block text-[8px] font-bold uppercase tracking-[0.2em] text-burgundy-primary">
                      {book.edition}
                    </span>
                  )}

                  <h3 className="text-sm font-bold text-navy-dark sm:text-base">
                    {book.title}
                  </h3>

                  <p className="mt-1 text-xs text-[#6d6260]">
                    {book.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* CREATIVE SPLIT-SCREEN MUSEUM ARCHIVE MODAL */}
      <AnimatePresence>
        {isExpanded && activeStory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#f9f8f6] text-[#1a1918] flex flex-col overflow-hidden"
          >
            
            {/* Top Archive Bar */}
            <header className="w-full px-6 sm:px-12 py-4 border-b border-[#e6e2de] flex items-right justify-right bg-white/90 backdrop-blur-md shrink-0">

              <button
                onClick={handleCloseReader}
                className="w-9 h-9 rounded-full bg-[#f4f0eb] hover:bg-[#e6e2de] text-[#1a1918] flex items-center justify-center text-xs transition-all group cursor-pointer border border-[#e6e2de]"
                aria-label="Close archive"
              >
                <span className="group-hover:rotate-90 transition-transform font-bold">✕</span>
              </button>
            </header>

            {/* Split Screen Workspace */}
            <div className="flex-1 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              
              {/* LEFT COLUMN: Sticky Book Showcase & Order Desk */}
              <div className="lg:col-span-5 lg:h-full lg:overflow-y-auto p-6 sm:p-10 lg:p-12 bg-[#f4f0eb] border-r border-[#e6e2de] flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  {/* Floating Cover Photo */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#eee7e1] border border-[#e6e2de] group max-w-sm mx-auto lg:mx-0">
                    <img
                      src={activeStory.image}
                      alt={activeStory.title}
                      className="w-full h-80 sm:h-96 object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h4 className="text-lg font-bold mt-1 text-white">{activeStory.title}</h4>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-navy-dark">{activeStory.price}</h2>
                  </div>
                </div>

                {/* Interactive Order Module */}
                <div className="p-5 rounded-2xl bg-white border border-[#e6e2de] shadow-sm space-y-4">
                  {orderState === 'success' ? (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-1"
                    >
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">✓ Copy Secured</p>
                      <p className="text-[11px]">We have logged your order inquiry. Our desk will contact you shortly.</p>
                      <button 
                        onClick={() => setOrderState('idle')}
                        className="mt-2 text-[10px] underline uppercase font-bold tracking-widest text-emerald-800 cursor-pointer"
                      >
                        Reset Request
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#6d6260]">Copies</span>
                        <div className="flex items-center border border-[#e6e2de] rounded-lg overflow-hidden bg-[#f4f0eb]">
                          <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-3 py-1 text-xs font-bold hover:bg-[#e6e2de] transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-xs font-bold">{quantity}</span>
                          <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-3 py-1 text-xs font-bold hover:bg-[#e6e2de] transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleOrder}
                        disabled={orderState === 'processing'}
                        className="w-full py-3.5 rounded-xl bg-burgundy-primary hover:bg-burgundy-primary/90 text-white text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {orderState === 'processing' ? (
                          <>
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Processing...</span>
                          </>
                        ) : (
                          `Purchase (${activeStory.price}) →`
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Exquisite Manuscript Reading Canvas */}
              <div className="lg:col-span-7 lg:h-full lg:overflow-y-auto p-6 sm:p-12 lg:p-16 bg-white flex flex-col justify-between">
                <div className="max-w-2xl mx-auto w-full space-y-10 pb-12">
                  
                  <div className="border-b border-[#e6e2de] pb-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-burgundy-primary">
                      Manuscript Preview
                    </span>
                    <h3 className="text-3xl font-bold tracking-tight text-navy-dark mt-1">
                      {activeStory.title}
                    </h3>
                    <p className="text-xs text-[#6d6260] mt-1">{activeStory.subtitle}</p>
                  </div>

                  {/* Dual Drop Cap Text Block */}
                  <div className="space-y-8">
                    {activeStory.body && (
                      <div className="text-base sm:text-lg text-[#332f2e] leading-relaxed whitespace-pre-line font-light tracking-wide">
                        <span className="float-left text-5xl sm:text-6xl text-burgundy-primary leading-none mr-3 mt-1 uppercase select-none font-serif">
                          {articleTextParts.part1Letter}
                        </span> 
                        {articleTextParts.part1Rest}
                      </div>
                    )}

                    {articleTextParts.part2Letter && (
                      <div className="pt-6 border-t border-[#f4f0eb]">
                        <div className="text-base sm:text-lg text-[#332f2e] leading-relaxed whitespace-pre-line font-light tracking-wide">
                          <span className="float-left text-5xl sm:text-6xl text-burgundy-primary leading-none mr-3 mt-1 uppercase select-none font-serif">
                            {articleTextParts.part2Letter}
                          </span>
                          {articleTextParts.part2Rest}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-12 border-t border-[#e6e2de] text-center">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#6d6260]">
                      End of Preview • Order Hardcover to Read Full Manuscript
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}