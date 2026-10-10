import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, MessageCircle, Pin, ChevronDown } from 'lucide-react';
import { getPosts } from '../../../lib/forumService';
import { formatRelativeTime, initials } from './forumHelpers';

const TABS = [
  { key: 'latest', label: 'Latest Discussions' },
  { key: 'trending', label: 'Trending' },
  { key: 'mostReplies', label: 'Most Replies' },
  { key: 'unanswered', label: 'Unanswered' },
];

const PAGE_SIZE = 10;

const DiscussionFeed = ({ selectedCategory }) => {
  const [activeTab, setActiveTab] = useState('latest');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Reload from the top whenever the category or the active tab changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function loadPosts() {
      try {
        const data = await getPosts({
          category: selectedCategory,
          sortBy: activeTab,
          limit: PAGE_SIZE,
          offset: 0,
        });
        if (!cancelled) {
          setPosts(data);
          setHasMore(data.length === PAGE_SIZE);
        }
      } catch (err) {
        console.error('FORUM FEED LOAD FAILED:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory, activeTab]);

  async function handleLoadMore() {
    setLoadingMore(true);
    try {
      const more = await getPosts({
        category: selectedCategory,
        sortBy: activeTab,
        limit: PAGE_SIZE,
        offset: posts.length,
      });
      setPosts((prev) => [...prev, ...more]);
      setHasMore(more.length === PAGE_SIZE);
    } catch (err) {
      console.error('FORUM LOAD MORE FAILED:', err);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="min-w-0 bg-white border border-[#B9BEC8]/30 rounded-2xl px-3 py-4 sm:p-5 shadow-sm space-y-4 sm:space-y-5">
      {/* Feed Filters Header */}
      <div className="flex min-w-0 items-center gap-2 border-b border-[#B9BEC8]/25 pb-3 sm:pb-4">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-[#FBF0F0] text-[#991313]'
                  : 'text-[#4D5057] hover:text-[#101A2B] hover:bg-[#F8F8F8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button className="hidden items-center gap-2 border border-stone-200 text-stone-700 px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-stone-50 transition-colors">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
        </button>
      </div>

      {/* Discussion Item List */}
      {loading ? (
        <p className="text-sm text-stone-400 py-8 text-center">Loading discussions...</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-stone-400 py-8 text-center">
          No discussions here yet. Be the first to start one!
        </p>
      ) : (
        <div className="divide-y divide-stone-100">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/forum/${post.id}`}
              className="block min-w-0 py-4 hover:bg-[#F8F8F8] rounded-xl px-1 sm:px-2 transition-colors no-underline"
            >
              <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-4">
                <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                  {post.author?.avatar_url ? (
                    <img
                      src={post.author.avatar_url}
                      alt={post.author.name || 'Author'}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-stone-200 shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-50 text-red-800 text-xs font-bold flex items-center justify-center border border-stone-200 shrink-0">
                      {initials(post.author?.name)}
                    </div>
                  )}

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-[13px] leading-5 sm:text-sm text-[#101A2B] hover:text-red-900 transition-colors">
                        {post.title}
                      </h4>
                      {post.pinned && <Pin className="w-3.5 h-3.5 text-red-800 fill-current" />}
                    </div>
                    <div className="flex min-w-0 items-center gap-x-1.5 gap-y-1 text-[10px] sm:text-[11px] text-[#4D5057] flex-wrap">
                      <span className="font-medium text-stone-700">{post.category}</span>
                      <span>•</span>
                      <span>Started by {post.author?.name || 'A member'}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(post.created_at)}</span>
                    </div>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-[11px] text-[#4D5057] font-medium shrink-0 pt-1">
                  <MessageCircle className="w-3.5 h-3.5" /> {post.replies_count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Action */}
      {!loading && hasMore && posts.length > 0 && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 px-6 py-2.5 rounded-full transition-colors disabled:opacity-60"
          >
            {loadingMore ? 'Loading...' : 'Load More Discussions'} <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscussionFeed;