import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Check, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const STORAGE_KEY = "machaira_newsletter_announcement";
const SESSION_KEY = "machaira_newsletter_seen";

const FIRST_DELAY = 35_000;
const OPENING_DURATION = 1800;

const messages = [
  {
    message:
      "So we all know you love Machaira right?.\n\n Guess what?\n\n We are cooking A LOT behind the scenes; audios, podcasts, new premium stuff on the website you would absolutely love.\n\n We don't want you to miss out and be hearing it last.\n\n Sooo....\n\n Subscribe real quick!",
  },
  {
    message:
      "Thou comest daily. Thou readest the devotional. Thou art blessed and refreshed... \n\n Thy consistency has not gone unnoticed in the heavens. But have thou already opted to be a family?\n\n If not, just make it official",
  },
  {
    message:
      "That which knows your name.\n\n Before your alarm. Before you might even pray, it's already on the grass.\n\n THE DEW!\n\n So is Machaira.\n\n Dew doesn't fall once and for all. It falls daily.\n\n We just want to make sure you don't miss the DEW ADVANTAGE. ",
  },
];

function getTrackingData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveTrackingData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function EnvelopeArtwork({ opening = false }) {
  return (
    <div className={`envelope-artwork relative mx-auto ${opening ? "envelope-opening" : ""}`} aria-hidden="true">
      <div className="envelope-shadow absolute inset-x-5 bottom-0 h-8 rounded-full bg-black/20 blur-xl" />

      <div className="envelope-letter absolute left-1/2 top-0 z-10 h-[220px] w-[190px] -translate-x-1/2 rounded-sm bg-[#fffdf8] shadow-xl">
        <div className="px-5 pt-6">
          <div className="mb-5 h-[3px] w-9 rounded-full bg-burgundy-primary/70" />
          <div className="mb-2 h-[3px] w-full rounded-full bg-[#d8d3ca]" />
          <div className="mb-2 h-[3px] w-[88%] rounded-full bg-[#d8d3ca]" />
          <div className="mb-2 h-[3px] w-[95%] rounded-full bg-[#d8d3ca]" />
          <div className="mb-2 h-[3px] w-[72%] rounded-full bg-[#d8d3ca]" />
          <div className="mt-7 h-[3px] w-[82%] rounded-full bg-[#d8d3ca]" />
          <div className="mt-2 h-[3px] w-[58%] rounded-full bg-[#d8d3ca]" />
        </div>
      </div>

      <svg viewBox="0 0 360 250" className="relative z-20 w-full drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="envelopeBody" x1="40" y1="80" x2="320" y2="250">
            <stop offset="0%" stopColor="#B52525" />
            <stop offset="100%" stopColor="#710D14" />
          </linearGradient>
          <linearGradient id="envelopeFlap" x1="180" y1="35" x2="180" y2="180">
            <stop offset="0%" stopColor="#C83232" />
            <stop offset="100%" stopColor="#8D1119" />
          </linearGradient>
          <linearGradient id="envelopeSide" x1="30" y1="120" x2="180" y2="240">
            <stop offset="0%" stopColor="#A91B24" />
            <stop offset="100%" stopColor="#780D16" />
          </linearGradient>
        </defs>

        <rect x="27" y="57" width="306" height="174" rx="9" fill="#720E17" />
        <path d="M29 68L180 177L29 230V68Z" fill="url(#envelopeSide)" />
        <path d="M331 68L180 177L331 230V68Z" fill="#8E111B" />
        <path d="M29 230L145 135L180 160L215 135L331 230H29Z" fill="#A51A24" />
        <path d="M29 230L145 135L180 160L215 135L331 230H29Z" fill="url(#envelopeBody)" />
        <path className="envelope-flap" d="M29 67L180 174L331 67C331 61.477 326.523 57 321 57H39C33.477 57 29 61.477 29 67Z" fill="url(#envelopeFlap)" />
        <path d="M42 65L180 163L318 65" stroke="#E76B69" strokeOpacity=".28" strokeWidth="1.5" />

        <g className="envelope-seal">
          <circle cx="180" cy="165" r="22" fill="#D6B477" />
          <circle cx="180" cy="165" r="18" stroke="#8C5B2C" strokeOpacity=".55" strokeWidth="1" />
          <circle cx="180" cy="165" r="3" fill="#794A29" />
        </g>

        <path d="M45 217L145 143M315 217L215 143" stroke="#E9A1A0" strokeOpacity=".2" strokeWidth="1" />
      </svg>

      <style>{`
        .envelope-artwork { width: min(100%, 340px); height: 245px; perspective: 900px; }
        .envelope-letter { transform: translateX(-50%) translateY(35px); transition: transform 1.5s cubic-bezier(.2,.8,.2,1); }
        .envelope-flap { transform-origin: 180px 67px; transition: transform .8s ease; }
        .envelope-opening .envelope-letter { transform: translateX(-50%) translateY(-55px); }
        .envelope-opening .envelope-flap { transform: rotateX(180deg); }
        .envelope-opening .envelope-seal { opacity: 0; transition: opacity .3s ease; }
        .envelope-opening .envelope-shadow { transform: scale(1.1); opacity: .7; }

        @media (prefers-reduced-motion: reduce) {
          .envelope-letter, .envelope-flap, .envelope-seal { transition: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function NewsletterAnnouncement() {
  const [isOpen, setIsOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const dialogRef = useRef(null);
  const emailInputRef = useRef(null);
  const openingTimerRef = useRef(null);
  const previousFocusRef = useRef(null);
  const closeRef = useRef(null);

  const currentMessage = messages[messageIndex] || messages[0];

  useEffect(() => {
    const now = Date.now();
    const today = new Date(now).toDateString();
    const tracking = getTrackingData();

    if ("email" in tracking) {
      const { email: _removed, ...rest } = tracking;
      saveTrackingData(rest);
    }

    if (tracking.lastShownDay === today) return;

    try {
      if (sessionStorage.getItem(SESSION_KEY) === today) return;
    } catch {}

    let timer;

    const startTimer = () => {
      if (timer) return;

      timer = window.setTimeout(() => {
        const latestTracking = getTrackingData();

        if (latestTracking.lastShownDay === today) return;

        try {
          sessionStorage.setItem(SESSION_KEY, today);
        } catch {}

        const nextMessageIndex = typeof latestTracking.messageIndex === "number" ? latestTracking.messageIndex % messages.length : 0;

        setMessageIndex(nextMessageIndex);

        saveTrackingData({
          ...latestTracking,
          lastShown: Date.now(),
          lastShownDay: today,
          messageIndex: (nextMessageIndex + 1) % messages.length,
        });

        setIsOpen(true);
      }, FIRST_DELAY);

      window.removeEventListener("pointerdown", startTimer);
      window.removeEventListener("keydown", startTimer);
      window.removeEventListener("scroll", startTimer);
    };

    window.addEventListener("pointerdown", startTimer, { once: true });
    window.addEventListener("keydown", startTimer, { once: true });
    window.addEventListener("scroll", startTimer, { once: true });

    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("pointerdown", startTimer);
      window.removeEventListener("keydown", startTimer);
      window.removeEventListener("scroll", startTimer);
    };
  }, []);

  const closeAnnouncement = useCallback(() => {
    if (openingTimerRef.current) window.clearTimeout(openingTimerRef.current);

    setIsOpen(false);
    setOpening(false);
    setLetterOpened(false);
    setError("");
  }, []);

  closeRef.current = closeAnnouncement;

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.querySelector("[data-close-button]")?.focus();
    }, 50);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');

      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!letterOpened) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const timer = window.setTimeout(() => emailInputRef.current?.focus(), 350);

    return () => window.clearTimeout(timer);
  }, [letterOpened]);

  const handleOpenLetter = () => {
    if (opening || letterOpened) return;

    setOpening(true);

    openingTimerRef.current = window.setTimeout(() => {
      setLetterOpened(true);
      setOpening(false);
    }, OPENING_DURATION);
  };

  const handleSubscribe = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { error: supabaseError } = await supabase.from("subscribers").insert([{ email: normalizedEmail }]);

      if (supabaseError && supabaseError.code !== "23505") throw supabaseError;

      setSubscribed(true);
      saveTrackingData({ ...getTrackingData(), subscribed: true });
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <>
      <style>{`
        @keyframes announcementFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes announcementRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes letterReveal { from { opacity: 0; transform: translateY(16px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .announcement-backdrop { animation: announcementFadeIn .4s ease both; }
        .announcement-content { animation: announcementRise .65s cubic-bezier(.2,.8,.2,1) both; }
        .announcement-letter { animation: letterReveal .45s cubic-bezier(.2,.8,.2,1) both; }

        .newsletter-paper {
          background-color: #fffdf8;
          background-image: repeating-linear-gradient(to bottom, transparent, transparent 31px, rgba(185,190,200,.25) 32px);
          background-position: 0 10px;
        }

        @media (prefers-reduced-motion: reduce) {
          .announcement-backdrop, .announcement-content, .announcement-letter { animation: none !important; }
        }
      `}</style>

      <div
        className="announcement-backdrop fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-navy-dark/65 px-5 py-8 backdrop-blur-md"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !email.trim()) closeAnnouncement();
        }}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={letterOpened ? "Newsletter letter" : "A special announcement"}
          className="relative flex min-h-full w-full items-center justify-center"
        >
          {!letterOpened && !subscribed && (
            <button
              type="button"
              data-close-button
              onClick={closeAnnouncement}
              aria-label="Close announcement"
              className="absolute right-0 top-0 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:rotate-90 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70 sm:right-2 sm:top-2"
            >
              <X size={19} strokeWidth={1.7} />
            </button>
          )}

          {!letterOpened && !subscribed && (
            <div className="announcement-content w-full max-w-[470px] py-10 text-center text-white">
              <div className="mb-5 text-[10px] font-semibold uppercase tracking-[.32em] text-white/65">
                A personal message from Machaira
              </div>

              <div className="relative mx-auto mb-7 flex w-full justify-center">
                <EnvelopeArtwork opening={opening} />
              </div>

              <div className="mx-auto max-w-[390px]">
                <h2 className="text-[clamp(29px,6vw,42px)] font-semibold leading-[1.16] tracking-[-.045em] text-white">
                  We have something
                  <span className="block text-[#E8C9A1]">to tell you.</span>
                </h2>

                <p className="mx-auto mt-5 max-w-[330px] text-sm leading-7 text-white/75">
                  A message we would love you to read. Take a moment and open it.
                </p>

                <button
                  type="button"
                  onClick={handleOpenLetter}
                  disabled={opening}
                  className="group mt-8 inline-flex min-h-[54px] items-center justify-center gap-4 rounded-full bg-burgundy-primary px-8 text-[11px] font-semibold uppercase tracking-[.15em] text-white shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:bg-[#B51B1B] hover:shadow-2xl disabled:cursor-wait disabled:opacity-80"
                >
                  {opening ? "Opening your letter..." : "Read it now"}
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>

                <button
                  type="button"
                  onClick={closeAnnouncement}
                  className="mt-5 block w-full text-[10px] font-medium uppercase tracking-[.2em] text-white/55 transition hover:text-white"
                >
                  Perhaps another time
                </button>
              </div>
            </div>
          )}

          {(letterOpened || subscribed) && (
            <div className="announcement-letter relative my-auto mx-auto w-full max-w-[480px]">
              <button
                type="button"
                data-close-button
                onClick={closeAnnouncement}
                aria-label="Close announcement"
                className="absolute -right-2 -top-2 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-navy-dark text-white shadow-lg transition hover:rotate-90 hover:bg-burgundy-primary focus:outline-none focus:ring-2 focus:ring-white/70"
              >
                <X size={17} strokeWidth={1.7} />
              </button>

              <div className="newsletter-paper relative overflow-hidden rounded-[3px] px-6 py-3.5 shadow-[0_25px_90px_rgba(0,0,0,.35)] sm:px-8 sm:py-4">
                <div className="absolute left-0 top-0 h-1 w-full bg-burgundy-primary" />

                <div className="relative">
                  {subscribed ? (
                    <div className="py-4 text-center">
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-burgundy-primary/10 text-burgundy-primary">
                        <Check size={21} strokeWidth={1.7} />
                      </div>

                      <p className="mb-2 text-[9px] font-bold uppercase tracking-[.25em] text-burgundy-primary">You Subscribed!</p>

                      <h2 className="text-xl font-semibold tracking-[-.04em] text-navy-dark">You are our Favourite.</h2>

                      <p className="mx-auto mt-2 max-w-[250px] text-[11px] leading-5 text-cool-gray">
                        We look forward to sharing latest gists from Heaven with you.
                      </p>

                      <button
                        type="button"
                        onClick={closeAnnouncement}
                        className="mt-4 inline-flex items-center gap-3 rounded-full bg-burgundy-primary px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[.15em] text-white transition hover:bg-[#B51B1B]"
                      >
                        Back to Home
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-[11px] leading-[1.8] text-cool-gray">Beloved of God,</p>

                      <p className="mt-2 text-[12px] leading-[1.9] whitespace-pre-line text-cool-gray">{currentMessage.message}</p>

                      <div className="mt-3">
                        <p className="text-[11px] leading-[1.8] text-cool-gray">With love,</p>
                        <p className="mt-0.5 text-xs font-semibold leading-[1.8] tracking-[-.02em] text-navy-dark">The Machaira Team.</p>
                      </div>

                      <div className="my-3 h-px w-full bg-soft-gray/50" />

                      <form onSubmit={handleSubscribe}>
                        <label htmlFor="newsletter-email" className="mb-1 block text-[9px] font-bold uppercase tracking-[.18em] text-navy-dark">
                          Stay connected with us
                        </label>

                        <p className="mb-2 text-[10px] leading-5 text-cool-gray">
                          You will be the first to know when Apostle Bennie drops something new on Machaira.
                        </p>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <input
                            ref={emailInputRef}
                            id="newsletter-email"
                            type="email"
                            value={email}
                            onChange={(event) => {
                              setEmail(event.target.value);
                              setError("");
                            }}
                            placeholder="Your email address"
                            autoComplete="email"
                            className="h-10 min-w-0 flex-1 rounded-sm border border-soft-gray/70 bg-white/80 px-3 text-[11px] text-navy-dark outline-none transition placeholder:text-cool-gray/60 focus:border-burgundy-primary focus:ring-2 focus:ring-burgundy-primary/10"
                          />

                          <button
                            type="submit"
                            disabled={submitting}
                            className="group flex h-10 shrink-0 items-center justify-center gap-2 bg-burgundy-primary px-5 text-[9px] font-semibold uppercase tracking-[.12em] text-white transition duration-300 hover:bg-[#B51B1B] disabled:cursor-wait disabled:opacity-60"
                          >
                            {submitting ? "Submitting..." : "Yes! Keep me posted"}
                            {!submitting && <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                          </button>
                        </div>

                        {error && (
                          <p role="alert" className="mt-2 text-[10px] leading-5 text-burgundy-primary">
                            {error}
                          </p>
                        )}
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}