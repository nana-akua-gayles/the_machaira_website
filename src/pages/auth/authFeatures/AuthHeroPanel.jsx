import heroChurchImage from "../../../assets/images/cross.png"; // ← replace with your real image path
import { CommunityIcon, BookIcon, HeartIcon } from "./authIcons";

const features = [
  { label: "Join a growing community", Icon: CommunityIcon },
  { label: "Access exclusive teachings", Icon: BookIcon },
  { label: "Stay inspired every day", Icon: HeartIcon },
];

function AuthHeroPanel({ heading, subtitle }) {
  return (
    <div className="relative min-h-[640px] overflow-hidden lg:min-h-[860px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroChurchImage})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#F7F1E6]/85 via-[#F7F1E6]/40 to-[#EDE1CD]/90" />

      <div className="pointer-events-none absolute right-6 top-8 select-none text-[#C9B48A]/50">
        <svg viewBox="0 0 120 180" className="h-40 w-28" fill="none">
          <path
            d="M60 175C60 120 60 60 95 15M60 140c-20-5-35-20-38-40M70 105c18-3 33-15 40-32M52 90C34 84 22 70 20 52M74 60c14-2 26-11 32-24"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="pointer-events-none absolute bottom-6 right-10 select-none text-[#C9B48A]/50">
        <svg viewBox="0 0 120 160" className="h-32 w-24" fill="none">
          <path
            d="M60 155C60 110 60 55 95 15M60 120c-20-5-35-20-38-40M70 90c18-3 33-15 40-32M52 75C34 69 22 55 20 37"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative flex h-full flex-col justify-between p-8 lg:p-12">
        <div>
          <h1 className="max-w-[440px] text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-[#101A2B] md:text-5xl lg:text-[56px]">
            {heading}
          </h1>

          <div className="mt-6 h-[3px] w-14 bg-[#991313]" />

          <p className="mt-6 max-w-[380px] text-sm leading-6 text-[#4D5057]">
            {subtitle}
          </p>
        </div>

        <div className="mt-10">
          <div className="max-w-[320px] rounded-2xl bg-white/85 p-5 shadow-[0_8px_30px_rgba(16,26,43,0.08)] backdrop-blur-sm">
            <span className="font-serif text-3xl leading-none text-[#991313]">"</span>
            <p className="mt-1 text-sm italic leading-relaxed text-[#101A2B]">
              Where two or three gather in my name, there am I with them.
            </p>
            <p className="mt-3 text-xs font-semibold text-[#991313]">
              — Matthew 18:20
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            {features.map(({ label, Icon }, index) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#991313]/30 bg-white/60 text-[#991313]">
                  <Icon />
                </span>
                <span className="max-w-[120px] text-xs leading-5 text-[#101A2B]">
                  {label}
                </span>
                {index < features.length - 1 && (
                  <span className="ml-5 hidden h-8 w-px bg-[#101A2B]/10 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthHeroPanel;