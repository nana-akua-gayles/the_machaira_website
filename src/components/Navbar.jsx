import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./componentStylesheet/Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">

        {/* Logo */}
        <NavLink to="/" className="navbar-logo">

          <div className="logo-name">
            Machaira 
          </div>

          <div className="logo-subtitle">
            with Apostle Bennie
          </div>

        </NavLink>


        {/* Navigation */}
        <nav className="navbar-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Newsfeed
          </NavLink>

          <NavLink
            to="/devotional"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Devotional
          </NavLink>

          <NavLink
            to="/episodes"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Previous Episodes
          </NavLink>

          <NavLink
            to="/blog"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Church Blog
          </NavLink>

          <NavLink
            to="/forum"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Discussion Forum
          </NavLink>

        </nav>


        {/* Right side */}
        <div className="navbar-actions">

          <NavLink
            to="/login"
            className="login-button"
          >
            Login
          </NavLink>


          {/* Search */}
          <div className="search-box">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search Topics..."
            />

          </div>

        </div>

      </div>
    </header>
  );
}

export default Navbar;