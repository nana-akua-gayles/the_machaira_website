import DevotionalDateNav from "./DevotionalDateNav";
import DevotionalAudio from "./DevotionalAudio";
import heroImage from "../../../assets/devotionalImages/devotional-hero.png";

function DevotionalHero() {
  return (
    <section className="relative min-h-[570px] overflow-hidden bg-white">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      />

      {/* Soft white overlay */}
      <div className="absolute inset-0 bg-white/35" />

      {/* Breadcrumb */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-8 pt-10 lg:px-12">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-lg text-[#991313]">
            ⌂
          </span>

          <span className="text-[#B9BEC8]">
            /
          </span>

          <span className="text-[#374151]">
            Devotional
          </span>
        </div>
      </div>

      {/* Main hero content */}
      <div className="relative z-10 mx-auto flex min-h-[510px] max-w-[1440px] px-8 lg:px-12">
        
        {/* Date navigation */}
        <DevotionalDateNav />

        {/* Main devotional content */}
        <div className="flex flex-1 items-center">
          <div className="max-w-[560px] pt-8">
            
            {/* Label */}
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#991313]">
              Daily Devotional
            </p>

            {/* Title */}
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:gap-72">
            <h1 className="max-w-[560px] text-6xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#101A2B] lg:text-7xl">
              Strength for
              <br />
              Today
            </h1>
                   {/* Scripture */}
        <div className="hidden w-[300px] -translate-x-8 items-center justify-center lg:flex">
        <div className="relative flex h-[240px] w-[240px] items-center justify-center rounded-full border border-[#9CA3AF]/50">
            
            <div className="max-w-[180px]">
            <p className="text-base italic leading-7 text-[#111827]">
                "The Lord is my strength and my shield; my heart trusts in Him."
            </p>

            <p className="mt-3 text-sm font-semibold text-[#991313]">
                — Psalm 28:7
            </p>
            </div>

        </div>
        </div>
        </div>

            {/* Decorative line */}
            <div className="my-7 h-[2px] w-12 bg-[#991313]" />

            {/* Description */}
            <p className="max-w-[500px] text-lg leading-8 text-[#374151]">
              Each day is a gift from God. Discover His word, receive fresh
              grace, and walk in divine purpose.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-wrap items-center gap-4">

              {/* Read */}
              <button
                type="button"
                className="rounded-full bg-[#991313] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#7f0e0e] hover:shadow-lg"
              >
                <span className="mr-2">
                  ▢
                </span>

                Read Devotional
              </button>

              {/* Audio */}
              <DevotionalAudio duration="8 min" />

            </div>
          </div>
        </div>

 

      </div>
    </section>
  );
}

export default DevotionalHero;