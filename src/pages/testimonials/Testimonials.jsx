import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import devotionalHero from "../../assets/devotionalImages/devotional-hero.png";
import TestimonyModal from "./testimonialsFeatures/TestimonyModal";
import ShareTestimonyModal from "./testimonialsFeatures/ShareTestimonyModal";
import { useAuth } from "../../context/AuthContext";
import TestimonyLikesButton from "./testimonialsFeatures/TestimonyLikesButton";
import {
  getTestimonies,
  getTestimonyStats,
  getUserLikes 
} from "../../lib/testimoniesService";

const categories = [
  "All Stories",
  "Faith",
  "Healing",
  "Breakthrough",
];

// ---- Helpers to shape raw Supabase rows into the shape your UI expects ----

function getInitials(name) {
  if (!name) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function formatDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Shape a Supabase row into the exact object shape the JSX already renders.
 * `is_anonymous` blanked-out name/initials is handled here.
 */
function shapeTestimony(row) {
  const profile = row.profiles ?? {};
  const anonymous = row.is_anonymous === true;

  const displayName = anonymous ? "Anonymous" : profile.name || "Believer";

  return {
    id: row.id,
    name: displayName,
    category: row.category ?? "Testimony",
    content: row.content ?? "",
    date: formatDate(row.created_at),
    likes: row.likes_count ?? 0,
    comments: row.comments_count ?? 0,
    initials: anonymous ? "AN" : getInitials(profile.name),
    avatarUrl: anonymous ? null : profile.avatar_url || null,
    attachedImageUrl: row.attached_image_url || null,
  };
}

function Testimonials() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All Stories");
  const [sortBy, setSortBy] = useState("Latest");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [categorySearch, setCategorySearch] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [userLikes, setUserLikes] = useState(new Set());
  const [requireAuthPrompt, setRequireAuthPrompt] = useState(false);

  const [testimonials, setTestimonials] = useState([]);
  const [impactStats, setImpactStats] = useState([
    { value: "—", label: "Stories Shared", icon: "users" },
    { value: "—", label: "Lives Inspired", icon: "heart" },
    { value: "—", label: "Countries Reached", icon: "flame" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const PAGE_SIZE = 12;

  // ---- Fetch testimonies whenever filters / page change ----
  const fetchTestimonies = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError, count } = await getTestimonies({
      category: activeCategory,
      categorySearch,
      sortBy,
      dateFilter,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    });

    if (fetchError) {
      setError("We couldn't load testimonies right now.");
      setTestimonials([]);
    } else {
      setTestimonials(data.map(shapeTestimony));
      setTotalCount(count ?? data.length);
    }

    setLoading(false);
  }, [activeCategory, sortBy, dateFilter, page, categorySearch]);

  useEffect(() => {
    fetchTestimonies();
  }, [fetchTestimonies]);

  // Reset to page 0 when filters change
  useEffect(() => {
    setPage(0);
  }, [activeCategory, sortBy, dateFilter, categorySearch]);

  // ---- Fetch user likes whenever the user or testimonials change ----
  useEffect(() => {
    if (!user || testimonials.length === 0) {
      setUserLikes(new Set());
      return;
    }
    const ids = testimonials.map((t) => t.id);
    getUserLikes(user.id, ids).then(({ data }) => setUserLikes(data));
  }, [user, testimonials]);

  // ---- Fetch sidebar impact stats once ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await getTestimonyStats();
      if (!cancelled && data) setImpactStats(data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // filteredTestimonials is now just `testimonials` — server already filtered.
  const filteredTestimonials = testimonials;

  const hasMore = testimonials.length < totalCount;
  
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
            <div className="flex flex-wrap items-center gap-2">
              {/* Category pills — unchanged */}
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

              {/* NEW: Search by category */}
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5" />
                  </svg>
                </span>

                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Search category..."
                  className="w-full rounded-full border border-[#E5E7EB] bg-white py-2 pl-9 pr-9 text-xs text-[#101A2B] placeholder:text-[#B9BEC8] outline-none transition-colors focus:border-[#991313] sm:w-[190px]"
                />

                {categorySearch && (
                  <button
                    type="button"
                    onClick={() => setCategorySearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#991313]"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                )}
              </div>
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
            {(() => {
              if (loading) {
                return (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="min-h-[340px] animate-pulse rounded-2xl border border-[#E5E7EB] bg-[#F8F7F5]"
                      />
                    ))}
                  </div>
                );
              }

              if (error) {
                return (
                  <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-[#D1D5DB] text-center">
                    <div>
                      <p className="font-serif text-xl text-[#101A2B]">{error}</p>
                      <button
                        type="button"
                        onClick={fetchTestimonies}
                        className="mt-3 text-sm font-medium text-[#991313] underline"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                );
              }

              if (filteredTestimonials.length > 0) {
                return (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredTestimonials.map((testimonial, index) => (
                      <article
                        key={testimonial.id}
                        onClick={() => setActiveTestimonial(testimonial)}
                        className="group relative flex min-h-[340px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D7B4B4] hover:shadow-[0_15px_40px_rgba(16,26,43,0.07)]"                    
                      >
                        {/* Quote */}
                        <div>
                          <div className="font-serif text-5xl leading-none text-[#991313]">
                            “
                          </div>

                          <p className="mt-2 font-serif text-[16px] leading-7 text-[#202735] line-clamp-6">
                            {testimonial.content}
                          </p>
                        </div>

                        {/* Bottom */}
                        <div className="mt-8">
                          <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F3E7E7] text-xs font-semibold text-[#991313]">
                            {testimonial.avatarUrl ? (
                              <img
                                src={testimonial.avatarUrl}
                                alt={testimonial.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  // If the image 404s, hide it so the initials behind show through
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              testimonial.initials
                            )}
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
                              <TestimonyLikesButton
                                testimonyId={testimonial.id}
                                liked={userLikes.has(testimonial.id)}
                                count={testimonial.likes}
                                onRequireAuth={() => setRequireAuthPrompt(true)}
                                onChange={(liked) => {
                                  setTestimonials((prev) =>
                                    prev.map((t) =>
                                      t.id === testimonial.id
                                        ? { ...t, likes: t.likes + (liked ? 1 : -1) }
                                        : t
                                    )
                                  );
                                  setUserLikes((prev) => {
                                    const next = new Set(prev);
                                    if (liked) next.add(testimonial.id);
                                    else next.delete(testimonial.id);
                                    return next;
                                  });
                                }}
                              />

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
                );
              }

              return (
                <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-[#D1D5DB] text-center">
                  <div>
                    <p className="font-serif text-xl text-[#101A2B]">No stories found</p>
                    <p className="mt-2 text-sm text-[#6B7280]">
                      Try another testimonial category.
                    </p>
                  </div>
                </div>
              );
            })()}
            {/* Load More */}
            {!loading && !error && hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
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
            )}
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
                onClick={() => setShareOpen(true)}
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
      {/* Testimony Modal */}
      <TestimonyModal
        testimony={activeTestimonial}
        onClose={() => setActiveTestimonial(null)}
      />

      {/* Share Testimony Modal */}
      <ShareTestimonyModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        onSuccess={() => {
          // Refresh the list so the new testimony appears immediately
          fetchTestimonies();
        }}
      />

      {requireAuthPrompt && (
        <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 rounded-full bg-[#101A2B] px-5 py-3 text-sm text-white shadow-lg animate-[fadeIn_.25s_ease-out]">
          <Link to="/login" className="font-semibold text-[#F3E7E7] hover:underline">
            Sign in
          </Link>{" "}
          to like testimonies.
          <button
            onClick={() => setRequireAuthPrompt(false)}
            className="ml-3 text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </main>
  );
}

export default Testimonials;