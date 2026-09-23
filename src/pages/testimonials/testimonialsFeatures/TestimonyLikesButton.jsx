import { useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toggleTestimonyLike } from "../../lib/testimoniesService";

export default function TestimonyLikesButton({
  testimonyId,
  liked,
  count,
  onChange,
  onRequireAuth,
  size = "sm",
}) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState(liked);
  const [optimisticCount, setOptimisticCount] = useState(count);

  // Sync from props when the parent's data changes (e.g. after a refetch)
  if (!busy && liked !== optimisticLiked) setOptimisticLiked(liked);
  if (!busy && count !== optimisticCount) setOptimisticCount(count);

  async function handleClick(e) {
    e.stopPropagation(); // don't open the card modal when tapping the heart

    if (!user) {
      onRequireAuth?.();
      return;
    }
    if (busy) return;

    setBusy(true);
    const nextLiked = !optimisticLiked;

    // Optimistic UI
    setOptimisticLiked(nextLiked);
    setOptimisticCount((c) => c + (nextLiked ? 1 : -1));

    const { liked: finalLiked, error } = await toggleTestimonyLike(
      testimonyId,
      user.id
    );

    if (error) {
      // Rollback
      setOptimisticLiked(!nextLiked);
      setOptimisticCount((c) => c + (nextLiked ? -1 : 1));
      setBusy(false);
      return;
    }

    setOptimisticLiked(finalLiked);
    onChange?.(finalLiked);
    setBusy(false);
  }

  const iconSize = size === "lg" ? 18 : 15;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label={optimisticLiked ? "Unlike" : "Like"}
      aria-pressed={optimisticLiked}
      className={`group/like flex items-center gap-1.5 transition-colors ${
        optimisticLiked ? "text-[#991313]" : "text-[#6B7280] hover:text-[#991313]"
      } ${busy ? "opacity-60" : ""}`}
    >
      <Heart
        width={iconSize}
        height={iconSize}
        strokeWidth={1.6}
        fill={optimisticLiked ? "#991313" : "none"}
        className={busy ? "animate-pulse" : ""}
      />
      {optimisticCount}
    </button>
  );
}