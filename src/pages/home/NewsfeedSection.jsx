import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function NewsfeedSection() {
  const topStory = {
    date: "Monday, August 31, 2026",
    title: "A New General Takes The Helm: Apostle Daniel Babatunde Inducted as National Head",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1000&auto=format&fit=crop"
  };

  const middleStories = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=400&auto=format&fit=crop",
      title: "34 Years, One Legacy: Apostle Nathaniel Ajayi Bows Out From Active Ministry",
      date: "August 31, 2026"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400&auto=format&fit=crop",
      title: "A New General Takes The Helm: Apostle Daniel Babatunde Inducted as The C.O.P Nigeria National Head",
      date: "August 31, 2026"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=400&auto=format&fit=crop",
      title: "PIWC Achimota Officially Inaugurated in a Vibrant Ceremony",
      date: "August 29, 2026"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?q=80&w=400&auto=format&fit=crop",
      title: "Tema Newtown District Supports Mission Work in Rural Communities",
      date: "August 28, 2026"
    }
  ];

  const sideNews = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&auto=format&fit=crop",
      title: "The Church of Pentecost Supports Tema Newtown Flood Victims",
      description: "The Newtown District under the leadership reaching out with compassion...",
      date: "August 13, 2026"
    },
    {
      id: 2,
      image: null,
      title: "The Church Of Pentecost Ventures Deeper Into Education",
      description: "Institutional framework expansion across multiple regional sectors...",
      date: "April 22, 2026"
    }
  ];

  const tickerItems = [
    "📅 August 31, 2026: Apostle Daniel Babatunde Inducted as National Head",
    "📅 August 31, 2026: Apostle Nathaniel Ajayi Bows Out From Active Ministry",
    "📅 August 29, 2026: PIWC Achimota Officially Inaugurated in a Vibrant Ceremony",
    "📅 August 28, 2026: Tema Newtown District Supports Mission Work in Rural Communities"
  ];

  // Scroll Progress Tracking for continuous physics-based parallax
  const { scrollYProgress } = useScroll();
  
  // Smooth spring physics so movement stays buttery even if the user scrolls abruptly
  const smoothYLeft = useSpring(useTransform(scrollYProgress, [0, 1], [50, -50]), {
    stiffness: 100,
    damping: 20
  });

  const smoothYRight = useSpring(useTransform(scrollYProgress, [0, 1], [100, -30]), {
    stiffness: 80,
    damping: 25
  });

  // Reusable scroll reveal variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60, scale: 0.96 },
    visible: (custom = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: custom * 0.15,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  };

  return (
    <section className="py-16 space-y-10 overflow-hidden">
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Top Banner Ticker: Smooth Entrance on Scroll */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={fadeInUp}
        custom={0}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-white via-[#FBF9F5] to-white border border-[#5A181C]/15 py-4 shadow-sm"
      >
        <div className="flex items-center">
          <div className="flex items-center gap-3 px-6 z-20 bg-white/95 shrink-0 border-r border-stone-200">
            <div className="flex -space-x-2">
              <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="User" />
              <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="User" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A181C]">Live Feed</span>
          </div>

          <div className="overflow-hidden whitespace-nowrap w-full relative">
            <div className="animate-marquee flex items-center gap-12 cursor-pointer">
              {[...tickerItems, ...tickerItems].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#2B2625] hover:text-[#5A181C] transition-colors">
                  <span>{item}</span>
                  <span className="text-stone-300 mx-4">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column (Top Story & Middle Feed) */}
        <motion.div style={{ y: smoothYLeft }} className="lg:col-span-8 space-y-12">
          
          {/* TOP STORY SECTION */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeInUp}
            custom={1}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 border-b-2 border-[#5A181C]/20 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5A181C]"></span>
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#5A181C]">TOP STORY</span>
            </div>

            <div className="space-y-6 group cursor-pointer">
              <div className="overflow-hidden rounded-[2.5rem] h-[440px] shadow-xl relative border border-[#5A181C]/10">
                <img 
                  src={topStory.image} 
                  alt={topStory.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B1012]/95 via-[#2B1012]/30 to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8 text-white space-y-3">
                  <div className="inline-block px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-semibold tracking-widest uppercase border border-white/20">
                    September 2, 2026
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-sans font-bold leading-[1.15] text-[#FBF9F5]">
                    Apostle Ousmane Zagre Retires After 40 Years Of Distinguished Ministry
                  </h2>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#6E6563] font-light leading-relaxed px-2">
                After four decades of dedicated, sacrificial and fruitful service to God and the Church, Apostle Ousmane Patinde Zagre leaves an extraordinary footprint of grace, sacrifice, and visionary leadership...
              </p>
            </div>
          </motion.div>

          {/* MIDDLE STORIES (Each item reveals dynamically as you scroll down) */}
          <div className="space-y-6 pt-4">
            <div className="divide-y divide-stone-200/80">
              {middleStories.map((story, index) => (
                <motion.article 
                  key={story.id} 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                  variants={fadeInUp}
                  custom={index * 0.5}
                  className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-center gap-6 group cursor-pointer"
                >
                  <div className="w-full sm:w-48 h-32 shrink-0 rounded-2xl overflow-hidden bg-stone-100 shadow-sm border border-stone-200/50 relative">
                    <img 
                      src={story.image} 
                      alt={story.title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                    />
                  </div>
                  <div className="space-y-2.5 flex-1 w-full">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#5A181C] bg-[#5A181C]/5 px-2.5 py-1 rounded-md transition-colors duration-300 group-hover:bg-[#5A181C] group-hover:text-white">
                      Update
                    </span>
                    <h3 className="text-base sm:text-lg font-sans font-bold text-[#2B2625] group-hover:text-[#5A181C] transition-colors duration-300 leading-snug">
                      {story.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#6E6563] font-medium">
                      <span>{story.date}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

        </motion.div>

        {/* Right Column Sidebar (Animates with Offset Parallax to create depth against the left column) */}
        <motion.div 
          style={{ y: smoothYRight }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeInUp}
          custom={2}
          className="lg:col-span-4 bg-gradient-to-br from-[#3D0F12] via-[#5A181C] to-[#2B1012] text-white rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden border border-white/15"
        >
          <div className="absolute -right-12 -bottom-12 font-sans font-black text-white/[0.03] text-[12rem] pointer-events-none select-none leading-none">
            NEWS
          </div>

          <div className="flex items-center justify-between border-b border-white/15 pb-4 relative z-10">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-stone-200">
              OTHER NEWS
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>

          <div className="space-y-8 divide-y divide-white/10 relative z-10">
            {sideNews.map((news, idx) => (
              <motion.div 
                key={news.id} 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.4 }}
                variants={fadeInUp}
                custom={idx}
                className={`${idx !== 0 ? 'pt-8' : ''} space-y-4 group/item cursor-pointer`}
              >
                {news.image && (
                  <div className="w-full h-44 rounded-2xl overflow-hidden border border-white/15 shadow-md relative">
                    <img 
                      src={news.image} 
                      alt={news.title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/item:scale-105" 
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <span className="text-[10px] text-stone-300 font-semibold uppercase tracking-wider">{news.date}</span>
                  <h4 className="text-base sm:text-lg font-sans font-bold text-white group-hover/item:text-stone-200 transition-colors duration-300 leading-snug">
                    {news.title}
                  </h4>
                  <p className="text-xs text-stone-300 font-light leading-relaxed">
                    {news.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-4 relative z-10">
            <button className="w-full py-4 bg-white/10 hover:bg-white text-[#FBF9F5] hover:text-[#5A181C] text-xs font-semibold tracking-[0.2em] uppercase rounded-2xl transition-all duration-300 border border-white/20 backdrop-blur-md shadow-sm active:scale-95">
              Explore All News
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}