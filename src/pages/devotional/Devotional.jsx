import DevotionalHero from "./devotionalFeatures/DevotionalHero";
import DevotionalExperience from "./devotionalFeatures/DevotionalExperience";
import DevotionalTopics from "./devotionalFeatures/DevotionalTopics";

function Devotional() {
  return (
    <main className="devotional-page bg-white">
      {/* Hero wrapper */}
      <section className="relative">
        <DevotionalHero />

        {/* Overlay experience panel */}
        <div className="pointer-events-none absolute right-8 top-16 z-20 lg:right-10">
          <div className="pointer-events-auto">
            <DevotionalExperience />
          </div>
        </div>
      </section>

          {/* Topics */}
      <DevotionalTopics />
    </main>
  );
}

export default Devotional;