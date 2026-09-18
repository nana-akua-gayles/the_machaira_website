import React from "react";

import LeftSidebar from "./LeftSidebar";
import MainFeedSection from "./MainFeedSection";
import RightSidebar from "./RightSidebar";
import Newsfeed from "../../assets/images/newsfeedhero.jpg";

export default function NewsfeedPage() {
  return (
    <main className="min-h-screen bg-[#FBF9F4] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* MAIN PAGE GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">

          {/* =====================================================
              HERO
              The image keeps its natural aspect ratio.
              Nothing is cropped.
          ====================================================== */}
          <section
            className="
              lg:col-span-9
              overflow-hidden
              rounded-[22px]
              border
              border-black/5
              shadow-sm
            "
          >
            <img
              src={Newsfeed}
              alt="Machaira Newsfeed"
              className="block h-auto w-full"
            />
          </section>

          {/* =====================================================
              RIGHT SIDEBAR
          ====================================================== */}
          <aside className="lg:col-span-3 lg:row-span-2">
            <RightSidebar />
          </aside>

          {/* =====================================================
              LEFT SIDEBAR
          ====================================================== */}
          <aside className="lg:col-span-3">
            <LeftSidebar />
          </aside>

          {/* =====================================================
              MAIN FEED
          ====================================================== */}
          <section className="lg:col-span-6">
            <MainFeedSection />
          </section>

        </div>

      </div>
    </main>
  );
}