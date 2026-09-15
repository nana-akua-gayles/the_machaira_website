import React from 'react';
import { Plus, Play, Quote, MessageSquare, Users, MessageCircle, Globe } from 'lucide-react';

const DiscussionHero = () => {
  const stats = [
    { label: 'Discussions', value: '2,548', icon: MessageSquare, color: 'text-red-800 bg-red-50' },
    { label: 'Members', value: '18,763', icon: Users, color: 'text-emerald-800 bg-emerald-50' },
    { label: 'Replies', value: '6,392', icon: MessageCircle, color: 'text-rose-800 bg-rose-50' },
    { label: 'Online Now', value: '128', icon: Globe, color: 'text-amber-800 bg-amber-50' },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-4">
      {/* Background Scenic Overlay Container */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-8 md:p-12 mb-8 shadow-xl min-h-[360px] flex flex-col justify-between">
        <img
          src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=1600"
          alt="Lighthouse landscape"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/60 to-transparent" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Title & Action Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight leading-tight text-stone-50">
                Let’s Grow Together <br />
                in <span className="italic font-normal text-red-300">Faith</span> &{' '}
                <span className="italic font-normal text-red-300">Purpose</span>
              </h1>
              <p className="text-stone-300 text-sm md:text-base max-w-lg leading-relaxed pt-2">
                Ask questions. Share insights. Encourage others. Together, we build a stronger faith community.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button className="bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-red-900/30">
                <Plus className="w-4 h-4" /> Start a New Discussion
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-full text-xs font-semibold flex items-center gap-2 transition-all">
                <Play className="w-3.5 h-3.5 fill-current" /> How It Works
              </button>
            </div>
          </div>

          {/* Scripture Quote Box */}
          <div className="lg:col-span-5 flex justify-end">
            <div className="bg-white/90 backdrop-blur-md text-stone-800 p-6 rounded-2xl max-w-sm border border-white/40 shadow-2xl relative">
              <Quote className="w-8 h-8 text-stone-300 mb-2" />
              <p className="text-sm font-serif italic text-stone-700 leading-relaxed">
                “Iron sharpens iron, and one man sharpens another.”
              </p>
              <span className="block text-right text-xs font-semibold text-red-800 mt-3">
                — Proverbs 27:17
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-stone-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-lg font-bold text-stone-900 leading-none">
                  {stat.value}
                </span>
                <span className="text-xs text-stone-500 font-medium">{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DiscussionHero;