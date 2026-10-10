import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../../../lib/supabaseClient";
import { getDevotionalByDate } from "../../../lib/devotionalService";
import { formatDevotionalTitle } from "./formatDevotional";
import DevotionalPrintView from "./DevotionalPrintView";

const BUTTON_SIZE = 64;
const DRAG_THRESHOLD = 6;
const DAY_MS = 1000 * 60 * 60 * 24;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getDefaultPosition() {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  return { x: window.innerWidth / 2 - BUTTON_SIZE / 2, y: window.innerHeight / 2 - BUTTON_SIZE / 2 };
}

function clampToViewport(pos) {
  const maxX = window.innerWidth - BUTTON_SIZE;
  const maxY = window.innerHeight - BUTTON_SIZE;
  return { x: clamp(pos.x, 0, Math.max(0, maxX)), y: clamp(pos.y, 0, Math.max(0, maxY)) };
}

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function useAuthUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setUser(data.session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return user;
}

function useStreak(userId) {
  const [streak, setStreak] = useState({ currentStreak: 0, lastActiveDate: null });

  const reload = useCallback(async () => {
    if (!userId) return;
    try {
      const { data: rows, error } = await supabase.rpc("enforce_streak_resets_and_get_leaderboard");
      if (error) throw error;
      const me = (rows || []).find((r) => r.id === userId);
      setStreak({ currentStreak: me?.current_streak ?? 0, lastActiveDate: me?.last_devotional_date ?? null });
    } catch (err) {
      console.error("Error fetching streak data:", err);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setStreak({ currentStreak: 0, lastActiveDate: null });
      return;
    }
    reload();
  }, [userId, reload]);

  const weekDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null;
    if (lastActive) lastActive.setHours(0, 0, 0, 0);
    const daysSinceLastActive = lastActive ? Math.floor((today - lastActive) / DAY_MS) : null;
    const streakIsLive = daysSinceLastActive !== null && daysSinceLastActive <= 1;

    return Array.from({ length: 7 }, (_, k) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - k));
      const daysBeforeLastActive = lastActive ? Math.floor((lastActive - d) / DAY_MS) : null;
      const completed = streakIsLive && daysBeforeLastActive !== null && daysBeforeLastActive >= 0 && daysBeforeLastActive < streak.currentStreak;
      return { label: d.toLocaleDateString("en-US", { weekday: "narrow" }), completed };
    });
  }, [streak.currentStreak, streak.lastActiveDate]);

  return { currentStreak: streak.currentStreak, weekDays, reload };
}

function useTodayDevotional(enabled) {
  const [state, setState] = useState({ devotional: null, status: "loading" });

  const load = useCallback(async () => {
    setState((s) => (s.devotional ? s : { ...s, status: "loading" }));
    try {
      const data = await getDevotionalByDate(todayString());
      setState({ devotional: data || null, status: data ? "ready" : "none" });
    } catch (err) {
      console.error("TODAY DEVOTIONAL LOAD FAILED:", err);
      setState((s) => (s.devotional ? s : { devotional: null, status: "error" }));
    }
  }, []);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  return { ...state, reload: load };
}

const STATUS_TEXT = {
  loading: "Preparing...",
  none: "No devotional published today",
  error: "Couldn't load it. Tap to retry",
};

