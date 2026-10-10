import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, CornerUpLeft, X } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabaseClient";
import { getCommentsForEpisode, addComment, getLikedCommentIds, likeComment, unlikeComment, editComment, deleteComment } from "../../../lib/commentService";

function authorName(author) {
  return author?.name?.trim() || "Anonymous";
}

function getInitials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function CommentAvatar({ author, sizeClass = "h-10 w-10 text-sm" }) {
  if (author?.avatar_url) {
    return (
      <img
        src={author.avatar_url}
        alt={author.name || "Commenter"}
        className={`${sizeClass} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-burgundy-primary font-semibold text-white`}>
      {getInitials(author?.name)}
    </div>
  );
}

function HeartButtonIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={filled ? "#991313" : "none"}
      stroke={filled ? "#991313" : "#B9BEC8"}
      strokeWidth="1.5"
    >
      <path
        d="M12 20s-7-4.3-7-9.3A4.2 4.2 0 019.2 6.5c1.2 0 2.2.6 2.8 1.5.6-.9 1.6-1.5 2.8-1.5a4.2 4.2 0 014.2 4.2c0 5-7 9.3-7 9.3z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatCommentDate(dateString) {
  return new Date(dateString).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Africa/Accra",
  });
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: sameYear ? undefined : "numeric", timeZone: "Africa/Accra" });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getMentionTrigger(text, caret) {
  const match = text.slice(0, caret).match(/(?:^|\s)@([^\s@]*(?: [^\s@]*)?)$/u);
  if (!match) return null;
  return { start: caret - match[1].length - 1, query: match[1] };
}

function findRoot(comment, byId) {
  let current = comment;
  const seen = new Set();
  while (current.parent_id && byId.has(current.parent_id) && !seen.has(current.id)) {
    seen.add(current.id);
    current = byId.get(current.parent_id);
  }
  return current;
}

function collectDescendantIds(id, comments) {
  const ids = new Set([id]);
  let grew = true;
  while (grew) {
    grew = false;
    comments.forEach((c) => {
      if (c.parent_id && ids.has(c.parent_id) && !ids.has(c.id)) {
        ids.add(c.id);
        grew = true;
      }
    });
  }
  return ids;
}

function CommentText({ content, names, selfNames }) {
  const parts = useMemo(() => {
    if (!names.length) return [content];
    const pattern = new RegExp(`(@(?:${names.map(escapeRegExp).join("|")}))(?![\\p{L}\\p{N}_])`, "gu");
    return content.split(pattern);
  }, [content, names]);

  return parts.map((part, index) => {
    if (index % 2 === 0) return <span key={index}>{part}</span>;
    const isSelf = selfNames.includes(part.slice(1));
    return (
      <span
        key={index}
        className={`font-semibold text-burgundy-primary ${isSelf ? "rounded-md bg-burgundy-primary/10 px-1" : ""}`}
      >
        {part}
      </span>
    );
  });
}

