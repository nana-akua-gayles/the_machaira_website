import { useEffect, useRef, useState } from "react";
import { PenLine } from "lucide-react";

const KEY = "machaira_testimony_share_button_position_v1";
const SIZE = 56;
const MARGIN = 12;
const initial = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) return saved;
  } catch { /* ignore */ }
  return { x: MARGIN, y: typeof window === "undefined" ? 500 : window.innerHeight - SIZE - 28 };
};
const clamp = (p) => ({
  x: Math.max(MARGIN, Math.min(p.x, window.innerWidth - SIZE - MARGIN)),
  y: Math.max(MARGIN, Math.min(p.y, window.innerHeight - SIZE - MARGIN)),
});

export default function DraggableShareButton({ onClick, hidden = false }) {
  const [position, setPosition] = useState(initial);
  const drag = useRef(null);
  const moved = useRef(false);
  const posRef = useRef(position);
  useEffect(() => { posRef.current = position; }, [position]);
  useEffect(() => {
    const adjust = () => setPosition((p) => clamp(p));
    adjust();
    window.addEventListener("resize", adjust);
    return () => window.removeEventListener("resize", adjust);
  }, []);
  function pointerDown(e) {
    if (e.button !== 0) return;
    moved.current = false;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, start: posRef.current };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function pointerMove(e) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.hypot(dx, dy) > 6) moved.current = true;
    if (moved.current) setPosition(clamp({ x: d.start.x + dx, y: d.start.y + dy }));
  }
  function pointerUp(e) {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    if (moved.current) {
      const p = clamp({ x: drag.current.start.x + e.clientX - drag.current.x, y: drag.current.start.y + e.clientY - drag.current.y });
      posRef.current = p;
      setPosition(p);
      try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ }
    } else onClick();
    drag.current = null;
  }
  if (hidden) return null;
  return <button type="button" aria-label="Share your testimony. Drag to reposition." title="Share your testimony"
    onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={() => { drag.current = null; }}
    style={{ left: position.x, top: position.y, touchAction: "none" }}
    className="fixed z-[80] flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-[#991313] text-white shadow-[0_8px_26px_rgba(16,26,43,0.28)] lg:hidden">
    <PenLine size={23}/>
  </button>;
}
