import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

export default function NewsfeedSection({ onSelectStory }) {
  const navigate = useNavigate();
  const [topStory, setTopStory] = useState(null);
  const [middleStories, setMiddleStories] = useState([]);
  const [sideNews, setSideNews] = useState([]);
  const [tickerItems, setTickerItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const extractFirstSentence = (text) => {
    if (!text) return '';
    const match = text.match(/[^.!?]+[.!?]+/);
    if (match) return match[0].trim();
    return text.length > 120 ? text.substring(0, 120).trim() + '...' : text;
  };

  // Helper to structure any clicked article so the reader modal gets standard fields
  const handleStoryClick = (item, categoryLabel = "UPDATE") => {
    if (!onSelectStory) return;
    
    onSelectStory({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle || item.date || categoryLabel,
      body: item.body || item.content || item.description,
      image_url: item.hero_image_url || item.image_url,
      isFeatured: false
    });
  };

  useEffect(() => {
    async function fetchNewsData() {
      try {
        setLoading(true);
        setError(null);

        const featuredQuery = supabase
          .from('featured_articles')
          .select('*')
          .order('updated_at', { ascending: false, nullsFirst: false })
          .limit(1)
          .maybeSingle();

        const articlesQuery = supabase
          .from('articles')
          .select('*')
          .order('updated_at', { ascending: false, nullsFirst: false });

        const [featuredRes, articlesRes] = await Promise.all([featuredQuery, articlesQuery]);

        let featuredData = featuredRes.data;
        if (featuredRes.error && featuredRes.error.code === '42703') {
          const fallbackFeatured = await supabase
            .from('featured_articles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          featuredData = fallbackFeatured.data;
        }

        let articlesData = articlesRes.data;
        if (articlesRes.error && articlesRes.error.code === '42703') {
          const fallbackArticles = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });
          articlesData = fallbackArticles.data;
        } else if (articlesRes.error) {
          throw articlesRes.error;
        }

        setTopStory(featuredData || null);

        const articles = articlesData || [];
        if (articles.length > 0) {
          // Display up to 3 articles in the middle
          setMiddleStories(articles.slice(0, 3));
          
          // Dynamically set side news indices based on available article count
          const sideStartIndex = Math.min(3, articles.length);
          const sideEndIndex = Math.min(5, articles.length);
          setSideNews(articles.slice(sideStartIndex, sideEndIndex));
          
          const liveTicker = articles.slice(0, 5).map(item => ({
            ...item,
            title: item.title,
            date: item.date || '',
            image_url: item.image_url
          }));
          setTickerItems(liveTicker);
        }
      } catch (err) {
        console.error("Error fetching news from Supabase:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNewsData();
  }, []);

  const { scrollYProgress } = useScroll();
  
  const smoothYLeft = useSpring(useTransform(scrollYProgress, [0, 1], [30, -30]), {
    stiffness: 100,
    damping: 20
  });

  const smoothYRight = useSpring(useTransform(scrollYProgress, [0, 1], [60, -20]), {
    stiffness: 80,
    damping: 25
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    visible: (custom = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        delay: custom * 0.1,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  };

  if (loading) {
    return (
      <div className="pb-24 text-center">
        <div className="w-8 h-8 border-4 border-[#5A181C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs tracking-widest uppercase text-[#6E6563]">Syncing Latest Updates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pb-20 text-center max-w-md mx-auto space-y-3">
        <p className="text-sm font-semibold text-[#5A181C]">Unable to load newsfeed at the moment.</p>
        <p className="text-xs text-[#6E6563]">{error}</p>
      </div>
    );
  }

  return (
    <section className="pt-0 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 overflow-hidden">
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {tickerItems.length > 0 && (
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          custom={0}
          className="relative overflow-hidden rounded-2xl bg-white/75 backdrop-blur-2xl border border-white/85 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-3.5"
        >
          <div className="flex items-center">
            <div className="flex items-center gap-2.5 px-6 z-20 bg-transparent shrink-0 border-r border-[#5A181C]/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A181C]">Headline</span>
            </div>

            <div className="overflow-hidden whitespace-nowrap w-full relative">
              <div className="animate-marquee flex items-center gap-10 cursor-pointer">
                {[...tickerItems, ...tickerItems].map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleStoryClick(item, "LIVE TICKER")}
                    className="flex items-center gap-2 text-xs font-medium text-[#2B2625] hover:text-[#5A181C] transition-colors"
                  >
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt="" 
                        className="w-5 h-5 rounded-full object-cover shrink-0 shadow-xs" 
                      />
                    )}
                    <span>{item.date ? `${item.date}: ` : ''}{item.title}</span>
                    <span className="text-stone-300 mx-3">•</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <motion.div style={{ y: smoothYLeft }} className="lg:col-span-8 space-y-10">
          
          {topStory && (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
              custom={1}
              className="space-y-5"
            >
              <div className="flex items-center gap-3 border-b border-[#5A181C]/15 pb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#5A181C]"></span>
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#5A181C]">TOP STORY</span>
              </div>

              <div 
                onClick={() => handleStoryClick({ ...topStory, image_url: topStory.hero_image_url || topStory.image_url }, "TOP STORY")}
                className="group cursor-pointer bg-[#FBF9F5] backdrop-blur-2xl rounded-3xl p-6 shadow-sm transition-all duration-500"
              >
                {topStory.hero_image_url && (
                  <div className="overflow-hidden rounded-2xl relative mb-4 h-72 sm:h-96 w-full">
                    <img 
                      src={topStory.hero_image_url} 
                      alt={topStory.title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                    />
                  </div>
                )}

                <div className="space-y-2.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#5A181C]/5 text-[10px] font-semibold tracking-wider uppercase text-[#5A181C]">
                    {topStory.date || "Featured"}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold leading-snug text-[#2B2625] group-hover:text-[#5A181C] transition-colors">
                    {topStory.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6E6563] font-normal leading-relaxed">
                    {topStory.description || extractFirstSentence(topStory.body || topStory.content)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {middleStories.length > 0 && (
            <div className="space-y-4">
              <div className="divide-y divide-[#5A181C]/5">
                {middleStories.map((story, index) => (
                  <motion.article 
                    key={story.id || index} 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                    custom={index * 0.3}
                    onClick={() => handleStoryClick(story, "UPDATE")}
                    className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-center gap-5 group cursor-pointer bg-white/40 backdrop-blur-md p-4 rounded-2xl hover:bg-white/80 transition-all duration-300"
                  >
                    {story.image_url && (
                      <div className="w-full sm:w-36 shrink-0 overflow-hidden rounded-xl">
                        <img 
                          src={story.image_url} 
                          alt={story.title} 
                          className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-110" 
                        />
                      </div>
                    )}
                    <div className="space-y-1.5 flex-1 w-full">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-[#5A181C] bg-[#5A181C]/5 px-2 py-0.5 rounded">
                        Update
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#2B2625] group-hover:text-[#5A181C] transition-colors leading-snug">
                        {story.title}
                      </h3>
                      <p className="text-xs text-[#6E6563] font-light line-clamp-2">
                        {story.description || extractFirstSentence(story.body || story.content)}
                      </p>
                      {story.date && <span className="text-[11px] text-[#6E6563] font-medium block">{story.date}</span>}
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}

        </motion.div>

        {sideNews.length > 0 && (
          <motion.div 
            style={{ y: smoothYRight }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            custom={2}
            className="lg:col-span-4 bg-linear-to-br from-[#3D0F12] via-[#5A181C] to-[#2B1012] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-3 relative z-10">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-stone-200">
                OTHER NEWS
              </span>
            </div>

            <div className="space-y-6 divide-y divide-white/10 relative z-10">
              {sideNews.map((news, idx) => (
                <div 
                  key={news.id || idx} 
                  onClick={() => handleStoryClick(news, "OTHER NEWS")}
                  className={`${idx !== 0 ? 'pt-6' : ''} space-y-3 group/item cursor-pointer`}
                >
                  {news.image_url && (
                    <div className="w-full overflow-hidden rounded-xl">
                      <img 
                        src={news.image_url} 
                        alt={news.title} 
                        className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover/item:scale-105" 
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    {news.date && <span className="text-[10px] text-stone-300 font-semibold tracking-wider">{news.date}</span>}
                    <h4 className="text-sm sm:text-base font-bold text-white group-hover/item:text-stone-200 transition-colors leading-snug">
                      {news.title}
                    </h4>
                    <p className="text-xs text-stone-300 font-light leading-relaxed">
                      {news.description || extractFirstSentence(news.body || news.content)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 relative z-10">
              <button 
                onClick={() => navigate('/news')}
                className="w-full py-3.5 bg-white/10 hover:bg-white text-[#FBF9F5] hover:text-[#5A181C] text-[11px] font-semibold tracking-[0.15em] uppercase rounded-xl transition-all duration-300 backdrop-blur-md active:scale-95 shadow-sm cursor-pointer"
              >
                Explore All News
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}