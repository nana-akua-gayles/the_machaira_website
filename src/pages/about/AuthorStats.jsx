import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, BookOpen, Globe, HeartHandshake } from 'lucide-react';

// Helper component for count-up animation triggered on scroll
function Counter({ value }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const numericMatch = value.match(/\d+/);
  const targetNumber = numericMatch ? parseInt(numericMatch[0], 10) : 0;
  const suffix = value.replace(/\d+/, '');

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1200;
    const incrementTime = 25;
    const steps = duration / incrementTime;
    const stepValue = targetNumber / steps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= targetNumber) {
        setCount(targetNumber);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, targetNumber]);

  return (
    <span ref={ref} className="text-burgundy-primary">
      {count}{suffix}
    </span>
  );
}

export default function AuthorStats() {
  const stats = [
    { icon: Users, count: '10+', label: 'Years in Ministry' },
    { icon: BookOpen, count: '35+', label: 'Books & Resources' },
    { icon: Globe, count: '5K+', label: 'Raised Missionaries' },
    { icon: HeartHandshake, count: '100K+', label: 'Lives Impacted' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
    >
      {stats.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div key={index} className="bg-white p-3.5 rounded-xl border border-soft-gray/40 shadow-xs flex items-center space-x-3">
            {/* Icon on the left side */}
            <div className="w-10 h-10 shrink-0 rounded-full bg-red-50 flex items-center justify-center text-burgundy-primary">
              <IconComponent size={18} />
            </div>
            {/* Text and Number content */}
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">
                <Counter value={item.count} />
              </span>
              <span className="text-cool-gray text-[11px] font-medium leading-tight">
                {item.label}
              </span>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}