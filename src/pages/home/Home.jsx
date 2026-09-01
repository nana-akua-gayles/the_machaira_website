import React from "react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-16">

      {/* ================= HERO SECTION ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Hero Text Content */}
        <div className="lg:col-span-6 space-y-6">


          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] font-serif text-navy-dark">
            God’s Word. <br />
            <span className="italic font-normal text-burgundy-primary">Your</span> Transformation.
          </h1>

          <p className="text-base sm:text-lg text-cool-gray max-w-lg leading-relaxed font-sans">
            Dive into life-transforming teachings from the book Machaira and grow in faith, truth, and purpose every day.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button className="bg-burgundy-primary hover:bg-navy-dark text-white font-medium px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 group">
              <svg className="w-5 h-5 text-white/90 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Start Your Journey
            </button>

            <button className="bg-white hover:bg-soft-gray/10 text-charcoal-text border border-soft-gray/50 font-medium px-7 py-3.5 rounded-full shadow-xs hover:shadow transition-all flex items-center gap-2.5">
              <svg className="w-5 h-5 text-burgundy-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Latest Episode
            </button>
          </div>

          {/* Scripture Quote Box */}
          <div className="p-5 bg-white border border-soft-gray/40 rounded-2xl shadow-xs max-w-md">
            <div className="flex gap-4 items-start">
              <span className="text-3xl text-burgundy-primary font-serif leading-none">“</span>
              <div>
                <p className="text-xs sm:text-sm italic text-charcoal-text mb-1 font-medium">
                  Your word is a lamp to my feet and a light to my path.
                </p>
                <span className="text-[10px] font-bold tracking-wider uppercase text-cool-gray">— Psalm 119:105</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hero Image Layout (Book Mockup Showcase) */}
        <div className="lg:col-span-6 relative">
          <div className="relative mx-auto max-w-xl">
            <div className="absolute -inset-2 bg-linear-to-tr from-soft-gray/20 to-transparent rounded-3xl blur-2xl opacity-60 -z-10"></div>
            
            <div className="bg-white p-3 sm:p-4 rounded-3xl border border-soft-gray/40 shadow-xl relative">
              <img 
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop" 
                alt="Machaira Book Showcase" 
                className="rounded-2xl w-full object-cover shadow-inner max-h-105"
              />
            </div>
          </div>
        </div>

      </section>

      {/* ================= FEATURE CARDS GRID ================= */}
      <section className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white border border-soft-gray/40 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-soft-gray/20 text-burgundy-primary flex items-center justify-center mb-4 group-hover:bg-burgundy-primary group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-charcoal-text mb-1.5 font-serif">Daily Devotional</h3>
              <p className="text-xs text-cool-gray leading-relaxed mb-4">
                Be refreshed daily with God's Word and practical insights for your life.
              </p>
              <div className="rounded-xl overflow-hidden mb-4 h-28 bg-soft-gray/10 border border-soft-gray/30">
                <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=500&auto=format&fit=crop" alt="Devotional" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <a href="#devotional" className="text-xs font-bold text-burgundy-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Read Today's Devotional &rarr;
            </a>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-soft-gray/40 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-soft-gray/20 text-burgundy-primary flex items-center justify-center mb-4 group-hover:bg-burgundy-primary group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-charcoal-text mb-1.5 font-serif">Previous Episodes</h3>
              <p className="text-xs text-cool-gray leading-relaxed mb-4">
                Watch or listen to powerful teachings that will build your faith.
              </p>
              <div className="rounded-xl overflow-hidden mb-4 h-28 bg-soft-gray/10 border border-soft-gray/30">
                <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=500&auto=format&fit=crop" alt="Episodes" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <a href="#episodes" className="text-xs font-bold text-burgundy-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Explore Episodes &rarr;
            </a>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-soft-gray/40 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-soft-gray/20 text-burgundy-primary flex items-center justify-center mb-4 group-hover:bg-burgundy-primary group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-charcoal-text mb-1.5 font-serif">Community Forum</h3>
              <p className="text-xs text-cool-gray leading-relaxed mb-4">
                Join meaningful discussions, ask questions, and grow together.
              </p>
              <div className="rounded-xl overflow-hidden mb-4 h-28 bg-soft-gray/10 border border-soft-gray/30">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=500&auto=format&fit=crop" alt="Forum" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <a href="#forum" className="text-xs font-bold text-burgundy-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Join the Conversation &rarr;
            </a>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-soft-gray/40 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-soft-gray/20 text-burgundy-primary flex items-center justify-center mb-4 group-hover:bg-burgundy-primary group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-charcoal-text mb-1.5 font-serif">Church Blog</h3>
              <p className="text-xs text-cool-gray leading-relaxed mb-4">
                Stay updated with inspiring stories, announcements, and ministry updates.
              </p>
              <div className="rounded-xl overflow-hidden mb-4 h-28 bg-soft-gray/10 border border-soft-gray/30">
                <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=500&auto=format&fit=crop" alt="Blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <a href="#blog" className="text-xs font-bold text-burgundy-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Read the Latest &rarr;
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}