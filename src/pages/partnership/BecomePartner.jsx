import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function BecomePartner() {
  return (
    <section className="mx-15 my-8 bg-[#4a1515] rounded-2xl p-10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-md">
      <div className="max-w-125">
        <h3 className="text-white text-xl font-bold mb-1.5">You can be part of what comes next.</h3>
        <p className="text-[#fcdcdc] text-xs">Your partnership today can help transform generations tomorrow.</p>
      </div>
      <button className="bg-[#8b0000] hover:bg-[#700000] text-white font-semibold px-5 py-3 rounded-lg flex items-center gap-2 text-xs transition-colors">
        Become a Partner <ArrowRight className="w-4 h-4" />
      </button>
    </section>
  );
}