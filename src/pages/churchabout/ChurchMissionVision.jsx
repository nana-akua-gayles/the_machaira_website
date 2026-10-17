
import ChurchOrbit from "./ChurchOrbit";
import { Target, Eye, ArrowDown } from "lucide-react";

export default function ChurchMissionVision() {
  return (
    <section className="relative isolate overflow-hidden bg-[#fdfaf7] py-16 sm:py-20 lg:py-24">
      {/* Subtle background details */}
      <div className="pointer-events-none absolute left-1/2 top-[46%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8d1515]/[0.045] sm:h-[560px] sm:w-[560px]" />
      <div className="pointer-events-none absolute left-1/2 top-[46%] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8d1515]/[0.035] sm:h-[430px] sm:w-[430px]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-[70%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(141,21,21,0.035),transparent_70%)]" />

      <div className="relative mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">

          <h2 className="text-4xl font-normal leading-[1.12] tracking-[-0.045em] text-navy-dark sm:text-5xl lg:text-[3.5rem]">
            Conviction with{" "}
            <span className="text-burgundy-primary">Direction</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-cool-gray sm:text-base sm:leading-8">
            Everything we do flows from one desire - to know Christ deeply,
            make Him known boldly, and raise people who live with divine
            purpose.
          </p>

          <div className="mx-auto mt-7 h-px w-14 bg-gradient-to-r from-transparent via-burgundy-primary/50 to-transparent" />
        </div>

        {/* Mobile Layout */}
        <div className="mt-9 lg:hidden">
          <ChurchOrbit variant="purpose" />
        </div>

        {/* Desktop Mission and Vision */}
        <div className="relative mx-auto mt-16 hidden max-w-5xl lg:block">
          {/* Central connecting line */}
          <div className="pointer-events-none absolute bottom-8 left-1/2 top-8 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#8d1515]/25 to-transparent" />

          {/* Mission */}
          <div className="group relative grid grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] items-center gap-8">
            <div className="relative py-5 text-right">
              <h3 className="mt-4 text-3xl font-normal tracking-[-0.04em] text-navy-dark transition-colors duration-300 group-hover:text-burgundy-primary xl:text-4xl">
                Our Mission
              </h3>

              <p className="ml-auto mt-4 max-w-md text-sm leading-7 text-cool-gray xl:text-[15px] xl:leading-8">
                To build a global family of passionate lovers of Jesus by cultivating the reigning life in Christ 
                in every member. Through dynamic live services, rich digital resources, structured discipleship, 
                and pastoral care, we equip believers 
                to walk in the certainty of their calling and to influence their spheres with His divine purpose and intent.
              </p>
            </div>

            {/* Mission Icon */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="absolute h-[88px] w-[88px] rounded-full border border-[#8d1515]/[0.08] transition-all duration-700 group-hover:scale-110 group-hover:border-[#8d1515]/20" />
              <div className="absolute h-[72px] w-[72px] rounded-full border border-[#8d1515]/[0.12]" />
              <div className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#8d1515]/25 bg-[#fdfaf7] shadow-[0_4px_20px_rgba(141,21,21,0.045)] transition-all duration-500 group-hover:scale-105 group-hover:border-[#8d1515]/55 group-hover:shadow-[0_0_0_8px_rgba(141,21,21,0.045)]">
                <Target className="h-[23px] w-[23px] text-burgundy-primary transition-transform duration-500 group-hover:rotate-12" strokeWidth={1.5} />
              </div>
            </div>

            <div />
          </div>

          {/* Central Connector */}
          <div className="relative z-20 my-8 flex justify-center">
            <div className="group/connector relative flex h-9 w-9 items-center justify-center rounded-full border border-[#8d1515]/15 bg-[#fdfaf7] shadow-[0_3px_12px_rgba(141,21,21,0.05)] transition-all duration-500 hover:border-[#8d1515]/40 hover:shadow-[0_0_0_6px_rgba(141,21,21,0.035)]">
              <ArrowDown className="h-4 w-4 text-burgundy-primary transition-transform duration-500 group-hover/connector:translate-y-0.5" strokeWidth={1.6} />
            </div>
          </div>

          {/* Vision */}
          <div className="group relative grid grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] items-center gap-8">
            <div />

            {/* Vision Icon */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="absolute h-[88px] w-[88px] rounded-full border border-[#8d1515]/[0.08] transition-all duration-700 group-hover:scale-110 group-hover:border-[#8d1515]/20" />
              <div className="absolute h-[72px] w-[72px] rounded-full border border-[#8d1515]/[0.12]" />
              <div className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#8d1515]/25 bg-[#fdfaf7] shadow-[0_4px_20px_rgba(141,21,21,0.045)] transition-all duration-500 group-hover:scale-105 group-hover:border-[#8d1515]/55 group-hover:shadow-[0_0_0_8px_rgba(141,21,21,0.045)]">
                <Eye className="h-[23px] w-[23px] text-burgundy-primary transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />
              </div>
            </div>

            <div className="relative py-5">
              <h3 className="mt-4 text-3xl font-normal tracking-[-0.04em] text-navy-dark transition-colors duration-300 group-hover:text-burgundy-primary xl:text-4xl">
                Our Vision
              </h3>

              <p className="mt-4 max-w-md text-sm leading-7 text-cool-gray xl:text-[15px] xl:leading-8">
                A Commonwealth who shine with the divine light, living in the certainty of their calling,
                 unlimited by time or distance, 
                who influence their spheres with the love of Christ, His purpose and intent 
                by the power of the Holy Spirit.
              </p>
            </div>
          </div>

          {/* Closing accent */}
          <div className="mt-14 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-burgundy-primary/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-burgundy-primary/50" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-burgundy-primary/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
