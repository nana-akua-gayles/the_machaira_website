
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import { getDevotionalByDate } from "../../../lib/devotionalService";
import { STREAK_EVENT } from "../../../lib/recordDevotionalActivity";
import { formatDevotionalTitle } from "./formatDevotional";
import DevotionalPrintView from "./DevotionalPrintView";

const BUTTON_SIZE = 64;
const POSITION_KEY = "machaira_devotional_experience_position_v1";
const DRAG_THRESHOLD = 6;
const MOBILE_BREAKPOINT = 1024;
const MOBILE_EDGE = 8;
const MOBILE_BOTTOM_GAP = 24;
const GHANA_TIME_ZONE = "Africa/Accra";
const DAY_MS = 24 * 60 * 60 * 1000;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;
}

function getViewportSize() {
  const visualViewport = window.visualViewport;

  return {
    width: isMobileViewport()
      ? visualViewport?.width || window.innerWidth
      : window.innerWidth,
    height: isMobileViewport()
      ? visualViewport?.height || window.innerHeight
      : window.innerHeight,
  };
}

function clampToViewport(pos) {
  const { width, height } = getViewportSize();
  const mobile = isMobileViewport();

  const minX = mobile ? MOBILE_EDGE : 0;
  const minY = mobile ? MOBILE_EDGE : 0;
  const maxX = Math.max(
    minX,
    width - BUTTON_SIZE - (mobile ? MOBILE_EDGE : 0)
  );
  const maxY = Math.max(
    minY,
    height - BUTTON_SIZE - (mobile ? MOBILE_EDGE : 0)
  );

  return {
    x: clamp(pos.x, minX, maxX),
    y: clamp(pos.y, minY, maxY),
  };
}

function getDefaultPosition() {
  if (typeof window === "undefined") {
    return { x: 16, y: 16 };
  }

  try {
    const stored = JSON.parse(window.localStorage.getItem(POSITION_KEY));

    if (Number.isFinite(stored?.x) && Number.isFinite(stored?.y)) {
      return clampToViewport(stored);
    }
  } catch {
    /* Storage may be unavailable */
  }

  const { height } = getViewportSize();

  return clampToViewport({
    x: 16,
    y: height - BUTTON_SIZE - (isMobileViewport() ? MOBILE_BOTTOM_GAP : 32),
  });
}

// ==========================================
// GHANA DATE HELPERS
// ==========================================

