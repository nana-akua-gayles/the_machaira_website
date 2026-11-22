
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getForumStats } from '../../../lib/forumService';
import { isAdmin } from '../../../lib/adminAccess';
import { useAuth } from '../../../context/AuthContext';

const DiscussionHero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canStartDiscussion = isAdmin(user);

  const [stats, setStats] = useState({
    discussions: 0,
    members: 0,
    replies: 0,
  });

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
    { label: 'Discussions', value: stats.discussions },
    { label: 'Members', value: stats.members },
    { label: 'Replies', value: stats.replies },
  ];

  return (
    <section className="bg-white pt-4 pb-5 sm:pt-8 sm:pb-8 border-b border-black/8">

      {/* Discussion Hero Image */}
      <div className="w-full">
        <img
          src="/images/discussion-hero.jpeg"
          alt="Let's grow together in faith and purpose"
          className="block w-full h-auto"
        />
      </div>

      {/* Administrator Action */}
      {canStartDiscussion && (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => navigate('/forum/new')}
            className="inline-flex items-center gap-2 rounded-full bg-burgundy-primary px-4 py-2.5 sm:px-6 sm:py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#7f0e0e] hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(153,19,19,0.25)]"
          >
            <Plus className="w-4 h-4" />
            Start a New Discussion
          </button>
        </div>
      )}

      {/* Dynamic Forum Statistics */}
      <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-[#B9BEC8]/35 bg-white px-1 py-3 text-center sm:flex-row sm:justify-start sm:gap-4 sm:rounded-2xl sm:p-5 sm:text-left"
          >
            <div>
              <span className="block text-lg sm:text-xl font-semibold leading-none text-navy-dark">
                {loading ? '...' : stat.value.toLocaleString()}
              </span>
              <span className="mt-1 block text-[10px] sm:text-xs font-medium text-cool-gray">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default DiscussionHero;
