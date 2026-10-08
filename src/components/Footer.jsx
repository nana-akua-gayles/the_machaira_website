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

  return (
    <footer className="w-full mt-20 bg-charcoal-text text-white pt-17.5 pb-6.25 relative overflow-visible">
      
      {/* CHAT BUBBLE ALERT NOTIFICATION */}
      {message && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
          <div className="relative bg-white text-black px-4 py-2.5 rounded-xl shadow-2xl border border-gray-200 flex items-center gap-2.5 whitespace-nowrap">
            {/* Chat Icon */}
            <svg 
              className="w-4 h-4 text-black shrink-0" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-[13px] font-medium m-0 tracking-wide">{message}</p>
            
            {/* Speech Bubble Arrow Tail */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45"></div>
          </div>
        </div>
      )}

      {/* MAIN FOOTER CONTAINER */}
      <div className="max-w-350 mx-auto px-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.5fr] gap-12.5 lg:gap-17.5">

        {/* BRAND */}
        <div className="flex flex-col">
          <div className="relative h-9 w-full mb-3">
            <img 
              src={logoImage} 
              alt="Machaira Logo" 
              className="absolute top-0 left-0 -translate-y-1/2 h-56 w-auto object-contain pointer-events-none"
            />
          </div>
          <span className="text-soft-gray text-[14px] leading-relaxed">
            Every word is written like a love letter from God to you.
          </span>
        </div>

        {/* EXPLORE */}
        <div className="flex flex-col gap-3.5">
          <h3 className="m-0 mb-2 text-[15px] font-bold text-white">Explore</h3>

          <NavLink 
            to="/devotional" 
            className="w-fit text-soft-gray no-underline text-[14px] transition-all duration-250 hover:text-white hover:translate-x-0.75"
          >
            Devotionals
          </NavLink>

          <NavLink 
            to="/forum" 
            className="w-fit text-soft-gray no-underline text-[14px] transition-all duration-250 hover:text-white hover:translate-x-0.75"
          >
            Discussion Forum
          </NavLink>

          <NavLink 
            to="/testimonials" 
            className="w-fit text-soft-gray no-underline text-[14px] transition-all duration-250 hover:text-white hover:translate-x-0.75"
          >
            Testimonials
          </NavLink>
        </div>

        {/* COMMUNITY */}
        <div className="flex flex-col gap-3.5">
          <h3 className="m-0 mb-2 text-[15px] font-bold text-white">Community</h3>

          <NavLink 
            to="/aboutChurch" 
            className="w-fit text-soft-gray no-underline text-[14px] transition-all duration-250 hover:text-white hover:translate-x-0.75"
          >
            Our Digital Church
          </NavLink>

          <NavLink 
            to="/partnership" 
            className="w-fit text-soft-gray no-underline text-[14px] transition-all duration-250 hover:text-white hover:translate-x-0.75"
          >
            Partner With Us
          </NavLink>

          <NavLink 
            to="/newsfeed" 
            className="w-fit text-soft-gray no-underline text-[14px] transition-all duration-250 hover:text-white hover:translate-x-0.75"
          >
            Ministry Blog
          </NavLink>
        </div>

        {/* NEWSLETTER */}
        <div className="flex flex-col gap-3.5">
          <h3 className="m-0 mb-2 text-[15px] font-bold text-white">Stay Connected</h3>

          <p className="m-0 max-w-75 text-soft-gray text-[14px] leading-[1.6]">
            Receive devotionals, updates and encouraging messages.
          </p>

          <form onSubmit={handleSubscribe} className="w-full max-w-82.5 flex flex-col gap-2 mt-2">
            <div className="w-full h-12 flex items-center p-1 border border-white/15 rounded-full bg-white/6 shadow-inner">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                disabled={status === 'loading'}
                className="flex-1 h-full px-4 border-none outline-none bg-transparent text-white text-[13px] placeholder:text-[#8f96a3]"
              />
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-10 h-10 border-none rounded-full bg-[#a41414] text-white text-[18px] cursor-pointer flex items-center justify-center transition-all duration-250 hover:bg-[#c01818] hover:translate-x-0.5 disabled:opacity-50 shadow-md"
              >
                {status === 'loading' ? '...' : '→'}
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="max-w-350 mx-auto mt-13.75 pt-5.5 px-15 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between text-[#8f96a3] text-[13px] gap-4 md:gap-0">
        <span>
          © {new Date().getFullYear()} Machaira with Apostle Bennie. All rights reserved.
        </span>

        <div className="flex gap-5.5">
          <NavLink to="/privacy" className="text-[#8f96a3] no-underline transition-colors duration-250 hover:text-white">
            Privacy
          </NavLink>
          <NavLink to="/terms" className="text-[#8f96a3] no-underline transition-colors duration-250 hover:text-white">
            Terms
          </NavLink>
        </div>
      </div>
    </footer>
  );
}

export default Footer;