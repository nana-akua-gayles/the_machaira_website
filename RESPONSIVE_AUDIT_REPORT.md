# Responsive Audit Report

**Project:** The Machaira Website  
**Audit date:** September 22, 2026  
**Scope:** Routed pages and shared navigation/footer at desktop, tablet, and mobile viewport sizes

## Executive Summary

No route produced document-level horizontal scrolling during the automated sweep. However, several pages contain elements wider than, or positioned outside, the available viewport. In multiple cases, `overflow-x-hidden` prevents a scrollbar while hiding or clipping content rather than allowing it to reflow.

The highest-priority issue is the devotional experience panel on `/devotional`: it is fixed at `330px` wide and absolutely positioned, so it extends beyond the available content area on small screens and overlays the hero. The login page also passes a fixed `380px` width to the Google Identity button, which is wider than a typical mobile viewport.

## Test Method

- Routes tested: `/`, `/about`, `/devotional`, `/previous-devotionals`, `/newsfeed`, `/forum`, `/partnership`, `/login`, `/testimonials`, and `/devotional/1`.
- Viewports tested: `375px`, `768px`, `1024px`, and `1440px` wide at `900px` high.
- Checks performed:
  - document `scrollWidth` versus viewport width;
  - child elements positioned outside the viewport;
  - fixed-width controls and panels;
  - mobile navigation and responsive grid behavior;
  - visual spot-check of the mobile devotional page.
- The browser reported usable CSS widths of `360px` and `753px` at the two narrowest tests because of the browser scrollbar.

## Findings

### High Priority

#### `/devotional`: experience panel clips on narrow screens

**Affected sizes:** `375px`, `768px`, and `1024px`  
**Components:** `src/pages/devotional/Devotional.jsx`, `src/pages/devotional/devotionalFeatures/DevotionalExperience.jsx`

`Devotional.jsx` places the experience panel in an absolutely positioned wrapper. `DevotionalExperience.jsx` sets the panel to a fixed `330px` width. At mobile width, the panel starts at approximately `-2px` and reaches approximately `328px` inside a usable `360px` viewport while the hero content itself is pushed to the right and measured beyond the viewport. The panel visually overlays the hero instead of participating in a responsive layout.

**Recommended fix:** move the panel into the normal mobile flow, or apply a mobile layout that uses `width: 100%` with a constrained `max-width`, static positioning, and horizontal page padding. Keep the absolute sidebar treatment only at larger breakpoints.

#### `/login`: Google sign-in control has a fixed mobile width

**Affected size:** `375px`  
**Component:** `src/pages/auth/authFeatures/GoogleSignInButton.jsx`

The Google Identity button is rendered with `width: 380`. That exceeds the available width of a typical mobile viewport once the auth card's horizontal padding is included. The audit could not fully validate the third-party iframe because the configured Google client rejected the local origin, but the fixed width is independently a responsive risk.

**Recommended fix:** use the available container width, for example `width: Math.min(380, containerWidth)`, or render the provider button in a full-width wrapper with CSS constraints.

### Medium Priority

#### `/about`: quote card overhangs the image at tablet widths

**Affected sizes:** `768px` and `1024px`  
**Component:** `src/pages/about/About.jsx`

The quote card uses `-right-4` on mobile and `-right-20` from the `sm` breakpoint. The card is intentionally allowed to overhang, but at tablet widths it can extend beyond the profile image and close to the page edge. This is decorative rather than a document overflow issue, but it can be clipped or visually detached on narrower tablet layouts.

**Recommended fix:** reduce the negative offset at tablet widths, or keep the card inside the image container until the layout reaches the large desktop breakpoint.

#### `/`: full-width hero relies on clipping at mobile width

**Affected size:** `375px`  
**Component:** `src/pages/home/Home.jsx` and the home hero section

The hero uses `w-screen` inside a page whose usable CSS width measured `360px`. The hero measured `375px` wide and began at approximately `-8px`; the page's `overflow-x-hidden` concealed the excess. The hero remains visible, but this is fragile and can cause edge clipping on devices with different scrollbar or safe-area behavior.

**Recommended fix:** use `width: 100%` for the hero, or use a full-bleed pattern that accounts for the parent padding without relying on negative overflow.

### Low Priority / Intentional Patterns

#### `/newsfeed`: horizontally scrollable category row

The category buttons intentionally use a horizontally scrollable row at small widths. This is responsive, but the row requires horizontal swiping to reveal all categories. Consider adding a subtle visual cue if discovering the additional categories is important.

#### `/previous-devotionals`: decorative absolute element

An absolute decorative element was measured outside the viewport bounds, but it did not create document scrolling or obscure the primary controls during the sweep.

#### `/testimonials`: decorative glow

The hero glow extends outside its normal box but is contained by `overflow-hidden`. No functional layout issue was observed.

## Route Status Matrix

| Route | Mobile | Tablet | Desktop | Notes |
|---|---|---|---|---|
| `/` | Review | Pass | Pass | Hero uses clipped `w-screen` sizing at 375px. |
| `/about` | Pass | Review | Pass | Quote card overhang at 768px and 1024px. |
| `/devotional` | **Fail** | **Fail** | Review | Experience panel and hero content do not reflow cleanly. |
| `/previous-devotionals` | Pass | Pass | Pass | Decorative overflow only. |
| `/newsfeed` | Pass | Pass | Pass | Category row scrolls horizontally by design. |
| `/forum` | Pass | Pass | Pass | No measured layout overflow. |
| `/partnership` | Pass | Pass | Pass | No measured layout overflow. |
| `/login` | Review | Pass | Pass | Google button requests fixed 380px width; third-party origin error blocked full iframe validation. |
| `/testimonials` | Pass | Pass | Pass | Decorative glow is contained. |
| `/devotional/1` | Pass* | Pass* | Pass* | Tested with an invalid ID and received the responsive not-found state. |

## Separate Environment Finding

The local Google Identity integration reported `The given origin is not allowed for the given client ID` and related `400`/`403` responses. This is an OAuth configuration issue, not a responsive-layout result. The local development origin must be added to the Google client configuration before the actual sign-in iframe can be verified.

## Recommended Fix Order

1. Reflow the `/devotional` experience panel on mobile and tablet.
2. Make the Google sign-in control fluid within the auth card.
3. Remove the home hero's dependence on clipped `w-screen` sizing.
4. Tune the `/about` quote-card overhang at tablet breakpoints.
5. Re-run the viewport sweep after implementation and inspect real devotional data at `/devotional/:id`.

## Verification Result

The Vite development server started successfully at `http://127.0.0.1:5173/`. The audit sweep completed at all four viewport sizes, and no route produced document-level horizontal scrolling. The findings above are element-level clipping and reflow risks that remain even when the page scrollbar is hidden.