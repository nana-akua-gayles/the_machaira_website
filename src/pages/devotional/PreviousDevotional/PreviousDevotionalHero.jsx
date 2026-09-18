import { Link } from "react-router-dom";
import heroImage from "../../../assets/devotionalImages/biblecoffee.jpg";

function PreviousDevotionalHero() {
  return (
    <section className="relative overflow-hidden bg-white">

      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-[#991313]/[0.035] blur-3xl" />

      <div className="mx-auto max-w-[1440px] px-8 lg:px-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-3 pt-8 text-sm">
          <Link
            to="/"
            className="text-[#991313] transition-colors hover:text-[#7f0e0e]"
          >
            ⌂
          </Link>

          <span className="text-[#B9BEC8]">/</span>

          <span className="text-[#4D5057]">
            Previous Devotionals
          </span>
        </div>

        {/* Hero composition */}
        <div className="relative grid min-h-[390px] items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-0">

          {/* Text */}
          <div className="relative z-20 max-w-[600px]">

            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#991313]">
              Previous Devotionals
            </p>

            <h1 className="max-w-[580px] text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#101A2B] md:text-6xl lg:text-[68px]">
              Every Word.
              <br />
              <span className="text-[#991313]">
                Every Season.
              </span>
            </h1>

            <div className="my-7 h-[2px] w-12 bg-[#991313]" />

            <p className="max-w-[500px] text-base leading-7 text-[#4D5057] md:text-lg">
              Explore our entire library of devotionals and grow in
              faith through God's timeless Word.
            </p>

          </div>

          {/* Visual */}
          <div className="relative min-h-[330px] lg:min-h-[390px]">

            {/* Soft image fade */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/20 to-transparent" />

            <img
              src={heroImage}
              alt="Open Bible and devotional reading"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            {/* Scripture card */}
            <div className="absolute bottom-6 right-0 z-20 w-[270px] rounded-2xl border border-black/10 bg-white/95 p-6 shadow-lg backdrop-blur-sm md:right-6 lg:bottom-8 lg:right-0">

              <div className="text-5xl leading-none text-[#991313]">
                “
              </div>

              <p className="mt-1 text-base italic leading-7 text-[#101A2B]">
                Your word is a lamp to my feet
                and a light to my path.
              </p>

              <p className="mt-4 text-sm font-semibold text-[#991313]">
                Psalm 119:105
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default PreviousDevotionalHero;