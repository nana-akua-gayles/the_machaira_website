import React, { useEffect, useState } from 'react';
import {
  LayoutGrid, Sparkles, HeartHandshake, BookOpen,
  Smile, Users, GraduationCap, Building2, Megaphone, Calendar
} from 'lucide-react';
import { FORUM_CATEGORIES, getCategoryCounts } from '../../../lib/forumService';

const CATEGORY_ICONS = {
  'Faith & Spirituality': Sparkles,
  'Prayer Requests': HeartHandshake,
  'Bible Study': BookOpen,
  'Christian Living': Smile,
  'Family & Relationships': Users,
  'Youth & Young Adults': GraduationCap,
  'Church Community': Building2,
  'Announcements': Megaphone,
  'Events & Programs': Calendar,
};

function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const DiscussionCategory = ({ selectedCategory, onSelectCategory }) => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCounts() {
      try {
        const data = await getCategoryCounts();
        if (!cancelled) setCounts(data);
      } catch (err) {
        console.error('CATEGORY COUNTS FAILED:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalCount = Object.values(counts).reduce((sum, n) => sum + n, 0);

  const categories = [
    { label: 'All Discussions', count: totalCount, icon: LayoutGrid },
    ...FORUM_CATEGORIES.map((label) => ({
      label,
      count: counts[label] || 0,
      icon: CATEGORY_ICONS[label] || Sparkles,
    })),
  ];

  return (
    <aside className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="font-serif font-bold text-stone-900 text-base">Categories</h3>

      <nav className="space-y-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const active = cat.label === selectedCategory;
          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => onSelectCategory(cat.label)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                active
                  ? 'bg-red-50 text-red-900 font-semibold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${active ? 'text-red-800' : 'text-stone-400'}`} />
                <span>{cat.label}</span>
              </div>
              <span className={`text-[11px] ${active ? 'text-red-800 font-bold' : 'text-stone-400'}`}>
                {loading ? '...' : formatCount(cat.count)}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default DiscussionCategory;