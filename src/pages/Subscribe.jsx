

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const initialForm = {
  fullName: "",
  email: "",
  phoneCode: "+233",
  phone: "",
  consent: false,
};

const countryCodes = [
  { name: "Ghana", code: "+233" },
  { name: "Nigeria", code: "+234" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Canada", code: "+1" },
  { name: "South Africa", code: "+27" },
  { name: "Kenya", code: "+254" },
  { name: "Uganda", code: "+256" },
  { name: "Australia", code: "+61" },
  { name: "Germany", code: "+49" },
  { name: "Other", code: "" },
];

const inputClass =
  "w-full rounded-lg border border-[#E7E2DF] bg-white px-4 py-3 text-sm text-[#292323] outline-none transition duration-200 placeholder:text-[#A49B98] focus:border-[#721F22] focus:ring-2 focus:ring-[#721F22]/10";

const labelClass = "mb-2 block text-sm font-medium text-[#352A2A]";

export default function Subscribe() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const update = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setStatus("idle");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (status === "loading") return;

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();

    if (!fullName) {
      setStatus("error");
      setMessage("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!phone) {
      setStatus("error");
      setMessage("Please enter your phone number.");
      return;
    }

    if (!form.consent) {
      setStatus("error");
      setMessage("Please confirm that you agree to receive updates.");
      return;
    }

    const subscriber = {
      full_name: fullName,
      email,
      phone_country_code: form.phoneCode || null,
      phone,
      consent: true,
      consent_at: new Date().toISOString(),
    };

    setStatus("loading");
    setMessage("");

    try {
      const { error } = await supabase
        .from("subscribers")
        .insert([subscriber]);

      if (error) {
        console.error("Subscription error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          status: error.status,
        });

        if (error.code === "23505") {
          setStatus("error");
          setMessage(
            "This email address is already subscribed. Please use another email address."
          );
          return;
        }

        if (error.code === "42501") {
          setStatus("error");
          setMessage(
            "We couldn't submit your registration because of a database permission issue. Please try again later."
          );
          return;
        }

        setStatus("error");
        setMessage(
          "We couldn't complete your registration. Please try again."
        );
        return;
      }

      setStatus("success");
      setMessage(
        "You're successfully registered! Thank you for staying connected with Machaira."
      );

      setForm(initialForm);
    } catch (error) {
      console.error("Unexpected subscription error:", error);

      setStatus("error");
      setMessage(
        "Something went wrong. Please check your connection and try again."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F7] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <style>{`
        @keyframes machairaIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .machaira-in {
          animation: machairaIn .75s ease both;
        }

        .machaira-form {
          animation: machairaIn .8s ease .1s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .machaira-in,
          .machaira-form {
            animation: none;
          }
        }
      `}</style>

      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl overflow-hidden rounded-2xl bg-white shadow-[0_12px_55px_rgba(50,25,25,0.07)] lg:grid-cols-[0.85fr_1.15fr]">

        {/* Intro panel */}
        <section className="flex flex-col justify-between bg-[#4A1515] px-7 py-10 text-white sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="machaira-in">
            <div className="mt-16 max-w-md lg:mt-24">
              <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl">
                Stay connected.
                <span className="mt-1 block text-[#E9B9A9]">
                  Stay inspired.
                </span>
              </h1>

              <p className="mt-7 max-w-sm text-base leading-8 text-white/80">
                Get updates from Machaira, be the first to know about new
                episodes uploads, and keep up with messages and activities
                from Apostle Bennie.
              </p>
            </div>
          </div>
        </section>

        {/* Subscription form */}
        <section className="machaira-form px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="mx-auto max-w-xl">

            <div className="mb-9">
              <h2 className="text-3xl font-semibold tracking-tight text-[#2D2525] sm:text-4xl">
                Let’s keep in touch.
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">

              {/* Full name */}
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className={inputClass}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>Phone Number</label>

                <div className="flex items-stretch gap-2">
                  <select
                    value={form.phoneCode}
                    onChange={(e) => update("phoneCode", e.target.value)}
                    className="w-[90px] shrink-0 rounded-lg border border-[#E7E2DF] bg-white px-2 py-3 text-sm text-[#292323] outline-none focus:border-[#721F22] focus:ring-2 focus:ring-[#721F22]/10"
                    aria-label="Phone country code"
                  >
                    {countryCodes.map((item) => (
                      <option key={item.name} value={item.code}>
                        {item.code || item.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="tel"
                    autoComplete="tel-national"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="Phone number"
                    className={`${inputClass} min-w-0 flex-1`}
                    required
                  />
                </div>
              </div>

              {/* Consent */}
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#77706D]">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#721F22]"
                  required
                />
                <span>
                  I agree to receive emails and updates from Machaira. I
                  understand that I can unsubscribe at any time.
                </span>
              </label>

              {/* Feedback */}
              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-lg px-4 py-3 text-sm leading-6 ${
                    status === "success"
                      ? "bg-[#EDF5EE] text-[#315B39]"
                      : "bg-[#FBEDEC] text-[#8C2929]"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-[#721F22] px-6 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#4A1515] focus:outline-none focus:ring-2 focus:ring-[#721F22] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Submitting..." : "Subscribe"}
              </button>

            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
