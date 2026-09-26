import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Star, ArrowRight } from 'lucide-react';
import { getTrendingPosts, getTopContributor } from '../../../lib/forumService';
import { initials } from './forumHelpers';
import { isAdmin } from '../../../lib/adminAccess';
import { useAuth } from '../../../context/AuthContext';

const DiscussionRightSidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canStartDiscussion = isAdmin(user);
  const [trending, setTrending] = useState([]);
  const [topContributor, setTopContributor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [trendingPosts, contributor] = await Promise.all([
          getTrendingPosts(3),
          getTopContributor(),
        ]);
        if (!cancelled) {
          setTrending(trendingPosts);
          setTopContributor(contributor);
        }
      } catch (err) {
        console.error('FORUM SIDEBAR FAILED:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <aside className="space-y-6">
      {/* Trending Topics Widget */}
      <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
          <TrendingUp className="w-4 h-4 text-red-800" />
          <h3>Trending Discussions</h3>
        </div>

        <div className="space-y-3">
          {!loading && trending.length === 0 && (
            <p className="text-xs text-stone-400">No discussions yet, be the first!</p>
          )}

          {trending.map((post, index) => (
            <Link
              key={post.id}
              to={`/forum/${post.id}`}
              className="flex items-center justify-between gap-3 group cursor-pointer no-underline"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-5 shrink-0 text-center text-xs font-bold text-stone-400 group-hover:text-red-800">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-stone-800 group-hover:text-red-900 line-clamp-1 transition-colors">
                    {post.title}
                  </h4>
                  <span className="text-[11px] text-stone-400">{post.replies_count} replies</span>
                </div>
              </div>
              {post.author?.avatar_url ? (
                <img
                  src={post.author.avatar_url}
                  alt={post.author.name || 'Author'}
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-800 text-xs font-bold flex items-center justify-center shrink-0">
                  {initials(post.author?.name)}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Community Spotlight Widget */}
      <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h3>Community Spotlight</h3>
        </div>

        {topContributor ? (
          <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100">
            {topContributor.avatar_url ? (
              <img
                src={topContributor.avatar_url}
                alt={topContributor.name || 'Top contributor'}
                className="w-12 h-12 rounded-full object-cover border border-white shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-800 text-sm font-bold flex items-center justify-center border border-white shadow-sm">
                {initials(topContributor.name)}
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-stone-900">{topContributor.name || 'Community member'}</h4>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Top Contributor
                </span>
              </div>
              <p className="text-[11px] text-stone-500">{topContributor.replyCount} replies</p>
            </div>
          </div>
        ) : (
          !loading && <p className="text-xs text-stone-400">No replies yet, start the conversation!</p>
        )}
      </div>

      {/* Call to Action Banner — only shown to admins, since only they can start a discussion */}
      {canStartDiscussion && (
        <div className="bg-stone-100 border border-stone-200/60 rounded-2xl p-6 relative overflow-hidden space-y-4">
          <div className="space-y-1 relative z-10">
            <h4 className="font-serif font-bold text-stone-900 text-base">Your voice matters.</h4>
            <p className="text-xs text-stone-600">Be a blessing today!</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/forum/new')}
            className="relative z-10 bg-red-800 hover:bg-red-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-md"
          >
            Start a New Discussion <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
};

export default DiscussionRightSidebar;