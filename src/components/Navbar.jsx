import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logoImage from "../assets/images/Mlogo.png";
import { useAuth } from "../context/AuthContext";
import UserAvatar from "./UserAvatar";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-1000 transition-all duration-400 ${
        scrolled ? "top-3.5 px-3 sm:px-5 lg:px-6" : "p-0"
      } font-sans`}
    >
      <div
        className={`w-full flex items-center transition-all duration-400 ${
          scrolled
            ? "max-w-367.5 mx-auto min-h-19 px-5 lg:px-5.5 bg-white/90 border border-black/8 rounded-[22px] shadow-[0_12px_35px_rgba(0,0,0,0.09)] backdrop-blur-[20px]"
            : "min-h-23 px-4.5 lg:px-6 bg-white/96 border-none rounded-none shadow-none backdrop-blur-md"
        }`}
      >
        {/* LOGO WITH OVERFLOWING LARGE IMAGE */}
        <NavLink
          to="/"
          className={`relative flex items-center h-full no-underline text-navy-dark transition-transform duration-300 hover:-translate-y-px shrink-0 ${
            scrolled ? "basis-[clamp(120px,13vw,170px)]" : "basis-[clamp(130px,14vw,190px)]"
          }`}
        >
          <div className="relative h-full w-full flex items-center">
            <img
              src={logoImage}
              alt="Machaira Logo"
              className="absolute top-1/2 left-0 -translate-y-1/2 h-[clamp(120px,17vw,770px)] w-auto object-contain pointer-events-none"
            />
          </div>
        </NavLink>

        {/* NAVIGATION LINKS */}
        <nav
          className={`hidden lg:flex flex-1 min-w-0 items-center justify-center transition-all duration-300 ${
            scrolled ? "gap-6.5 mx-2" : "gap-7.5 mx-2.5"
          }`}
        >
          {[
            { to: "/", label: "Home" },
            { to: "/devotional", label: "Today's Devotional" },
            { to: "/newsfeed", label: "Newsfeed" },
            { to: "/forum", label: "Discussion Forum" },
            { to: "/testimonials", label: "Testimonials" },
            { to: "/partnership", label: "Be a Partner" },
            { to: "/about", label: "About Author" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative no-underline text-[14px] ${
                  scrolled ? "py-6.75 text-[13.5px]" : "py-8.5"
                } font-medium whitespace-nowrap transition-all duration-250 hover:text-burgundy-primary hover:-translate-y-px ${
                  isActive ? "text-[#a41414] font-semibold" : "text-cool-gray"
                } after:content-[''] after:absolute after:left-1/2 ${
                  scrolled ? "after:bottom-4" : "after:bottom-5.75"
                } after:h-0.5 after:bg-[#a41414] after:-translate-x-1/2 transition-all duration-300 ${
                  isActive ? "after:w-7" : "after:w-0"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3 ml-auto lg:ml-0 shrink-0">
          {!loading &&
            (user ? (
              <button
                type="button"
                onClick={signOut}
                title="Sign out"
                className="flex items-center bg-transparent border-none p-0 cursor-pointer"
              >
                <UserAvatar user={user} size={36} />
              </button>
            ) : (
              <NavLink
                to="/login"
                className={`flex items-center justify-center rounded-full bg-burgundy-primary text-white no-underline font-semibold whitespace-nowrap transition-all duration-250 hover:bg-[#7f0e0e] hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(153,19,19,0.18)] ${
                  scrolled
                    ? "h-10.75 min-w-21 px-4 text-[14px]"
                    : "h-8.75 min-w-20.5 px-4.5 text-[14px]"
                }`}
              >
                Login
              </NavLink>
            ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;