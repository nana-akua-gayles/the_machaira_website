import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./componentStylesheet/Navbar.css";
import logoImage from "../assets/images/Mlogo.png";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/devotional", label: "Today's Devotional" },
  { to: "/newsfeed", label: "Newsfeed" },
  { to: "/forum", label: "Discussion Forum" },
  { to: "/partnership", label: "Be a Partner" },
  { to: "/about", label: "About Author" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  function closeMenu() {
    setMenuOpen(false);
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

          {/* Login — visible on desktop; hidden on mobile, where it
              lives inside the hamburger menu instead */}
          <NavLink to="/login" className="login-button">
            Login
          </NavLink>

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

        <NavLink
          to="/login"
          onClick={closeMenu}
          className="mobile-login-link"
        >
          Login
        </NavLink>
      </div>
    </header>
  );
}

export default Navbar;