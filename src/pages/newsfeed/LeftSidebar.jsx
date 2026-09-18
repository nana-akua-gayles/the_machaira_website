import React from "react";
import { 
  Globe, Megaphone, BookOpen, Building, Heart, Users, Calendar, Bookmark, 
  Flame, ThumbsUp, MessageCircle, Sparkles 
} from "lucide-react";

export default function LeftSidebar() {
  return (
    <div className="space-y-4">
      
      {/* BROWSE BY CATEGORY (Shrunk & tight layout, no horizontal scroll) */}
      <div className="bg-white p-4 rounded-xl border border-black/5 shadow-xs">
        <h3 className="text-[9px] font-semibold uppercase tracking-[0.15em] text-soft-gray mb-3">
          Browse by Category
        </h3>
        <nav className="space-y-0.5 text-[11px]">
          {[
            { label: "All Updates", icon: Globe, active: true },
            { label: "Announcements", icon: Megaphone },
            { label: "Teachings", icon: BookOpen },
            { label: "Ministry News", icon: Building },
            { label: "Testimonies", icon: Heart },
            { label: "Community", icon: Users },
            { label: "Events", icon: Calendar },
            { label: "Devotional Highlights", icon: Bookmark },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button 
                key={idx}
                className={`flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition text-left ${
                  item.active 
                    ? "bg-[#fffaf5] text-burgundy-primary font-medium" 
                    : "text-charcoal-text hover:bg-black/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5 opacity-70" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* FILTER BY */}
      <div className="bg-white p-4 rounded-xl border border-black/5 shadow-xs">
        <h3 className="text-[9px] font-semibold uppercase tracking-[0.15em] text-soft-gray mb-3">
          Filter By
        </h3>
        <div className="space-y-2.5 text-[11px] text-charcoal-text">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="filter" defaultChecked className="accent-burgundy-primary" />
            <span className="flex items-center gap-1.5"><Flame className="w-3 h-3 text-amber-600" /> Most Recent</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="filter" className="accent-burgundy-primary" />
            <span className="flex items-center gap-1.5"><ThumbsUp className="w-3 h-3 text-cool-gray" /> Most Liked</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="filter" className="accent-burgundy-primary" />
            <span className="flex items-center gap-1.5"><MessageCircle className="w-3 h-3 text-cool-gray" /> Most Commented</span>
          </label>
        </div>
      </div>

      {/* SHARE YOUR STORY CARD */}
      <div className="bg-burgundy-primary text-white p-4 rounded-xl shadow-xs relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xs font-semibold mb-1">Share Your Story</h3>
          <p className="text-[10px] opacity-90 mb-3 leading-relaxed">
            Your testimony can inspire someone today.
          </p>
          <button className="flex items-center justify-center gap-2 w-full bg-white text-burgundy-primary px-3 py-2 rounded-lg text-[11px] font-medium transition hover:bg-[#fffaf5]">
            <span>Share Now</span>
          </button>
        </div>
      </div>

    </div>
  );
}