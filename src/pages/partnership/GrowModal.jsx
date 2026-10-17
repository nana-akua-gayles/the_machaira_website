import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  Share2,
  Users,
  X,
} from "lucide-react";

const growthPaths = [
  {
    number: "01",
    title: "Sit To Learn before You Stand To Teach",
    description:
      "You cannot give what you do not have. Submit to a systematic study of the Word.",
    detail: "BEGIN TODAY",
    Icon: BookOpen,
    href: "/devotional",
  },
  {
    number: "02",
    title: "Meditate Until It Becomes Your Revelation",
    description:
      "Marinate! Think, pray and speak the Word until it stops being information and becomes your conviction.",
    detail: "EXPLORE THE ARCHIVE",
    Icon: CalendarDays,
    href: "/previous-devotionals",
  },
  {
    number: "03",
    title: "Return To It",
    description:
      "When doubt, confusion, or fear comes, the wise don't look for a new word, they return to the ledger of God's faithfulness.",
    detail: "READ THE STORIES",
    Icon: Users,
    href: "/testimonials",
  },
];

export default function GrowModal({ isOpen, onClose, routes = {} }) {
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setShareStatus("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/devotional`;
    const shareData = {
      title: "The Machaira",
      text: "Discover devotionals that inspire faith, deepen your walk with God, and bring His Word into everyday life. Share the message with someone today.",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("Thank you for sharing the message.");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("Link copied. Share the message with someone.");
    } catch (error) {
      if (error.name === "AbortError") return;

      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus("Link copied. Share the message with someone.");
      } catch {
        setShareStatus("Sharing isn't available on this device. Please copy the devotional link from your browser.");
      }
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-[#101A2B]/70 p-0 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="grow-modal-title"
        className="relative flex h-[100dvh] w-full max-w-5xl flex-col overflow-y-auto bg-white text-[#111827] shadow-2xl sm:h-auto sm:max-h-[92dvh]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close growth options"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center border border-white/25 bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
        >
          <X size={19} />
        </button>

        <header className="relative overflow-hidden bg-[#101A2B] px-6 pb-8 pt-12 text-white sm:px-10 sm:pb-10 sm:pt-14 lg:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-12 h-52 w-52 rounded-full border border-white/10"
          />
          <div className="relative z-[1] max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9 bg-white/60" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
                The Journey of The Wise
              </p>
            </div>
          </div>
        </header>

        <div className="px-5 py-7 sm:px-10 sm:py-9 lg:px-12">
          <div className="mb-6 flex flex-col gap-2 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#991313]">
                Desire Truth More Than Trends
              </p>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#4D5057]">
              Don't only be rich in quotes but be rich in TRUTH
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {growthPaths.map((path) => {
              const Icon = path.Icon;
              const href = routes[path.number] || path.href;

              return (
                <a
                  key={path.number}
                  href={href}
                  className="group flex min-h-[220px] flex-col border border-[#E5E7EB] bg-white p-5 transition duration-200 hover:border-[#991313]/50 hover:shadow-lg hover:shadow-[#101A2B]/5 sm:p-6"
                >
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center border border-[#E5E7EB] text-[#991313] transition group-hover:border-[#991313] group-hover:bg-[#991313] group-hover:text-white">
                      <Icon size={21} strokeWidth={1.6} />
                    </div>
                    <span className="text-xs font-medium tracking-[0.15em] text-[#9CA3AF]">
                      {path.number}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col">
                    <h4 className="text-lg font-semibold leading-snug tracking-tight sm:text-xl">
                      {path.title}
                    </h4>
                    <p className="mt-3 flex-1 text-sm leading-6 text-[#4D5057]">
                      {path.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-[#E5E7EB] pt-4">
                      <span className="text-[10px] font-semibold tracking-[0.13em] text-[#991313]">
                        {path.detail}
                      </span>
                      <ArrowUpRight
                        size={18}
                        className="text-[#991313] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </div>
                  </div>
                </a>
              );
            })}

            <button
              type="button"
              onClick={handleShare}
              className="group flex min-h-[220px] flex-col border border-[#E5E7EB] bg-[#F9FAFB] p-5 text-left transition duration-200 hover:border-[#991313]/50 hover:bg-white hover:shadow-lg hover:shadow-[#101A2B]/5 sm:p-6"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center border border-[#E5E7EB] text-[#991313] transition group-hover:border-[#991313] group-hover:bg-[#991313] group-hover:text-white">
                  <Share2 size={21} strokeWidth={1.6} />
                </div>
                <span className="text-xs font-medium tracking-[0.15em] text-[#9CA3AF]">
                  04
                </span>
              </div>

              <div className="flex flex-1 flex-col">
                <h4 className="text-lg font-semibold leading-snug tracking-tight sm:text-xl">
                  Teach What You Have Become
                </h4>
                <p className="mt-3 flex-1 text-sm leading-6 text-[#4D5057]">
                 The Proof that you are rich in doctrine is that you can make another rich. 
                 Don't just be a consumer of truth, be a distributor of it. 
                 Make disciples.  
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-[#E5E7EB] pt-4">
                  <span className="text-[10px] font-semibold tracking-[0.13em] text-[#991313]">
                    {shareStatus ? "MESSAGE READY" : "PASS IT ON"}
                  </span>
                  {shareStatus ? (
                    <Check size={18} className="text-[#991313]" />
                  ) : (
                    <ArrowRight
                      size={18}
                      className="text-[#991313] transition-transform duration-200 group-hover:translate-x-1"
                    />
                  )}
                </div>
              </div>
            </button>
          </div>

          {shareStatus && (
            <p
              role="status"
              className="mt-4 border-l-2 border-[#991313] px-4 py-3 text-sm leading-6 text-[#4D5057]"
            >
              {shareStatus}
            </p>
          )}

          <div className="mt-7 flex flex-col gap-3 border-t border-[#E5E7EB] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-6 text-[#4D5057]">
              You do not have to take every step today. Start with one, and
              let each day bring you closer to the truth.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-fit shrink-0 items-center gap-2 text-sm font-semibold text-[#111827] transition hover:text-[#991313]"
            >
              Return to the page
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>,
    document.body
  );
}