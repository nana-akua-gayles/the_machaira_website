import { Link } from "react-router-dom";
import heroImage from "../../../assets/devotionalImages/prev.jpg";

function PreviousDevotionalHero() {
  return (
    <section className="relative overflow-hidden bg-white">

      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-32 top-0 h-125 w-125 rounded-full bg-burgundy-primary/[0.035] blur-3xl" />

      <div className="mx-auto max-w-360 px-8 lg:px-12">

        {/* Hero composition */}
        <div className="relative grid min-h-97.5 items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-0">

          {/* Text */}
          <div className="relative z-20 max-w-150">

            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-burgundy-primary">
              Previous Devotionals
            </p>

            <h1 className="max-w-[580px] text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-navy-dark md:text-4xl lg:text-[58px]">
              Missed an 
              <br />
              <span className="text-burgundy-primary">
                Episode ?
              </span>
            </h1>

            <div className="my-7 h-0.5 w-12 bg-burgundy-primary" />

            <p className="max-w-125 text-base leading-7 text-cool-gray md:text-2m">
              Got you covered! The Word is still fresh, still powerful, and still for you!
              Revisit any of our previous devotionals and catch up on the answers God has 
              given for every situation.
            </p>

          </div>

          {/* Visual */}
          <div className="relative min-h-[330px] lg:min-h-[390px]">

            {/* Soft image fade */}
            <img
              src={heroImage}
              alt="Open Bible and devotional reading"
              className="absolute inset-0 h-full w-full object-contain object-center"
            />
          </div>

        </div>

      </div>
    </section>
  );
}

export default PreviousDevotionalHero;