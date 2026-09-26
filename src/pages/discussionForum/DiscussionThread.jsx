import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MessageCircle, Pin, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getPostById,
  getRepliesForPost,
  createReply,
  updateReply,
  deleteReply,
  incrementPostViews,
} from '../../lib/forumService';
import { formatRelativeTime, initials } from './discussionFeatures/forumHelpers';

function Avatar({ author, sizeClass = 'w-10 h-10' }) {
  if (author?.avatar_url) {
    return (
      <img
        src={author.avatar_url}
        alt={author.name || 'Member'}
        className={`${sizeClass} rounded-full object-cover border border-black/10 shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${sizeClass} rounded-full bg-[#FBF0F0] text-burgundy-primary text-xs font-bold flex items-center justify-center border border-black/10 shrink-0`}
    >
      {initials(author?.name)}
    </div>
  );
}

const DiscussionThread = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyError, setReplyError] = useState(null);

  // Inline edit state for a single reply at a time.
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deletingReplyId, setDeletingReplyId] = useState(null);

  // Tracks which post id we've already counted a view for, so navigating
  // from one thread straight to another (without a full remount) still
  // counts a fresh view, but re-renders of the same thread don't.
  const viewCountedForRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadThread() {
      try {
        setLoading(true);
        setError(null);

        const [postData, repliesData] = await Promise.all([
          getPostById(id),
          getRepliesForPost(id),
        ]);

        if (cancelled) return;

        if (!postData) {
          setError('This discussion could not be found.');
          return;
        }

        setPost(postData);
        setReplies(repliesData);

        if (viewCountedForRef.current !== id) {
          viewCountedForRef.current = id;
          incrementPostViews(id).catch((err) =>
            console.error('VIEW COUNT FAILED:', err)
          );
        }
      } catch (err) {
        console.error('THREAD LOAD FAILED:', err);
        if (!cancelled) setError('Unable to load this discussion.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadThread();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmitReply(event) {
    event.preventDefault();
    if (!replyText.trim() || !user) return;

    setSubmitting(true);
    setReplyError(null);

    try {
      await createReply({
        postId: id,
        userId: user.id,
        content: replyText.trim(),
      });

      // Refetch rather than guess the shape of the freshly-created
      // reply's author fields — this way the display always matches
      // whatever's actually in the profiles table.
      const updatedReplies = await getRepliesForPost(id);
      setReplies(updatedReplies);
      setPost((prev) => (prev ? { ...prev, replies_count: prev.replies_count + 1 } : prev));
      setReplyText('');
    } catch (err) {
      console.error('REPLY SUBMIT FAILED:', err);
      setReplyError('Your reply could not be posted. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function startEditingReply(reply) {
    setEditingReplyId(reply.id);
    setEditText(reply.content);
  }

  function cancelEditingReply() {
    setEditingReplyId(null);
    setEditText('');
  }

  async function handleSaveEditedReply(replyId) {
    if (!editText.trim()) return;

    setEditSubmitting(true);
    try {
      const updated = await updateReply({ replyId, content: editText.trim() });
      setReplies((prev) =>
        prev.map((r) => (r.id === replyId ? { ...r, content: updated.content } : r))
      );
      setEditingReplyId(null);
      setEditText('');
    } catch (err) {
      console.error('REPLY EDIT FAILED:', err);
    } finally {
      setEditSubmitting(false);
    }
  }

  async function handleDeleteReply(replyId) {
    const confirmed = window.confirm('Delete this reply? This cannot be undone.');
    if (!confirmed) return;

    setDeletingReplyId(replyId);
    try {
      await deleteReply(replyId);
      setReplies((prev) => prev.filter((r) => r.id !== replyId));
      setPost((prev) =>
        prev ? { ...prev, replies_count: Math.max(prev.replies_count - 1, 0) } : prev
      );
    } catch (err) {
      console.error('REPLY DELETE FAILED:', err);
    } finally {
      setDeletingReplyId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-burgundy-primary">
            Discussion Forum
          </p>
          <h1 className="mt-5 text-3xl font-semibold text-navy-dark">Loading discussion...</h1>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-[70vh] bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-20 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-burgundy-primary">
            Discussion Forum
          </p>
          <h1 className="mt-5 text-3xl font-semibold text-navy-dark">
            {error || 'Discussion not found.'}
          </h1>
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
      <div className="mx-auto max-w-[820px] px-6 py-12 lg:px-8">
        <Link
          to="/forum"
          className="inline-flex items-center gap-2 text-sm font-semibold text-burgundy-primary transition-colors hover:text-[#7f0e0e]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Forum
        </Link>

        {/* Post header */}
        <div className="mt-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-burgundy-primary">
              {post.category}
            </span>
            {post.pinned && <Pin className="w-3.5 h-3.5 text-burgundy-primary fill-current" />}
          </div>

          <h1 className="mt-3 text-3xl md:text-4xl font-semibold leading-[1.15] tracking-[-0.02em] text-navy-dark">
            {post.title}
          </h1>

          <div className="mt-5 flex items-center gap-3">
            <Avatar author={post.author} sizeClass="w-11 h-11" />
            <div>
              <p className="text-sm font-semibold text-navy-dark">
                {post.author?.name || 'A member'}
              </p>
              <p className="text-xs text-cool-gray">{formatRelativeTime(post.created_at)}</p>
            </div>

            <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-cool-gray">
              <MessageCircle className="w-3.5 h-3.5" /> {post.replies_count}
            </span>
          </div>
        </div>

        {/* Post body */}
        <div className="mt-8 whitespace-pre-line text-[16px] leading-[1.9] text-[#374151]">
          {post.body}
        </div>

        {/* Replies */}
        <div className="mt-14 border-t border-black/8 pt-8">
          <h2 className="text-lg font-semibold text-navy-dark">
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h2>

          <div className="mt-6 space-y-6">
            {replies.length === 0 && (
              <p className="text-sm text-cool-gray">No replies yet. Be the first to respond.</p>
            )}

            {replies.map((reply) => {
              const isOwnReply = user && reply.user_id === user.id;
              const isEditing = editingReplyId === reply.id;
              const isDeleting = deletingReplyId === reply.id;

              return (
                <div key={reply.id} className="flex gap-3">
                  <Avatar author={reply.author} sizeClass="w-9 h-9" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-navy-dark">
                        {reply.author?.name || 'A member'}
                      </p>
                      <span className="text-[#B9BEC8]">•</span>
                      <p className="text-xs text-cool-gray">{formatRelativeTime(reply.created_at)}</p>

                      {isOwnReply && !isEditing && (
                        <div className="ml-auto flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => startEditingReply(reply)}
                            className="text-xs font-semibold text-cool-gray hover:text-burgundy-primary transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteReply(reply.id)}
                            disabled={isDeleting}
                            className="text-xs font-semibold text-cool-gray hover:text-burgundy-primary transition-colors disabled:opacity-50"
                          >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="mt-1.5 space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          autoFocus
                          className="w-full rounded-xl border border-black/10 p-3 text-sm text-navy-dark focus:border-burgundy-primary focus:outline-none focus:ring-1 focus:ring-burgundy-primary"
                        />
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleSaveEditedReply(reply.id)}
                            disabled={editSubmitting || !editText.trim()}
                            className="rounded-full bg-burgundy-primary px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#7f0e0e] disabled:opacity-50"
                          >
                            {editSubmitting ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditingReply}
                            className="text-xs font-semibold text-cool-gray hover:text-navy-dark transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-[#374151]">
                        {reply.content}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply form */}
          <div className="mt-10 border-t border-black/8 pt-8">
            {user ? (
              <form onSubmit={handleSubmitReply} className="space-y-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  className="w-full rounded-2xl border border-black/10 p-4 text-sm text-navy-dark placeholder:text-[#B9BEC8] focus:border-burgundy-primary focus:outline-none focus:ring-1 focus:ring-burgundy-primary"
                />
                {replyError && (
                  <p className="text-sm font-medium text-burgundy-primary">{replyError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting || !replyText.trim()}
                  className="inline-flex items-center rounded-full bg-burgundy-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#7f0e0e] disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
              </form>
            ) : (
              <div className="rounded-2xl border border-black/8 bg-[#FBF8F6] p-6 text-center">
                <p className="text-sm text-cool-gray">You need an account to join this discussion.</p>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="mt-4 inline-flex rounded-full bg-burgundy-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#7f0e0e]"
                >
                  Log In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DiscussionThread;