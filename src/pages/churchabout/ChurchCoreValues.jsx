import { useState } from "react";



const VALUES = [

  {

    title: "Truth",

    description:

      "We are firmly rooted in Scripture as the absolute guide for faith, doctrine, and daily living.",

    position: "left-[2%] sm:left-[4%] top-[12%]",

  },

  {

    title: "Love",

    description:

      "We demonstrate God's grace through genuine compassion, intentional service, and warm hospitality.",

    position: "right-[2%] sm:right-[4%] top-[8%]",

  },

  {

    title: "Faith",

    description:

      "We believe we grow stronger together as a family, supporting, uplifting, and sharpening one another.",

    position: "right-[2%] sm:right-[4%] top-[52%]",

  },

  {

    title: "Impact",

    description:

      "We are commissioned to take the gospel outside the four walls, reaching cities and nations with hope.",

    position: "left-[2%] sm:left-[4%] top-[58%]",

  },

];



export default function ChurchCoreValues() {

  const [active, setActive] = useState(0);



  return (

    <section className="relative overflow-hidden bg-[#fdfaf7] py-20 sm:py-24 lg:py-28">

      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">



                  {/* Mobile: the original desktop tree composition, adapted to fit the viewport. */}
          <div className="lg:hidden">
            <h2 className="max-w-md text-[clamp(2rem,9vw,3rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-[#241516]">
              Revealing Christ <span className="text-[#8d1515]">To the world</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#6d6260]">
              Everything we are and everything we do grows from a foundation of
              Scripture, love, community, and a desire to make an impact beyond ourselves.
            </p>

            {/* Labels remain arranged around the illustrated tree, just like desktop.
                A generous aspect ratio gives the branches and labels room to breathe. */}
            <div className="relative mx-auto mt-9 w-full max-w-[540px] aspect-[0.88] min-h-[410px] select-none">
              <div className="pointer-events-none absolute inset-[12%_8%_10%] flex items-center justify-center">
                <svg

                  viewBox="0 0 500 500"

                  className="h-full w-full text-[#8d1515]"

                  fill="none"

                  xmlns="http\://www.w3.org/2000/svg"

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
              <div className="pointer-events-none absolute bottom-[7%] left-1/2 h-10 w-[65%] -translate-x-1/2 rounded-[50%] bg-[#8d1515]/5 blur-xl" />
              {VALUES.map((value, index) => {
                const positions = [
                  "left-0 top-[10%] text-left",
                  "right-0 top-[7%] text-right",
                  "right-0 top-[56%] text-right",
                  "left-0 top-[61%] text-left",
                ];
                return (
                  <button
                    key={value.title}
                    type="button"
                    onClick={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    aria-pressed={active === index}
                    className={`absolute z-20 w-[42%] max-w-[190px] rounded-xl px-1 py-2 transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8d1515] ${positions[index]} ${active === index ? "opacity-100" : "opacity-70"}`}
                  >
                    <span className={`block text-[clamp(0.85rem,3.6vw,1.35rem)] font-semibold leading-tight tracking-tight transition-colors ${active === index ? "text-[#8d1515]" : "text-[#332829]"}`}>
                      {value.title}
                    </span>
                    <span className={`mt-1.5 block overflow-hidden text-[clamp(0.65rem,2.6vw,0.82rem)] leading-[1.5] text-[#6d6260] transition-all duration-500 ${active === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                      {value.description}
                    </span>
                    <span className={`mt-2 block h-px bg-[#8d1515] transition-all duration-500 ${active === index ? "w-10" : "w-0"} ${index === 1 || index === 2 ? "ml-auto" : ""}`} />
                  </button>
                );
              })}
              <div className="pointer-events-none absolute bottom-[2%] left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#8d1515]/20 bg-white/85 px-4 py-2 text-center shadow-sm backdrop-blur-sm">
                <span className="block whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.2em] text-[#8d1515]">Our Foundation</span>
                <span className="block text-sm font-semibold text-[#332829]">Christ</span>
              </div>
            </div>
          </div>

{/* Desktop: preserve the original tree and its interactive labels. */}

        <div className="hidden lg:block">

        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* INTRO */}
          <div className="lg:col-span-4">

            <h2 className="max-w-md text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#241516] sm:text-3xl lg:text-4xl">
              Revealing Christ
              <br />
              <span className="text-[#8d1515]">To the World.</span>
            </h2>

            <p className="mt-7 max-w-md text-sm leading-7 text-[#6d6260] sm:text-base">
              In the unfolding of His Word, light shines; in the shining of that light, we are established. These are the truths we 
              stand upon and the life we walk in: the convictions that make us one family, and that send us out to reign.
            </p>

            <div className="mt-9 h-px w-16 bg-[#8d1515]/40" />
          </div>

          {/* GARDEN WITH REAL SVG TREE */}
          <div className="relative lg:col-span-8">
            <div className="relative mx-auto h-[520px] sm:h-[580px] max-w-[700px] flex items-center justify-center">

              {/* SOFT GROUND GLOW */}
              <div className="absolute bottom-4 left-1/2 h-16 w-[75%] -translate-x-1/2 rounded-[50%] bg-[#8d1515]/5 blur-2xl" />

              {/* REAL ILLUSTRATED SVG TREE */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg
                  viewBox="0 0 500 500"
                  className="w-full h-full max-h-[500px] text-[#8d1515]"
                  fill="none"
                  xmlns="http\://www.w3.org/2000/svg"
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
                  className={`absolute ${value.position} z-30 max-w-[210px] sm:max-w-[230px] text-left transition-all duration-500 cursor-pointer ${
                    active === index
                      ? "translate-y-1 opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <span
                    className={`block text-xl font-semibold tracking-tight transition-colors duration-500 sm:text-2xl ${
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
      </div>
    </section>
  );
}