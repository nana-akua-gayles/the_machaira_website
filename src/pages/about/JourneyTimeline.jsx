import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ApostlesImage from '../../assets/images/Apostle2.jpg';

export default function JourneyTimeline() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0.9]);
  const yImage = useTransform(scrollYProgress, [0, 0.3], [30, 0]);
  const xMilestone = useTransform(scrollYProgress, [0, 0.4], [30, 0]);

  const milestones = [
    { title: 'The Rising Generation', desc: 'Inspired, nurtured, and equipped thousands of young people for ministry and global leadership.' },
    { title: 'Reclaiming the Soil', desc: 'Transformed villages and towns in Ghana through rural and urban mission campaigns.' },
    { title: 'An Army Without Borders', desc: 'Inspired and equipped over 5,000 missionaries globally.' },
    { title: 'Halls of Influence', desc: 'Impacted Secondary and Tertiary institutions in Ghana through Transformational 360 (T360).' },
  ];

  return (
    <motion.div 
      ref={containerRef}
      style={{ opacity }}
      className="bg-white rounded-3xl p-0 overflow-hidden border border-soft-gray/40 shadow-sm grid grid-cols-1 lg:grid-cols-12 items-stretch"
    >
      {/* Left Side: Full-bleed image reacting to scroll */}
      <motion.div 
        style={{ y: yImage }}
        className="lg:col-span-5 relative min-h-80 lg:min-h-full flex flex-col justify-end p-5 sm:p-6 overflow-hidden"
      >
        <img 
          src={ApostlesImage}
          alt="Apostle Benjamin Nana Amissah Ansah"
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
        />
        {/* Deep bottom-to-middle dark gradient wash */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent pointer-events-none" />
        
        {/* Text Content Placed Over the Image */}
        <div className="relative z-10 space-y-1.5">
          <span className="text-burgundy-primary text-[10px] font-bold tracking-[0.4em] uppercase">
            Global Footprint & Initiatives
          </span>
          <p className="text-xs text-zinc-200 leading-relaxed">
            Through various life-transforming meetings, mission campaigns, and initiatives including 
            YMS, GLOBAL ICONS, CDLS, SMEC, ONLINE MINISTRY SCHOOL, and IMOC, his leadership has broken 
            systemic barriers:
          </p>
        </div>
      </motion.div>

      {/* Right Side: Timeline Milestones & Family Section */}
      <motion.div 
        style={{ x: xMilestone }}
        className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-between"
      >
        {/* Milestones Container */}
        <div className="relative py-1">
          {/* Timeline Vertical Bar */}
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-burgundy-primary/20" />

          <div className="space-y-4 relative">
            {milestones.map((item, index) => (
              <div 
                key={index} 
                className="relative pl-9"
              >
                {/* Number Badge aligned cleanly on the vertical line */}
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-burgundy-primary text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                  {index + 1}
                </div>
                <div className="mb-0.5">
                  <h3 className="text-charcoal-text font-bold text-xs sm:text-sm">{item.title}</h3>
                </div>
                <p className="text-[11px] sm:text-xs text-cool-gray leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Family Section Separated from the Points */}
        <div className="mt-6 pt-4 border-t border-soft-gray/30 bg-parchment/60 p-3.5 rounded-2xl">
          <span className="text-burgundy-primary text-[10px] font-bold tracking-wider block mb-1 uppercase">
            A Legacy of Love
          </span>
          <p className="text-[11px] sm:text-xs text-charcoal-text leading-relaxed">
            Beyond his public ministry, Apostle Bennie walks in the beauty of a godly home. He is happily married to his partner in purpose, Pastor Selly Nana Akosua Amissah Ansah, 
            and together they are blessed with three lovely daughters: Jethra, Tiphara, and Liselle.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}