import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import devotionalHero from "../../assets/devotionalImages/devotional-hero.png";
import TestimonyModal from "./testimonialsFeatures/TestimonyModal";
import ShareTestimonyModal from "./testimonialsFeatures/ShareTestimonyModal";
import { useAuth } from "../../context/AuthContext";
import TestimonyLikesButton from "./testimonialsFeatures/TestimonyLikesButton";
import SavedCategorySearch from "./testimonialsFeatures/SavedCategorySearch";
import DraggableShareButton from "./testimonialsFeatures/DraggableShareButton";
import {
  getTestimonies,
  getTestimonyStats,
  getUserLikes,
} from "../../lib/testimoniesService";

const PAGE_SIZE = 12;

function previewText(text, limit = 120) {
  if (!text || text.length <= limit) return text || "";
  return `${text.slice(0, limit).trimEnd()}...`;
}

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

  const date = new Date(isoString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Prevent older requests from overwriting newer results.
  const requestIdRef = useRef(0);

  // Fetch testimonies for the selected page and filters.
  const fetchTestimonies = useCallback(
    async (requestedPage = page) => {
      const requestId = ++requestIdRef.current;

      setLoading(true);
      setError(null);

      try {
        const {
          data,
          error: fetchError,
          count,
        } = await getTestimonies({
          category: activeCategory,
          categorySearch,
          sortBy,
          dateFilter,
          limit: PAGE_SIZE,
          offset: requestedPage * PAGE_SIZE,
        });

        // Ignore a response if a newer request has started.
        if (requestId !== requestIdRef.current) return;

        if (fetchError) {
          setError("We couldn't load testimonies right now.");

          if (requestedPage === 0) {
            setTestimonials([]);
          }

          return;
        }

        const rows = Array.isArray(data) ? data : [];
        const shapedData = rows.map(shapeTestimony);

        if (requestedPage === 0) {
          // Replace results when loading the first page.
          setTestimonials(shapedData);
        } else {
          // Append the next page without duplicating existing cards.
          setTestimonials((previous) => {
            const existingIds = new Set(previous.map((item) => item.id));

            return [
              ...previous,
              ...shapedData.filter((item) => !existingIds.has(item.id)),
            ];
          });
        }

        setTotalCount(
          count ?? requestedPage * PAGE_SIZE + shapedData.length
        );
      } catch (err) {
        if (requestId !== requestIdRef.current) return;

        console.error("Error loading testimonies:", err);
        setError("We couldn't load testimonies right now.");

        if (requestedPage === 0) {
          setTestimonials([]);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [activeCategory, categorySearch, sortBy, dateFilter, page]
  );

  // Fetch whenever the selected page or filters change.
  useEffect(() => {
    fetchTestimonies();
  }, [fetchTestimonies]);

  // Reset pagination whenever a filter changes.
  useEffect(() => {
    setPage(0);
  }, [activeCategory, sortBy, dateFilter, categorySearch]);

  // Fetch the current user's likes for the displayed testimonies.
  useEffect(() => {
    let cancelled = false;

    if (!user || testimonials.length === 0) {
      setUserLikes(new Set());
      return;
    }

    const ids = testimonials.map((testimony) => testimony.id);

    getUserLikes(user.id, ids)
      .then(({ data, error: likesError }) => {
        if (!cancelled && !likesError) {
          setUserLikes(data ?? new Set());
        }
      })
      .catch((err) => {
        console.error("Error loading testimony likes:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [user, testimonials]);

  // Fetch impact statistics, excluding community- and country-related items.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data, error: statsError } = await getTestimonyStats();

        if (cancelled || statsError || !data) return;

        setImpactStats(
          data.filter((stat) => {
            const label = stat.label?.toLowerCase() ?? "";

            return (
              !label.includes("communit") &&
              !label.includes("countr")
            );
          })
        );
      } catch (err) {
        console.error("Error loading testimony statistics:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTestimonials = testimonials;
  const hasMore = testimonials.length < totalCount;

  // Refresh the first page after a testimony is submitted.
  const refreshTestimonials = () => {
    if (page !== 0) {
      setPage(0);
    } else {
      fetchTestimonies(0);
    }
  };

  return (
    <main className="min-h-screen bg-white text-navy-dark">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto mt-8 max-w-[1350px] px-0 lg:px-10">
          <div className="relative min-h-[330px] overflow-hidden rounded-none bg-[#F8F7F5] lg:rounded-[28px]">
            <div className="absolute inset-y-0 right-0 w-full lg:w-[62%]">
              <img
                src={devotionalHero}
                alt=""
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#F8F7F5]/95 via-[#F8F7F5]/75 to-[#F8F7F5]/30 lg:from-[#F8F7F5] lg:via-[#F8F7F5]/25 lg:to-transparent" />
            </div>

            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-burgundy-primary/5 blur-3xl" />

            <div className="relative z-10 flex min-h-[330px] items-center px-8 py-12 sm:px-12 lg:w-[55%] lg:px-16">
              <div className="max-w-[570px]">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-burgundy-primary">
                  Testimonials
                </p>

                <h1 className="text-2xl leading-[1.08] tracking-[-0.04em] text-navy-dark sm:text-3xl lg:text-[32px]">
                  Real Stories.
                  <br />
                  Lasting{" "}
                  <span className="text-burgundy-primary">
                    Transformations.
                  </span>
                </h1>

                <div className="mt-5 h-0.5 w-9 bg-burgundy-primary" />

                <p className="mt-5 max-w-125 text-sm leading-7 text-cool-gray sm:text-[15px]">
                  These are footprints of men and women who walked through
                  fire and found God standing in the flame. Souls once
                  shattered, now stitched with grace. Lives once lost, now
                  lit with purpose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-[1350px] px-6 pb-20 pt-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
          {/* TESTIMONIES */}
          <div className="min-w-0">
            <div className="mb-5 border-b border-[#E5E7EB] pb-5">
              <SavedCategorySearch
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                categorySearch={categorySearch}
                onSearchChange={setCategorySearch}
              />

              <div className="mt-4 flex min-w-0 items-center justify-between gap-2">
                <span className="shrink-0 text-[11px] font-semibold text-[#4D5057] sm:text-sm">
                  Testimonies
                </span>

                <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
                  <label htmlFor="testimony-sort" className="sr-only">
                    Sort by
                  </label>

                  <select
                    id="testimony-sort"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="min-w-0 max-w-[116px] rounded-full border border-[#E5E7EB] bg-white px-2 py-2 text-[11px] text-navy-dark outline-none focus:border-burgundy-primary sm:max-w-none sm:px-4 sm:text-sm"
                  >
                    <option value="Latest">Latest</option>
                    <option value="Most Liked">Most Liked</option>
                    <option value="Most Discussed">Most Discussed</option>
                  </select>

                  <label htmlFor="testimony-date-mobile" className="sr-only">
                    Filter by date
                  </label>

                  <select
                    id="testimony-date-mobile"
                    value={dateFilter}
                    onChange={(event) => setDateFilter(event.target.value)}
                    className="min-w-0 max-w-[125px] rounded-full border border-[#E5E7EB] bg-white px-2 py-2 text-[11px] text-navy-dark outline-none focus:border-burgundy-primary sm:hidden"
                  >
                    <option>All Time</option>
                    <option>This Month</option>
                    <option>Last 3 Months</option>
                    <option>This Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* RESULTS */}
            {loading && filteredTestimonials.length === 0 ? (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="min-h-[210px] animate-pulse rounded-xl border border-[#E5E7EB] bg-[#F8F7F5] sm:min-h-[280px] sm:rounded-2xl"
                  />
                ))}
              </div>
            ) : error && filteredTestimonials.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-[#D1D5DB] text-center">
                <div>
                  <p className="text-base text-navy-dark">{error}</p>

                  <button
                    type="button"
                    onClick={() => fetchTestimonies()}
                    className="mt-3 text-sm font-medium text-burgundy-primary underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : filteredTestimonials.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredTestimonials.map((testimonial, index) => (
                    <article
                      key={testimonial.id}
                      onClick={() => setActiveTestimonial(testimonial)}
                      className="group relative flex min-w-0 min-h-[210px] cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-2.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D7B4B4] hover:shadow-[0_15px_40px_rgba(16,26,43,0.07)] sm:min-h-[280px] sm:rounded-2xl sm:p-4"
                    >
                      {/* QUOTE */}
                      <div>
                        <div className="text-3xl leading-none text-burgundy-primary sm:text-4xl">
                          “
                        </div>

                        <p className="mt-1.5 break-words text-[11px] leading-[1.15rem] text-[#202735] sm:text-sm sm:leading-6">
                          {previewText(testimonial.content, 120)}
                        </p>
                      </div>

                      {/* AUTHOR AND ENGAGEMENT */}
                      <div className="mt-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F3E7E7] text-[9px] font-semibold text-burgundy-primary sm:h-8 sm:w-8 sm:text-[10px]">
                            {testimonial.avatarUrl ? (
                              <img
                                src={testimonial.avatarUrl}
                                alt={testimonial.name}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              testimonial.initials
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="break-words text-[10px] font-semibold text-navy-dark sm:text-xs">
                              {testimonial.name}
                            </p>

                            <p className="mt-0.5 break-words text-[9px] text-burgundy-primary sm:text-[11px]">
                              {testimonial.category}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1.5 border-t border-[#E5E7EB] pt-2.5 sm:mt-4 sm:pt-3">
                          <span className="text-[9px] text-[#6B7280] sm:text-[11px]">
                            {testimonial.date}
                          </span>

                          <div className="flex items-center gap-2 text-[9px] text-[#6B7280] sm:gap-3 sm:text-[11px]">
                            <TestimonyLikesButton
                              testimonyId={testimonial.id}
                              liked={userLikes.has(testimonial.id)}
                              count={testimonial.likes}
                              onRequireAuth={() => setRequireAuthPrompt(true)}
                              onChange={(liked) => {
                                setTestimonials((previous) =>
                                  previous.map((item) =>
                                    item.id === testimonial.id
                                      ? {
                                          ...item,
                                          likes: Math.max(
                                            0,
                                            item.likes + (liked ? 1 : -1)
                                          ),
                                        }
                                      : item
                                  )
                                );

                                setUserLikes((previous) => {
                                  const next = new Set(previous);

                                  if (liked) {
                                    next.add(testimonial.id);
                                  } else {
                                    next.delete(testimonial.id);
                                  }

                                  return next;
                                });
                              }}
                            />

                            <span className="flex items-center gap-1">
                              <svg
                                width="13"
                                height="13"
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

                      {/* BOTANICAL DECORATION */}
                      {index % 3 === 0 && (
                        <div className="pointer-events-none absolute -bottom-5 -right-2 opacity-[0.08]">
                          <svg
                            width="75"
                            height="85"
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

                {/* LOAD MORE */}
                {error && (
                  <p className="mt-4 text-center text-sm text-red-600">
                    {error}
                  </p>
                )}

                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setPage((previous) => previous + 1)}
                      className="inline-flex items-center gap-3 rounded-xl border border-burgundy-primary px-5 py-2.5 text-xs font-medium text-burgundy-primary transition-all hover:bg-burgundy-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3 sm:text-sm"
                    >
                      {loading ? "Loading..." : "Load More Stories"}

                      {!loading && (
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
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : error ? (
              <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-[#D1D5DB] text-center">
                <div>
                  <p className="text-base text-navy-dark">{error}</p>
                  <button
                    type="button"
                    onClick={() => fetchTestimonies()}
                    className="mt-3 text-sm font-medium text-burgundy-primary underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-[#D1D5DB] text-center">
                <div>
                  <p className="text-lg text-navy-dark">No stories found</p>
                  <p className="mt-2 text-sm text-[#6B7280]">
                    Try another testimonial category.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-4">
            {/* SHARE TESTIMONY */}
            <div className="hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 lg:block">
              <p className="text-lg text-navy-dark">Share Your Testimony</p>

              <div className="mt-3 h-0.5 w-8 bg-burgundy-primary" />

              <p className="mt-4 text-sm leading-6 text-cool-gray">
                Your testimony is not just a memory, it is ministry.
                <br />
                It is proof that the valley can be walked through, and the
                fire can be walked out of.
              </p>

              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-burgundy-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#7F0E0E]"
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
            </div>

            {/* TESTIMONY IMPACT */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-6">
              <p className="text-base text-navy-dark sm:text-lg">
                Testimonies Impact
              </p>

              <div className="mt-3 h-0.5 w-8 bg-burgundy-primary" />

              <div className="mt-5 space-y-4 sm:space-y-5">
                {impactStats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8EDED] text-burgundy-primary sm:h-11 sm:w-11">
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
                    </div>

                    <div>
                      <p className="text-base font-semibold text-navy-dark sm:text-lg">
                        {stat.value}
                      </p>
                      <p className="text-[11px] text-[#6B7280] sm:text-xs">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DATE FILTER */}
            <div className="hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:block">
              <p className="text-lg text-navy-dark">Filter by Date</p>

              <div className="mt-3 h-0.5 w-8 bg-burgundy-primary" />

              <div className="relative mt-5">
                <select
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 pr-10 text-sm text-cool-gray outline-none focus:border-burgundy-primary"
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

      {/* TESTIMONY DETAILS MODAL */}
      <TestimonyModal
        testimony={activeTestimonial}
        onClose={() => setActiveTestimonial(null)}
      />

      {/* MOBILE SHARE BUTTON */}
      <div className="lg:hidden">
        <DraggableShareButton onClick={() => setShareOpen(true)} />
      </div>

      {/* SHARE MODAL — rendered only once */}
      <ShareTestimonyModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        onSuccess={refreshTestimonials}
      />

      {/* SIGN-IN PROMPT */}
      {requireAuthPrompt && (
        <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 animate-[fadeIn_.25s_ease-out] rounded-full bg-[#101A2B] px-5 py-3 text-sm text-white shadow-lg">
          <Link
            to="/login"
            className="font-semibold text-[#F3E7E7] hover:underline"
          >
            Sign in
          </Link>{" "}
          to like testimonies.

          <button
            type="button"
            onClick={() => setRequireAuthPrompt(false)}
            className="ml-3 text-white/60 hover:text-white"
            aria-label="Dismiss sign-in message"
          >
            ✕
          </button>
        </div>
      )}
    </main>
  );
}

export default Testimonials;
