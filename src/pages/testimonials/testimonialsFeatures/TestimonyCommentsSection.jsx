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
    <div className="mt-8 border-t border-[#E5E7EB] pt-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-[#101A2B]">
          Comments{" "}
          <span className="text-sm font-normal text-[#6B7280]">
            ({comments.length})
          </span>
        </h3>
      </div>

      {/* List */}
      <div className="mt-4 space-y-4">
        {loading && (
          <div className="flex items-center gap-2 py-4 text-sm text-[#6B7280]">
            <Loader2 className="h-4 w-4 animate-spin text-[#991313]" />
            Loading comments…
          </div>
        )}

        {!loading && error && (
          <p className="py-2 text-sm text-[#991313]">{error}</p>
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
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F3E7E7] text-[11px] font-semibold text-[#991313]">
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
                    <p className="truncate text-sm font-semibold text-[#101A2B]">
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
      <div className="mt-6">
        {authLoading ? (
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Loader2 className="h-4 w-4 animate-spin text-[#991313]" />
            Checking your session…
          </div>
        ) : !user ? (
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F8F8F7] p-4 text-center">
            <p className="text-sm text-[#4D5057]">
              Please{" "}
              <Link
                to="/login"
                className="font-semibold text-[#991313] hover:underline"
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
                className="min-h-[44px] flex-1 resize-none rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm leading-6 text-[#101A2B] placeholder:text-[#B9BEC8] outline-none transition-colors focus:border-[#991313] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={posting || !draft.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#991313] text-white transition-colors hover:bg-[#7F0E0E] disabled:opacity-50"
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
              <p className="mt-2 text-xs text-[#991313]">{postError}</p>
            )}
            <p className="mt-2 text-[11px] text-[#6B7280]">
              Press Enter to post • Shift + Enter for a new line
            </p>
          </form>
        )}
      </div>
    </div>
  );
}