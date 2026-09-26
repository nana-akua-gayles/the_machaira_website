import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WelcomeModal from "./WelcomeModal"; 
import DevotionalOverlay from "./DevotionalOverlay"; // Import the overlay
import { supabase } from "../lib/supabaseClient";
import "./componentStylesheet/MainLayout.css";

function MainLayout() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [allDevotionals, setAllDevotionals] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Fetch devotionals in the background when layout mounts
  useEffect(() => {
    async function fetchDevotionals() {
      const { data, error } = await supabase
        .from("devotionals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching devotionals:", error.message);
      } else {
        setAllDevotionals(data || []);
      }
    }
    fetchDevotionals();
  }, []);

  // 2. Control modal visibility based on route and session storage
  useEffect(() => {
    const isHomePage = location.pathname === "/" || location.pathname === "";
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcomeModal");

    if (isHomePage && !hasSeenWelcome) {
      setShowWelcomeModal(true);
      sessionStorage.setItem("hasSeenWelcomeModal", "true");
    }
  }, [location.pathname]);

  // 3. Handle Mood / Category Selection
  const handleSelectEpisode = (episode, categoryKey) => {
    navigate(`/devotional/${episode.id}`);
  };

  // 4. Handle "Today's Word" Hero Card (Instant fallback if list isn't ready)
  const handleTodayEpisode = async () => {
    // If background list is already loaded, use it instantly
    if (allDevotionals.length > 0) {
      navigate(`/devotional/${allDevotionals[0].id}`);
      return;
    }

    // Otherwise, fetch the latest one right away on click
    try {
      const { data, error } = await supabase
        .from("devotionals")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data && data.id) {
        navigate(`/devotional/${data.id}`);
      } else {
        console.warn("No devotionals found in database.");
      }
    } catch (err) {
      console.error("Error fetching latest devotional on click:", err);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
      
      {/* Persistent Daily Devotional Prompt Overlay */}
      <DevotionalOverlay 
        onReadDevotional={handleTodayEpisode} 
      />
      
      {showWelcomeModal && (
        <WelcomeModal 
          allDevotionals={allDevotionals}
          onSelectEpisode={handleSelectEpisode}
          onTodayEpisode={handleTodayEpisode}
        />
      )}
    </div>
  );
}

export default MainLayout;