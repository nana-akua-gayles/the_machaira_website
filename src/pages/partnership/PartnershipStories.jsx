import React, { useState, useEffect } from 'react';
import { ArrowRight, User } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function PartnershipStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        const { data, error } = await supabase
          .from('partnership_stories') 
          .select('*')
          .limit(4);

        if (error) {
          console.error('Error fetching stories:', error.message);
        } else if (data) {
          setStories(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  return (
    <section className="px-15 py-12 flex flex-col items-center">
      <div className="flex justify-between items-end w-full mb-6">
        <div>
          <span className="text-burgundy-primary text-xl font-bold tracking-wider mb-1 block">
            Why Partner with Us?
          </span>
        </div>
        <button className="flex items-center gap-1 text-burgundy-primary font-semibold text-xs hover:opacity-80 transition-opacity group">
          View All Stories <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {loading ? (
        <div className="flex h-56 w-full items-center justify-center text-cool-gray text-xs tracking-widest animate-pulse">
          LOADING STORIES...
        </div>
      ) : stories.length === 0 ? (
        <div className="flex h-56 w-full items-center justify-center text-cool-gray text-xs tracking-widest">
          NO STORIES AVAILABLE
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {stories.map((story) => (
            <div 
              key={story.id} 
              onClick={() => setSelectedStory(story)}
              className="relative rounded-2xl overflow-hidden shadow-sm h-105 flex flex-col justify-end group cursor-pointer border border-soft-gray/30 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              {/* Full Background Image */}
              <div className="absolute inset-0 bg-soft-gray/20">
                {story.image_url ? (
                  <img 
                    src={story.image_url} 
                    alt={story.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-burgundy-primary/10 text-burgundy-primary">
                    <User className="w-16 h-16 opacity-40" />
                  </div>
                )}
              </div>

              {/* Edge-to-Edge Glassmorphism Overlay for Text */}
              <div className="relative z-10 w-full p-5 bg-navy-dark/80 backdrop-blur-md border-t border-parchment/10 text-parchment flex flex-col justify-between transition-colors group-hover:bg-navy-dark/90">
                <div>
                  <span className="text-xl text-burgundy-primary font-bold leading-none block mb-1">“</span>
                  <p className="text-xs text-soft-gray leading-relaxed mb-4 line-clamp-3">
                    {story.testimony}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-parchment leading-tight mb-0.5">
                    {story.name}
                  </h4>
                  <span className="text-[10px] text-soft-gray leading-tight block">
                    {story.org}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal/Expanded View when a card is tapped */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-parchment rounded-2xl max-w-lg w-full p-6 relative shadow-xl border border-soft-gray/40">
            <button 
              onClick={() => setSelectedStory(null)}
              className="absolute top-4 right-4 text-cool-gray hover:text-charcoal-text font-bold text-sm"
            >
              ✕
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-soft-gray/20 shrink-0">
                {selectedStory.image_url ? (
                  <img src={selectedStory.image_url} alt={selectedStory.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-burgundy-primary/10 text-burgundy-primary">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-charcoal-text">{selectedStory.name}</h3>
                <span className="text-xs text-cool-gray">{selectedStory.org}</span>
              </div>
            </div>
            <span className="text-3xl text-burgundy-primary font-bold leading-none block mb-2">“</span>
            <p className="text-xs text-cool-gray leading-relaxed mb-6">
              {selectedStory.testimony}
            </p>
            <button 
              onClick={() => setSelectedStory(null)}
              className="w-full py-2.5 bg-burgundy-primary text-white rounded-xl text-xs font-semibold hover:opacity-95 transition-opacity"
            >
              Close Testimony
            </button>
          </div>
        </div>
      )}
    </section>
  );
}