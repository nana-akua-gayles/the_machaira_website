import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserAvatar from "./UserAvatar";
import logoImage from "../assets/images/Mlogo.png";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/devotional", label: "Today's Devotional" },
  { to: "/newsfeed", label: "Newsfeed" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/forum", label: "Discussion Forum" },
  { to: "/partnership", label: "Be a Partner" },
  { to: "/about", label: "About Author" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!profileMenuOpen) return;

    function handlePointerDown(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileMenuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleLogout() {
    await signOut();
    setProfileMenuOpen(false);
    closeMenu();
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-1000 transition-all duration-400 ${
        scrolled ? "top-3.5 px-3 sm:px-5 lg:px-6" : "p-0"
      } font-sans`}
    >
      <div
        className={`w-full flex items-center justify-between transition-all duration-400 ${
          scrolled
            ? "max-w-367.5 mx-auto min-h-19 px-5 lg:px-5.5 bg-white/90 border border-black/8 rounded-[22px] shadow-[0_12px_35px_rgba(0,0,0,0.09)] backdrop-blur-[20px]"
            : "min-h-23 px-4.5 lg:px-6 bg-white/96 border-none rounded-none shadow-none backdrop-blur-md"
        }`}
      >
        {/* LOGO WITH OVERFLOWING LARGE IMAGE */}
        <NavLink
          to="/"
          onClick={closeMenu}
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

        {/* NAVIGATION LINKS — Desktop */}
        <nav
          className={`hidden lg:flex flex-1 min-w-0 items-center justify-center transition-all duration-300 ${
            scrolled ? "gap-6.5 mx-2" : "gap-7.5 mx-2.5"
          }`}
        >
          {navItems.map((item) => (
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
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                className="flex items-center bg-transparent border-none p-0 cursor-pointer rounded-full"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                aria-label="Open profile menu"
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
              >
                <UserAvatar user={user} size={40} />
              </button>

              {profileMenuOpen && (
                <div 
                  className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-black/10 py-2 z-50 flex flex-col"
                  role="menu"
                >
                  <span className="px-4 py-2 text-xs text-gray-500 truncate border-b border-gray-100">
                    {user.email}
                  </span>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className={`hidden sm:flex items-center justify-center rounded-full bg-burgundy-primary text-white no-underline font-semibold whitespace-nowrap transition-all duration-250 hover:bg-[#7f0e0e] hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(153,19,19,0.18)] ${
                scrolled
                  ? "h-10.75 min-w-21 px-4 text-[14px]"
                  : "h-8.75 min-w-20.5 px-4.5 text-[14px]"
              }`}
            >
              Login
            </NavLink>
          )}

          {/* HAMBURGER TOGGLE — Mobile only */}
          <button
            type="button"
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 bg-transparent border-none cursor-pointer p-2 z-50"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className={`w-6 h-0.5 bg-[#222] transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-6 h-0.5 bg-[#222] transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-6 h-0.5 bg-[#222] transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      <div
        className={`fixed inset-0 bg-white/98 backdrop-blur-2xl z-40 flex flex-col pt-24 px-6 pb-8 transition-all duration-300 lg:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-6 text-center">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                `text-lg font-medium no-underline transition-colors ${
                  isActive ? "text-[#a41414] font-semibold" : "text-gray-700 hover:text-[#a41414]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {!user && (
          <div className="mt-auto pt-6 border-t border-gray-100 flex justify-center">
            <NavLink
              to="/login"
              onClick={closeMenu}
              className="w-full max-w-xs h-12 flex items-center justify-center rounded-full bg-burgundy-primary text-white text-base font-semibold shadow-md"
            >
              Login
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;