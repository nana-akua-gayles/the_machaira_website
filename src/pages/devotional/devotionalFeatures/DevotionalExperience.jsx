import { useEffect, useRef, useState } from "react";

const BUTTON_SIZE = 64; // matches h-16 w-16
const DRAG_THRESHOLD = 6; // px of movement before a tap counts as a drag

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getDefaultPosition() {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  return {
    x: window.innerWidth / 2 - BUTTON_SIZE / 2,
    y: window.innerHeight / 2 - BUTTON_SIZE / 2,
  };
}

function clampToViewport(pos) {
  const maxX = window.innerWidth - BUTTON_SIZE;
  const maxY = window.innerHeight - BUTTON_SIZE;
  return {
    x: clamp(pos.x, 0, Math.max(0, maxX)),
    y: clamp(pos.y, 0, Math.max(0, maxY)),
  };
}

function ExperiencePanelContent() {
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <>
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#111827]">
          Your Devotional Experience
        </h2>
        <div className="mt-3 h-[2px] w-12 bg-[#991313]" />
      </div>

      <div className="rounded-2xl border border-black/10 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-sm font-medium text-[#374151]">Streak</span>
            <p className="mt-2 text-2xl font-semibold text-[#111827]">12 Days</p>
            <p className="mt-1 text-xs font-medium text-[#991313]">Keep going!</p>
          </div>
          <div className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[conic-gradient(#991313_0deg_270deg,#E5E7EB_270deg_360deg)]">
            <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-white">
              <span className="text-sm font-semibold text-[#111827]">75%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-black/10 p-4">
        <p className="text-sm font-medium text-[#111827]">Progress this Week</p>
        <div className="mt-4 flex items-center justify-between">
          {weekDays.map((day, index) => {
            const completed = index < 6;
            return (
              <div
                key={`${day}-${index}`}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                  completed ? "bg-[#991313] text-white" : "bg-[#E5E7EB] text-[#374151]"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-between rounded-2xl border border-black/10 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:bg-[#FAFAFA]"
      >
        <div>
          <p className="text-sm font-medium text-[#111827]">Download for Offline</p>
          <p className="mt-1 text-xs text-[#4D5057]">Save and read anywhere</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg">↓</span>
      </button>

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-between rounded-2xl border border-black/10 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:bg-[#FAFAFA]"
      >
        <div>
          <p className="text-sm font-medium text-[#111827]">Share Today's Devotional</p>
          <p className="mt-1 text-xs text-[#4D5057]">Encourage someone</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg">↗</span>
      </button>

      <div className="relative mt-3 overflow-hidden rounded-2xl border border-[#E7DCD2] bg-[#F8F1EA] p-5">
        <div className="relative z-10 max-w-[190px]">
          <p className="text-sm font-semibold text-[#111827]">Join Our Community</p>
          <p className="mt-2 text-xs leading-5 text-[#4D5057]">
            Discuss, connect and grow together in faith.
          </p>
          <button
            type="button"
            className="mt-4 rounded-full bg-[#991313] px-5 py-2.5 text-xs font-semibold text-white transition duration-300 hover:bg-[#7F0E0E]"
          >
            Join Forum
          </button>
        </div>
        <div className="absolute right-7 top-5 h-12 w-12 opacity-70">
          <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-[#8D563B]" />
          <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-[#8D563B]" />
        </div>
      </div>
    </>
  );
}

function FloatingToggle({ position, onPositionChange, onOpen }) {
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

    if (!wasDraggedRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
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
        event.currentTarget.releasePointerCapture(dragState.current.pointerId);
      } catch {
        // Capture may already be released — safe to ignore.
      }
    }
    dragState.current = null;
  }

  function handleClick() {
    // If the pointer moved past the threshold, this click is just the
    // tail end of a drag gesture — don't treat it as "open."
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
      className="fixed z-30 flex h-16 w-16 touch-none select-none flex-col items-center justify-center rounded-full bg-[#991313] text-white shadow-[0_10px_30px_rgba(153,19,19,0.35)] transition-transform duration-150 active:scale-95"
    >
      <span className="text-lg font-semibold leading-none">12</span>
      <span className="mt-0.5 text-[9px] uppercase tracking-wide">days</span>
    </button>
  );
}

function DevotionalExperience() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(getDefaultPosition);

  useEffect(() => {
    function handleResize() {
      setPosition((prev) => clampToViewport(prev));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Desktop — unchanged, always visible */}
      <aside className="hidden w-[330px] rounded-[26px] border border-black/10 bg-white/90 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:block">
        <ExperiencePanelContent />
      </aside>

      {/* Mobile / tablet — draggable circle */}
      <div className="lg:hidden">
        {!isOpen && (
          <FloatingToggle
            position={position}
            onPositionChange={setPosition}
            onOpen={() => setIsOpen(true)}
          />
        )}

        {isOpen && (
          <div
            className="fixed inset-0 z-40 flex items-end bg-black/40"
            onClick={() => setIsOpen(false)}
          >
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
              <ExperiencePanelContent />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DevotionalExperience;