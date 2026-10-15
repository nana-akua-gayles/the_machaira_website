import heroImage from "../../../assets/devotionalImages/prev.jpg";

function PreviousDevotionalHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Mobile and tablet hero */}
      <div className="lg:hidden">
        {/* Image banner */}
        <div className="relative h-[190px] overflow-hidden sm:h-[250px]">
          <img
            src={heroImage}
            alt="Open Bible and devotional reading"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101A2B]/35 via-transparent to-white/5" />
        </div>

        {/* Text beneath the image */}
        <div className="relative px-5 pb-9 pt-7 sm:px-8 sm:pb-12 sm:pt-9">
          <div className="mx-auto max-w-[680px]">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8A2B2E] sm:text-xs">
              Previous Devotionals
            </p>

            <h1 className="max-w-[500px] text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-[#101A2B]">
              Missed an{" "}
              <span className="text-[#8A2B2E]">Episode?</span>
            </h1>

            <div className="my-4 flex items-center gap-2.5">
            <div className="h-[3px] w-10 rounded-full bg-[#8A2B2E]" />
            <div className="h-1 w-1 rounded-full bg-[#D8B6A0]" />
            <div className="h-1 w-1 rounded-full bg-[#D8B6A0]" />
          </div>

            <p className="max-w-[520px] text-sm leading-6 text-[#667085] sm:text-base sm:leading-7">
              We've got you! The Word is still juicy, still powerful, and still
              for you. Revisit the archives and discover the timeless messages
              God has been speaking to you.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop composition retained */}
      <div className="relative mx-auto hidden max-w-[1440px] px-12 lg:block">
        <div className="relative grid min-h-[390px] grid-cols-[0.9fr_1.1fr] items-center gap-0 py-10">
          <div className="relative z-20 max-w-[600px]">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-burgundy-primary">
              Previous Devotionals
            </p>

            <h1 className="max-w-[580px] text-[68px] font-semibold leading-[1.02] tracking-[-0.045em] text-navy-dark">
              Missed an
              <br />
              <span className="text-burgundy-primary">Episode?</span>
            </h1>

            <div className="my-7 h-0.5 w-12 bg-burgundy-primary" />

            <p className="max-w-[500px] text-base leading-7 text-cool-gray">
              We've got you! The Word is still juicy, still powerful, and still
              for you. Revisit the archives to be updated on all the letters
              God has been writing to you.
            </p>
          </div>

          <div className="relative min-h-[390px]">
            <img
              src={heroImage}
              alt="Open Bible and devotional reading"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PreviousDevotionalHero;