function ExperiencePanelContent({ currentStreak, weekDays, todayStatus, preparing, shareCopied, onDownload, onShare }) {
  const completedCount = weekDays.filter((d) => d.completed).length;
  const percent = Math.round((completedCount / 7) * 100);
  const degrees = (completedCount / 7) * 360;
  const actionsDisabled = todayStatus === "loading" || todayStatus === "none";

  return (
    <>
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-charcoal-text">
          Your Devotional Experience
        </h2>
        <div className="mt-3 h-0.5 w-12 bg-burgundy-primary" />
      </div>

      <div className="rounded-2xl border border-black/10 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-sm font-medium text-[#374151]">Streak</span>
            <p className="mt-2 text-2xl font-semibold text-charcoal-text">
              {currentStreak} {currentStreak === 1 ? "Day" : "Days"}
            </p>
            <p className="mt-1 text-xs font-medium text-burgundy-primary">
              {currentStreak > 0 ? "Keep going!" : "Start your streak today!"}
            </p>
          </div>
          <div
            className="relative flex h-19 w-19 items-center justify-center rounded-full"
            style={{ background: `conic-gradient(#991313 0deg ${degrees}deg, #E5E7EB ${degrees}deg 360deg)` }}
          >
            <div className="flex h-14.5 w-14.5 items-center justify-center rounded-full bg-white">
              <span className="text-sm font-semibold text-charcoal-text">{percent}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-black/10 p-4">
        <p className="text-sm font-medium text-charcoal-text">Progress this Week</p>
        <div className="mt-4 flex items-center justify-between">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                day.completed ? "bg-burgundy-primary text-white" : "bg-[#E5E7EB] text-[#374151]"
              }`}
            >
              {day.label}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onDownload}
        disabled={actionsDisabled || preparing}
        className="mt-3 flex w-full items-center justify-between rounded-2xl border border-black/10 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:bg-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        <div>
          <p className="text-sm font-medium text-charcoal-text">Download PDF</p>
          <p className="mt-1 text-xs text-cool-gray">{preparing ? "Preparing PDF..." : STATUS_TEXT[todayStatus] || "Save today's devotional as PDF"}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg">{preparing ? "…" : "↓"}</span>
      </button>

      <button
        type="button"
        onClick={onShare}
        disabled={actionsDisabled}
        className="mt-3 flex w-full items-center justify-between rounded-2xl border border-black/10 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:bg-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        <div>
          <p className="text-sm font-medium text-charcoal-text">Share Today's Devotional</p>
          <p className="mt-1 text-xs text-cool-gray">{shareCopied ? "Link copied!" : STATUS_TEXT[todayStatus] || "Encourage someone"}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg">{shareCopied ? "✓" : "↗"}</span>
      </button>
    </>
  );
}

function FloatingToggle({ position, onPositionChange, onOpen, currentStreak }) {
  const dragState = useRef(null);
  const wasDraggedRef = useRef(false);

  function handlePointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: position.x, originY: position.y };
    wasDraggedRef.current = false;
  }

  function handlePointerMove(event) {
    if (!dragState.current) return;
    const dx = event.clientX - dragState.current.startX;
    const dy = event.clientY - dragState.current.startY;
    if (!wasDraggedRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) wasDraggedRef.current = true;
    if (wasDraggedRef.current) {
      onPositionChange(clampToViewport({ x: dragState.current.originX + dx, y: dragState.current.originY + dy }));
    }
  }

  function handlePointerUp(event) {
    if (dragState.current) {
      try {
        event.currentTarget.releasePointerCapture(dragState.current.pointerId);
      } catch {}
    }
    dragState.current = null;
  }

  function handleClick() {
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      return;
    }
    onOpen();
  }

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      aria-label="Open your devotional experience"
      style={{ left: position.x, top: position.y }}
      className="fixed z-30 flex h-16 w-16 touch-none select-none flex-col items-center justify-center rounded-full bg-burgundy-primary text-white shadow-[0_10px_30px_rgba(153,19,19,0.35)] transition-transform duration-150 active:scale-95"
    >
      <span className="text-lg font-semibold leading-none">{currentStreak}</span>
      <span className="mt-0.5 text-[9px] uppercase tracking-wide">{currentStreak === 1 ? "day" : "days"}</span>
    </button>
  );
}

function DevotionalExperience() {
  const user = useAuthUser();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(getDefaultPosition);
  const [shareCopied, setShareCopied] = useState(false);
  const [printJob, setPrintJob] = useState(0);
  const [preparing, setPreparing] = useState(false);
  const { currentStreak, weekDays, reload } = useStreak(user?.id);
  const today = useTodayDevotional(Boolean(user));

  useEffect(() => {
    function handleResize() {
      setPosition((prev) => clampToViewport(prev));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      reload();
      today.reload();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!user) setIsOpen(false);
  }, [user]);

  useEffect(() => {
    if (printJob === 0 || !today.devotional) return;

    const previousTitle = document.title;
    let cancelled = false;

    function finish() {
      document.body.classList.remove("printing-devotional");
      document.title = previousTitle;
      window.removeEventListener("afterprint", finish);
      setPreparing(false);
    }

    async function run() {
      const root = document.getElementById("devotional-print-root");
      const images = root ? [...root.querySelectorAll("img")] : [];
      await Promise.race([
        Promise.all(images.map((img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()))),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);
      if (cancelled) return;

      const { mainTitle } = formatDevotionalTitle(today.devotional.title);
      document.title = `${mainTitle} - Machaira`;
      document.body.classList.add("printing-devotional");
      window.addEventListener("afterprint", finish);
      setPreparing(false);
      window.print();
    }

    run();
    return () => {
      cancelled = true;
      finish();
    };
  }, [printJob]);

  function handleDownload() {
    if (today.status === "error") return today.reload();
    if (!today.devotional || preparing) return;
    setPreparing(true);
    setPrintJob((n) => n + 1);
  }

  async function handleShare() {
    if (today.status === "error") return today.reload();
    if (!today.devotional) return;

    const { mainTitle, episodeLabel } = formatDevotionalTitle(today.devotional.title);
    const title = episodeLabel ? `${mainTitle} (${episodeLabel})` : mainTitle;
    const text = `Today's Machaira devotional: ${title}`;
    const url = `${window.location.origin}/devotional/${today.devotional.id}`;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      }
    } catch (err) {
      if (err?.name !== "AbortError") console.error("SHARE FAILED:", err);
    }
  }

  if (!user) return null;

  const panelProps = { currentStreak, weekDays, todayStatus: today.status, preparing, shareCopied, onDownload: handleDownload, onShare: handleShare };

  return (
    <>
      <aside className="hidden w-82.5 rounded-[26px] border border-black/10 bg-white/90 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:block print:hidden">
        <ExperiencePanelContent {...panelProps} />
      </aside>

      <div className="lg:hidden print:hidden">
        {!isOpen && (
          <FloatingToggle position={position} onPositionChange={setPosition} onOpen={() => setIsOpen(true)} currentStreak={currentStreak} />
        )}

        {isOpen && (
          <div className="fixed inset-0 z-40 flex items-end bg-black/40" onClick={() => setIsOpen(false)}>
            <div
              className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-[26px] border border-black/10 bg-white p-5 pb-8 shadow-2xl animate-[slideUp_0.3s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-lg text-[#374151]"
              >
                ×
              </button>
              <ExperiencePanelContent {...panelProps} />
            </div>
          </div>
        )}
      </div>

      {printJob > 0 && today.devotional && createPortal(<DevotionalPrintView devotional={today.devotional} />, document.body)}
    </>
  );
}

export default DevotionalExperience;