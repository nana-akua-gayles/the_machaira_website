import React, { useState } from 'react';
import { SlidersHorizontal, MessageCircle, Eye, Pin, ChevronDown } from 'lucide-react';

const DiscussionFeed = () => {
  const [activeTab, setActiveTab] = useState('Latest Discussions');

  const tabs = ['Latest Discussions', 'Trending', 'Most Replies', 'Unanswered'];

  const posts = [
    {
      id: 1,
      title: 'How do I stay faithful during difficult seasons?',
      category: 'Faith & Spirituality',
      author: 'Grace M.',
      time: '2h ago',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      replies: 23,
      views: 215,
      pinned: true,
    },
    {
      id: 2,
      title: 'Praying for my father\'s healing – Please pray with me',
      category: 'Prayer Requests',
      author: 'Daniel K.',
      time: '5h ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      replies: 18,
      views: 134,
      online: true,
    },
    {
      id: 3,
      title: 'What does the Bible say about Forgiveness?',
      category: 'Bible Study',
      author: 'Sarah T.',
      time: '7h ago',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      replies: 31,
      views: 310,
    },
    {
      id: 4,
      title: 'Youth Conference 2025 – What to Expect',
      category: 'Events & Programs',
      author: 'Michael A.',
      time: '1d ago',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      replies: 12,
      views: 98,
      online: true,
    },
    {
      id: 5,
      title: 'Balancing work, family and ministry',
      category: 'Christian Living',
      author: 'Abigail O.',
      time: '1d ago',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      replies: 27,
      views: 176,
    },
    {
      id: 6,
      title: 'New to CCC? Introduce yourself here! 👋',
      category: 'Church Community',
      author: 'Admin',
      time: '2d ago',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      replies: 64,
      views: 402,
      pinned: true,
    },
  ];

  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Feed Filters Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-red-50 text-red-900'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 border border-stone-200 text-stone-700 px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-stone-50 transition-colors">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
        </button>
      </div>

      {/* Discussion Item List */}
      <div className="divide-y divide-stone-100">
        {posts.map((post) => (
          <div key={post.id} className="py-4 hover:bg-stone-50/50 rounded-xl px-2 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />
                  {post.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-sm text-stone-900 hover:text-red-900 transition-colors cursor-pointer">
                      {post.title}
                    </h4>
                    {post.pinned && <Pin className="w-3.5 h-3.5 text-red-800 fill-current" />}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span className="font-medium text-stone-700">{post.category}</span>
                    <span>•</span>
                    <span>Started by {post.author}</span>
                    <span>•</span>
                    <span>{post.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-stone-400 font-medium shrink-0 pt-1">
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" /> {post.replies}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> {post.views}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Action */}
      <div className="pt-2 text-center">
        <button className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 px-6 py-2.5 rounded-full transition-colors">
          Load More Discussions <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default DiscussionFeed;