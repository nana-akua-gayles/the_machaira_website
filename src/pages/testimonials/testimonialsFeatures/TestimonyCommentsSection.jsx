import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Send } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import {
  getTestimonyComments,
  createTestimonyComment,
} from "../../../lib/testimoniesService";

function getInitials(name) {
  if (!name) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function timeAgo(iso) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const secs = Math.floor((now - then) / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TestimonyCommentsSection({ testimonyId }) {
  const { user, loading: authLoading } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  // ----- Fetch comments -----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error: fetchErr } = await getTestimonyComments(testimonyId);
      if (cancelled) return;
      if (fetchErr) setError("Couldn't load comments.");
      else setComments(data);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [testimonyId]);

  // ----- Post comment -----
  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || posting) return;
    const trimmed = draft.trim();
    if (!trimmed) return;

    setPosting(true);
    setPostError("");

    const { data, error: postErr } = await createTestimonyComment({
      testimonyId,
      userId: user.id,
      content: trimmed,
    });

    if (postErr || !data) {
      setPostError("Couldn't post your comment. Please try again.");
      setPosting(false);
      return;
    }

    setComments((prev) => [...prev, data]);
    setDraft("");
    setPosting(false);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col border-t border-[#E5E7EB] pt-3 sm:mt-8 sm:block sm:pt-6">
      <div className="flex shrink-0 items-center justify-between px-5 sm:px-0">
        <h3 className="font-serif text-lg text-navy-dark">
          Comments{" "}
          <span className="text-sm font-normal text-[#6B7280]">
            ({comments.length})
          </span>
        </h3>
      </div>

      {/* List */}
      <div className="mt-3 min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 pb-4 sm:mt-4 sm:overflow-visible sm:px-0 sm:pb-0">
        {loading && (
          <div className="flex items-center gap-2 py-4 text-sm text-[#6B7280]">
            <Loader2 className="h-4 w-4 animate-spin text-burgundy-primary" />
            Loading comments…
          </div>
        )}

        {!loading && error && (
          <p className="py-2 text-sm text-burgundy-primary">{error}</p>
        )}

        {!loading && !error && comments.length === 0 && (
          <p className="py-2 text-sm italic text-[#6B7280]">
            No comments yet. Be the first to encourage.
          </p>
        )}

        {!loading &&
          !error &&
          comments.map((comment) => {
            const profile = Array.isArray(comment.profiles)
              ? comment.profiles[0]
              : comment.profiles ?? {};
            return (
              <div key={comment.id} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F3E7E7] text-[11px] font-semibold text-burgundy-primary">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name ?? ""}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    getInitials(profile.name)
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="truncate text-sm font-semibold text-navy-dark">
                      {profile.name || "Believer"}
                    </p>
                    <span className="shrink-0 text-xs text-[#6B7280]">
                      {timeAgo(comment.created_at)}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#202735]">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      {/* Composer */}
      <div className="mt-0 shrink-0 border-t border-[#E5E7EB] bg-[#fdfaf7] px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:mt-6 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        {authLoading ? (
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Loader2 className="h-4 w-4 animate-spin text-burgundy-primary" />
            Checking your session…
          </div>
        ) : !user ? (
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F8F8F7] p-4 text-center">
            <p className="text-sm text-cool-gray">
              Please{" "}
              <Link
                to="/login"
                className="font-semibold text-burgundy-primary hover:underline"
              >
                sign in
              </Link>{" "}
              to leave a comment.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                disabled={posting}
                rows={2}
                placeholder="Write a comment…"
                className="min-h-[44px] flex-1 resize-none rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm leading-6 text-navy-dark placeholder:text-soft-gray outline-none transition-colors focus:border-burgundy-primary disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={posting || !draft.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-burgundy-primary text-white transition-colors hover:bg-[#7F0E0E] disabled:opacity-50"
                aria-label="Post comment"
              >
                {posting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>

            {postError && (
              <p className="mt-2 text-xs text-burgundy-primary">{postError}</p>
            )}
            <p className="mt-2 hidden text-[11px] text-[#6B7280] sm:block">
              Press Enter to post • Shift + Enter for a new line
            </p>
          </form>
        )}
      </div>
    </div>
  );
}