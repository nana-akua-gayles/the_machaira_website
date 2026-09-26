import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import AuthorStats from './AuthorStats';
import JourneyTimeline from './JourneyTimeline';
import BooksGrid from './BooksGrid';
import ApostlesImage from '../../assets/images/Apostle3.jpg';

export default function About() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-12">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Text (Expanded to col-span-8 to keep balanced) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 space-y-4"
          >
            <p className="text-burgundy-primary text-[11px] font-bold tracking-[0.2em] uppercase">
              ABOUT THE AUTHOR
            </p>
            
            <div>
              <h1 className="text-xl sm:text-2xl font-bold leading-[1.3]">
                The <span className="text-burgundy-primary">originating voice</span> and <span className="text-burgundy-primary">prophetic author</span> of the Machaira devotional.
              </h1>
              <div className="w-12 h-1 bg-burgundy-primary mt-2 mb-4 rounded-full" />
            </div>

            <p className="text-cool-gray text-xs sm:text-sm leading-relaxed">
              Apostle Benjamin Nana Amissah Ansah is a renowned transgenerational leader and Sound Kingdom expositor with a mandate of influencing the techno-pluralistic society with the intent of Christ through the saturation and filling of every heart with the intrinsic knowledge of the fullness of the reigning life in Christ.
            </p>
            <p className="text-cool-gray text-xs sm:text-sm leading-relaxed">
              His multifaceted ministry encompasses sound prophetic-teaching, healing, and establishing believers in spiritual understanding. He is the originating voice and prophetic author of Machaira with Apostle Bennie devotional.
            </p>
          </motion.div>

          {/* Right Column: Slimmer Profile Photo (Reduced to col-span-4) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-4 relative"
          >
            {/* Using overflow-visible so the quote card can hang over the edge */}
            <div className="relative rounded-xl overflow-visible shadow-2xl bg-navy-dark h-95 sm:h-105">
              <div className="w-full h-full rounded-xl overflow-hidden">
                <img 
                  src={ApostlesImage}
                  alt="Apostle Benjamin Nana Amissah Ansah"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent rounded-xl" />
              </div>
              
              {/* Compact Quote Card (aspect-square removed so text and author group naturally without dead space) */}
              <div className="absolute -right-4 sm:-right-20 -bottom-5 sm:-bottom-7 z-25 w-36 sm:w-40 bg-white shadow-2xl rounded-xl p-3 sm:p-3.5 border border-soft-gray/40 flex flex-col space-y-2.5">
                <div>
                  <Quote size={14} className="text-burgundy-primary mb-1 opacity-80" />
                  <p className="text-charcoal-text text-[9px] sm:text-[10px] italic leading-tight">
                    Let Posterity know : I raised leaders in every major seat of power in this nation and nations beyond.
                  </p>
                </div>
                <p className="text-burgundy-primary text-[9px] font-bold text-right">
                  ~ Apostle Bennie
                </p>
              </div>

            </div>
          </motion.div>

        </div>

        {/* Modular Sections */}
        <AuthorStats />
        <JourneyTimeline />
        <BooksGrid />

      </div>
    </div>
  );
}