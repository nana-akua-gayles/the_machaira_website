import PreviousDevotionalHero from "./PreviousDevotional/PreviousDevotionalHero";
import PreviousDevotionalToolbar from "./PreviousDevotional/PreviousDevotionalToolbar";
import PreviousDevotionalFilters from "./PreviousDevotional/PreviousDevotionalFilters";
import PreviousDevotionalList from "./PreviousDevotional/PreviousDevotionalList";

function PreviousDevotional() {
  const devotionals = [
    {
      id: 1327,
      title: "IS ANYTHING TOO HARD FOR THE LORD?",
      category: "Faith",
      episode_number: 1327,
      created_at: "2026-09-10T14:21:33+00:00",
      excerpt:
        "God's power is not limited by what appears impossible to us. Trust Him even when the situation seems beyond your understanding.",
      flyer_url: "",
    },
    {
      id: 1326,
      title: "WALKING IN THE LIGHT OF HIS WORD",
      category: "Faith",
      episode_number: 1326,
      created_at: "2026-09-09T14:18:20+00:00",
      excerpt:
        "When we allow God's Word to guide our steps, we learn to walk with confidence, wisdom and purpose.",
      flyer_url: "",
    },
    {
      id: 1325,
      title: "THE POWER OF A PRAYING HEART",
      category: "Prayer",
      episode_number: 1325,
      created_at: "2026-09-08T14:10:12+00:00",
      excerpt:
        "Prayer is more than asking. It is fellowship with God and an opportunity to align our hearts with His will.",
      flyer_url: "",
    },
    {
      id: 1324,
      title: "WHEN GOD CALLS YOU TO TRUST",
      category: "Faith",
      episode_number: 1324,
      created_at: "2026-09-07T13:55:42+00:00",
      excerpt:
        "Faith begins where our ability to control the outcome ends. Learn to trust God's direction even when you cannot see the entire path.",
      flyer_url: "",
    },
    {
      id: 1323,
      title: "STRENGTH FOR THE JOURNEY",
      category: "Purpose",
      episode_number: 1323,
      created_at: "2026-09-06T14:02:18+00:00",
      excerpt:
        "Every season carries its own demands, but God provides the grace and strength required for the journey ahead.",
      flyer_url: "",
    },
  ];

  return (
    <main className="previous-devotional-page min-h-screen bg-white">

      <PreviousDevotionalHero />

      <PreviousDevotionalToolbar />

      <section className="mx-auto max-w-[1350px] px-6 pb-20 pt-20 lg:px-10">

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">

          <PreviousDevotionalFilters />

          {/* Devotional results will go here */}
          <div className="min-w-0 flex-1">
            <PreviousDevotionalList devotionals={devotionals} />
            {/* Coming next */}
          </div>

        </div>

      </section>

      {/* Pagination will be built later */}

      {/* CTA will be built later */}

    </main>
  );
}

export default PreviousDevotional;