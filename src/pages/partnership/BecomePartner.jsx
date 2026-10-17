
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import PartnershipModal from "./PartnershipModal";

export default function BecomePartner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden mx-5 sm:mx-8 md:mx-15 my-8 bg-[#4a1515] rounded-[28px] p-7 sm:p-10 md:p-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-7 shadow-xl">
        <div className="partnership-cta-glow" aria-hidden="true" />
        <div className="relative z-10 max-w-125">
          <h3 className="text-white text-3xl md:text-4xl font-bold mb-3 tracking-tight leading-tight">
            You can be part of what comes next.
          </h3>
          <p className="text-[#fcdcdc] text-sm leading-relaxed">
            Your partnership today can help transform generations tomorrow.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative z-10 bg-white hover:bg-[#fce7e7] text-[#4a1515] font-bold px-6 py-4 rounded-full flex items-center justify-center gap-3 text-sm transition-all hover:-translate-y-1 w-full md:w-auto"
        >
          Become a Partner <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      <PartnershipModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
