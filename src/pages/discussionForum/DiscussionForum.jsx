import React from 'react';
import DiscussionCategory from './discussionFeatures/DiscussionCategory';
import DiscussionHero from './discussionFeatures/DiscussionHero';
import DiscussionFeed from './discussionFeatures/DiscussionFeed';
import DiscussionRightSidebar from './discussionFeatures/DiscussionRightSidebar';

const DiscussionForum = () => {
  return (
    <div className="min-h-screen bg-stone-50/50 font-sans text-stone-800 antialiased selection:bg-red-100 selection:text-red-900">

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Banner */}
        <DiscussionHero />

        {/* Responsive Grid Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          {/* Left Navigation Column */}
          <div className="lg:col-span-3">
            <DiscussionCategory />
          </div>

          {/* Center Main Discussions Column */}
          <div className="lg:col-span-6">
            <DiscussionFeed />
          </div>

          {/* Right Highlights Column */}
          <div className="lg:col-span-3">
            <DiscussionRightSidebar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiscussionForum;