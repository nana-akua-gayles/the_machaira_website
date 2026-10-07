import React, { useState } from "react";

const VALUES = [
  {
    title: "Biblical Truth",
    description:
      "We are firmly rooted in Scripture as the absolute guide for faith, doctrine, and daily living.",
    position: "left-[2%] sm:left-[4%] top-[12%]",
  },
  {
    title: "Love in Action",
    description:
      "We demonstrate God's grace through genuine compassion, intentional service, and warm hospitality.",
    position: "right-[2%] sm:right-[4%] top-[8%]",
  },
  {
    title: "Faith in Community",
    description:
      "We believe we grow stronger together as a family, supporting, uplifting, and sharpening one another.",
    position: "right-[2%] sm:right-[4%] top-[52%]",
  },
  {
    title: "Impact Beyond",
    description:
      "We are commissioned to take the gospel outside the four walls, reaching cities and nations with hope.",
    position: "left-[2%] sm:left-[4%] top-[58%]",
  },
];

export default function ChurchCoreValues() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#fdfaf7] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-360 px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">

          {/* INTRO */}
          <div className="lg:col-span-4">
            <span className="mb-5 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8d1515]">
              What We Grow From
            </span>

            <h2 className="max-w-md text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#241516] sm:text-5xl lg:text-6xl">
              Rooted in faith.
              <br />
              <span className="text-[#8d1515]">Growing with purpose.</span>
            </h2>

            <p className="mt-7 max-w-md text-sm leading-7 text-[#6d6260] sm:text-base">
              Everything we are and everything we do grows from a foundation
              of Scripture, love, community, and a desire to make an impact
              beyond ourselves.
            </p>

            <div className="mt-9 h-px w-16 bg-[#8d1515]/40" />
          </div>

          {/* GARDEN WITH REAL SVG TREE */}
          <div className="relative lg:col-span-8">
            <div className="relative mx-auto h-130 sm:h-145 max-w-175 flex items-center justify-center">

              {/* SOFT GROUND GLOW */}
              <div className="absolute bottom-4 left-1/2 h-16 w-[75%] -translate-x-1/2 rounded-[50%] bg-[#8d1515]/5 blur-2xl" />

              {/* REAL ILLUSTRATED SVG TREE */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg
                  viewBox="0 0 500 500"
                  className="w-full h-full max-h-125 text-[#8d1515]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Roots */}
                  <path
                    d="M250 380C250 380 230 410 190 425M250 380C250 380 270 410 310 425M250 395C250 395 240 435 215 450M250 395C250 395 260 435 285 450"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="opacity-40"
                  />
                  
                  {/* Trunk & Main Branches */}
                  <path
                    d="M236 410C238 360 242 310 245 260C245 240 240 210 230 180M264 410C262 360 258 310 255 260C255 240 260 210 270 180"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="opacity-60"
                  />
                  <path
                    d="M250 330C230 300 180 270 140 275M250 280C280 250 330 230 370 245M250 220C220 190 170 180 130 200M250 200C280 170 330 160 370 190"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="opacity-50"
                  />
                  <path
                    d="M170 285C140 270 110 230 120 190M340 240C370 230 390 190 380 150M180 200C150 170 140 130 170 100M320 180C350 160 370 120 350 90"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-40"
                  />

                  {/* Foliage Canopies (Organic Tree Clusters) */}
                  <g className="opacity-20 fill-current">
                    <circle cx="160" cy="170" r="65" />
                    <circle cx="210" cy="110" r="75" />
                    <circle cx="290" cy="100" r="80" />
                    <circle cx="350" cy="160" r="70" />
                    <circle cx="250" cy="140" r="85" />
                  </g>
                </svg>
              </div>

              {/* INTERACTIVE VALUE LABELS */}
              {VALUES.map((value, index) => (
                <button
                  key={value.title}
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className={`absolute ${value.position} z-30 max-w-52.5 sm:max-w-57.5 text-left transition-all duration-500 cursor-pointer ${
                    active === index
                      ? "translate-y-1 opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <span
                    className={`block text-xl font-semibold tracking-right transition-colors duration-500 sm:text-2xl ${
                      active === index
                        ? "text-[#8d1515]"
                        : "text-[#332829]"
                    }`}
                  >
                    {value.title}
                  </span>

                  <span
                    className={`mt-2 block overflow-hidden text-xs leading-6 text-[#6d6260] transition-all duration-500 sm:text-sm ${
                      active === index
                        ? "max-h-28 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {value.description}
                  </span>

                  <span
                    className={`mt-3 block h-px bg-[#8d1515] transition-all duration-700 ${
                      active === index ? "w-12" : "w-0"
                    }`}
                  />
                </button>
              ))}

              {/* CENTER FOUNDATION BADGE */}
              <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 text-center bg-white/80 backdrop-blur-md px-5 py-2 rounded-full border border-[#8d1515]/20 shadow-sm">
                <span className="block text-[9px] font-semibold uppercase tracking-[0.3em] text-[#8d1515]">
                  Our Foundation
                </span>
                <span className="mt-0.5 block text-xs sm:text-sm font-semibold text-[#332829]">
                  Christ
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}