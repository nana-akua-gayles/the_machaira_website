import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import blogImage from "../../assets/images/blog.jpg";
import discussionImage from "../../assets/images/discussion.jpg";
import testimonyImage from "../../assets/images/testimony.jpg";

const cards = [
  { title: "Discussion Forum", to: "/forum", image: discussionImage },
  { title: "Ministry Blog", to: "/newsfeed", image: blogImage },
  { title: "Testimonies", to: "/testimonials", image: testimonyImage },
];

export default function MobileJourneyWindmill() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef(null);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % cards.length), 4500);
    return () => window.clearInterval(timer);
  }, [paused]);

  function finishSwipe(event) {
    if (startX.current === null) return;
    const distance = event.changedTouches[0].clientX - startX.current;
    if (Math.abs(distance) > 35) {
      setActive((current) => (current + (distance < 0 ? 1 : cards.length - 1)) % cards.length);
      setPaused(true);
    }
    startX.current = null;
  }

  return (
    <div className="md:hidden" aria-label="Explore Machaira ministries">
      <div className="relative h-[350px] overflow-hidden" onTouchStart={(event) => { startX.current = event.touches[0].clientX; }} onTouchEnd={finishSwipe}>
        {cards.map((card, index) => {
          const offset = (index - active + cards.length) % cards.length;
          const current = offset === 0;
          return (
            <Link key={card.to} to={card.to} aria-label={`Explore ${card.title}`} tabIndex={current ? 0 : -1}
              className={`absolute left-1/2 top-2 block h-[310px] w-[min(78vw,320px)] overflow-hidden rounded-[26px] bg-[#2B2625] shadow-xl transition-all duration-700 ease-in-out motion-reduce:transition-none ${current ? 'z-30 opacity-100' : offset === 1 ? 'z-20 opacity-75' : 'z-10 opacity-55'}`}
              style={{ transform: current ? 'translateX(-50%) rotate(0deg) scale(1)' : offset === 1 ? 'translateX(-35%) rotate(10deg) scale(.87)' : 'translateX(-65%) rotate(-10deg) scale(.87)', pointerEvents: current ? 'auto' : 'none' }}>
              <img src={card.image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-x-5 bottom-6 flex items-center justify-between gap-3 text-white">
                <h3 className="font-serif text-[22px] font-semibold">{card.title}</h3>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/15 text-xl">↗</span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-1 flex items-center justify-center gap-3">
        <button type="button" aria-label="Previous ministry" onClick={() => { setPaused(true); setActive((current) => (current + cards.length - 1) % cards.length); }} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#5A181C]/20">←</button>
        {cards.map((card, index) => <button type="button" key={card.to} aria-label={`Show ${card.title}`} aria-current={active === index ? 'true' : undefined} onClick={() => { setPaused(true); setActive(index); }} className={`h-2.5 rounded-full transition-all ${active === index ? 'w-7 bg-[#5A181C]' : 'w-2.5 bg-[#5A181C]/25'}`} />)}
        <button type="button" aria-label="Next ministry" onClick={() => { setPaused(true); setActive((current) => (current + 1) % cards.length); }} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#5A181C]/20">→</button>
      </div>
    </div>
  );
}
