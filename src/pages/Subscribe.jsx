
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const { error } = await supabase
        .from("subscribers")
        .insert([{ email: cleanEmail }]);

      if (error) {
        if (error.code === "23505") {
          setStatus("success");
          setMessage(
            "You're already part of our family. Grace and peace to you."
          );
          setEmail("");
          return;
        }

        throw error;
      }

      setStatus("success");
      setMessage(
        "Thank you for subscribing. We look forward to sharing the Word with you."
      );
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-[75vh] bg-[#FAFAFA] text-[#101A2B]">
      {/* Main Editorial Section */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-14 sm:px-10 sm:pb-24 sm:pt-20 lg:px-16 lg:pt-24">

        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">

          {/* Introduction */}
          <div className="max-w-2xl">

            <h1 className="max-w-2xl text-[42px] font-semibold leading-[1.16] tracking-[-0.045em] text-[#101A2B] sm:text-5xl lg:text-[64px]">
              Let the Word
              <span className="block font-normal italic text-[#991313]">
                stay with you.
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-sm leading-8 text-[#4D5057] sm:text-base sm:leading-9">
              There is something powerful about beginning each day with
              the truth of God's Word. Let Machaira with Apostle Bennie
              bring you thoughtful devotionals, spiritual encouragement
              and messages that strengthen your walk with God.
            </p>

            <div className="mt-12 border-l-2 border-[#991313] py-2 pl-6">
              <p className="max-w-md text-base font-medium italic leading-8 text-[#352A48] sm:text-lg">
                "Make room for the Word. Carry its truth into every
                moment of your day."
              </p>
            </div>

          </div>

          {/* Subscription Area */}
          <div className="relative">

            <div className="absolute -right-3 -top-3 h-20 w-20 border-r border-t border-[#991313]/30 sm:-right-5 sm:-top-5" />

            <div className="relative border border-[#101A2B]/10 bg-white px-7 py-10 sm:px-10 sm:py-12">

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#991313]">
                Stay Connected
              </p>

              <h2 className="mt-5 text-2xl font-semibold leading-snug tracking-tight text-[#101A2B] sm:text-3xl">
                A little more of God's Word in your inbox.
              </h2>

              <p className="mt-5 text-sm leading-7 text-[#6B7079]">
                Subscribe to receive Machaira devotionals and ministry
                updates directly in your email.
              </p>

              <form onSubmit={handleSubscribe} className="mt-10">

                <label
                  htmlFor="subscribe-email"
                  className="mb-3 block text-[10px] font-bold uppercase tracking-[0.17em] text-[#352A48]"
                >
                  Your Email Address
                </label>

                <input
                  id="subscribe-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") {
                      setStatus("idle");
                      setMessage("");
                    }
                  }}
                  placeholder="you@example.com"
                  disabled={status === "loading"}
                  className="h-14 w-full border-b border-[#101A2B]/20 bg-transparent px-1 text-sm text-[#101A2B] outline-none transition placeholder:text-[#A5A7AD] focus:border-[#991313] disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-7 flex h-14 w-full items-center justify-between bg-[#721F22] px-6 text-xs font-bold uppercase tracking-[0.16em] text-white transition duration-300 hover:bg-[#991313] disabled:cursor-wait disabled:opacity-60"
                >
                  <span>
                    {status === "loading" ? "Subscribing..." : "Join the Community"}
                  </span>
                  <span className="text-lg font-normal">→</span>
                </button>

              </form>

              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`mt-6 border-l-2 px-4 py-3 text-xs leading-6 ${
                    status === "success"
                      ? "border-green-700 bg-green-50 text-green-800"
                      : "border-red-700 bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>

            <div className="absolute -bottom-3 -left-3 h-20 w-20 border-b border-l border-[#991313]/30 sm:-bottom-5 sm:-left-5" />

          </div>

        </div>

        {/* Bottom Editorial Feature */}
        <div className="mt-20 grid overflow-hidden bg-[#352A48] sm:grid-cols-[1fr_auto] sm:items-center">

          <div className="px-7 py-9 sm:px-12 sm:py-11">
            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#E4B6A9]">
              More than a subscription
            </p>
            <h3 className="mt-4 max-w-xl text-xl font-medium leading-relaxed text-white sm:text-2xl">
              A consistent encounter with the Word can change the way
              you see every day.
            </h3>
          </div>
        </div>

      </section>
    </main>
  );
}
