import { NavLink } from "react-router-dom";
import "./componentStylesheet/Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">

          <h2>
            Machaira
          </h2>

          <p>
            With Apostle Bennie
          </p>

          <span>
            Impact your generation. Daily.
          </span>

        </div>

        {/* Explore */}
        <div className="footer-column">

          <h3>Explore</h3>

          <NavLink to="/devotional">
            Devotional
          </NavLink>

          <NavLink to="/blog">
            Ministry Blog
          </NavLink>

          <NavLink to="/forum">
            Discussion Forum
          </NavLink>

          <NavLink to="/partner">
            Partner with Us
          </NavLink>

        </div>

        {/* Community */}
        <div className="footer-column">

          <h3>Community</h3>

          <NavLink to="/about">
            About the Church
          </NavLink>

          <NavLink to="/partnership">
            Partner With Us
          </NavLink>

          <NavLink to="/testimonies">
            Testimonies
          </NavLink>

        </div>

        {/* Newsletter */}
        <div className="footer-column footer-newsletter">

          <h3>Stay Connected</h3>

          <p>
            Receive devotionals, updates and
            encouraging messages.
          </p>

          <div className="newsletter-input">
            <input
              type="email"
              placeholder="Your email address"
            />

            <button>
              →
            </button>
          </div>

        </div>

      </div>

      <div className="footer-bottom">

        <span>
          © {new Date().getFullYear()} Machaira. All rights reserved.
        </span>

        <div>
          <NavLink to="/privacy">
            Privacy
          </NavLink>

          <NavLink to="/terms">
            Terms
          </NavLink>
        </div>

      </div>

    </footer>
  );
}

export default Footer;