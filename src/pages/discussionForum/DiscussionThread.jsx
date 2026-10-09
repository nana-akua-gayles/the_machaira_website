import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  MessageCircle,
  Pin,
  ArrowLeft,
  Sparkles,
  Send,
  Pencil,
  Trash2,
  HeartHandshake,
  BookOpen,
} from "lucide-react";
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
  <main className="min-h-screen bg-[#FAF8F6] pb-24">
    {/* Editorial hero */}
    <section className="relative overflow-hidden bg-[#101A2B] text-white">
      <div className="pointer-events-none absolute -right-24 -top-36 h-[400px] w-[400px] rounded-full bg-[#991313]/40 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-72 rounded-full bg-[#D8A65C]/10 blur-[90px]" />

      <div className="relative mx-auto max-w-[1180px] px-6 py-14 lg:px-10 lg:py-20">
        <Link
          to="/forum"
          className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to discussions
        </Link>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[#D8A65C]/40 bg-[#D8A65C]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#F0C98C]">
            {post.category || "Community"}
          </span>

          {post.pinned && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white">
              <Pin size={12} />
              Pinned discussion
            </span>
          )}
        </div>

        <h1 className="mt-6 max-w-[900px] font-serif text-4xl leading-[1.12] tracking-tight sm:text-5xl lg:text-[58px]">
          {post.title}
        </h1>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/15 pt-6">
          <Avatar author={post.author} sizeClass="w-12 h-12" />

          <div>
            <p className="text-sm font-semibold text-white">
              {post.author?.name || "A member"}
            </p>
            <p className="mt-1 text-xs text-white/55">
              {formatRelativeTime(post.created_at)}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90">
            <MessageCircle size={16} className="text-[#F0C98C]" />
            {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </div>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-[#991313] via-[#D8A65C] to-[#991313]" />
    </section>

    <div className="mx-auto max-w-[1180px] px-5 pt-10 sm:px-6 lg:px-10">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_285px]">
        {/* Main discussion column */}
        <div className="min-w-0 space-y-8">
          {/* Original post */}
          <article className="overflow-hidden rounded-[24px] border border-[#EEE5E1] bg-white shadow-[0_15px_50px_rgba(16,26,43,0.045)]">
            <div className="flex items-center gap-3 border-b border-[#F0E8E5] px-6 py-5 sm:px-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F9EDEE] text-[#991313]">
                <BookOpen size={19} />
              </span>

              <div>
                <p className="text-sm font-bold text-[#101A2B]">
                  The Conversation
                </p>
                <p className="text-xs text-[#8B8584]">
                  A thought shared with the community
                </p>
              </div>
            </div>

            <div className="px-6 py-8 sm:px-8 sm:py-10">
              <div className="mb-7 h-[3px] w-12 rounded-full bg-[#991313]" />

              <p className="whitespace-pre-line text-[16px] leading-[2] text-[#374151]">
                {post.body}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-[#F0E8E5] bg-[#FFFCFB] px-6 py-4 sm:px-8">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-[#7B7270]">
                <HeartHandshake size={15} className="text-[#991313]" />
                Shared with the Machaira family
              </span>
            </div>
          </article>

          {/* Replies */}
          <section>
            <div className="mb-6 flex items-end justify-between gap-3">
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#991313]">
                  Community voices
                </p>

                <h2 className="font-serif text-3xl text-[#101A2B]">
                  The Discussion
                </h2>
              </div>

              <span className="rounded-full bg-[#F3E5E4] px-4 py-2 text-xs font-bold text-[#991313]">
                {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
              </span>
            </div>

            <div className="space-y-4">
              {replies.length === 0 && (
                <div className="rounded-[22px] border border-dashed border-[#DCC9C5] bg-white px-6 py-12 text-center">
                  <MessageCircle
                    size={28}
                    className="mx-auto text-[#991313]"
                    strokeWidth={1.5}
                  />
                  <h3 className="mt-4 font-serif text-xl text-[#101A2B]">
                    Be the first to respond
                  </h3>
                  <p className="mt-2 text-sm text-[#79716E]">
                    Every meaningful conversation begins with one voice.
                  </p>
                </div>
              )}

              {replies.map((reply) => {
                const isOwnReply = user && reply.user_id === user.id;
                const isEditing = editingReplyId === reply.id;
                const isDeleting = deletingReplyId === reply.id;

                return (
                  <article
                    key={reply.id}
                    className={`rounded-[22px] border bg-white p-5 shadow-[0_8px_30px_rgba(16,26,43,0.035)] transition-colors sm:p-6 ${
                      isOwnReply
                        ? "border-[#E7C9C5]"
                        : "border-[#EEE5E1] hover:border-[#DCC9C5]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        author={reply.author}
                        sizeClass="w-11 h-11"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-[#101A2B]">
                            {reply.author?.name || "A member"}
                          </p>

                          {isOwnReply && (
                            <span className="rounded-full bg-[#F9EDEE] px-2 py-0.5 text-[10px] font-semibold text-[#991313]">
                              You
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-[#9B9390]">
                          {formatRelativeTime(reply.created_at)}
                        </p>
                      </div>

                      {isOwnReply && !isEditing && (
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEditingReply(reply)}
                            aria-label="Edit reply"
                            className="rounded-full bg-[#F7F4F2] p-2 text-[#716966] transition hover:bg-[#F9EDEE] hover:text-[#991313]"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteReply(reply.id)}
                            disabled={isDeleting}
                            aria-label="Delete reply"
                            className="rounded-full bg-[#F7F4F2] p-2 text-[#716966] transition hover:bg-[#F9EDEE] hover:text-[#991313] disabled:opacity-50"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pl-0 sm:pl-14">
                      {isEditing ? (
                        <div className="space-y-3">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={4}
                            autoFocus
                            className="w-full rounded-xl border border-[#E7D6D3] bg-[#FFFCFB] p-4 text-sm text-[#101A2B] outline-none focus:border-[#991313] focus:ring-2 focus:ring-[#991313]/10"
                          />

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => handleSaveEditedReply(reply.id)}
                              disabled={editSubmitting || !editText.trim()}
                              className="rounded-full bg-[#991313] px-5 py-2 text-xs font-semibold text-white hover:bg-[#7F0E0E] disabled:opacity-50"
                            >
                              {editSubmitting ? "Saving..." : "Save Changes"}
                            </button>

                            <button
                              type="button"
                              onClick={cancelEditingReply}
                              className="text-xs font-semibold text-[#716966] hover:text-[#101A2B]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-line text-sm leading-7 text-[#4D5057]">
                          {reply.content}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Reply composer */}
          <section className="overflow-hidden rounded-[24px] border border-[#E9DAD6] bg-white shadow-[0_15px_45px_rgba(16,26,43,0.05)]">
            <div className="bg-gradient-to-r from-[#991313] to-[#67121B] px-6 py-6 text-white sm:px-8">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-white/15 p-2.5">
                  <MessageCircle size={20} />
                </span>

                <div>
                  <h3 className="font-serif text-2xl">
                    Add Your Voice
                  </h3>
                  <p className="mt-1 text-xs text-white/75">
                    Share a thoughtful response with the community.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {user ? (
                <form onSubmit={handleSubmitReply}>
                  <label
                    htmlFor="thread-reply"
                    className="mb-3 block text-sm font-semibold text-[#101A2B]"
                  >
                    Your response
                  </label>

                  <textarea
                    id="thread-reply"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="What would you like to share with the community?"
                    rows={5}
                    className="w-full resize-y rounded-2xl border border-[#E7D6D3] bg-[#FFFCFB] p-5 text-sm leading-7 text-[#101A2B] outline-none transition focus:border-[#991313] focus:ring-2 focus:ring-[#991313]/10"
                  />

                  {replyError && (
                    <p role="alert" className="mt-3 text-sm font-medium text-[#991313]">
                      {replyError}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <p className="max-w-[280px] text-xs leading-5 text-[#8B8584]">
                      Speak with kindness. Your words may encourage someone today.
                    </p>

                    <button
                      type="submit"
                      disabled={submitting || !replyText.trim()}
                      className="inline-flex items-center gap-2 rounded-full bg-[#991313] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#7F0E0E] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send size={16} />
                      {submitting ? "Posting..." : "Post Reply"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <p className="text-sm leading-7 text-[#716966]">
                    Join the Machaira family to contribute to this discussion.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="mt-5 rounded-full bg-[#991313] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#7F0E0E]"
                  >
                    Log In to Participate
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Editorial sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-28">
          <div className="relative overflow-hidden rounded-[24px] bg-[#101A2B] p-7 text-white">
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-5 -top-5 h-28 w-28 rounded-full border border-white/10" />

            <Sparkles size={22} className="text-[#D8A65C]" />

            <h3 className="relative mt-6 font-serif text-2xl leading-snug">
              A Community Built on the Word.
            </h3>

            <p className="relative mt-4 text-sm leading-7 text-white/65">
              Come with questions. Share your experiences.
              Leave with new perspectives and renewed faith.
            </p>

            <div className="mt-6 h-px w-full bg-white/15" />

            <p className="mt-5 text-xs font-medium tracking-wide text-[#F0C98C]">
              GROW • CONNECT • ENCOURAGE
            </p>
          </div>

          <div className="rounded-[22px] border border-[#EEDCD8] bg-[#F9EDEC] p-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#991313]">
              A Gentle Reminder
            </span>

            <h3 className="mt-3 font-serif text-xl text-[#101A2B]">
              Let grace lead the conversation.
            </h3>

            <p className="mt-3 text-sm leading-7 text-[#716966]">
              Listen thoughtfully, respond respectfully,
              and make room for every voice.
            </p>
          </div>

          <Link
            to="/forum"
            className="flex items-center justify-between rounded-2xl border border-[#E9DAD6] bg-white px-5 py-4 text-sm font-semibold text-[#101A2B] transition hover:border-[#991313] hover:text-[#991313]"
          >
            Explore more discussions
            <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </aside>
      </div>
    </div>
  </main>
);
};

export default DiscussionThread;