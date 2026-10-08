import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, Pause, Volume2, X } from "lucide-react";
import { recordDevotionalActivity } from "../../../lib/recordDevotionalActivity";

const LISTEN_THRESHOLD = 0.8;
let activeStop = null;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatMinutes(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  const mins = Math.max(1, Math.round(seconds / 60));
  return `${mins} min`;
}

function DevotionalAudio({ audioUrl, duration = "8 min", title, episode, variant = "pill" }) {
  const audioRef = useRef(null);
  const listenedRef = useRef(0);
  const lastTimeRef = useRef(0);
  const recordedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    lastTimeRef.current = 0;
    setIsPlaying(false);
    setHasStarted(false);
    setCurrent(0);
  }, []);

  useEffect(() => () => {
    audioRef.current?.pause();
    if (activeStop === stopAudio) activeStop = null;
  }, [stopAudio]);

  useEffect(() => {
    listenedRef.current = 0;
    lastTimeRef.current = 0;
    recordedRef.current = false;
  }, [audioUrl]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
  };

  const seek = (e) => {
    const value = Number(e.target.value);
    audioRef.current.currentTime = value;
    lastTimeRef.current = value;
    setCurrent(value);
  };

  const handlePlay = () => {
    if (activeStop && activeStop !== stopAudio) activeStop();
    activeStop = stopAudio;
    setIsPlaying(true);
    setHasStarted(true);
  };

  const handleTimeUpdate = (e) => {
    const time = e.currentTarget.currentTime;
    const length = e.currentTarget.duration;
    const delta = time - lastTimeRef.current;
    if (delta > 0 && delta < 1.5) listenedRef.current += delta;
    lastTimeRef.current = time;
    setCurrent(time);
    if (!recordedRef.current && Number.isFinite(length) && length > 0 && listenedRef.current >= length * LISTEN_THRESHOLD) {
      recordedRef.current = true;
      recordDevotionalActivity();
    }
  };

  const progress = total > 0 ? (current / total) * 100 : 0;
  const trackLabel = episode || title || "Devotional Audio";
  const statusText = !audioUrl ? "No audio yet" : hasStarted ? (isPlaying ? "Now Playing" : "Paused") : formatMinutes(total) || duration;
  const ariaLabel = isPlaying ? "Pause audio" : "Play audio";

  let trigger;

  if (variant === "light") {
    trigger = (
      <button
        type="button"
        onClick={toggleAudio}
        disabled={!audioUrl}
        aria-label={ariaLabel}
        className="devotional-sidebar-promo-button-light cursor-pointer border-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPlaying ? "Pause" : hasStarted ? "Resume" : "Listen Now"}
      </button>
    );
  } else if (variant === "topbar") {
    trigger = (
      <button
        type="button"
        onClick={toggleAudio}
        disabled={!audioUrl}
        aria-label={ariaLabel}
        title={isPlaying ? "Pause" : "Listen"}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-burgundy-primary px-3 text-sm font-semibold text-white transition-colors hover:bg-[#7f0e0e] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
        <span>{isPlaying ? "Pause" : "Listen"}</span>
      </button>
    );
  } else {
    trigger = (
      <button
        type="button"
        onClick={toggleAudio}
        disabled={!audioUrl}
        aria-label={ariaLabel}
        className={`flex items-center gap-3 rounded-full border py-2 pl-2 pr-2 text-left transition duration-300 ${
          audioUrl
            ? "border-[#9CA3AF] bg-white/50 text-[#111827] backdrop-blur-sm hover:-translate-y-1 hover:bg-white hover:shadow-lg active:scale-95"
            : "cursor-not-allowed border-[#D1D5DB] bg-white/40 text-[#9CA3AF]"
        }`}
      >
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${audioUrl ? "bg-burgundy-primary/10 text-burgundy-primary" : "bg-[#E5E7EB] text-[#9CA3AF]"}`}>
          <Volume2 size={18} />
        </span>
        <span className="flex min-w-24 flex-col leading-tight">
          <span className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-cool-gray">{statusText}</span>
          <span className="text-sm font-semibold">{hasStarted ? trackLabel : "Listen"}</span>
        </span>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${audioUrl ? "bg-burgundy-primary text-white shadow-md" : "bg-[#D1D5DB] text-white"}`}>
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
        </span>
      </button>
    );
  }

  return (
    <>
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          onLoadedMetadata={(e) => setTotal(e.currentTarget.duration)}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={() => setIsPlaying(false)}
          onEnded={() => { setIsPlaying(false); setHasStarted(false); setCurrent(0); lastTimeRef.current = 0; }}
        />
      )}

      {trigger}

      {hasStarted &&
        createPortal(
          <div className="fixed inset-x-4 bottom-4 z-50 animate-[slideUp_0.3s_ease-out] rounded-2xl border-[1.5px] border-black/10 bg-white p-3 shadow-[0_6px_20px_rgba(0,0,0,0.12)] md:inset-x-auto md:right-6 md:w-96 print:hidden">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-burgundy-primary/10 text-burgundy-primary">
                <Volume2 size={18} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-cool-gray">
                  <span className="relative flex h-1.5 w-1.5">
                    {isPlaying && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />}
                    <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${isPlaying ? "bg-emerald-500" : "bg-amber-500"}`} />
                  </span>
                  {isPlaying ? "Now Playing" : "Paused"}
                </div>
                <p className="truncate text-[13px] font-bold text-[#111827]">{trackLabel}</p>
              </div>

              <button
                type="button"
                onClick={toggleAudio}
                aria-label={ariaLabel}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-burgundy-primary text-white shadow-md transition duration-300 hover:bg-[#7f0e0e] active:scale-95"
              >
                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={stopAudio}
                aria-label="Close audio player"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280] transition duration-300 hover:bg-[#E5E7EB]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="w-9 text-[11px] font-medium tabular-nums text-cool-gray">{formatTime(current)}</span>
              <input
                type="range"
                min={0}
                max={total || 0}
                step={0.1}
                value={current}
                onChange={seek}
                aria-label="Seek audio"
                className="h-1 flex-1 cursor-pointer appearance-none rounded-full accent-[#991313]"
                style={{ background: `linear-gradient(to right, #991313 ${progress}%, #E5E7EB ${progress}%)` }}
              />
              <span className="w-9 text-right text-[11px] font-medium tabular-nums text-cool-gray">{formatTime(total)}</span>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default DevotionalAudio;