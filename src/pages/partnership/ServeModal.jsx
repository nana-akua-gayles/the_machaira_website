
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const servingAreas = [
  {
    name: "The Publishers",
    description:
      "Hand to hand, office to office, we freely distribute copies of Machaira because someone in suit or uniform out there needs to know God has them in mind.",
  },
  {
    name: "Outreach Team",
    description:
      "We go to the world. We are soul-winners, love-carriers, and hope-dealers. Our mission is simple: fill until there's nothing else.",
  },
  {
    name: "Content Creation",
    description:
      "We craft the message for the timeline. If they are online, we will meet them there.",
  },
  {
    name: "Creative Arts",
    description:
      "Through dance, drama, poetry and design, we communicate the message artistically.",
  },
  {
    name: "Prayer Team",
    description:
      "We are the foundation. While others go out, we hold the fort. We stand in the gap until change happens.",
  },
  {
    name: "Media and Tech",
    description:
      "We make sure Jesus is seen clearly and heard loudly through digital platforms, media production, and technical operations.",
  },
  {
    name: "Others",
    description:
      "Offer other skills, experience, or ideas that could serve the vision.",
  },
];

const allowedServingAreas = servingAreas.map((area) => area.name);

const initialForm = {
  fullName: "",
  email: "",
  areas: [],
  message: "",
};

