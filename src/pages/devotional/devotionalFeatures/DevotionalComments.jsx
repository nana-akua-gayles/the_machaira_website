import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import { getCommentsForEpisode, addComment, updateCommentLikes } from "../../../lib/commentService";

function getInitials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function CommentAvatar({ author }) {
  if (author?.avatar_url) {
    return (
      <img
        src={author.avatar_url}
        alt={author.name || "Commenter"}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#991313] text-sm font-semibold text-white">
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

function DevotionalComments({ episodeNumber }) {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);


  const [likedCommentIds, setLikedCommentIds] = useState(() => {
    try {
      const stored = localStorage.getItem("likedCommentIds");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

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

  async function handleSubmit(event) {
    event.preventDefault();
    if (!newComment.trim()) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const created = await addComment(episodeNumber, user.id, newComment.trim());
      setComments((prev) => [
        {
          ...created,
          author: {
            id: user.id,
            name: user.user_metadata?.full_name || user.email,
            avatar_url: user.user_metadata?.avatar_url || null,
          },
        },
        ...prev,
      ]);
      setNewComment("");
    } catch (err) {
      setSubmitError(
        err?.message || "We couldn't post your comment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleLike(comment) {
    const isLiked = likedCommentIds.has(comment.id);
    const delta = isLiked ? -1 : 1;
    const newCount = Math.max(0, (comment.likes_count || 0) + delta);

    // Optimistic UI update — flip immediately, don't wait on the network.
    setComments((prev) =>
      prev.map((c) => (c.id === comment.id ? { ...c, likes_count: newCount } : c))
    );

    setLikedCommentIds((prev) => {
      const next = new Set(prev);
      if (isLiked) {
        next.delete(comment.id);
      } else {
        next.add(comment.id);
      }
      localStorage.setItem("likedCommentIds", JSON.stringify([...next]));
      return next;
    });

    try {
      await updateCommentLikes(comment.id, newCount);
    } catch (err) {
      console.error("Failed to update like:", err);

      // Revert everything if the database update actually failed.
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id ? { ...c, likes_count: comment.likes_count } : c
        )
      );
      setLikedCommentIds((prev) => {
        const next = new Set(prev);
        if (isLiked) {
          next.add(comment.id);
        } else {
          next.delete(comment.id);
        }
        localStorage.setItem("likedCommentIds", JSON.stringify([...next]));
        return next;
      });
    }
  }

  return (
    <section className="mt-16 border-t border-black/10 pt-10">

      <h3 className="text-xl font-semibold text-[#101A2B]">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts on today's devotional..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-black/10 bg-[#F8F8F7] p-4 text-sm text-[#101A2B] placeholder:text-[#B9BEC8] focus:border-[#991313] focus:outline-none"
          />

          {submitError && (
            <p className="mt-2 text-sm text-[#991313]">{submitError}</p>
          )}

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="rounded-full bg-[#991313] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7f0e0e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 rounded-2xl bg-[#F8F8F7] p-5 text-center">
          <p className="text-sm text-[#4D5057]">
            Sign in to join the conversation.
          </p>
          <Link
            to="/login"
            className="mt-3 inline-flex items-center justify-center rounded-full border border-[#991313] px-6 py-2.5 text-sm font-semibold text-[#991313] transition-colors hover:bg-[#991313] hover:text-white"
          >
            Sign In
          </Link>
        </div>
      )}

      {loading && (
        <p className="mt-8 text-sm text-[#4D5057]">Loading comments...</p>
      )}

      {error && (
        <p className="mt-8 text-sm text-[#991313]">{error}</p>
      )}

      {!loading && !error && comments.length === 0 && (
        <p className="mt-8 text-sm text-[#4D5057]">
          No comments yet. Be the first to share your thoughts.
        </p>
      )}

      <div className="mt-8 space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <CommentAvatar author={comment.author} />

            <div className="flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <p className="text-sm font-semibold text-[#101A2B]">
                  {comment.author?.name || "Anonymous"}
                </p>
                <span className="text-xs text-[#B9BEC8]">
                  {formatCommentDate(comment.created_at)}
                </span>
              </div>

              <p className="mt-1 text-sm leading-relaxed text-[#374151]">
                {comment.content}
              </p>

             <button
                type="button"
                onClick={() => toggleLike(comment)}
                className="mt-2 flex items-center gap-1.5 text-xs transition-transform active:scale-90"
              >
                <HeartButtonIcon filled={likedCommentIds.has(comment.id)} />
                <span
                  className={
                    likedCommentIds.has(comment.id)
                      ? "font-semibold text-[#991313]"
                      : "text-[#B9BEC8]"
                  }
                >
                  {comment.likes_count || 0}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}

export default DevotionalComments;