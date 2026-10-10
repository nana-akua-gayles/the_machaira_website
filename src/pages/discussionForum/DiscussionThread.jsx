import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  MessageCircle,
  Pin,
  ArrowLeft,
  Send,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
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
  const repliesEndRef = useRef(null);
  const [topicExpanded, setTopicExpanded] = useState(false);

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
      // Avoid scrolling the entire mobile page when a reply is posted.
      if (window.matchMedia('(min-width: 1024px)').matches) {
        requestAnimationFrame(() => repliesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
      }
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
    <main className="bg-white text-[#111827] font-['Montserrat',sans-serif] lg:px-6 lg:py-7">
      {/* Mobile scrolls with the document; desktop uses a bounded split panel. */}
      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-[1400px] flex-col bg-white lg:h-[calc(100dvh-8rem)] lg:min-h-[480px] lg:overflow-hidden lg:min-h-[480px] lg:flex-row lg:rounded-[24px] lg:border lg:border-[#B9BEC8]/40 lg:shadow-[0_15px_50px_rgba(16,26,43,0.08)]">
        {/* Desktop: discussion context remains visible independently of reply scroll. */}
        <aside className="hidden w-[38%] min-w-0 flex-col overflow-hidden border-r border-[#B9BEC8]/30 bg-[#101A2B] text-white lg:flex">
          <div className="shrink-0 border-b border-white/15 px-8 py-7">
            <Link to="/forum" className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white">
              <ArrowLeft size={17} /> All discussions
            </Link>
            <p className="mt-9 text-xs font-bold uppercase tracking-[0.18em] text-white/60">Machaira Community</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white">{post.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#991313] px-3 py-1.5 text-xs font-semibold text-white">{post.category || 'Community'}</span>
              {post.pinned && <span className="inline-flex items-center gap-1 rounded-full border border-white/25 px-3 py-1.5 text-xs"><Pin size={12} /> Pinned</span>}
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-8 py-7 [scrollbar-width:thin]">
            <div className="flex items-center gap-3">
              <Avatar author={post.author} sizeClass="w-11 h-11" />
              <div>
                <p className="text-sm font-semibold">{post.author?.name || 'A member'}</p>
                <p className="text-xs text-white/60">{formatRelativeTime(post.created_at)}</p>
              </div>
            </div>
            <div className="mt-7 rounded-2xl border border-white/15 bg-white/10 p-6">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-white/70">Original discussion</p>
              <p className="whitespace-pre-line break-words text-sm leading-8 text-white/90">{post.body}</p>
            </div>
          </div>
          <div className="shrink-0 border-t border-white/15 px-8 py-5 text-xs text-white/65">
            Share thoughtfully. Every voice matters.
          </div>
        </aside>

        {/* Mobile: compact messaging header; desktop: replies header. */}
        <section className="flex min-w-0 flex-1 flex-col bg-[#F8F8F8] lg:min-h-0">
          <header className="z-10 shrink-0 border-b border-[#B9BEC8]/35 bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8 lg:py-5">
            <div className="flex items-center gap-3">
              <Link to="/forum" aria-label="Back to discussions" className="rounded-full p-2 text-[#101A2B] hover:bg-[#101A2B]/5 lg:hidden"><ArrowLeft size={21} /></Link>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#101A2B] lg:text-lg lg:font-semibold">{post.title}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#4D5057]"><MessageCircle size={13} className="text-[#991313]" /> {replies.length} {replies.length === 1 ? 'reply' : 'replies'} <span className="lg:hidden">· {post.category || 'Community'}</span></p>
              </div>
              <button type="button" onClick={() => setTopicExpanded((value) => !value)} aria-expanded={topicExpanded} aria-label={topicExpanded ? 'Hide original discussion' : 'Show original discussion'} className="flex shrink-0 items-center gap-1 rounded-full border border-[#B9BEC8]/50 px-3 py-2 text-xs font-semibold text-[#991313] hover:bg-[#991313]/5 lg:hidden">
                Topic {topicExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </header>

          {/* Mobile topic expands without making the composer scroll offscreen. */}
          {topicExpanded && <div className="max-h-[35dvh] shrink-0 overflow-y-auto border-b border-[#B9BEC8]/35 bg-white px-5 py-4 lg:hidden">
            <div className="mb-3 flex items-center gap-2"><Avatar author={post.author} sizeClass="w-8 h-8" /><span className="text-xs font-semibold text-[#101A2B]">{post.author?.name || 'A member'}</span></div>
            <p className="whitespace-pre-line break-words text-sm leading-7 text-[#4D5057]">{post.body}</p>
          </div>}

          {/* On mobile, use document scrolling; on desktop, scroll replies independently. */}
          <div role="log" aria-label="Discussion replies" className="flex-1 px-4 py-6 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain [scrollbar-width:thin] sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-[780px] space-y-5">
              <div className="mx-auto w-fit rounded-full border border-[#B9BEC8]/40 bg-white px-4 py-1.5 text-[11px] font-semibold text-[#4D5057]">Community conversation</div>
              {replies.length === 0 && <div className="rounded-2xl border border-[#B9BEC8]/40 bg-white p-8 text-center"><MessageCircle className="mx-auto text-[#991313]" size={27} /><p className="mt-3 font-semibold text-[#101A2B]">Start the conversation</p><p className="mt-2 text-sm text-[#4D5057]">Be the first to share your thoughts.</p></div>}
              {replies.map((reply) => {
                const isOwnReply = Boolean(user && reply.user_id === user.id);
                const isEditing = editingReplyId === reply.id;
                const isDeleting = deletingReplyId === reply.id;
                return <article key={reply.id} className={`flex items-end gap-2.5 ${isOwnReply ? 'flex-row-reverse' : ''}`}>
                  {!isOwnReply && <Avatar author={reply.author} sizeClass="w-8 h-8" />}
                  <div className={`min-w-0 max-w-[85%] rounded-2xl border px-4 py-3 shadow-[0_3px_12px_rgba(16,26,43,0.035)] sm:max-w-[75%] ${isOwnReply ? 'rounded-br-sm border-[#991313]/15 bg-[#991313]/10' : 'rounded-bl-sm border-[#B9BEC8]/30 bg-white'}`}>
                    <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className={`text-xs font-bold ${isOwnReply ? 'text-[#991313]' : 'text-[#101A2B]'}`}>{isOwnReply ? 'You' : reply.author?.name || 'A member'}</span>
                      <span className="text-[10px] text-[#4D5057]">{formatRelativeTime(reply.created_at)}</span>
                    </div>
                    {isEditing ? <div className="space-y-2">
                      <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3} autoFocus className="w-full min-w-[190px] rounded-xl border border-[#B9BEC8] bg-white p-3 text-sm text-[#111827] outline-none focus:border-[#991313]" />
                      <div className="flex gap-3"><button type="button" onClick={() => handleSaveEditedReply(reply.id)} disabled={editSubmitting || !editText.trim()} className="rounded-full bg-[#991313] px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50">{editSubmitting ? 'Saving...' : 'Save'}</button><button type="button" onClick={cancelEditingReply} className="text-xs text-[#4D5057]">Cancel</button></div>
                    </div> : <p className="whitespace-pre-line break-words text-sm leading-7 text-[#111827]">{reply.content}</p>}
                    {isOwnReply && !isEditing && <div className="mt-2 flex justify-end gap-3 border-t border-[#991313]/10 pt-2"><button type="button" onClick={() => startEditingReply(reply)} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4D5057] hover:text-[#991313]"><Pencil size={12} /> Edit</button><button type="button" onClick={() => handleDeleteReply(reply.id)} disabled={isDeleting} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4D5057] hover:text-[#991313] disabled:opacity-50"><Trash2 size={12} /> {isDeleting ? 'Deleting...' : 'Delete'}</button></div>}
                  </div>
                </article>;
              })}
              <div ref={repliesEndRef} />
            </div>
          </div>

          {/* Sticky on mobile, fixed within the flex panel on desktop. */}
          <div className="sticky bottom-0 z-10 shrink-0 border-t border-[#B9BEC8]/35 bg-white px-3 py-3 lg:static pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8 lg:py-5">
            <div className="mx-auto max-w-[780px]">
              {user ? <form onSubmit={handleSubmitReply} className="flex items-end gap-2.5">
                <label htmlFor="discussion-reply" className="sr-only">Write a reply</label>
                <textarea id="discussion-reply" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Share your thoughts..." rows={2} className="max-h-36 min-h-[52px] min-w-0 flex-1 resize-none rounded-2xl border border-[#B9BEC8]/60 bg-[#F8F8F8] px-4 py-3 text-sm leading-6 text-[#111827] outline-none placeholder:text-[#4D5057]/70 focus:border-[#991313] focus:ring-2 focus:ring-[#991313]/10 lg:resize-y" />
                <button type="submit" aria-label="Post reply" disabled={submitting || !replyText.trim()} className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#991313] text-white transition hover:bg-[#7F0E0E] disabled:cursor-not-allowed disabled:opacity-50"><Send size={19} /></button>
              </form> : <div className="flex items-center justify-between gap-3"><p className="text-xs text-[#4D5057] sm:text-sm">Sign in to join the conversation.</p><button type="button" onClick={() => navigate('/login')} className="shrink-0 rounded-full bg-[#991313] px-5 py-2.5 text-xs font-semibold text-white">Log In</button></div>}
              {submitting && <p className="mt-2 text-xs text-[#4D5057]">Posting your reply...</p>}
              {replyError && <p role="alert" className="mt-2 text-xs font-medium text-[#991313]">{replyError}</p>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DiscussionThread;
