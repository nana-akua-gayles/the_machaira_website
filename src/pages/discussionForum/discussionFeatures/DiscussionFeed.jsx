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
    <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Feed Filters Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-red-50 text-red-900'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 border border-stone-200 text-stone-700 px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-stone-50 transition-colors">
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
              className="block py-4 hover:bg-stone-50/50 rounded-xl px-2 transition-colors no-underline"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {post.author?.avatar_url ? (
                    <img
                      src={post.author.avatar_url}
                      alt={post.author.name || 'Author'}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-800 text-xs font-bold flex items-center justify-center border border-stone-200 shrink-0">
                      {initials(post.author?.name)}
                    </div>
                  )}

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm text-stone-900 hover:text-red-900 transition-colors">
                        {post.title}
                      </h4>
                      {post.pinned && <Pin className="w-3.5 h-3.5 text-red-800 fill-current" />}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 flex-wrap">
                      <span className="font-medium text-stone-700">{post.category}</span>
                      <span>•</span>
                      <span>Started by {post.author?.name || 'A member'}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(post.created_at)}</span>
                    </div>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 text-xs text-stone-400 font-medium shrink-0">
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