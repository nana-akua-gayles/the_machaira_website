import { ArrowRight } from "lucide-react";
import churchBuildingImg from "../../../src/assets/images/book1.png";

export default function ChurchHero({ onJoinCommunity }) {
  return (
    <section className="relative overflow-visible bg-[#f8f4ef]">
      <div className="church-about-hero relative min-h-[650px] sm:min-h-[550px] lg:h-127.5">

        {/* Background Image */}
        <img
          src={churchBuildingImg}
          alt="Our Church"
          className="church-about-hero-image absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Left Light Gradient */}
        <div className="church-about-hero-gradient absolute inset-0 lg:inset-y-0 lg:left-0 lg:w-[65%] lg:bg-linear-to-r lg:from-[#f8f4ef] lg:via-[#f8f4ef]/90 lg:to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-350 items-end px-6 pb-14 pt-24 sm:min-h-[550px] sm:px-8 lg:h-full lg:min-h-0 lg:items-center lg:px-16 lg:py-0">
          <div className="church-hero-mobile-content max-w-130">

            <span className="church-about-hero-copy text-[10px] font-bold uppercase tracking-[0.18em] text-[#8d1515] sm:text-[11px]">
              The Commonwealth Digital Church
            </span>

            <h1 className="church-about-hero-copy mt-4 text-[clamp(2.6rem,11vw,4rem)] lg:text-[1.8rem] font-normal leading-[1.04] tracking-[-0.035em] text-[#171717] sm:text-[2.5rem] lg:text-[2.9rem]">
              Beyond the <span className="text-[#8d1515]">Hieron, </span>
              within your <span className="text-[#8d1515]">Reach</span>
            </h1>

            <div className="my-5 h-px w-8 bg-[#8d1515]" />

            <p className="church-about-hero-muted max-w-96.25 text-[13px] leading-[1.7] text-[#57524e] sm:text-[13px]">
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