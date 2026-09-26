import hopeImage from "../../../assets/devotionalImages/hope.jpg";
import faithImage from "../../../assets/devotionalImages/faith.jpg";
import healingImage from "../../../assets/devotionalImages/healing.jpg";
import libertyImage from "../../../assets/devotionalImages/prayer.jpg";
import deliveranceImage from "../../../assets/devotionalImages/deliverance.jpg";
import "./DevotionalTopics.css";
import { useNavigate } from "react-router-dom";

const topics = [
  {
    name: "Faith",
    description: "Grow deeper in your trust and walk with God.",
    image: faithImage,
  },
  {
    name: "Healing",
    description: "Find encouragement, hope, and restoration.",
    image: healingImage,
  },
  {
    name: "Liberty",
    description: "Experience freedom in Christ.",
    image: libertyImage,
  },
  {
    name: "Believe",
    description: "Strengthen your faith and trust in God.",
    image: deliveranceImage,
  },
  {
    name: "Hope",
    description: "Discover God's direction for your life.",
    image: hopeImage,
  },
];

function DevotionalTopics() {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1440px] px-8 lg:px-12">

        {/* Section heading */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#991313]">
              Explore
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#101A2B] md:text-4xl">
              Devotionals by Topic
            </h2>

            <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#4D5057]">
              Explore devotionals designed to meet you wherever you are in
              your walk with God.
            </p>
          </div>
        </div>

        {/* Topic carousel */}
        <div className="topic-scroll mt-10 -mx-2 px-2 pb-5">
          <div className="topic-scroll-track">

            {topics.map((topic) => (
              <button
                key={topic.name}
                type="button"
                onClick={() =>
                  navigate(
                    `/previous-devotionals?category=${encodeURIComponent(topic.name)}`
                  )
                }
                className="topic-card group relative h-[260px] w-[230px] shrink-0 overflow-hidden rounded-[24px] text-left shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Image */}
                <img
                  src={topic.image}
                  alt={topic.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#101A2B]/90 via-[#101A2B]/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="mb-3 h-[2px] w-8 bg-[#991313] transition-all duration-300 group-hover:w-12" />

                  <h3 className="text-xl font-semibold text-white">
                    {topic.name}
                  </h3>

                  <p className="mt-2 max-w-[190px] text-xs leading-5 text-white/75">
                    {topic.description}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white">
                    Explore
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </button>
            ))}

          </div>
        </div>

        {/* Mobile View All */}
        <button
          type="button"
          className="mt-3 rounded-full border border-[#B9BEC8] px-5 py-2.5 text-xs font-semibold text-[#101A2B] transition duration-300 hover:border-[#991313] hover:bg-[#991313] hover:text-white md:hidden"
        >
          View All
        </button>

      </div>
    </section>
  );
}

export default DevotionalTopics;