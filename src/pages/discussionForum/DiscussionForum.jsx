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
    <div className="min-h-screen bg-stone-50/50 font-sans text-stone-800 antialiased selection:bg-red-100 selection:text-red-900">

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Banner */}
        <DiscussionHero />

        {/* Responsive Grid Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          {/* Left Navigation Column */}
          <div className="lg:col-span-3">
            <DiscussionCategory
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Center Main Discussions Column */}
          <div className="lg:col-span-6">
            <DiscussionFeed selectedCategory={selectedCategory} />
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