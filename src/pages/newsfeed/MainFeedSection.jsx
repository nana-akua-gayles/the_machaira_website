import React, { useState } from "react";
import { 
  Globe, Megaphone, BookOpen, Heart, Calendar, Bookmark, 
  MessageSquare, MoreHorizontal, Play, Send
} from "lucide-react";

export default function MainFeedSection({ onSelectStory }) {
  const [activeCategory, setActiveCategory] = useState("All Updates");

  // Categories list with icons (Community and Ministry News removed)
  const categories = [
    { label: "All Updates", icon: Globe },
    { label: "Announcements", icon: Megaphone },
    { label: "Teachings", icon: BookOpen },
    { label: "Testimonies", icon: Heart },
    { label: "Events", icon: Calendar },
  ];

  const posts = [
    {
      category: "TEACHINGS",
      title: "Walking by Faith, Not by Sight",
      snippet: "A powerful reminder that God's plan is always greater than what we can see. Learn to trust Him in every season.",
      author: "Apostle Bennie",
      date: "May 14, 2026",
      image: "/images/mountain-faith.jpg",
      featured: true,
      likes: 128,
      comments: 36
    },
    {
      category: "MINISTRY NEWS",
      title: "Youth Conference 2026 is Coming!",
      snippet: "Join us for an unforgettable time of worship, teaching, and fellowship. Don't miss what God is about to do!",
      author: "Machaira Ministry",
      date: "May 12, 2026",
      image: "/images/youth-conference.jpg",
      video: true,
      likes: 96,
      comments: 24
    },
    {
      category: "DEVOTIONAL HIGHLIGHTS",
      title: "Today in Devotional: Faith That Prevails",
      snippet: "A summary of today's devotional — key takeaways to meditate on throughout your day.",
      author: "Apostle Bennie",
      date: "May 10, 2026",
      image: "/images/devotional-book.jpg",
      likes: 76,
      comments: 18
    },
    {
      category: "TESTIMONIES",
      title: "From Darkness to Light: God Changed My Story",
      snippet: "Read how God delivered and restored hope in the life of one of our community members.",
      author: "Community Member",
      date: "May 8, 2026",
      image: "/images/sunrise-testimony.jpg",
      likes: 142,
      comments: 45
    }
  ];

  return (
    <div className="space-y-4">
      
      {/* =====================================================
          HORIZONTAL CATEGORIES BAR
      ====================================================== */}
      <div className="bg-white p-4 rounded-xl border border-black/5 shadow-xs">
        
        {/* Categories Horizontal Scroll Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.label;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategory(item.label)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[11px] font-medium whitespace-nowrap transition shrink-0 ${
                  isActive
                    ? "bg-[#fffaf5] text-burgundy-primary border border-burgundy-primary/20 shadow-xs"
                    : "text-charcoal-text hover:bg-black/5 border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-burgundy-primary" : "opacity-70"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* =====================================================
          SHARE YOUR STORY CARD (Compact & Streamlined)
      ====================================================== */}
      <div className="bg-gradient-to-br from-burgundy-primary via-[#5a1827] to-[#3a0f18] text-white px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl border border-white/10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-serif font-medium tracking-tight">Share Your Story With Us</h3>
            <p className="text-[10px] sm:text-[11px] text-white/80 leading-relaxed font-light">
              Your testimony has the power to inspire and uplift someone today.
            </p>
          </div>

          <div className="shrink-0">
            <button className="w-full sm:w-auto bg-white hover:bg-[#fffaf5] text-burgundy-primary px-3.5 py-2 rounded-lg text-[10px] sm:text-[11px] font-medium transition shadow-sm flex items-center justify-center gap-1.5 group">
              <Send className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              <span>Share Your Story</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          POSTS FEED LIST
      ====================================================== */}
      {posts.map((post, index) => (
        <article key={index} className="bg-white p-4 sm:p-5 rounded-xl border border-black/5 shadow-xs transition hover:shadow-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Post Thumbnail */}
            <div className="relative h-36 sm:h-auto rounded-lg overflow-hidden bg-black/5">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              {post.featured && (
                <span className="absolute top-2 left-2 bg-burgundy-primary text-white text-[8px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                  Featured
                </span>
              )}
              {post.video && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-8 h-8 rounded-full bg-white/90 text-burgundy-primary flex items-center justify-center shadow-md">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
              )}
            </div>

            {/* Post Content */}
            <div className="sm:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-burgundy-primary">
                    {post.category}
                  </span>
                  <button className="text-cool-gray hover:text-charcoal-text">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h2 
                  onClick={() => onSelectStory && onSelectStory(post)}
                  className="text-sm sm:text-base font-normal text-charcoal-text leading-snug mb-1.5 hover:text-burgundy-primary transition cursor-pointer"
                >
                  {post.title}
                </h2>

                <p className="text-[11px] text-cool-gray leading-relaxed mb-3">
                  {post.snippet}
                </p>
              </div>

              {/* Post Footer Metadata */}
              <div className="flex items-center justify-between pt-2.5 border-t border-black/5 text-[10px] text-cool-gray">
                <div className="flex items-center gap-1.5">
                  <div className="w-4.5 h-4.5 rounded-full bg-burgundy-primary/20 text-burgundy-primary flex items-center justify-center font-bold text-[8px]">
                    {post.author[0]}
                  </div>
                  <span className="font-medium text-charcoal-text">{post.author}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 hover:text-burgundy-primary transition">
                    <Heart className="w-3 h-3" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-burgundy-primary transition">
                    <MessageSquare className="w-3 h-3" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="hover:text-burgundy-primary transition">
                    <Bookmark className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </article>
      ))}
    </div>
  );
}