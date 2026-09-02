import { useRef, useState } from "react";

function DevotionalAudio({ audioUrl, duration = "8 min" }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <>
      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Listen button */}
      <button
        type="button"
        onClick={toggleAudio}
        disabled={!audioUrl}
        className={`flex items-center gap-2 rounded-full border px-7 py-4 text-sm font-medium transition duration-300 ${
          audioUrl
            ? "border-[#9CA3AF] bg-white/50 text-[#111827] backdrop-blur-sm hover:-translate-y-1 hover:bg-white"
            : "cursor-not-allowed border-[#D1D5DB] bg-white/40 text-[#9CA3AF]"
        }`}
      >
        {/* Play / pause icon */}
        <span className="flex h-5 w-5 items-center justify-center">
          {isPlaying ? "❚❚" : "▷"}
        </span>

        <span>
          {isPlaying ? "Playing" : "Listen"}{" "}
          {!isPlaying && `(${duration})`}
        </span>
      </button>
    </>
  );
}

export default DevotionalAudio;