function DevotionalComments({ episodeNumber }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myProfile, setMyProfile] = useState(undefined);

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [replyTo, setReplyTo] = useState(null);
  const [trigger, setTrigger] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(() => new Set());

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const textareaRef = useRef(null);
  const formRef = useRef(null);
  const pendingLikesRef = useRef(new Set());

  const [likedCommentIds, setLikedCommentIds] = useState(() => new Set());

  useEffect(() => {
    if (!episodeNumber) return;

    async function loadComments() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCommentsForEpisode(episodeNumber);
        setComments(data);
      } catch (err) {
        console.error("Failed to load comments:", err);
        setError("Unable to load comments right now.");
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [episodeNumber]);

  useEffect(() => {
    if (!user) {
      setLikedCommentIds(new Set());
      return;
    }
    if (loading || !episodeNumber) return;

    let active = true;
    getLikedCommentIds(user.id, episodeNumber)
      .then((ids) => {
        if (active) setLikedCommentIds(new Set(ids));
      })
      .catch((err) => console.error("Failed to load your likes:", err));
    return () => {
      active = false;
    };
  }, [user?.id, loading, episodeNumber]);

  useEffect(() => {
    if (!user) {
      setMyProfile(undefined);
      return;
    }
    let active = true;
    supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setMyProfile(data || { name: null, avatar_url: null });
      });
    return () => {
      active = false;
    };
  }, [user]);

  const people = useMemo(() => {
    const seen = new Map();
    comments.forEach((c) => {
      if (!seen.has(c.user_id)) seen.set(c.user_id, { id: c.user_id, name: authorName(c.author), avatar_url: c.author?.avatar_url || null });
    });
    return [...seen.values()];
  }, [comments]);

  const names = useMemo(() => [...new Set(people.map((p) => p.name))].sort((a, b) => b.length - a.length), [people]);
  const selfNames = useMemo(() => people.filter((p) => p.id === user?.id).map((p) => p.name), [people, user]);
  const mentionable = useMemo(() => people.filter((p) => p.id !== user?.id), [people, user]);

  const mentionMatches = useMemo(() => {
    if (!trigger) return [];
    const query = trigger.query.toLowerCase();
    return mentionable.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 5);
  }, [trigger, mentionable]);

  const { threads, byId } = useMemo(() => {
    const lookup = new Map(comments.map((c) => [c.id, c]));
    const groups = new Map();

    [...comments]
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .forEach((comment) => {
        const root = findRoot(comment, lookup);
        if (!groups.has(root.id)) groups.set(root.id, { root, replies: [] });
        if (root.id !== comment.id) groups.get(root.id).replies.push({ comment, parent: lookup.get(comment.parent_id) });
      });

    const list = [...groups.values()].sort((a, b) => new Date(b.root.created_at) - new Date(a.root.created_at));
    return { threads: list, byId: lookup };
  }, [comments]);

  function handleChange(event) {
    const value = event.target.value;
    setNewComment(value);
    setTrigger(getMentionTrigger(value, event.target.selectionStart));
    setActiveIndex(0);
  }

  function insertMention(person) {
    const el = textareaRef.current;
    const caret = el.selectionStart;
    const before = newComment.slice(0, trigger.start);
    const inserted = `@${person.name} `;
    setNewComment(before + inserted + newComment.slice(caret));
    setTrigger(null);
    requestAnimationFrame(() => {
      el.focus();
      const pos = before.length + inserted.length;
      el.setSelectionRange(pos, pos);
    });
  }

  function handleKeyDown(event) {
    if (!trigger || mentionMatches.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % mentionMatches.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + mentionMatches.length) % mentionMatches.length);
    } else if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      insertMention(mentionMatches[activeIndex]);
    } else if (event.key === "Escape") {
      setTrigger(null);
    }
  }

  function startReply(comment) {
    setReplyTo(comment);
    setTrigger(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  }

  function cancelReply() {
    setReplyTo(null);
    setTrigger(null);
  }

  function toggleThread(rootId) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(rootId)) next.delete(rootId);
      else next.add(rootId);
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!newComment.trim()) return;

    const threadToOpen = replyTo ? findRoot(replyTo, byId).id : null;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const created = await addComment(episodeNumber, user.id, newComment.trim(), replyTo?.id || null);
      const ownName = myProfile ? myProfile.name : user.user_metadata?.full_name || user.email;
      const ownAvatar = myProfile ? myProfile.avatar_url : user.user_metadata?.avatar_url || null;
      setComments((prev) => [
        {
          ...created,
          author: { id: user.id, name: ownName, avatar_url: ownAvatar },
        },
        ...prev,
      ]);
      if (threadToOpen) setExpanded((prev) => new Set(prev).add(threadToOpen));
      setNewComment("");
      setReplyTo(null);
      setTrigger(null);
    } catch (err) {
      setSubmitError(
        err?.message || "We couldn't post your comment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEdit(comment) {
    setEditingId(comment.id);
    setEditText(comment.content || "");
    setConfirmDeleteId(null);
    setActionError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
    setActionError(null);
  }

  async function saveEdit(comment) {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === comment.content || savingEdit) return;

    setSavingEdit(true);
    setActionError(null);
    try {
      const updated = await editComment(comment.id, user.id, trimmed);
      setComments((prev) => prev.map((c) => (c.id === comment.id ? { ...c, content: updated.content } : c)));
      setEditingId(null);
      setEditText("");
    } catch (err) {
      setActionError({ id: comment.id, message: err?.message || "We couldn't save your changes. Please try again." });
    } finally {
      setSavingEdit(false);
    }
  }

  function handleEditKeyDown(event, comment) {
    if (event.key === "Escape") cancelEdit();
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      saveEdit(comment);
    }
  }

  async function handleDelete(comment) {
    if (deletingId) return;

    setDeletingId(comment.id);
    setActionError(null);
    try {
      await deleteComment(comment.id, user.id);
      const removed = collectDescendantIds(comment.id, comments);
      setComments((prev) => prev.filter((c) => !removed.has(c.id)));
      if (replyTo && removed.has(replyTo.id)) cancelReply();
      setConfirmDeleteId(null);
    } catch (err) {
      setActionError({ id: comment.id, message: err?.message || "We couldn't delete this comment. Please try again." });
    } finally {
      setDeletingId(null);
    }
  }

  function applyLike(commentId, liked) {
    setLikedCommentIds((prev) => {
      const next = new Set(prev);
      if (liked) next.add(commentId);
      else next.delete(commentId);
      return next;
    });
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes_count: Math.max(0, (c.likes_count || 0) + (liked ? 1 : -1)) } : c))
    );
  }

  function adjustCount(commentId, delta) {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes_count: Math.max(0, (c.likes_count || 0) + delta) } : c))
    );
  }

  async function toggleLike(comment) {
    if (!user) {
      navigate("/login");
      return;
    }
    if (pendingLikesRef.current.has(comment.id)) return;

    const wasLiked = likedCommentIds.has(comment.id);
    pendingLikesRef.current.add(comment.id);
    applyLike(comment.id, !wasLiked);

    try {
      if (wasLiked) {
        const removed = await unlikeComment(comment.id, user.id);
        if (!removed) adjustCount(comment.id, 1);
      } else {
        const added = await likeComment(comment.id, user.id);
        if (!added) adjustCount(comment.id, -1);
      }
    } catch (err) {
      console.error("Failed to update like:", err);
      applyLike(comment.id, wasLiked);
    } finally {
      pendingLikesRef.current.delete(comment.id);
    }
  }

  function renderComment(comment, { isReply = false, parent = null, rootId = null } = {}) {
    const isLiked = likedCommentIds.has(comment.id);
    const isOwner = Boolean(user && comment.user_id === user.id);
    const isEditing = editingId === comment.id;
    const isConfirmingDelete = confirmDeleteId === comment.id;
    const showTarget = isReply && parent && parent.id !== rootId;
    const replyCount = collectDescendantIds(comment.id, comments).size - 1;

    return (
      <div key={comment.id} className="flex gap-3">
        <CommentAvatar author={comment.author} sizeClass={isReply ? "h-8 w-8 text-[11px]" : "h-10 w-10 text-sm"} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5">
            <p className="text-[13px] font-semibold text-cool-gray">{authorName(comment.author)}</p>
            {isOwner && (
              <span className="rounded bg-burgundy-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-burgundy-primary">You</span>
            )}
            {showTarget && (
              <>
                <span className="text-[10px] text-soft-gray">▸</span>
                <span className="text-[13px] font-semibold text-cool-gray">{authorName(parent.author)}</span>
              </>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => handleEditKeyDown(e, comment)}
                rows={3}
                autoFocus
                className="w-full resize-none rounded-xl border border-black/10 bg-[#F8F8F7] p-3 text-sm text-navy-dark focus:border-burgundy-primary focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-full px-4 py-1.5 text-xs font-semibold text-cool-gray transition-colors hover:text-navy-dark"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => saveEdit(comment)}
                  disabled={savingEdit || !editText.trim() || editText.trim() === comment.content}
                  className="rounded-full bg-burgundy-primary px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#7f0e0e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingEdit ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-navy-dark">
              <CommentText content={comment.content || ""} names={names} selfNames={selfNames} />
            </p>
          )}

          {!isEditing && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-soft-gray">
              <span title={formatCommentDate(comment.created_at)}>{timeAgo(comment.created_at)}</span>

              {user && (
                <button type="button" onClick={() => startReply(comment)} className="font-semibold transition-colors hover:text-burgundy-primary">
                  Reply
                </button>
              )}

              {isOwner && !isConfirmingDelete && (
                <>
                  <button type="button" onClick={() => startEdit(comment)} className="font-semibold transition-colors hover:text-burgundy-primary">
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmDeleteId(comment.id);
                      setActionError(null);
                    }}
                    className="font-semibold transition-colors hover:text-burgundy-primary"
                  >
                    Delete
                  </button>
                </>
              )}

              {isOwner && isConfirmingDelete && (
                <div className="flex items-center gap-3 rounded-full bg-burgundy-primary/5 py-1 pl-3 pr-1.5">
                  <span className="font-medium text-navy-dark">
                    {replyCount > 0 ? `Delete this and ${replyCount} ${replyCount === 1 ? "reply" : "replies"}?` : "Delete this comment?"}
                  </span>
                  <button type="button" onClick={() => setConfirmDeleteId(null)} className="font-semibold text-cool-gray transition-colors hover:text-navy-dark">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(comment)}
                    disabled={deletingId === comment.id}
                    className="rounded-full bg-burgundy-primary px-3 py-1 font-semibold text-white transition-colors hover:bg-[#7f0e0e] disabled:opacity-60"
                  >
                    {deletingId === comment.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          )}

          {actionError?.id === comment.id && (
            <p className="mt-2 text-xs text-burgundy-primary">{actionError.message}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleLike(comment)}
          aria-label={isLiked ? "Unlike comment" : "Like comment"}
          title={user ? undefined : "Sign in to like"}
          className="flex shrink-0 flex-col items-center gap-0.5 self-start pt-1 text-xs transition-transform active:scale-90"
        >
          <HeartButtonIcon filled={isLiked} />
          <span className={isLiked ? "font-semibold text-burgundy-primary" : "text-soft-gray"}>{comment.likes_count || 0}</span>
        </button>
      </div>
    );
  }

  return (
    <section className="mt-16 border-t border-black/10 pt-10">

      <h3 className="text-xl font-semibold text-navy-dark">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      {user ? (
        <form ref={formRef} onSubmit={handleSubmit} className="mt-6">
          {replyTo && (
            <div className="mb-2 flex items-center justify-between gap-3 rounded-xl bg-burgundy-primary/5 px-4 py-2.5">
              <div className="flex min-w-0 items-center gap-2 text-xs text-cool-gray">
                <CornerUpLeft size={13} className="shrink-0 text-burgundy-primary" />
                <span className="shrink-0">Replying to</span>
                <span className="shrink-0 font-semibold text-navy-dark">{authorName(replyTo.author)}</span>
                <span className="truncate">· {replyTo.content}</span>
              </div>
              <button type="button" onClick={cancelReply} aria-label="Cancel reply" className="shrink-0 text-cool-gray transition-colors hover:text-burgundy-primary">
                <X size={15} />
              </button>
            </div>
          )}

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={handleChange}
              onClick={(e) => setTrigger(getMentionTrigger(e.target.value, e.target.selectionStart))}
              onKeyDown={handleKeyDown}
              onBlur={() => setTrigger(null)}
              placeholder={replyTo ? `Reply to ${authorName(replyTo.author)}...` : "Share your thoughts on today's devotional..."}
              rows={3}
              className="w-full resize-none rounded-2xl border border-black/10 bg-[#F8F8F7] p-4 text-sm text-navy-dark placeholder:text-soft-gray focus:border-burgundy-primary focus:outline-none"
            />

            {trigger && mentionMatches.length > 0 && (
              <ul role="listbox" className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-black/10 bg-white py-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)]">
                {mentionMatches.map((person, index) => (
                  <li key={person.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertMention(person);
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${index === activeIndex ? "bg-burgundy-primary/5" : ""}`}
                    >
                      <CommentAvatar author={person} sizeClass="h-7 w-7 text-[11px]" />
                      <span className="font-medium text-navy-dark">{person.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {submitError && (
            <p className="mt-2 text-sm text-burgundy-primary">{submitError}</p>
          )}

          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-xs text-soft-gray">Type @ to mention someone</p>
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="rounded-full bg-burgundy-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7f0e0e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : replyTo ? "Post Reply" : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 rounded-2xl bg-[#F8F8F7] p-5 text-center">
          <p className="text-sm text-cool-gray">
            Sign in to join the conversation.
          </p>
          <Link
            to="/login"
            className="mt-3 inline-flex items-center justify-center rounded-full border border-burgundy-primary px-6 py-2.5 text-sm font-semibold text-burgundy-primary transition-colors hover:bg-burgundy-primary hover:text-white"
          >
            Sign In
          </Link>
        </div>
      )}

      {loading && (
        <p className="mt-8 text-sm text-cool-gray">Loading comments...</p>
      )}

      {error && (
        <p className="mt-8 text-sm text-burgundy-primary">{error}</p>
      )}

      {!loading && !error && comments.length === 0 && (
        <p className="mt-8 text-sm text-cool-gray">
          No comments yet. Be the first to share your thoughts.
        </p>
      )}

      <div className="mt-8 space-y-6">
        {threads.map(({ root, replies }) => {
          const isOpen = expanded.has(root.id);

          return (
            <div key={root.id}>
              {renderComment(root)}

              {replies.length > 0 && (
                <div className="ml-[52px] mt-3">
                  {isOpen && (
                    <div className="space-y-4">
                      {replies.map(({ comment, parent }) => renderComment(comment, { isReply: true, parent, rootId: root.id }))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleThread(root.id)}
                    className="mt-3 flex items-center gap-3 text-xs font-semibold text-soft-gray transition-colors hover:text-navy-dark"
                  >
                    <span className="h-px w-6 bg-black/20" />
                    {isOpen ? "Hide replies" : `View ${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
}

export default DevotionalComments;