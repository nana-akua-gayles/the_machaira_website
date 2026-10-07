import React from "react";
import ChurchHero from "./ChurchHero";
import ChurchMissionVision from "./ChurchMissionVision";
import ChurchCoreValues from "./ChurchCoreValues";
import ChurchLeadership from "./ChurchLeadership";
import WelcomeBanner from "./WelcomeBanner";

export default function AboutChurch() {
  const handleAction = (actionName) => {
    console.log(`Triggered action: ${actionName}`);
  };

  return (
    <main className="min-h-screen bg-[#fdfaf7]">
      <ChurchHero onJoinCommunity={() => handleAction("Join Community")} />
      <ChurchMissionVision />
      <ChurchCoreValues />
      <ChurchLeadership onLearnMore={() => handleAction("Learn More About Author")} />
      <WelcomeBanner onVisitSunday={() => handleAction("Visit This Sunday")} />
    </main>
  );
}