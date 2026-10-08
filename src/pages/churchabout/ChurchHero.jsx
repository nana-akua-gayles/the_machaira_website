import React from "react";
import { ArrowRight } from "lucide-react";
import churchBuildingImg from "../../../src/assets/images/book1.png";

export default function ChurchHero({ onJoinCommunity }) {
  return (
    <section className="relative overflow-visible bg-[#f8f4ef]">
      <div className="relative min-h-117.5 sm:min-h-112.5 lg:h-127.5">

        {/* Background Image */}
        <img
          src={churchBuildingImg}
          alt="Our Church"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Left Light Gradient */}
        <div className="absolute inset-y-0 left-0 w-[65%] bg-linear-to-r from-[#f8f4ef] via-[#f8f4ef]/90 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-350 items-center px-6 sm:px-8 lg:px-16">
          <div className="max-w-130">

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8d1515] sm:text-[11px]">
              The Commonwealth Digital Church
            </span>

            <h1 className="mt-4 text-[1.8rem] font-normal leading-[1.04] tracking-[-0.035em] text-[#171717] sm:text-[2.5rem] lg:text-[2.9rem]">
              Beyond the <span className="text-[#8d1515]">Hieron, </span>
              within your <span className="text-[#8d1515]">Reach</span>
            </h1>

            <div className="my-5 h-px w-8 bg-[#8d1515]" />

            <p className="max-w-96.25 text-[12px] leading-[1.7] text-[#57524e] sm:text-[13px]">
              The Commonwealth Digital Church is not a concession to convenience. It is the continuation of the 
              apostolic pattern: to reach men where they are, while forming them into who they must become in 
              Christ.
            </p>

            <button
              onClick={onJoinCommunity}
              className="group mt-5 inline-flex cursor-pointer items-center gap-3 rounded-full bg-[#8d1515] px-5 py-3 text-[10px] font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#741010]"
            >
              <span>Join Our Digital Church</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

          </div>
        </div>

      </div>

      <div className="h-20 bg-[#fdfbf8]" />
    </section>
  );
}