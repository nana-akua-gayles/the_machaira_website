import React from "react";
import { NavLink } from "react-router-dom";
import logoImage from "../assets/images/Mlogo.png";

function Footer() {
  return (
    <footer className="w-full mt-20 bg-charcoal-text text-white pt-17.5 pb-6.25 font-sans">
      {/* MAIN FOOTER CONTAINER */}
      <div className="max-w-350 mx-auto px-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.5fr] gap-12.5 lg:gap-17.5">

        {/* BRAND */}
        <div className="flex flex-col">
          {/* Controlled layout wrapper with absolute-overflow logo */}
          <div className="relative h-7 w-full mb-3">
            <img 
              src={logoImage} 
              alt="Machaira Logo" 
              className="absolute top-1/2 left-0 -translate-y-1/2 h-56 w-auto object-contain pointer-events-none"
            />
          </div>
          <span className="text-soft-gray text-[14px] leading-relaxed mt-2">
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
            Devotional
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
            to="/about" 
            className="w-fit text-soft-gray no-underline text-[14px] transition-all duration-250 hover:text-white hover:translate-x-0.75"
          >
            About the Church
          </NavLink>

          <NavLink 
            to="/partnership" 
            className="w-fit text-soft-gray no-underline text-[14px] transition-all duration-250 hover:text-white hover:translate-x-0.75"
          >
            Partner With Us
          </NavLink>

          <NavLink 
            to="/blog" 
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

          <div className="w-full max-w-82.5 h-12 flex items-center mt-2 p-1 border border-white/15 rounded-full bg-white/6">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 h-full px-4 border-none outline-none bg-transparent text-white text-[13px] placeholder:text-[#8f96a3]"
            />
            <button 
              type="button"
              className="w-10 h-10 border-none rounded-full bg-[#a41414] text-white text-[18px] cursor-pointer flex items-center justify-center transition-all duration-250 hover:bg-[#c01818] hover:translate-x-0.5"
            >
              →
            </button>
          </div>
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