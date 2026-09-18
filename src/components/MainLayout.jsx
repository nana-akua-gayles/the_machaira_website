import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WelcomeModal from "./WelcomeModal"; 
import "./componentStylesheet/MainLayout.css";

function MainLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
      
      {/* Global Welcome Modal (Opens on load) */}
      <WelcomeModal />
    </div>
  );
}

export default MainLayout;