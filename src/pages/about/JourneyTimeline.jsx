import React from 'react';
import { motion } from 'framer-motion';
import ApostlesImage from '../../assets/images/Apostle2.jpg';

export default function JourneyTimeline() {
  const milestones = [
    { title: 'The Rising Generation', desc: 'Inspired, nurtured, and equipped thousands of young people for ministry and global leadership.' },
    { title: 'Reclaiming the Soil', desc: 'Transformed villages and towns in Ghana through rural and urban mission campaigns.' },
    { title: 'An Army Without Borders', desc: 'Inspired and equipped over 5,000 missionaries globally.' },
    { title: 'Halls of Influence', desc: 'Impacted Secondary and Tertiary institutions in Ghana through Transformational 360 (T360).' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl p-0 overflow-hidden border border-soft-gray/40 shadow-sm grid grid-cols-1 lg:grid-cols-12 items-stretch"
    >
      {/* Left Side: Full-bleed Image with zero margins/padding */}
      <div className="lg:col-span-5 relative min-h-87.5 lg:min-h-full flex flex-col justify-end p-6">
        <img 
          src={ApostlesImage}
          alt="Apostle Benjamin Nana Amissah Ansah"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Deep bottom-to-middle dark gradient wash */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent" />
        
        {/* Text Content Placed Over the Image */}
        <div className="relative z-10 space-y-2">
          <span className="text-burgundy-primary text-[10px] font-bold tracking-[0.4em] uppercase">
            Global Footprint & Initiatives
          </span>
          <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
            Through various life-transforming meetings, mission campaigns, and initiatives including 
            YMS, GLOBAL ICONS, CDLS, SMEC, ONLINE MINISTRY SCHOOL, and IMOC, his leadership has broken 
            systemic barriers:
          </p>
        </div>
      </div>

      {/* Right Side: Timeline Milestones (Years removed) */}
      <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 relative flex flex-col justify-center">
        <div className="absolute left-6 sm:left-10 top-12 bottom-12 w-0.5 bg-burgundy-primary/20" />

        <div className="space-y-6 relative pl-6">
          {milestones.map((item, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-9.25 top-0 w-6 h-6 rounded-full bg-burgundy-primary text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                {index + 1}
              </div>
              <div className="mb-1">
                <h3 className="text-charcoal-text font-bold text-sm">{item.title}</h3>
              </div>
              <p className="text-xs text-cool-gray leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}