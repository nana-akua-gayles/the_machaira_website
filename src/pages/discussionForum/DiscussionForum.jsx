import React, { useState } from 'react';
import DiscussionCategory from './discussionFeatures/DiscussionCategory';
import DiscussionHero from './discussionFeatures/DiscussionHero';
import DiscussionFeed from './discussionFeatures/DiscussionFeed';
import DiscussionRightSidebar from './discussionFeatures/DiscussionRightSidebar';

const DiscussionForum = () => {
  // Selected category lives here because both DiscussionCategory (which
  // sets it) and DiscussionFeed (which filters by it) need it. The active
  // tab (Latest/Trending/etc) stays local to DiscussionFeed since nothing
  // else depends on it.
  const [selectedCategory, setSelectedCategory] = useState('All Discussions');

  return (
    <div className="min-h-screen min-w-0 overflow-x-clip bg-[#F8F8F8] font-[Montserrat,sans-serif] text-[#111827] antialiased selection:bg-red-100 selection:text-red-900">

      {/* Main Container */}
      <main className="max-w-7xl mx-auto min-w-0 px-3 sm:px-6 lg:px-8 pb-16">
        {/* Banner */}
        <DiscussionHero />

        {/* Responsive Grid Structure */}
        <div className="flex min-w-0 flex-col gap-4 lg:mt-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
          {/* Left Navigation Column */}
          <div className="min-w-0 lg:col-span-3">
            <DiscussionCategory
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Center Main Discussions Column */}
          <div className="min-w-0 lg:col-span-6">
            <DiscussionFeed selectedCategory={selectedCategory} />
          </div>

          {/* Right Highlights Column */}
          <div className="min-w-0 lg:col-span-3">
            <DiscussionRightSidebar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiscussionForum;