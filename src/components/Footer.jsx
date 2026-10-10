import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logoImage from "../assets/images/Mlogo.png";
import { supabase } from "../lib/supabaseClient";

function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        if (status === "success") setStatus("idle");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, status]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email: email.trim().toLowerCase() }]);

      if (error) {
        if (error.code === '23505') {
          setStatus("success");
          setMessage("You're already part of our family! Grace and peace to you.");
          setEmail("");
        } else {
          throw error;
        }
      } else {
        setStatus("success");
        setMessage("Thank you for subscribing. We love you deeply.");
        setEmail("");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const linkClass = "w-fit text-soft-gray no-underline text-[13px] sm:text-[14px] leading-6 transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

  return (
    <footer className="relative mt-20 w-full bg-charcoal-text pt-12 pb-7 text-white sm:pt-14 lg:pt-17.5 lg:pb-6.25">
      {/* Subscription feedback: readable and contained on narrow screens */}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-x-4 -top-12 z-50 mx-auto max-w-md animate-fadeIn sm:inset-x-auto sm:left-1/2 sm:w-max sm:max-w-[min(90vw,28rem)] sm:-translate-x-1/2"
        >
          <div className="relative flex items-start gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-[#101A2B] shadow-2xl">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="min-w-0 text-[12px] font-medium leading-5 sm:text-[13px]">{message}</p>
            <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-gray-200 bg-white" />
          </div>
        </div>
      )}

      {/* Mobile: brand, paired navigation, full-width newsletter.
          Desktop: original four-column arrangement. */}
      <div className="mx-auto grid max-w-350 grid-cols-2 gap-x-5 gap-y-9 px-5 sm:px-8 md:grid-cols-2 md:gap-x-10 lg:grid-cols-[1.4fr_1fr_1fr_1.5fr] lg:gap-17.5 lg:px-15">
        {/* Brand */}
        <div className="col-span-2 flex min-w-0 flex-col items-start lg:col-span-1">
          <div className="mb-3 flex h-20 w-full items-center sm:h-24 lg:relative lg:mb-3 lg:h-9">
            <img
              src={logoImage}
              alt="Machaira Logo"
              className="h-full max-w-[220px] object-contain object-left lg:pointer-events-none lg:absolute lg:left-0 lg:top-0 lg:h-56 lg:max-w-none lg:w-auto lg:-translate-y-1/2"
            />
          </div>
          <p className="max-w-sm text-[13px] leading-6 text-soft-gray sm:text-[14px] lg:max-w-none lg:leading-relaxed">
            Every word is written like a love letter from God to you.
          </p>
        </div>

        {/* Explore and Community are two adjacent columns on phones */}
        <nav aria-label="Explore" className="flex min-w-0 flex-col items-start gap-3 lg:gap-3.5">
          <h3 className="mb-1 text-[14px] font-bold text-white sm:text-[15px] lg:mb-2">Explore</h3>
          <NavLink to="/devotional" className={linkClass}>Devotionals</NavLink>
          <NavLink to="/forum" className={linkClass}>Discussion Forum</NavLink>
          <NavLink to="/testimonials" className={linkClass}>Testimonials</NavLink>
        </nav>

        <nav aria-label="Community" className="flex min-w-0 flex-col items-start gap-3 lg:gap-3.5">
          <h3 className="mb-1 text-[14px] font-bold text-white sm:text-[15px] lg:mb-2">Community</h3>
          <NavLink to="/aboutChurch" className={linkClass}>Our Digital Church</NavLink>
          <NavLink to="/partnership" className={linkClass}>Partner With Us</NavLink>
          <NavLink to="/newsfeed" className={linkClass}>Ministry Blog</NavLink>
        </nav>

        {/* Newsletter spans full width on mobile, unchanged in desktop grid */}
        <div className="col-span-2 min-w-0 border-t border-white/10 pt-7 lg:col-span-1 lg:border-0 lg:pt-0">
          <h3 className="mb-3 text-[15px] font-bold text-white">Stay Connected</h3>
          <p className="max-w-sm text-[13px] leading-6 text-soft-gray sm:text-[14px] lg:max-w-75 lg:leading-[1.6]">
            Receive devotionals, updates and encouraging messages.
          </p>
          <form onSubmit={handleSubscribe} className="mt-4 w-full max-w-md lg:mt-5 lg:max-w-82.5">
            <div className="flex h-12 w-full min-w-0 items-center rounded-full border border-white/15 bg-white/6 p-1 shadow-inner focus-within:border-white/50">
              <label htmlFor="footer-subscribe-email" className="sr-only">Email address</label>
              <input
                id="footer-subscribe-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                disabled={status === "loading"}
                className="h-full min-w-0 flex-1 border-none bg-transparent px-4 text-[13px] text-white outline-none placeholder:text-[#8f96a3]"
              />
              <button
                type="submit"
                aria-label={status === "loading" ? "Subscribing" : "Subscribe to newsletter"}
                disabled={status === "loading"}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#a41414] text-[18px] text-white shadow-md transition-all duration-200 hover:bg-[#c01818] disabled:cursor-wait disabled:opacity-50"
              >
                {status === "loading" ? "…" : "→"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile: privacy links first, copyright below; desktop original order */}
      <div className="mx-auto mt-10 flex max-w-350 flex-col-reverse items-start justify-between gap-5 border-t border-white/10 px-5 pt-6 text-[12px] leading-5 text-[#8f96a3] sm:px-8 sm:text-[13px] md:flex-row md:items-center md:gap-0 lg:mt-13.75 lg:px-15 lg:pt-5.5">
        <span>© {new Date().getFullYear()} Machaira with Apostle Bennie. All rights reserved.</span>
        <nav aria-label="Legal" className="flex items-center gap-6">
          <NavLink to="/privacy" className="transition-colors hover:text-white">Privacy</NavLink>
          <NavLink to="/terms" className="transition-colors hover:text-white">Terms</NavLink>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;