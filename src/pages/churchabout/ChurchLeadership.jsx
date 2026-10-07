import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import apostleImg from "../../../src/assets/images/Apostle3.jpg";

export default function ChurchLeadership({ onLearnMore }) {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#fdfaf7] py-24 sm:py-28">
      {/* Decorative background elements */}
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#8d1515]/4 blur-3xl animate-pulse" />
      <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#d9b9a3]/8 blur-3xl" />

      <div className="relative mx-auto max-w-360 px-6 lg:px-12">

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Image */}
          <div className="group relative lg:col-span-5">

            {/* Decorative frame */}
            <div className="absolute -left-3 -top-3 h-full w-full rounded-4xl border border-[#8d1515]/20 transition-all duration-700 group-hover:-left-5 group-hover:-top-5" />

            <div className="relative overflow-hidden rounded-4xl shadow-[0_25px_60px_rgba(50,25,15,0.15)]">

              <img
                src={apostleImg}
                alt="Apostle Bennie"
                className="h-105 w-full object-cover object-top transition-transform duration-1200 ease-out group-hover:scale-105"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-40" />

              {/* Floating label */}
              <div className="absolute bottom-5 left-5 translate-y-3 rounded-full border border-white/30 bg-white/90 px-5 py-2 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8d1515]">
                  The Lead Presbyter 
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7 lg:pl-6">

            {/* Eyebrow */}
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-burgundy-primary transition-all duration-700 hover:w-14" />
              <span className="text-[13px] font-bold uppercase tracking-[0.25em] text-burgundy-primary">
                A vessel Set Apart
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-[13px] font-normal tracking-[-0.04em] text-navy-dark sm:text-2xl lg:text-[2rem] lg:leading-[1.05]">
                Apostle Benjamin Nana Amissah Ansah
            </h2>

            {/* Animated line */}
            <div className="my-7 flex items-center gap-3">
              <div className="h-0.5 w-16 bg-burgundy-primary transition-all duration-1000 group-hover:w-24" />
              <div className="h-1.5 w-1.5 rounded-full bg-burgundy-primary" />
            </div>

            {/* Description */}
            <p className="max-w-xl text-sm leading-8 text-cool-gray sm:text-base">
              <span className="text-[53px] font-bold text-burgundy-primary">
              I</span>s
              a renowned transgenerational leader and Sound 
              Kingdom expositor with a mandate of influencing the techno-pluralistic society with 
              the intent of Christ through the saturation and filling of every heart with the 
              intrinsic knowledge of the fullness of the reigning life in Christ.
            </p>

            {/* Button */}
            <div className="mt-9">
              <button
                onClick={() => navigate("/about")}
                className="group inline-flex items-center gap-3 rounded-full bg-burgundy-primary px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_10px_30px_rgba(120,15,15,0.18)] transition-all duration-500 hover:-translate-y-1 hover:bg-[#741010] hover:shadow-[0_15px_35px_rgba(120,15,15,0.28)]"
              >
                <span>Read More</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}