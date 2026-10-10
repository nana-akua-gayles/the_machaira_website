import { Link } from "react-router-dom";
import heroImage from "../../../assets/devotionalImages/prev.jpg";

function PreviousDevotionalHero() {
  return (
    <section className="relative overflow-hidden bg-white">
<<<<<<< HEAD

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
=======
      {/* Mobile: all hero elements are over the image, without excessive height. */}
      <div className="relative isolate min-h-[350px] overflow-hidden sm:min-h-[390px] lg:hidden">
        <img src={heroImage} alt="Open Bible and devotional reading" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101A2B]/90 via-[#101A2B]/75 to-[#101A2B]/40" />
        <div className="mx-auto flex min-h-[350px] max-w-[1350px] flex-col justify-between px-5 pb-5 pt-5 sm:min-h-[390px] sm:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/80">
            <Link to="/" className="font-semibold text-white hover:underline">⌂ Home</Link><span>/</span><span>Previous Devotionals</span>
          </nav>
          <div className="py-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F5D2D2]">Previous Devotionals</p>
            <h1 className="text-[clamp(2rem,9vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-white">Every Word.<br/><span className="text-[#F2B7B7]">Every Season.</span></h1>
            <p className="mt-3 max-w-[340px] text-xs leading-5 text-white/90 sm:text-sm">Explore our entire library of devotionals and grow in faith through God's timeless Word.</p>
          </div>
          <div className="animate-[verseFloat_5s_ease-in-out_infinite] self-end rounded-xl border border-white/25 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm motion-reduce:animate-none">
            <p className="max-w-[260px] font-serif text-[12px] italic leading-5 text-[#101A2B]">“Your word is a lamp to my feet and a light to my path.”</p>
            <p className="mt-1 text-[11px] font-semibold text-[#991313]">Psalm 119:105</p>
>>>>>>> d355de247515715790a1a24934e8df943aab5721
          </div>
        </div>
      </div>
      <style>{`@keyframes verseFloat { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-7px) } }`}</style>

      {/* Desktop composition retained. */}
      <div className="relative mx-auto hidden max-w-[1440px] px-12 lg:block">
        <div className="flex items-center gap-3 pt-8 text-sm"><Link to="/" className="text-burgundy-primary hover:text-[#7f0e0e]">⌂</Link><span className="text-soft-gray">/</span><span className="text-cool-gray">Previous Devotionals</span></div>
        <div className="relative grid min-h-[390px] grid-cols-[0.9fr_1.1fr] items-center gap-0 py-10">
          <div className="relative z-20 max-w-[600px]"><p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-burgundy-primary">Previous Devotionals</p><h1 className="max-w-[580px] text-[68px] font-semibold leading-[1.02] tracking-[-0.045em] text-navy-dark">Every Word.<br/><span className="text-burgundy-primary">Every Season.</span></h1><div className="my-7 h-0.5 w-12 bg-burgundy-primary"/><p className="max-w-[500px] text-base leading-7 text-cool-gray">Explore our entire library of devotionals and grow in faith through God's timeless Word.</p></div>
          <div className="relative min-h-[390px]"><div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/20 to-transparent"/><img src={heroImage} alt="Open Bible and devotional reading" className="absolute inset-0 h-full w-full object-cover object-center"/><div className="absolute bottom-8 right-0 z-20 w-[270px] rounded-2xl border border-black/10 bg-white/95 p-6 shadow-lg backdrop-blur-sm"><div className="text-5xl leading-none text-burgundy-primary">“</div><p className="mt-1 text-base italic leading-7 text-navy-dark">Your word is a lamp to my feet and a light to my path.</p><p className="mt-4 text-sm font-semibold text-burgundy-primary">Psalm 119:105</p></div></div>
        </div>
      </div>
    </section>
  );
}
export default PreviousDevotionalHero;
