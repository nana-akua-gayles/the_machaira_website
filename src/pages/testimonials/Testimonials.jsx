import { useState } from "react";
import devotionalHero from "../../assets/devotionalImages/devotional-hero.png";

const mockTestimonials = [
  {
    id: 1,
    name: "Grace A.",
    category: "Faith",
    content:
      "Machaira devotionals came into my life at my lowest point. The message on faith reminded me that God still had a plan for me. Today, I walk in a new season of purpose and peace.",
    date: "May 12, 2026",
    likes: 128,
    comments: 24,
    initials: "GA",
  },
  {
    id: 2,
    name: "Michael T.",
    category: "Breakthrough",
    content:
      "After years of waiting and prayers, God answered! I got the job I had been believing for, and I know it was the teachings on patience and trust that kept me going.",
    date: "May 10, 2026",
    likes: 96,
    comments: 18,
    initials: "MT",
  },
  {
    id: 3,
    name: "Abena K.",
    category: "Healing",
    content:
      "God healed me completely from a chronic illness. I stand today as a testimony that His word is still working mightily.",
    date: "May 9, 2026",
    likes: 142,
    comments: 32,
    initials: "AK",
  },
  {
    id: 4,
    name: "Linda O.",
    category: "Deliverance",
    content:
      "The prayers and devotionals gave me strength to leave an abusive situation. God delivered me and restored my dignity. I am forever grateful.",
    date: "May 8, 2026",
    likes: 87,
    comments: 16,
    initials: "LO",
  },
  {
    id: 5,
    name: "Joseph D.",
    category: "Provision",
    content:
      "I was drowning in debt and had lost all hope. Through the messages on God's provision, I learned to trust again. Today, my finances are stable and I'm debt-free!",
    date: "May 7, 2026",
    likes: 112,
    comments: 22,
    initials: "JD",
  },
  {
    id: 6,
    name: "Sarah M.",
    category: "Purpose",
    content:
      "The series on purpose changed everything. I discovered my God-given calling and stepped out in faith. My life has never been the same.",
    date: "May 6, 2026",
    likes: 78,
    comments: 14,
    initials: "SM",
  },
];

const categories = [
  "All Stories",
  "Faith",
  "Healing",
  "Breakthrough",
  "Provision",
  "Deliverance",
  "Purpose",
  "Other",
];

const impactStats = [
  {
    value: "1,254",
    label: "Stories Shared",
    icon: "users",
  },
  {
    value: "32,876",
    label: "Lives Inspired",
    icon: "heart",
  },
  {
    value: "98",
    label: "Countries Reached",
    icon: "flame",
  },
];

