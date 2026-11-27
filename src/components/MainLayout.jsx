
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WelcomeModal from "./WelcomeModal";
import DevotionalOverlay from "./DevotionalOverlay";
import { supabase } from "../lib/supabaseClient";
import "./componentStylesheet/MainLayout.css";
import NewsletterAnnouncement from "./NewsletterAnnouncement";

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Control welcome modal visibility using session storage
  const [showWelcomeModal] = useState(() => {
    if (typeof window === "undefined") return false;

    const isHomePage =
      location.pathname === "/" || location.pathname === "";

    const hasSeenWelcome = sessionStorage.getItem(
      "hasSeenWelcomeModal"
    );

    if (isHomePage && !hasSeenWelcome) {
      sessionStorage.setItem("hasSeenWelcomeModal", "true");
      return true;
    }

    return false;
  });

  // Navigate directly to a selected devotional
  const handleSelectEpisode = (episode) => {
    if (!episode?.id) return;

    navigate(`/devotional/${episode.id}`);
  };

  // Fetch only the latest devotional when requested
  const handleTodayEpisode = async () => {
    try {
      const { data, error } = await supabase
        .from("devotionals")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "Error fetching latest devotional:",
          error.message
        );
        return;
      }

      if (data?.id) {
        navigate(`/devotional/${data.id}`);
      } else {
        console.warn("No devotionals found in database.");
      }
    } catch (error) {
      console.error(
        "Unexpected error fetching latest devotional:",
        error
      );
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

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <WelcomeModal
          onSelectEpisode={handleSelectEpisode}
          onTodayEpisode={handleTodayEpisode}
        />
      )}

      <NewsletterAnnouncement />
    </div>
  );
}

MainLayout.displayName = "MainLayout";

export default MainLayout;
