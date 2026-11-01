
import { useState, useEffect } from 'react';
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

    return text.length > 120
      ? text.substring(0, 120).trim() + '...'
      : text;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Standardize clicked articles for the reader modal.
  const handleStoryClick = (item, categoryLabel = 'UPDATE') => {
    if (!onSelectStory) return;

    onSelectStory({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle || categoryLabel,
      body: item.body || '',
      image_url: item.hero_image_url || item.image_url,
      isFeatured: Boolean(item.isFeatured)
    });
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchNewsData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch only the latest active featured article.
        const featuredQuery = supabase
          .from('featured_articles')
          .select(
            'id, title, subtitle, body, hero_image_url, is_active, published_at, created_at'
          )
          .eq('is_active', true)
          .order('published_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Fetch only the latest five regular articles.
        const articlesQuery = supabase
          .from('articles')
          .select('id, title, body, image_url, created_at, category')
          .order('created_at', {
            ascending: false,
            nullsFirst: false
          })
          .order('id', { ascending: false })
          .limit(5);

        const [featuredRes, articlesRes] = await Promise.all([
          featuredQuery,
          articlesQuery
        ]);

        if (featuredRes.error) throw featuredRes.error;
        if (articlesRes.error) throw articlesRes.error;

        if (!isMounted) return;

        // Prepare the featured article.
        const featuredData = featuredRes.data
          ? {
              ...featuredRes.data,
              displayDate: formatDate(
                featuredRes.data.published_at ||
                featuredRes.data.created_at
              ),
              isFeatured: true
            }
          : null;

        setTopStory(featuredData);

        // Prepare regular articles.
        const articles = (articlesRes.data || []).map((item) => ({
          ...item,
          displayDate: formatDate(item.created_at),
          isFeatured: false
        }));

        // First three articles appear in the middle section.
        setMiddleStories(articles.slice(0, 3));

        // Remaining two articles appear in the side section.
        setSideNews(articles.slice(3, 5));

        // Latest five articles appear in the headlines ticker.
        setTickerItems(articles.slice(0, 5));
      } catch (err) {
        console.error(
          'Error fetching news from Supabase:',
          err.message
        );

        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchNewsData();

    return () => {
      isMounted = false;
    };
  }, []);

  const { scrollYProgress } = useScroll();

  const smoothYLeft = useSpring(
    useTransform(scrollYProgress, [0, 1], [30, -30]),
    {
      stiffness: 100,
      damping: 20
    }
  );

  const smoothYRight = useSpring(
    useTransform(scrollYProgress, [0, 1], [60, -20]),
    {
      stiffness: 80,
      damping: 25
    }
  );

  const fadeInUp = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.98
    },
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
        <p className="text-xs tracking-widest uppercase text-[#6E6563]">
          Syncing Latest Updates...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pb-20 text-center max-w-md mx-auto space-y-3">
        <p className="text-sm font-semibold text-[#5A181C]">
          Unable to load newsfeed at the moment.
        </p>
        <p className="text-xs text-[#6E6563]">{error}</p>
      </div>
    );
  }

  return (
    <section className="pt-0 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-7 sm:space-y-12 overflow-hidden">

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 48s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* HEADLINES TICKER */}
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
            <div className="flex items-center gap-2.5 px-3 sm:px-6 z-20 bg-transparent shrink-0 border-r border-[#5A181C]/10">
              <span className="text-xs sm:text-[11px] font-bold uppercase tracking-wider text-[#5A181C]">
                Headlines
              </span>
            </div>

            <div className="overflow-hidden whitespace-nowrap w-full relative">
              <div className="animate-marquee flex items-center gap-10 cursor-pointer">
                {[...tickerItems, ...tickerItems].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleStoryClick(item, 'LIVE TICKER')}
                    className="flex items-center gap-3 text-sm sm:text-xs font-medium text-[#2B2625] hover:text-[#5A181C] transition-colors"
                  >
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt=""
                        loading="lazy"
                        className="w-5 h-5 rounded-full object-cover shrink-0 shadow-xs"
                      />
                    )}

                    <span>
                      {item.displayDate
                        ? `${item.displayDate}: `
                        : ''}
                      {item.title}
                    </span>

                    <span className="text-stone-300 mx-3">•</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

        {/* LEFT COLUMN */}
        <motion.div
          style={{ y: smoothYLeft }}
          className="lg:col-span-8 space-y-6 sm:space-y-10"
        >

          {/* TOP STORY */}
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
                <span className="w-2 h-2 rounded-full bg-[#5A181C]" />

                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#5A181C]">
                  TOP STORY
                </span>
              </div>

              <div
                onClick={() => handleStoryClick(topStory, 'TOP STORY')}
                className="group cursor-pointer bg-[#FBF9F5] backdrop-blur-2xl rounded-3xl p-3 sm:p-6 shadow-sm transition-all duration-500"
              >
                {topStory.hero_image_url && (
                  <div className="overflow-hidden rounded-2xl relative mb-4 h-52 sm:h-96 w-full">
                    <img
                      src={topStory.hero_image_url}
                      alt={topStory.title}
                      loading="eager"
                      fetchPriority="high"
                      className="w-full h-full object-cover object-center max-sm:object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="space-y-2.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#5A181C]/5 text-[10px] font-semibold tracking-wider uppercase text-[#5A181C]">
                    {topStory.subtitle || 'Featured'}
                  </span>

                  <h2 className="text-xl sm:text-3xl font-bold leading-snug text-[#2B2625] group-hover:text-[#5A181C] transition-colors">
                    {topStory.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#6E6563] font-normal leading-relaxed">
                    {extractFirstSentence(topStory.body)}
                  </p>

                  {topStory.displayDate && (
                    <span className="text-[11px] text-[#6E6563] font-medium block">
                      {topStory.displayDate}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* MIDDLE ARTICLES */}
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
                    onClick={() => handleStoryClick(story)}
                    className="py-5 first:pt-0 last:pb-0 flex flex-row items-start sm:items-center gap-3 sm:gap-5 group cursor-pointer bg-white/40 backdrop-blur-md p-3 sm:p-4 rounded-2xl hover:bg-white/80 transition-all duration-300"
                  >
                    {story.image_url && (
                      <div className="w-24 sm:w-36 shrink-0 overflow-hidden rounded-xl">
                        <img
                          src={story.image_url}
                          alt={story.title}
                          loading="lazy"
                          className="w-full h-24 sm:h-auto object-cover object-center max-sm:object-top transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5 flex-1 w-full">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-[#5A181C] bg-[#5A181C]/5 px-2 py-0.5 rounded">
                        {story.category || 'Update'}
                      </span>

                      <h3 className="text-sm sm:text-base font-bold text-[#2B2625] group-hover:text-[#5A181C] transition-colors leading-snug">
                        {story.title}
                      </h3>

                      <p className="text-xs text-[#6E6563] font-light line-clamp-2">
                        {extractFirstSentence(story.body)}
                      </p>

                      {story.displayDate && (
                        <span className="text-[11px] text-[#6E6563] font-medium block">
                          {story.displayDate}
                        </span>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}

        </motion.div>

        {/* RIGHT COLUMN - OTHER NEWS */}
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
                  onClick={() => handleStoryClick(news, 'OTHER NEWS')}
                  className={`${idx !== 0 ? 'pt-6' : ''} space-y-3 group/item cursor-pointer`}
                >
                  {news.image_url && (
                    <div className="w-full overflow-hidden rounded-xl">
                      <img
                        src={news.image_url}
                        alt={news.title}
                        loading="lazy"
                        className="w-full h-56 sm:h-auto object-cover object-center max-sm:object-top 
                        transition-transform duration-700 ease-out group-hover/item:scale-105"                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {news.displayDate && (
                      <span className="text-[10px] text-stone-300 font-semibold tracking-wider">
                        {news.displayDate}
                      </span>
                    )}

                    <h4 className="text-sm sm:text-base font-bold text-white group-hover/item:text-stone-200 transition-colors leading-snug">
                      {news.title}
                    </h4>

                    <p className="text-xs text-stone-300 font-light leading-relaxed">
                      {extractFirstSentence(news.body)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 relative z-10">
              <button
                onClick={() => navigate('/newsfeed')}
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