function Testimonials() {
  const [activeCategory, setActiveCategory] = useState("All Stories");
  const [sortBy, setSortBy] = useState("Latest");
  const [dateFilter, setDateFilter] = useState("All Time");

  const filteredTestimonials =
    activeCategory === "All Stories"
      ? mockTestimonials
      : mockTestimonials.filter(
          (testimonial) => testimonial.category === activeCategory
        );

  return (
    <main className="min-h-screen bg-white text-[#101A2B]">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-[1350px] px-6 pt-7 lg:px-10">
          <div className="flex items-center gap-4 text-sm text-[#4D5057]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#991313]"
            >
              <path d="M3 10.5L12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
              <path d="M9 21v-6h6v6" />
            </svg>

            <span>/</span>
            <span>Testimonials</span>
          </div>
        </div>

        {/* Hero */}
        <div className="mx-auto mt-8 max-w-[1350px] px-6 lg:px-10">
          <div className="relative min-h-[330px] overflow-hidden rounded-[28px] bg-[#F8F7F5]">
            {/* Image */}
            <div className="absolute inset-y-0 right-0 w-full lg:w-[62%]">
              <img
                src={devotionalHero}
                alt=""
                className="h-full w-full object-cover"
              />

              {/* Image fade */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#F8F7F5] via-[#F8F7F5]/75 to-transparent lg:from-[#F8F7F5] lg:via-[#F8F7F5]/25" />
            </div>

            {/* Decorative glow */}
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#991313]/5 blur-3xl" />

            {/* Hero content */}
            <div className="relative z-10 flex min-h-[330px] items-center px-8 py-12 sm:px-12 lg:w-[55%] lg:px-16">
              <div className="max-w-[570px]">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#991313]">
                  Testimonials
                </p>

                <h1 className="font-serif text-4xl leading-[1.08] tracking-[-0.04em] text-[#101A2B] sm:text-5xl lg:text-[52px]">
                  Real Stories.
                  <br />
                  Real{" "}
                  <span className="text-[#991313]">
                    Transformations.
                  </span>
                </h1>

                <div className="mt-5 h-[2px] w-9 bg-[#991313]" />

                <p className="mt-5 max-w-[500px] text-sm leading-7 text-[#4D5057] sm:text-[15px]">
                  Read how God is changing lives through His word,
                  grace, and the Machaira community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}
      <section className="mx-auto max-w-[1350px] px-6 pb-20 pt-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}
          <div className="min-w-0">
            {/* Toolbar */}
            <div className="mb-5 flex flex-col gap-4 border-b border-[#E5E7EB] pb-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const active = activeCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                        active
                          ? "border-[#991313] bg-[#991313] text-white"
                          : "border-[#E5E7EB] bg-white text-[#4D5057] hover:border-[#991313] hover:text-[#991313]"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              <div className="flex shrink-0 items-center gap-3 text-sm">
                <span className="text-[#6B7280]">Sort by:</span>

                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm text-[#101A2B] outline-none focus:border-[#991313]"
                >
                  <option>Latest</option>
                  <option>Most Liked</option>
                  <option>Most Discussed</option>
                </select>
              </div>
            </div>

            {/* Results */}
            {filteredTestimonials.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredTestimonials.map((testimonial, index) => (
                  <article
                    key={testimonial.id}
                    className="group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D7B4B4] hover:shadow-[0_15px_40px_rgba(16,26,43,0.07)]"
                  >
                    {/* Quote */}
                    <div>
                      <div className="font-serif text-5xl leading-none text-[#991313]">
                        “
                      </div>

                      <p className="mt-2 font-serif text-[16px] leading-7 text-[#202735]">
                        {testimonial.content}
                      </p>
                    </div>

                    {/* Bottom */}
                    <div className="mt-8">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3E7E7] text-xs font-semibold text-[#991313]">
                          {testimonial.initials}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-[#101A2B]">
                            {testimonial.name}
                          </p>

                          <p className="mt-0.5 text-xs text-[#991313]">
                            {testimonial.category}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-[#E5E7EB] pt-4">
                        <span className="text-xs text-[#6B7280]">
                          {testimonial.date}
                        </span>

                        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                          <span className="flex items-center gap-1.5">
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            >
                              <path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7C3.2 5.6 5.3 4 7.8 4c1.6 0 3.1.8 4.2 2.1C13.1 4.8 14.6 4 16.2 4c2.5 0 4.6 1.6 4.6 4.7Z" />
                            </svg>
                            {testimonial.likes}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            >
                              <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 2v-4.5A7.5 7.5 0 1 1 20 11.5Z" />
                            </svg>
                            {testimonial.comments}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botanical decoration */}
                    {index % 3 === 0 && (
                      <div className="pointer-events-none absolute -bottom-5 -right-2 opacity-[0.08]">
                        <svg
                          width="90"
                          height="100"
                          viewBox="0 0 90 100"
                          fill="none"
                        >
                          <path
                            d="M15 96C28 69 48 42 79 14"
                            stroke="#991313"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M28 73C18 62 11 60 5 61C9 70 17 75 28 73Z"
                            fill="#991313"
                          />
                          <path
                            d="M40 58C31 48 29 40 31 34C40 39 44 48 40 58Z"
                            fill="#991313"
                          />
                          <path
                            d="M54 43C48 31 50 24 54 20C61 28 61 36 54 43Z"
                            fill="#991313"
                          />
                          <path
                            d="M66 31C65 20 69 14 74 11C77 20 74 27 66 31Z"
                            fill="#991313"
                          />
                        </svg>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-[#D1D5DB] text-center">
                <div>
                  <p className="font-serif text-xl text-[#101A2B]">
                    No stories found
                  </p>
                  <p className="mt-2 text-sm text-[#6B7280]">
                    Try another testimonial category.
                  </p>
                </div>
              </div>
            )}

            {/* Load More */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-3 rounded-xl border border-[#991313] px-6 py-3 text-sm font-medium text-[#991313] transition-all hover:bg-[#991313] hover:text-white"
              >
                Load More Stories

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* =====================================================
              SIDEBAR
          ====================================================== */}
          <aside className="space-y-4">
            {/* Share testimony */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
              <p className="font-serif text-lg text-[#101A2B]">
                Share Your Testimony
              </p>

              <div className="mt-3 h-[2px] w-8 bg-[#991313]" />

              <p className="mt-4 text-sm leading-6 text-[#4D5057]">
                Your story can inspire someone else today. Share
                what God has done in your life.
              </p>

              <button
                type="button"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#991313] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#7F0E0E]"
              >
                Share Your Story

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2l-7 20-4-9-9-4 20-7Z" />
                </svg>
              </button>

              <p className="mt-4 text-xs leading-5 text-[#6B7280]">
                Your story is safe with us and may be featured on
                our platform.
              </p>
            </div>

            {/* Impact */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
              <p className="font-serif text-lg text-[#101A2B]">
                Testimonies Impact
              </p>

              <div className="mt-3 h-[2px] w-8 bg-[#991313]" />

              <div className="mt-5 space-y-5">
                {impactStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F8EDED] text-[#991313]">
                      {stat.icon === "users" && (
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      )}

                      {stat.icon === "heart" && (
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        >
                          <path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7C3.2 5.6 5.3 4 7.8 4c1.6 0 3.1.8 4.2 2.1C13.1 4.8 14.6 4 16.2 4c2.5 0 4.6 1.6 4.6 4.7Z" />
                        </svg>
                      )}

                      {stat.icon === "flame" && (
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        >
                          <path d="M12 22c4.4 0 8-3.3 8-7.5 0-3.3-2.2-5.8-5.1-8.3.1 2.1-.8 3.7-2.1 4.6.1-4-2.2-7-4.8-8.8.2 3.7-3 6.4-3 10.3C5 17.8 8.1 22 12 22Z" />
                        </svg>
                      )}
                    </div>

                    <div>
                      <p className="text-lg font-semibold text-[#101A2B]">
                        {stat.value}
                      </p>

                      <p className="text-xs text-[#6B7280]">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date filter */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
              <p className="font-serif text-lg text-[#101A2B]">
                Filter by Date
              </p>

              <div className="mt-3 h-[2px] w-8 bg-[#991313]" />

              <div className="relative mt-5">
                <select
                  value={dateFilter}
                  onChange={(event) =>
                    setDateFilter(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 pr-10 text-sm text-[#4D5057] outline-none focus:border-[#991313]"
                >
                  <option>All Time</option>
                  <option>This Month</option>
                  <option>Last 3 Months</option>
                  <option>This Year</option>
                </select>

                <svg
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Testimonials;