function todayString() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: GHANA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function dateToUtc(dateString) {
  if (!dateString) return null;

  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) return null;

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function addDays(dateString, amount) {
  const date = dateToUtc(dateString);

  if (!date) return null;

  date.setUTCDate(date.getUTCDate() + amount);

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function dayDifference(laterDate, earlierDate) {
  const later = dateToUtc(laterDate);
  const earlier = dateToUtc(earlierDate);

  if (!later || !earlier) return null;

  return Math.round((later.getTime() - earlier.getTime()) / DAY_MS);
}

// ==========================================
// AUTHENTICATED USER
// ==========================================

function useAuthUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("AUTH SESSION FAILED:", error);
        return;
      }

      if (active) {
        setUser(data.session?.user ?? null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return user;
}

// ==========================================
// STREAK DATA
// ==========================================

function useStreak(userId) {
  const [streak, setStreak] = useState({
    currentStreak: 0,
    lastActiveDate: null,
  });

  const fetchStreak = useCallback(async () => {
    if (!userId) return null;

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("current_streak, last_devotional_date")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;

      if (!profile) {
        return {
          currentStreak: 0,
          lastActiveDate: null,
        };
      }

      const today = todayString();
      const lastActiveDate = profile.last_devotional_date;

      const daysSinceLastActive = lastActiveDate
        ? dayDifference(today, lastActiveDate)
        : null;

      // Display zero if the user missed more than one calendar day.
      // This is a read-only calculation; it does not update profiles.
      const currentStreak =
        daysSinceLastActive !== null &&
        daysSinceLastActive >= 0 &&
        daysSinceLastActive <= 1
          ? profile.current_streak ?? 0
          : 0;

      return {
        currentStreak,
        lastActiveDate: lastActiveDate || null,
      };
    } catch (err) {
      console.error("Error fetching streak data:", err);
      return null;
    }
  }, [userId]);

  const reload = useCallback(async () => {
    const next = await fetchStreak();

    if (next) {
      setStreak(next);
    }

    return next;
  }, [fetchStreak]);

  // Initial streak load.
  useEffect(() => {
    let active = true;

    fetchStreak().then((next) => {
      if (active && next) {
        setStreak(next);
      }
    });

    return () => {
      active = false;
    };
  }, [fetchStreak]);

  // Refresh after the devotional reader records a streak.
  useEffect(() => {
    function handleStreakUpdate() {
      reload();
    }

    window.addEventListener(STREAK_EVENT, handleStreakUpdate);

    return () => {
      window.removeEventListener(STREAK_EVENT, handleStreakUpdate);
    };
  }, [reload]);

  // Refresh when the user returns to the website.
  useEffect(() => {
    function handleVisibilityChange() {
      if (!document.hidden) {
        reload();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [reload]);

  // Calculate the seven-day progress using Ghana calendar dates.
  const weekDays = useMemo(() => {
    const today = todayString();
    const lastActive = streak.lastActiveDate;

    const daysSinceLastActive = lastActive
      ? dayDifference(today, lastActive)
      : null;

    const streakIsLive =
      daysSinceLastActive !== null &&
      daysSinceLastActive >= 0 &&
      daysSinceLastActive <= 1;

    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(today, index - 6);

      const daysBeforeLastActive = lastActive
        ? dayDifference(lastActive, date)
        : null;

      const completed =
        streakIsLive &&
        daysBeforeLastActive !== null &&
        daysBeforeLastActive >= 0 &&
        daysBeforeLastActive < streak.currentStreak;

      const parsedDate = dateToUtc(date);

      return {
        label: parsedDate
          ? parsedDate.toLocaleDateString("en-US", {
              weekday: "narrow",
              timeZone: "UTC",
            })
          : "",
        completed,
      };
    });
  }, [streak.currentStreak, streak.lastActiveDate]);

  return {
    currentStreak: streak.currentStreak,
    weekDays,
    reload,
  };
}

// ==========================================
// TODAY'S DEVOTIONAL
// ==========================================

function useTodayDevotional() {
  const [state, setState] = useState({
    devotional: null,
    status: "loading",
  });

  const fetchToday = useCallback(async () => {
    try {
      const data = await getDevotionalByDate(todayString());

      return {
        devotional: data || null,
        status: data ? "ready" : "none",
      };
    } catch (err) {
      console.error("TODAY DEVOTIONAL LOAD FAILED:", err);
      return null;
    }
  }, []);

  const settle = useCallback(
    (next) =>
      setState((s) =>
        next ||
        (s.devotional
          ? s
          : {
              devotional: null,
              status: "error",
            })
      ),
    []
  );

  const reload = useCallback(
    () => fetchToday().then(settle),
    [fetchToday, settle]
  );

  const retry = useCallback(() => {
    setState((s) =>
      s.devotional
        ? s
        : {
            ...s,
            status: "loading",
          }
    );

    reload();
  }, [reload]);

  useEffect(() => {
    let active = true;

    fetchToday().then((next) => {
      if (active) settle(next);
    });

    return () => {
      active = false;
    };
  }, [fetchToday, settle]);

  return {
    ...state,
    reload,
    retry,
  };
}

const STATUS_TEXT = {
  loading: "Preparing...",
  none: "No devotional published today",
  error: "Couldn't load it. Tap to retry",
};

// ==========================================
// EXPERIENCE PANEL
// ==========================================

function ExperiencePanelContent({
  currentStreak,
  weekDays,
  todayStatus,
  preparing,
  shareCopied,
  onDownload,
  onShare,
}) {
  const completedCount = weekDays.filter((d) => d.completed).length;
  const percent = Math.round((completedCount / 7) * 100);
  const degrees = (completedCount / 7) * 360;

  const actionsDisabled =
    todayStatus === "loading" || todayStatus === "none";

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
            <span className="text-sm font-medium text-[#374151]">
              Streak
            </span>

            <p className="mt-2 text-2xl font-semibold text-charcoal-text">
              {currentStreak} {currentStreak === 1 ? "Day" : "Days"}
            </p>

            <p className="mt-1 text-xs font-medium text-burgundy-primary">
              {currentStreak > 0
                ? "Keep going!"
                : "Start your streak today!"}
            </p>
          </div>

          <div
            className="relative flex h-19 w-19 shrink-0 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(#991313 0deg ${degrees}deg, #E5E7EB ${degrees}deg 360deg)`,
            }}
          >
            <div className="flex h-14.5 w-14.5 items-center justify-center rounded-full bg-white">
              <span className="text-sm font-semibold text-charcoal-text">
                {percent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-black/10 p-4">
        <p className="text-sm font-medium text-charcoal-text">
          Progress this Week
        </p>

        <div className="mt-4 flex items-center justify-between">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                day.completed
                  ? "bg-burgundy-primary text-white"
                  : "bg-[#E5E7EB] text-[#374151]"
              }`}
            >
              {day.label}
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard link */}
      <Link
        to="/leaderboard"
        className="mt-3 flex w-full items-center justify-between rounded-2xl bg-[#991313] p-4 text-left text-white transition duration-300 hover:bg-[#7F1010]"
      >
        <p className="text-sm font-semibold">
          View Leaderboard
        </p>

        <span className="ml-3 text-xl">
          →
        </span>
      </Link>

      <button
        type="button"
        onClick={onDownload}
        disabled={actionsDisabled || preparing}
        className="mt-3 flex w-full items-center justify-between rounded-2xl border border-black/10 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:bg-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        <div>
          <p className="text-sm font-medium text-charcoal-text">
            Download PDF
          </p>

          <p className="mt-1 text-xs text-cool-gray">
            {preparing
              ? "Preparing PDF..."
              : STATUS_TEXT[todayStatus] || "Save today's devotional as PDF"}
          </p>
        </div>

        <span className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 text-lg">
          {preparing ? "…" : "↓"}
        </span>
      </button>

      <button
        type="button"
        onClick={onShare}
        disabled={actionsDisabled}
        className="mt-3 flex w-full items-center justify-between rounded-2xl border border-black/10 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:bg-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        <div>
          <p className="text-sm font-medium text-charcoal-text">
            Share Today's Devotional
          </p>

          <p className="mt-1 text-xs text-cool-gray">
            {shareCopied
              ? "Link copied!"
              : STATUS_TEXT[todayStatus] || "Encourage someone"}
          </p>
        </div>

        <span className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 text-lg">
          {shareCopied ? "✓" : "↗"}
        </span>
      </button>
    </>
  );
}

// ==========================================
// FLOATING BUTTON
// ==========================================

function FloatingToggle({
  position,
  onPositionChange,
  onOpen,
  currentStreak,
}) {
  const dragState = useRef(null);
  const wasDraggedRef = useRef(false);

  function handlePointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId);

    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };

    wasDraggedRef.current = false;
  }

  function handlePointerMove(event) {
    if (!dragState.current) return;

    const dx = event.clientX - dragState.current.startX;
    const dy = event.clientY - dragState.current.startY;

    if (
      !wasDraggedRef.current &&
      Math.hypot(dx, dy) > DRAG_THRESHOLD
    ) {
      wasDraggedRef.current = true;
    }

    if (wasDraggedRef.current) {
      onPositionChange(
        clampToViewport({
          x: dragState.current.originX + dx,
          y: dragState.current.originY + dy,
        })
      );
    }
  }

  function handlePointerUp(event) {
    if (dragState.current) {
      try {
        event.currentTarget.releasePointerCapture(
          dragState.current.pointerId
        );
      } catch {
        /* Pointer may already be released */
      }
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
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      aria-label="Open your devotional experience"
      style={{
        left: position.x,
        top: position.y,
      }}
      className="fixed z-[9999] flex h-16 w-16 touch-none select-none flex-col items-center justify-center rounded-full bg-burgundy-primary text-white shadow-[0_10px_30px_rgba(153,19,19,0.35)] transition-transform duration-150 active:scale-95"
    >
      <span className="text-lg font-semibold leading-none">
        {currentStreak}
      </span>

      <span className="mt-0.5 text-[9px] uppercase tracking-wide">
        {currentStreak === 1 ? "day" : "days"}
      </span>
    </button>
  );
}

// ==========================================
// MAIN EXPERIENCE CONTAINER
// ==========================================

function ExperienceContainer({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(getDefaultPosition);
  const [shareCopied, setShareCopied] = useState(false);
  const [printJob, setPrintJob] = useState(null);
  const [preparing, setPreparing] = useState(false);

  const {
    currentStreak,
    weekDays,
    reload: reloadStreak,
  } = useStreak(user.id);

  const {
    devotional,
    status,
    reload: reloadToday,
    retry,
  } = useTodayDevotional();

  const updatePosition = useCallback((next) => {
    const adjusted = clampToViewport(next);

    setPosition(adjusted);

    try {
      window.localStorage.setItem(
        POSITION_KEY,
        JSON.stringify(adjusted)
      );
    } catch {
      /* Storage may be unavailable */
    }
  }, []);

  // Adjust floating button on viewport changes.
  useEffect(() => {
    function handleViewportChange() {
      if (isMobileViewport()) {
        setPosition((prev) => clampToViewport(prev));
      }
    }

    window.addEventListener("resize", handleViewportChange);

    window.visualViewport?.addEventListener(
      "resize",
      handleViewportChange
    );

    window.visualViewport?.addEventListener(
      "scroll",
      handleViewportChange
    );

    return () => {
      window.removeEventListener("resize", handleViewportChange);

      window.visualViewport?.removeEventListener(
        "resize",
        handleViewportChange
      );

      window.visualViewport?.removeEventListener(
        "scroll",
        handleViewportChange
      );
    };
  }, []);

  // Refresh data when the panel opens.
  useEffect(() => {
    if (!isOpen) return;

    reloadStreak();
    reloadToday();
  }, [isOpen, reloadStreak, reloadToday]);

  // Refresh today's devotional when Ghana's date changes
  // and the visitor returns to the website.
  useEffect(() => {
    let previousDate = todayString();

    function checkDate() {
      const currentDate = todayString();

      if (currentDate !== previousDate) {
        previousDate = currentDate;
        reloadToday();
        reloadStreak();
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkDate();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [reloadToday, reloadStreak]);

  // ==========================================
  // PRINTING
  // ==========================================

  useEffect(() => {
    if (!printJob) return;

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

      const images = root
        ? [...root.querySelectorAll("img")]
        : [];

      await Promise.race([
        Promise.all(
          images.map((img) =>
            img.decode
              ? img.decode().catch(() => {})
              : Promise.resolve()
          )
        ),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);

      if (cancelled) return;

      const { mainTitle } = formatDevotionalTitle(
        printJob.devotional.title
      );

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
    if (status === "error") {
      retry();
      return;
    }

    if (!devotional || preparing) return;

    setPreparing(true);

    setPrintJob({
      devotional,
      at: Date.now(),
    });
  }

  // ==========================================
  // SHARING
  // ==========================================

  async function handleShare() {
    if (status === "error") {
      retry();
      return;
    }

    if (!devotional) return;

    const { mainTitle, episodeLabel } = formatDevotionalTitle(
      devotional.title
    );

    const title = episodeLabel
      ? `${mainTitle} (${episodeLabel})`
      : mainTitle;

    const text = `Today's Machaira devotional: ${title}`;

    const url = `${window.location.origin}/devotional/${devotional.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);

        setShareCopied(true);

        window.setTimeout(() => {
          setShareCopied(false);
        }, 2500);
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error("SHARE FAILED:", err);
      }
    }
  }

  const panelProps = {
    currentStreak,
    weekDays,
    todayStatus: status,
    preparing,
    shareCopied,
    onDownload: handleDownload,
    onShare: handleShare,
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-82.5 rounded-[26px] border border-black/10 bg-white/90 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:block print:hidden">
        <ExperiencePanelContent {...panelProps} />
      </aside>

      {/* Mobile floating button and modal */}
      <div className="lg:hidden print:hidden">
        {!isOpen && (
          <FloatingToggle
            position={position}
            onPositionChange={updatePosition}
            onOpen={() => setIsOpen(true)}
            currentStreak={currentStreak}
          />
        )}

        {isOpen &&
          createPortal(
            <div
              className="fixed inset-0 z-[2147483647] flex items-center justify-start bg-black/40 px-3 sm:px-5 print:hidden"
              style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100dvh",
              }}
              onClick={() => setIsOpen(false)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Your Devotional Experience"
                className="relative max-h-[85dvh] w-[min(360px,90vw)] overflow-y-auto overscroll-contain rounded-[26px] border border-black/10 bg-white p-5 pb-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-lg text-[#374151]"
                >
                  ×
                </button>

                <ExperiencePanelContent {...panelProps} />
              </div>
            </div>,
            document.body
          )}
      </div>

      {printJob &&
        createPortal(
          <DevotionalPrintView devotional={printJob.devotional} />,
          document.body
        )}
    </>
  );
}

// ==========================================
// ROOT COMPONENT
// ==========================================

function DevotionalExperience() {
  const user = useAuthUser();

  if (!user) return null;

  return (
    <ExperienceContainer
      key={user.id}
      user={user}
    />
  );
}

export default DevotionalExperience;
