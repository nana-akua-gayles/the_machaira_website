import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FORUM_CATEGORIES, createPost } from '../../lib/forumService';
import { isAdmin } from '../../lib/adminAccess';

const DiscussionNewPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [category, setCategory] = useState(FORUM_CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() || !body.trim() || !user) return;

    setSubmitting(true);
    setError(null);

    try {
      const newPost = await createPost({
        userId: user.id,
        category,
        title: title.trim(),
        body: body.trim(),
      });
      navigate(`/forum/${newPost.id}`);
    } catch (err) {
      console.error('CREATE POST FAILED:', err);
      setError('Your discussion could not be posted. Please try again.');
      setSubmitting(false);
    }
  }

  // Not logged in: same gate pattern as the reply box on the thread page.
  if (!user) {
    return (
      <main className="min-h-[70vh] bg-white">
        <div className="mx-auto max-w-[640px] px-6 py-20 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-burgundy-primary">
            Discussion Forum
          </p>
          <h1 className="mt-5 text-3xl font-semibold text-navy-dark">
            You need an account to start a discussion.
          </h1>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-8 inline-flex rounded-full bg-burgundy-primary px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#7f0e0e]"
          >
            Log In
          </button>
        </div>
      </main>
    );
  }

  // Logged in, but not on the admin list: this is the page that actually
  // stops someone from reaching the form by typing /forum/new directly,
  // separate from the buttons being hidden elsewhere.
  if (!isAdmin(user)) {
    return (
      <main className="min-h-[70vh] bg-white">
        <div className="mx-auto max-w-[640px] px-6 py-20 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-burgundy-primary">
            Discussion Forum
          </p>
          <h1 className="mt-5 text-3xl font-semibold text-navy-dark">
            New discussions are started by the ministry team.
          </h1>
          <p className="mt-3 text-[15px] text-cool-gray">
            You're welcome to join and reply to any conversation in the forum.
          </p>
          <Link
            to="/forum"
            className="mt-8 inline-flex rounded-full bg-burgundy-primary px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#7f0e0e]"
          >
            ← Back to Forum
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[720px] px-6 py-12 lg:px-8">
        <Link
          to="/forum"
          className="inline-flex items-center gap-2 text-sm font-semibold text-burgundy-primary transition-colors hover:text-[#7f0e0e]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Forum
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-burgundy-primary">
          New Discussion
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold leading-[1.15] tracking-[-0.02em] text-navy-dark">
          Start a Conversation
        </h1>
        <p className="mt-3 text-[15px] text-cool-gray">
          Ask a question, share an insight, or start something the community can grow from.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-navy-dark">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 p-3.5 text-sm text-navy-dark focus:border-burgundy-primary focus:outline-none focus:ring-1 focus:ring-burgundy-primary"
            >
              {FORUM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-navy-dark">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your discussion about?"
              maxLength={150}
              className="mt-2 w-full rounded-xl border border-black/10 p-3.5 text-sm text-navy-dark placeholder:text-[#B9BEC8] focus:border-burgundy-primary focus:outline-none focus:ring-1 focus:ring-burgundy-primary"
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-semibold text-navy-dark">
              Your Message
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share the details, ask your question, or open the conversation..."
              rows={8}
              className="mt-2 w-full rounded-2xl border border-black/10 p-4 text-sm text-navy-dark placeholder:text-[#B9BEC8] focus:border-burgundy-primary focus:outline-none focus:ring-1 focus:ring-burgundy-primary"
            />
          </div>

          {error && <p className="text-sm font-medium text-burgundy-primary">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !title.trim() || !body.trim()}
            className="inline-flex items-center rounded-full bg-burgundy-primary px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#7f0e0e] disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Discussion'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default DiscussionNewPost;