export default function ServeModal({ isOpen, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && status !== "submitting") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, status]);

  const toggleArea = (area) => {
    setForm((current) => ({
      ...current,
      areas: current.areas.includes(area)
        ? current.areas.filter((item) => item !== area)
        : [...current.areas, area],
    }));
  };

  const handleClose = () => {
    if (status === "submitting") return;
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();

    if (!fullName || !email) {
      setError("Please enter your name and email address.");
      return;
    }

    if (fullName.length > 120 || email.length > 254) {
      setError("Please check the length of your name or email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (
      form.areas.length === 0 ||
      form.areas.some((area) => !allowedServingAreas.includes(area)) ||
      new Set(form.areas).size !== form.areas.length
    ) {
      setError("Please choose at least one valid serving area.");
      return;
    }

    if (form.message.length > 1500) {
      setError("Your message must be 1500 characters or fewer.");
      return;
    }

    setStatus("submitting");

    try {
      const { error: submissionError } = await supabase
        .from("serving_applications")
        .insert({
          full_name: fullName,
          email,
          serving_areas: form.areas,
          message: form.message.trim() || null,
        });

      if (submissionError) {
        console.error(
          "Serving application submission failed:",
          submissionError
        );
        throw new Error(
          "We couldn't submit your application right now. Please try again."
        );
      }

      setForm(initialForm);
      setStatus("success");
    } catch (submissionError) {
      setStatus("error");
      setError(
        submissionError?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-[#15120F]/75 p-0 backdrop-blur-[3px] sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="serve-modal-title"
        className="relative flex h-[100dvh] w-full max-w-5xl flex-col overflow-hidden bg-[#F8F5EF] text-[#211D19] shadow-2xl sm:h-auto sm:max-h-[92dvh] sm:flex-row"
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={status === "submitting"}
          aria-label="Close serving opportunities"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center border border-black/15 bg-[#F8F5EF] text-[#211D19] transition hover:bg-white disabled:opacity-50 sm:right-5 sm:top-5"
        >
          <X size={19} />
        </button>

        <aside className="relative flex shrink-0 flex-col justify-between overflow-hidden bg-[#671B20] px-6 pb-7 pt-9 text-[#FFF9F1] sm:w-[38%] sm:px-8 sm:pb-9 sm:pt-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-28 h-64 w-64 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 top-36 h-44 w-44 rounded-full border border-white/10"
          />

          <div className="relative z-10">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
              The mission continues
            </p>
            <h2
              id="serve-modal-title"
              className="max-w-sm text-3xl leading-[1.04] tracking-tight sm:text-4xl"
            >
              There is a place for you here.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/80">
              Every gift, every skill, every willing heart can help carry the
              message further. Find the place where you can make a difference.
            </p>
          </div>

          <div className="relative z-10 mt-7 border-t border-white/20 pt-5">
            <p className="text-xl">
              Impact is NON-NEGOTIABLE
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/60">
              Machaira With Apostle Bennie
            </p>
          </div>
        </aside>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {status === "success" ? (
            <div className="flex min-h-full flex-col justify-center px-6 py-12 sm:px-10 sm:py-16">
              <div className="mb-6 flex h-12 w-12 items-center justify-center border border-[#671B20]/20 text-[#671B20]">
                <Check size={23} />
              </div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#671B20]">
                Application received
              </p>
              <h3 className="max-w-md font-serif text-4xl leading-tight">
                Thank you for saying yes.
              </h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#625B52]">
                Your interest in serving has been received. Thank you for
                considering how your gifts can contribute to the mission.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-8 inline-flex w-fit items-center gap-3 bg-[#671B20] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#501419]"
              >
                Close <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="px-6 pb-8 pt-16 sm:px-10 sm:pb-10 sm:pt-12"
            >
              <div className="mb-7 border-b border-[#DCD5CA] pb-5">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#671B20]">
                  Get involved
                </p>
                <h3 className="text-2xl leading-tight sm:text-3xl">
                  Where would you like to serve?
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#625B52]">
                  Choose the areas that resonate with you. You can select more than
                  one.
                </p>
              </div>

              <fieldset>
                <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.13em]">
                  Serving areas <span className="text-[#671B20]">*</span>
                </legend>

                <div className="divide-y divide-[#E4DED4] border-y border-[#DCD5CA]">
                  {servingAreas.map((area, index) => {
                    const selected = form.areas.includes(area.name);

                    return (
                      <label
                        key={area.name}
                        className={`group flex cursor-pointer items-start gap-4 py-4 transition ${
                          selected ? "bg-[#EEE7DC] px-3" : "px-1"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleArea(area.name)}
                          className="sr-only"
                        />

                        <span
                          aria-hidden="true"
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition ${
                            selected
                              ? "border-[#671B20] bg-[#671B20] text-white"
                              : "border-[#B8AEA1] bg-transparent group-hover:border-[#671B20]"
                          }`}
                        >
                          {selected && <Check size={13} />}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <span className="font-mono text-[10px] text-[#9B8E80]">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            {area.name}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-[#746B60]">
                            {area.description}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]">
                    Full name <span className="text-[#671B20]">*</span>
                  </span>
                  <input
                    required
                    autoComplete="name"
                    maxLength={120}
                    value={form.fullName}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                    }
                    placeholder="Your full name"
                    className="w-full border-b border-[#CFC6B9] bg-transparent px-0 py-3 text-sm outline-none transition placeholder:text-[#A49A8D] focus:border-[#671B20]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]">
                    Email address <span className="text-[#671B20]">*</span>
                  </span>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="you@example.com"
                    className="w-full border-b border-[#CFC6B9] bg-transparent px-0 py-3 text-sm outline-none transition placeholder:text-[#A49A8D] focus:border-[#671B20]"
                  />
                </label>
              </div>

              <label className="mt-6 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]">
                  Anything you'd like us to know?{" "}
                  <span className="font-normal normal-case tracking-normal text-[#8C8174]">
                    (Optional)
                  </span>
                </span>
                <textarea
                  rows={3}
                  maxLength={1500}
                  value={form.message}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  placeholder="Share your skills, experience, or how you'd like to help..."
                  className="w-full resize-y border border-[#DCD5CA] bg-white/50 p-3 text-sm leading-6 outline-none transition placeholder:text-[#A49A8D] focus:border-[#671B20]"
                />
              </label>

              {error && (
                <p
                  role="alert"
                  className="mt-4 border-l-2 border-[#671B20] bg-[#671B20]/5 px-3 py-2 text-sm text-[#671B20]"
                >
                  {error}
                </p>
              )}

              <div className="mt-7 flex flex-col gap-4 border-t border-[#DCD5CA] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xs text-[11px] leading-5 text-[#81776A]">
                  Your details will be used to follow up about serving
                  opportunities.
                </p>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex shrink-0 items-center justify-center gap-3 bg-[#671B20] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#501419] disabled:cursor-wait disabled:opacity-60"
                >
                  {status === "submitting"
                    ? "Submitting..."
                    : "Express my interest"}
                  {status !== "submitting" && <ArrowUpRight size={17} />}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>,
    document.body
  );
}
