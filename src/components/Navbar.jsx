import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserAvatar from "./UserAvatar";
import "./componentStylesheet/Navbar.css";
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
  const desktopProfileMenuRef = useRef(null);
  const mobileProfileMenuRef = useRef(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
      const insideDesktopProfile = desktopProfileMenuRef.current?.contains(event.target);
      const insideMobileProfile = mobileProfileMenuRef.current?.contains(event.target);

      if (!insideDesktopProfile && !insideMobileProfile) {
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
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">

        {/* Logo with Overflowing Large Image */}
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-image-wrapper">
            <img
              src={logoImage}
              alt="Machaira Logo"
              className="logo-image-overflow"
            />
          </div>
        </NavLink>

        {/* Navigation — desktop */}
        <nav className="navbar-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="navbar-actions">

          {/* Desktop profile/login controls. The profile moves into the
              mobile menu at the mobile breakpoint. */}
          {user ? (
            <div className="navbar-profile desktop-profile" ref={desktopProfileMenuRef}>
              <button
                type="button"
                className="navbar-avatar"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                aria-label="Open profile menu"
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
              >
                <UserAvatar user={user} size={40} />
              </button>

              {profileMenuOpen && (
                <div className="profile-dropdown" role="menu">
                  <span className="profile-dropdown-email">
                    {user.email}
                  </span>
                  <button
                    type="button"
                    className="profile-logout-button"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="login-button">
              Login
            </NavLink>
          )}

          {/* Hamburger — mobile only */}
          <button
            type="button"
            className={`menu-toggle ${menuOpen ? "menu-toggle-open" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>

        </div>

      </div>

      {/* Mobile menu panel */}
      <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}>
        {user && (
          <div className="mobile-profile-summary navbar-profile" ref={mobileProfileMenuRef}>
            <button
              type="button"
              className="mobile-profile-trigger"
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              aria-label="Open profile menu"
              aria-expanded={profileMenuOpen}
              aria-haspopup="menu"
            >
              <UserAvatar user={user} size={44} />
              <span className="mobile-profile-email">{user.email}</span>
            </button>

            {profileMenuOpen && (
              <div className="profile-dropdown" role="menu">
                <span className="profile-dropdown-email">
                  {user.email}
                </span>
                <button
                  type="button"
                  className="profile-logout-button"
                  onClick={handleLogout}
                  role="menuitem"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}

        <nav className="mobile-menu-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "mobile-nav-link active" : "mobile-nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {!user && (
          <NavLink
            to="/login"
            onClick={closeMenu}
            className="mobile-login-link"
          >
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
}

export default Navbar;