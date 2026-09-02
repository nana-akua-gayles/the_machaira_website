import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./componentStylesheet/Navbar.css";
import logoImage from "../assets/images/Mlogo.png";

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

        {/* Logo with Overflowing Large Image */}
        <NavLink to="/" className="navbar-logo">
          <div className="logo-image-wrapper">
            <img 
              src={logoImage} 
              alt="Machaira Logo" 
              className="logo-image-overflow"
            />
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
            Home
          </NavLink>

        <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            About
          </NavLink>


          <NavLink
            to="/devotional"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
           Today's Devotional
          </NavLink>

          <NavLink
            to="/newsfeed"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Newsfeed
          </NavLink>

          <NavLink
            to="/forum"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Discussion Forum
          </NavLink>

        <NavLink
            to="/partner"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Be a Partner
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