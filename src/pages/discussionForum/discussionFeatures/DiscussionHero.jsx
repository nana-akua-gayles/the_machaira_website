import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, Users, MessageCircle } from 'lucide-react';
import { getForumStats } from '../../../lib/forumService';
import { isAdmin } from '../../../lib/adminAccess';
import { useAuth } from '../../../context/AuthContext';

const DiscussionHero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canStartDiscussion = isAdmin(user);
  const [stats, setStats] = useState({ discussions: 0, members: 0, replies: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const data = await getForumStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        console.error('FORUM STATS FAILED:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const statCards = [
    { label: 'Discussions', value: stats.discussions, icon: MessageSquare },
    { label: 'Members', value: stats.members, icon: Users },
    { label: 'Replies', value: stats.replies, icon: MessageCircle },
  ];

  return (
    <section className="bg-white pt-10 pb-8 border-b border-black/8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Headline + action */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-burgundy-primary">
              Community
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-[1.1] tracking-[-0.03em] text-navy-dark">
              Let's Grow Together in Faith &amp; Purpose
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-cool-gray">
              Ask questions, share insights, and encourage others. Together, we build a stronger faith community.
            </p>
          </div>

          {canStartDiscussion ? (
            <button
              type="button"
              onClick={() => navigate('/forum/new')}
              className="inline-flex items-center gap-2 rounded-full bg-burgundy-primary px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#7f0e0e] hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(153,19,19,0.25)]"
            >
              <Plus className="w-4 h-4" /> Start a New Discussion
            </button>
          ) : (
            <p className="text-sm text-cool-gray">
              New discussions are started by the ministry team. Jump into a conversation below.
            </p>
          )}
        </div>

        {/* Scripture quote — same editorial treatment as the devotional blockquote */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl border border-black/8 bg-[#FBF8F6] p-7">
            <span className="font-[Georgia,serif] text-5xl leading-none text-burgundy-primary">
              &ldquo;
            </span>
            <p className="mt-2 text-[17px] italic leading-relaxed text-navy-dark">
              Iron sharpens iron, and one man sharpens another.
            </p>
            <p className="mt-4 text-right text-sm font-semibold text-burgundy-primary">
              Proverbs 27:17
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FBF0F0] text-burgundy-primary">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xl font-semibold leading-none text-navy-dark">
                  {loading ? '...' : stat.value.toLocaleString()}
                </span>
                <span className="mt-1 block text-xs font-medium text-cool-gray">{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DiscussionHero;