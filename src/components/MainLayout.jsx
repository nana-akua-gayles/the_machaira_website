import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WelcomeModal from "./WelcomeModal"; 
import "./componentStylesheet/MainLayout.css";

function MainLayout({ allDevotionals, onSelectEpisode, onTodayEpisode }) {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 1. Check if the current route is the home page (adjust "/" if your home route is different)
    const isHomePage = location.pathname === "/" || location.pathname === "";

    // 2. Check session storage to see if they already saw the welcome modal in this session
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcomeModal");

    // 3. Show only if it's the home page AND they haven't seen it yet
    if (isHomePage && !hasSeenWelcome) {
      setShowWelcomeModal(true);
      // Mark as seen so a page reload or navigation won't trigger it again
      sessionStorage.setItem("hasSeenWelcomeModal", "true");
    }
  }, [location.pathname]);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
      
      {/* Global Welcome Modal (Conditionally rendered only on initial home page visit) */}
      {showWelcomeModal && (
        <WelcomeModal 
          allDevotionals={allDevotionals}
          onSelectEpisode={onSelectEpisode}
          onTodayEpisode={onTodayEpisode}
        />
      )}
    </div>
  );
}

export default MainLayout;