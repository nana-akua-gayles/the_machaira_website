import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserAvatar from "./UserAvatar";
import logoImage from "../assets/images/mIcon.png";
import { searchAllContent } from "../lib/globalSearch";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/devotional", label: "Today's Devotional" },
  { to: "/newsfeed", label: "Newsfeed" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/forum", label: "Discussion Forum" },
  { to: "/partnership", label: "Be a Partner" },
  { to: "/about", label: "About Author" },
];

const emptySearchResults = {
  devotionals: [],
  articles: [],
  featuredArticles: [],
  forumPosts: [],
};

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(emptySearchResults);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const profileMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!profileMenuOpen) return;

    function handlePointerDown(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileMenuOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    searchInputRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeSearch();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen]);

  // Live search with a 350ms debounce.
  useEffect(() => {
    const query = searchQuery.trim();

    if (!searchOpen || query.length < 2) {
      setSearchResults(emptySearchResults);
      setSearchLoading(false);
      setSearchError(false);
      return;
    }

    let cancelled = false;

    const timeout = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError(false);

      try {
        const results = await searchAllContent(query);

        if (!cancelled) {
          setSearchResults(results);
        }
      } catch (error) {
        console.error("Global search failed:", error);

        if (!cancelled) {
          setSearchResults(emptySearchResults);
          setSearchError(true);
        }
      } finally {
        if (!cancelled) {
          setSearchLoading(false);
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [searchQuery, searchOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults(emptySearchResults);
    setSearchError(false);
  }

  function handleResultClick(type, item) {
    closeSearch();
    closeMenu();

    if (type === "devotional") {
      navigate(`/devotional/${item.id}`);
      return;
    }

    if (type === "forum") {
      navigate(`/forum/${item.id}`);
      return;
    }

    // Newsfeed and featured articles use the existing Newsfeed reader.
    navigate("/newsfeed", {
      state: {
        selectedSearchResult: {
          ...item,
          isFeatured: type === "featured",
        },
      },
    });
  }

  async function handleLogout() {
    await signOut();
    setProfileMenuOpen(false);
    closeMenu();
  }

  const searchGroups = [
    {
      title: "Devotionals",
      type: "devotional",
      items: searchResults.devotionals,
    },
    {
      title: "Newsfeed",
      type: "article",
      items: searchResults.articles,
    },
    {
      title: "Featured Articles",
      type: "featured",
      items: searchResults.featuredArticles,
    },
    {
      title: "Discussion Forum",
      type: "forum",
      items: searchResults.forumPosts,
    },
  ];

  const hasSearchResults = searchGroups.some(
    (group) => group.items.length > 0
  );

  return (
    <header
      className={`fixed top-0 left-0 w-full z-1000 transition-all duration-400 ${
        scrolled ? "top-3.5 px-3 sm:px-5 lg:px-6" : "p-0"
      } font-sans`}
    >
      <div
        className={`w-full flex items-center justify-between transition-all duration-400 ${
          scrolled
            ? "max-w-367.5 mx-auto min-h-19 px-5 lg:px-5.5 bg-white/90 border border-black/8 rounded-[22px] shadow-[0_12px_35px_rgba(0,0,0,0.09)] backdrop-blur-[20px]"
            : "min-h-23 px-4.5 lg:px-6 bg-white/96 border-none rounded-none shadow-none backdrop-blur-md"
        }`}
      >
        {/* LOGO */}
        <NavLink
          to="/"
          onClick={closeMenu}
          className={`relative flex items-center h-full no-underline text-navy-dark transition-transform duration-300 hover:-translate-y-px shrink-0 ${
            scrolled
              ? "basis-[clamp(155px,17vw,215px)]"
              : "basis-[clamp(170px,18vw,235px)]"
          }`}
        >
          <div className="relative h-full w-full flex items-center">
            <img
              src={logoImage}
              alt="Machaira Logo"
              className={`absolute top-1/2 left-0 -translate-y-1/2 w-auto max-w-none object-contain pointer-events-none transition-[height] duration-300 ${
                scrolled
                  ? "h-[clamp(150px,18vw,260px)]"
                  : "h-[clamp(165px,20vw,340px)]"
              }`}
            />
          </div>
        </NavLink>

        {/* DESKTOP NAVIGATION */}
        <nav
          className={`hidden lg:flex flex-1 min-w-0 items-center justify-center transition-all duration-300 ${
            scrolled ? "gap-6.5 mx-2" : "gap-7.5 mx-2.5"
          }`}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative no-underline text-[14px] ${
                  scrolled ? "py-6.75 text-[13.5px]" : "py-8.5"
                } font-medium whitespace-nowrap transition-all duration-250 hover:text-burgundy-primary hover:-translate-y-px ${
                  isActive
                    ? "text-[#a41414] font-semibold"
                    : "text-cool-gray"
                } after:content-[''] after:absolute after:left-1/2 ${
                  scrolled ? "after:bottom-4" : "after:bottom-5.75"
                } after:h-0.5 after:bg-[#a41414] after:-translate-x-1/2 transition-all duration-300 ${
                  isActive ? "after:w-7" : "after:w-0"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* PROFILE / SEARCH / MOBILE MENU */}
        <div className="flex items-center gap-3 shrink-0">
          {/* SEARCH ICON */}
          <button
            type="button"
            onClick={() => {
              setSearchOpen((prev) => !prev);
              setMenuOpen(false);
            }}
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-black/10 text-navy-dark hover:bg-black/5 transition-colors shrink-0 lg:ml-5"
          >
            {searchOpen ? (
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            )}
          </button>

          {/* DESKTOP PROFILE */}
          {user ? (
            <div className="relative hidden lg:block" ref={profileMenuRef}>
              <button
                type="button"
                className="flex items-center bg-transparent border-none p-0 cursor-pointer rounded-full"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                aria-label="Open profile menu"
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
              >
                <UserAvatar user={user} size={40} />
              </button>

              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-black/10 py-2 z-50 flex flex-col"
                  role="menu"
                >
                  <span className="px-4 py-2 text-xs text-gray-500 truncate border-b border-gray-100">
                    {user.email}
                  </span>

                  <button
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className={`hidden lg:flex items-center justify-center rounded-full bg-burgundy-primary text-white no-underline font-semibold whitespace-nowrap transition-all duration-250 hover:bg-[#7f0e0e] hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(153,19,19,0.18)] ${
                scrolled
                  ? "h-10.75 min-w-21 px-4 text-[14px]"
                  : "h-8.75 min-w-20.5 px-4.5 text-[14px]"
              }`}
            >
              Login
            </NavLink>
          )}

          {/* MOBILE HAMBURGER */}
          <button
            type="button"
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 bg-transparent border-none cursor-pointer p-2 z-50"
            onClick={() => {
              setMenuOpen((prev) => !prev);
              setSearchOpen(false);
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`w-6 h-0.5 bg-[#222] transition-transform duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-[#222] transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-[#222] transition-transform duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* LIVE SEARCH PANEL */}
      <div
        className={`absolute top-full left-0 right-0 px-4 pt-3 transition-all duration-300 ${
          searchOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-black/10 shadow-xl overflow-hidden">
          <div className="flex items-center gap-3 p-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-gray-400"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search devotionals, articles, discussions..."
              aria-label="Search Machaira"
              className="flex-1 min-w-0 outline-none border-none bg-transparent text-sm text-navy-dark"
            />

            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-xl transition-colors"
            >
              ×
            </button>
          </div>

          {searchQuery.trim().length > 0 && (
            <div className="max-h-[65vh] overflow-y-auto border-t border-black/5">
              {searchQuery.trim().length < 2 ? (
                <p className="px-5 py-4 text-sm text-gray-500">
                  Type at least 2 characters to search.
                </p>
              ) : searchLoading ? (
                <p className="px-5 py-5 text-sm text-gray-500">
                  Searching Machaira...
                </p>
              ) : searchError ? (
                <p className="px-5 py-5 text-sm text-red-600">
                  Search could not be completed. Please try again.
                </p>
              ) : !hasSearchResults ? (
                <p className="px-5 py-5 text-sm text-gray-500">
                  No results found for "{searchQuery.trim()}".
                </p>
              ) : (
                searchGroups.map((group) =>
                  group.items.length > 0 ? (
                    <section
                      key={group.title}
                      className="px-4 py-3 border-b border-black/5 last:border-b-0"
                    >
                      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        {group.title}
                      </h3>

                      <div className="space-y-1">
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              handleResultClick(group.type, item)
                            }
                            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <span className="block text-sm font-semibold text-navy-dark line-clamp-1">
                              {item.title}
                            </span>

                            {(item.category || item.subtitle) && (
                              <span className="block mt-1 text-xs text-gray-500 line-clamp-1">
                                {item.category || item.subtitle}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </section>
                  ) : null
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      <div
        className={`fixed inset-0 bg-white z-40 flex flex-col transition-all duration-300 lg:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none translate-x-full"
        }`}
      >
        {/* PANEL HEADER */}
        <div className="flex items-center justify-between px-6 h-20 shrink-0 border-b border-black/8">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cool-gray">
            Menu
          </span>

          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-black/10 text-navy-dark transition-colors hover:bg-black/5"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M1 1L14 14M14 1L1 14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* MOBILE PROFILE */}
        {user && (
          <div className="flex items-center gap-3 px-6 py-5 shrink-0 border-b border-black/8">
            <UserAvatar user={user} size={44} />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-navy-dark truncate">
                {user.email}
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-0.5 text-xs font-semibold text-burgundy-primary hover:text-[#7f0e0e] transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        )}

        {/* MOBILE NAVIGATION LINKS */}
        <nav className="flex-1 overflow-y-auto px-6 py-2">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                `group flex items-center justify-between gap-4 py-4 border-b border-black/6 no-underline transition-colors ${
                  isActive
                    ? "text-burgundy-primary"
                    : "text-navy-dark"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-4">
                    <span
                      className={`text-[11px] font-semibold tabular-nums ${
                        isActive
                          ? "text-burgundy-primary"
                          : "text-soft-gray"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-[16px] font-medium tracking-[-0.01em]">
                      {item.label}
                    </span>
                  </span>

                  <span
                    className={`text-base transition-all duration-200 ${
                      isActive
                        ? "text-burgundy-primary translate-x-0.5"
                        : "text-black/15 group-hover:text-burgundy-primary group-hover:translate-x-0.5"
                    }`}
                  >
                    →
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* MOBILE LOGIN */}
        {!user && (
          <div className="px-6 pt-4 pb-8 shrink-0 border-t border-black/8">
            <NavLink
              to="/login"
              onClick={closeMenu}
              className="w-full h-13 flex items-center justify-center rounded-full bg-burgundy-primary text-white text-base font-semibold no-underline shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Login
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
