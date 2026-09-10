import React from 'react';
import { TrendingUp, Star, ArrowRight } from 'lucide-react';

const DiscussionRightSidebar = () => {
  const trending = [
    {
      id: 1,
      title: 'Overcoming anxiety through prayer',
      replies: '32 replies',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=150',
    },
    {
      id: 2,
      title: 'The power of gratitude daily',
      replies: '28 replies',
      image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=150',
    },
    {
      id: 3,
      title: 'How to study the Bible effectively',
      replies: '25 replies',
      image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=150',
    },
  ];

  return (
    <aside className="space-y-6">
      {/* Trending Topics Widget */}
      <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
          <TrendingUp className="w-4 h-4 text-red-800" />
          <h3>Trending Discussions</h3>
        </div>

        <div className="space-y-3">
          {trending.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between gap-3 group cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="w-5 text-center text-xs font-bold text-stone-400 group-hover:text-red-800">
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-stone-800 group-hover:text-red-900 line-clamp-1 transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-stone-400">{item.replies}</span>
                </div>
              </div>
              <img
                src={item.image}
                alt={item.title}
                className="w-10 h-10 rounded-xl object-cover shrink-0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Community Spotlight Widget */}
      <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h3>Community Spotlight</h3>
        </div>

        <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
            alt="Matthew O."
            className="w-12 h-12 rounded-full object-cover border border-white shadow-sm"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-stone-900">Matthew O.</h4>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Top Contributor
              </span>
            </div>
            <p className="text-[11px] text-stone-500">245 replies • 32 helpful answers</p>
          </div>
        </div>

        <button className="w-full text-right text-xs font-semibold text-red-800 hover:text-red-950 transition-colors">
          View Profile
        </button>
      </div>

      {/* Call to Action Banner */}
      <div className="bg-stone-100 border border-stone-200/60 rounded-2xl p-6 relative overflow-hidden space-y-4">
        <div className="space-y-1 relative z-10">
          <h4 className="font-serif font-bold text-stone-900 text-base">Your voice matters.</h4>
          <p className="text-xs text-stone-600">Be a blessing today!</p>
        </div>
        <button className="relative z-10 bg-red-800 hover:bg-red-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-md">
          Start a New Discussion <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

export default DiscussionRightSidebar;