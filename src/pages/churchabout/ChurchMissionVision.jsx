import React from "react";
import { Target, Eye, ArrowDown } from "lucide-react";

export default function ChurchMissionVision() {
  return (
    <section className="relative overflow-hidden bg-[#fdfaf7] py-16 sm:py-20">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-105 w-105 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8d1515]/5" />

      <div className="relative mx-auto max-w-360 px-6 lg:px-12">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">

          <h2 className="mt-3 text-4xl font-normal tracking-[-0.04em] text-navy-dark sm:text-5xl">
            Faith with a <span className="text-burgundy-primary">purpose.</span>
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-cool-gray">
            Everything we do flows from one desire — to know Christ deeply,
            make Him known boldly, and raise people who live with divine
            purpose.
          </p>
        </div>

        {/* Main Content */}
        <div className="relative mx-auto mt-12 max-w-5xl">

          {/* Center Line */}
          <div className="absolute left-1/2 top-6 hidden h-[calc(100%-12px)] w-px -translate-x-1/2 bg-[#8d1515]/15 md:block" />

          {/* Mission */}
          <div className="group relative grid grid-cols-[1fr_auto_1fr] items-center gap-8">

            <div className="text-right">
              <div className="flex items-center justify-end gap-3">
                <span className="h-px w-10 bg-burgundy-primary/30" />
              </div>

              <h3 className="mt-2 text-3xl font-normal tracking-[-0.03em] text-navy-dark sm:text-4xl">
                Our Mission
              </h3>

              <p className="ml-auto mt-3 max-w-md text-xs leading-6 text-cool-gray sm:text-sm">
                To know Christ and make Him known by teaching the truth of
                God's Word, equipping believers, and demonstrating Christ's
                love in our community and to the ends of the earth.
              </p>
            </div>

            {/* Center Icon */}
            <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#8d1515]/20 bg-[#fdfaf7] transition-all duration-700 group-hover:scale-110 group-hover:border-[#8d1515]/50 group-hover:shadow-[0_0_0_10px_rgba(141,21,21,0.04)]">
              <Target className="h-6 w-6 text-burgundy-primary transition-transform duration-700 group-hover:rotate-12" />
            </div>

            <div />
          </div>

          {/* Middle Connector */}
          <div className="relative z-10 my-7 flex justify-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8d1515] text-white shadow-md">
              <ArrowDown className="h-3 w-3 animate-bounce" />
            </div>
          </div>

          {/* Vision */}
          <div className="group relative grid grid-cols-[1fr_auto_1fr] items-center gap-8">

            <div />

            {/* Center Icon */}
            <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#8d1515]/20 bg-[#fdfaf7] transition-all duration-700 group-hover:scale-110 group-hover:border-[#8d1515]/50 group-hover:shadow-[0_0_0_10px_rgba(141,21,21,0.04)]">
              <Eye className="h-6 w-6 text-burgundy-primary transition-transform duration-700 group-hover:scale-110" />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-burgundy-primary/30" />
              </div>

              <h3 className="mt-2 text-3xl font-normal tracking-[-0.03em] text-navy-dark sm:text-4xl">
                Our Vision
              </h3>

              <p className="mt-3 max-w-md text-xs leading-6 text-cool-gray sm:text-sm">
                To raise a vibrant generation of spirit-filled believers who
                walk in authentic faith, transform their spheres of influence,
                and reflect the glory of God in character and purpose.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}