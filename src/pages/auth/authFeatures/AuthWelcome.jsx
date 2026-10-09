
import { BookOpen, UsersRound, Heart } from "lucide-react";

const highlights = [
  {
    icon: BookOpen,
    label: "Grow in the Word",
  },
  {
    icon: UsersRound,
    label: "Find Community",
  },
  {
    icon: Heart,
    label: "Be Inspired",
  },
];

function AuthWelcome() {
  return (
    <section
      aria-label="Welcome to Machaira"
      className="mt-10 w-full border-t border-[#E9E5E3] pt-8"
    >
      <div className="text-center">
        <div className="mb-3 flex items-center justify-center gap-3">
          <span className="h-px w-7 bg-[#D9B5B5]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#991313]">
            Welcome to Machaira
          </span>
          <span className="h-px w-7 bg-[#D9B5B5]" />
        </div>

        <h2 className="font-serif text-[26px] leading-tight tracking-[-0.03em] text-[#101A2B]">
          A Place to <span className="italic text-[#991313]">Belong.</span>
        </h2>

        <p className="mx-auto mt-3 max-w-[350px] text-[13px] leading-6 text-[#6B7280]">
          More than a platform. A community growing together
          in faith, wisdom, and God's Word.
        </p>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-2">
        {highlights.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 text-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F9EEEE] text-[#991313]">
              <Icon size={18} strokeWidth={1.6} />
            </div>

            <span className="text-[11px] font-medium leading-4 text-[#4D5057]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AuthWelcome;
