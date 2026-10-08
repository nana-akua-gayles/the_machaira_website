import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function WelcomeBanner({ onVisitSunday }) {
  return (
    <section className="bg-[#fdfaf7] py-14 sm:py-16">
      <div className="mx-auto max-w-360 px-6 lg:px-12">
        <div className="group relative overflow-hidden rounded-[26px] bg-[#74191d] px-6 py-9 text-white sm:px-9 sm:py-10 lg:px-12 lg:py-11">
          
          {/* Botanical detail */}
          <div className="pointer-events-none absolute -right-2 bottom-4.5 opacity-[0.16] transition-all duration-1200 group-hover:translate-x-2 group-hover:-rotate-2">
            <div className="relative h-44 w-44">
              <div className="absolute bottom-0 left-1/2 h-40 w-px origin-bottom rotate-18 bg-white/80" />

              <div className="absolute bottom-20 left-10 h-10 w-20 rotate-[-28deg] rounded-[100%_0] border border-white/70" />
              <div className="absolute bottom-28 left-20 h-9 w-16 rotate-18 rounded-[100%_0] border border-white/70" />
              <div className="absolute bottom-12 right-1 h-9 w-16 rotate-38 rounded-[100%_0] border border-white/70" />
              <div className="absolute bottom-32 right-8 h-7 w-12 -rotate-35 rounded-[100%_0] border border-white/70" />

              <div className="absolute bottom-24 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border border-white/70" />
              <div className="absolute bottom-22.5 left-19.5 h-3 w-3 rounded-full bg-white/70" />
            </div>
          </div>

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-white/50" />
                <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/65">
                  You're Welcome Here
                </span>
              </div>

              <h2 className="mt-4 max-w-3xl text-[2.35rem] font-normal leading-none tracking-[-0.04em] sm:text-4xl lg:text-[3.6rem]">
                There is a place
                <br />
                <span className="text-white/55">for you here.</span>
              </h2>

              <p className="mt-5 max-w-lg text-[11px] leading-[1.8] text-white/65 sm:text-xs">
                Whether you're discovering faith, returning to church, or
                searching for a family to call your own — come and experience
                what God is doing among us.
              </p>
            </div>

            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <button
                onClick={onVisitSunday}
                className="group/btn inline-flex items-center gap-4 rounded-full bg-white px-5 py-2.5 text-[#74191d] shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(0,0,0,0.18)]"
              >
                <span className="text-[9px] font-bold uppercase tracking-[0.15em]">
                  Visit Us This Saturday
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#74191d] text-white transition-transform duration-500 group-hover/btn:rotate-45">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}