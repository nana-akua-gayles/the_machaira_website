import React from 'react';
import { 
  LayoutGrid, Sparkles, HeartHandshake, BookOpen, 
  Smile, Users, GraduationCap, Building2, Megaphone, Calendar 
} from 'lucide-react';

const DiscussionCategory = () => {
  const categories = [
    { label: 'All Discussions', count: '2.5k', icon: LayoutGrid, active: true },
    { label: 'Faith & Spirituality', count: '568', icon: Sparkles },
    { label: 'Prayer Requests', count: '342', icon: HeartHandshake },
    { label: 'Bible Study', count: '476', icon: BookOpen },
    { label: 'Christian Living', count: '389', icon: Smile },
    { label: 'Family & Relationships', count: '281', icon: Users },
    { label: 'Youth & Young Adults', count: '245', icon: GraduationCap },
    { label: 'Church Community', count: '198', icon: Building2 },
    { label: 'Announcements', count: '102', icon: Megaphone },
    { label: 'Events & Programs', count: '95', icon: Calendar },
  ];

  return (
    <aside className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="font-serif font-bold text-stone-900 text-base">Categories</h3>
      
      <nav className="space-y-1">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <button
              key={idx}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                cat.active
                  ? 'bg-red-50 text-red-900 font-semibold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${cat.active ? 'text-red-800' : 'text-stone-400'}`} />
                <span>{cat.label}</span>
              </div>
              <span className={`text-[11px] ${cat.active ? 'text-red-800 font-bold' : 'text-stone-400'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </nav>

      <button className="w-full text-center py-2.5 text-xs text-stone-600 font-semibold bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors">
        View All Categories
      </button>
    </aside>
  );
};

export default DiscussionCategory;