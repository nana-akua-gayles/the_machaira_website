import React from "react";

export default function RightSidebar() {
  return (
    <div className="space-y-4">
      
      {/* THEME OF THE YEAR (Sits at the very top right of the page) */}
      <div className="bg-white p-4 rounded-xl border border-black/5 shadow-xs relative overflow-hidden">
        <h3 className="text-[9px] font-semibold uppercase tracking-[0.15em] text-burgundy-primary mb-2">
          Theme of the Year
        </h3>
        <div>
          <p className="text-base font-normal italic text-charcoal-text leading-snug mb-1.5">
            "A Year of Divine Acceleration & Overflowing Grace."
          </p>
          <p className="text-[10px] text-cool-gray">
            Isaiah 60:22 — When the time is right, I, the Lord, will make it happen.
          </p>
        </div>
      </div>

      {/* UPCOMING EVENTS */}
      <div className="bg-white p-4 rounded-xl border border-black/5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[9px] font-semibold uppercase tracking-[0.15em] text-soft-gray">
            Upcoming Events
          </h3>
          <button className="text-[10px] font-medium text-burgundy-primary hover:underline">
            View All
          </button>
        </div>

        <div className="space-y-3 text-[11px]">
          {[
            {
              month: "MAY",
              day: "25",
              title: "Sunday Worship Service",
              time: "May 25, 2026 • 9:00 AM",
              location: "Machaira Auditorium"
            },
            {
              month: "JUN",
              day: "07",
              title: "Prayer & Fasting",
              time: "Jun 7, 2026 • 6:00 AM",
              location: "Online & In-Person"
            }
          ].map((event, idx) => (
            <div key={idx} className="flex items-start gap-2.5 pb-2.5 border-b border-black/5 last:border-0 last:pb-0">
              <div className="flex flex-col items-center justify-center bg-[#fffaf5] border border-burgundy-primary/20 rounded-lg px-2 py-1 text-burgundy-primary shrink-0">
                <span className="text-[7px] font-bold uppercase tracking-wider">{event.month}</span>
                <span className="text-xs font-semibold">{event.day}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-charcoal-text truncate">{event.title}</h4>
                <p className="text-[9px] text-cool-gray mt-0.5">{event.time}</p>
                <p className="text-[9px] text-cool-gray">{event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}