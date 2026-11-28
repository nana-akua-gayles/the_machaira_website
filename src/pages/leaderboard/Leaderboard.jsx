
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Flame,
  Crown,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Motion & Editorial Atmosphere                                     */
/* ------------------------------------------------------------------ */

const embeddedStyles = `
@keyframes lbRise {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes lbPop {
  0% { opacity: 0; transform: scale(.96); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes lbGrow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes lbFlame {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-3px) scale(1.06); }
}
@keyframes lbCrown {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-5px) rotate(3deg); }
}
@keyframes lbDrift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(14px, -12px, 0) scale(1.05); }
}
@keyframes lbSpin { to { transform: rotate(360deg); } }
@keyframes lbSkeleton {
  0% { background-position: 150% 0; }
  100% { background-position: -150% 0; }
}
@keyframes heroTextIn {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes heroImageIn {
  from { opacity: 0; transform: translateX(24px); }
  to { opacity: 1; transform: translateX(0); }
}

.lb-rise { animation: lbRise .7s cubic-bezier(0.22, 1, 0.36, 1) both; }
.lb-pop { animation: lbPop .45s cubic-bezier(0.22, 1, 0.36, 1) both; }
.lb-grow {
  transform-origin: left;
  animation: lbGrow .9s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.lb-flame { animation: lbFlame 2s ease-in-out infinite; }
.lb-crown { animation: lbCrown 3.4s ease-in-out infinite; }
.lb-drift { animation: lbDrift 9s ease-in-out infinite; }
.lb-spin { animation: lbSpin 1s linear infinite; }
.lb-skeleton {
  background: linear-gradient(
    100deg,
    #F5F2EE 30%,
    #FFFFFF 50%,
    #F5F2EE 70%
  );
  background-size: 220% 100%;
  animation: lbSkeleton 1.6s ease-in-out infinite;
}

.hero-text-in {
  animation: heroTextIn .8s cubic-bezier(.22, 1, .36, 1) both;
}
.hero-image-in {
  animation: heroImageIn 1s cubic-bezier(.22, 1, .36, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .lb-rise, .lb-pop, .lb-grow, .lb-flame,
  .lb-crown, .lb-drift, .lb-spin, .lb-skeleton,
  .hero-text-in, .hero-image-in {
    animation: none !important;
  }
}
`;

/* ------------------------------------------------------------------ */
/*  Theme & Configuration                                             */
/* ------------------------------------------------------------------ */

const GOLD = "#B99A59";
const BURGUNDY = "#991313";

const TITLES = [
  { min: 0, name: "New Believer" },
  { min: 3, name: "Rooted" },
  { min: 7, name: "Set Apart" },
  { min: 14, name: "Word Walker" },
  { min: 30, name: "Unashamed" },
  { min: 60, name: "Unshaken" },
  { min: 100, name: "The Faithful" },
];

const MEDALS = {
  1: { color: GOLD, label: "1st" },
  2: { color: "#C8CCD4", label: "2nd" },
  3: { color: "#CC9274", label: "3rd" },
};

const formatPoints = (value) => Number(value || 0).toFixed(3);

const formatDays = (value) => {
  const n = Number(value || 0);
  return `${n} day${n === 1 ? "" : "s"}`;
};

function formatOrdinalRank(rank) {
  if (!rank || rank < 1) return "Unranked";
  if (rank === 1) return "First place";
  if (rank === 2) return "Second place";
  if (rank === 3) return "Third place";

  const mod100 = rank % 100;
  let suffix = "th";

  if (mod100 < 11 || mod100 > 13) {
    if (rank % 10 === 1) suffix = "st";
    else if (rank % 10 === 2) suffix = "nd";
    else if (rank % 10 === 3) suffix = "rd";
  }

  return `#${rank} · ${rank}${suffix}`;
}

function titleFor(streak) {
  let found = TITLES[0];

  for (const title of TITLES) {
    if (streak >= title.min) found = title;
  }

  return found;
}

function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "M"
  );
}

/*
 * Use Ghana time so the displayed month agrees with the
 * previous-month leaderboard SQL function.
 */
function previousMonthName() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());

  const year = Number(parts.find((part) => part.type === "year").value);
  const month = Number(parts.find((part) => part.type === "month").value);

  const previousMonth = new Date(Date.UTC(year, month - 2, 1));

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  }).format(previousMonth);
}

/* ------------------------------------------------------------------ */
/*  Avatar                                                            */
/* ------------------------------------------------------------------ */

function Avatar({ reader, size = 44, variant = "light" }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [reader?.avatar_url]);

  const fallbackTone =
    variant === "dark"
      ? "bg-[#2C060A] text-[#E7C988] border border-[#B99A59]/40"
      : "bg-[#FAF6F5] text-[#991313] border border-[#991313]/20";

  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full font-bold select-none ${fallbackTone}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
      }}
    >
      {reader?.avatar_url && !failed ? (
        <img
          src={reader.avatar_url}
          alt={reader.name || "Reader"}
          loading="eager"
          decoding="sync"
          className="h-full w-full object-cover object-center"
          onError={() => setFailed(true)}
        />
      ) : (
        initials(reader?.name)
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Previous Month Champion Hero                                      */
/* ------------------------------------------------------------------ */
function SovereignHero({ reader }) {
  const month = previousMonthName();

  if (!reader) {
    return (
      <section className="relative isolate w-full overflow-hidden bg-white text-[#111827]">
        <div className="relative mx-auto min-h-[600px] max-w-[1440px] overflow-hidden sm:min-h-[560px] lg:min-h-[540px]">

          {/* Community artwork */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[57%] sm:h-[72%] lg:inset-y-0 lg:left-[38%] lg:right-0 lg:h-full">
            <img
              src="/machaira-champion-team.png"
              alt="Machaira community members celebrating together with a trophy"
              className="hero-image-in absolute bottom-0 right-0 h-full w-full object-contain object-bottom brightness-[0.86] contrast-[1.10] saturate-[0.90] lg:object-right-bottom"
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Editorial typography */}
          <div className="relative z-10 flex min-h-[600px] flex-col justify-center px-6 pb-[265px] pt-12 sm:min-h-[560px] sm:px-12 sm:pb-[235px] lg:min-h-[540px] lg:max-w-[790px] lg:pb-10 lg:pl-20 lg:pr-0">

            <h1
              className="hero-text-in max-w-[680px] text-[46px] font-bold leading-[1.08] tracking-[-2px] text-[#991313] sm:text-[60px] lg:text-[72px]"
              style={{ animationDelay: "120ms" }}
            >
              A heart that stays
              <span className="block text-[#111827]">
                rooted in the Word.
              </span>
            </h1>

            <p
              className="hero-text-in mt-6 max-w-[510px] text-[16px] leading-[1.9] text-[#4D5057] sm:mt-7 sm:text-[18px] sm:leading-[1.9]"
              style={{ animationDelay: "260ms" }}
            >
              Some of the deepest growth happens quietly, one
              EPISODE at a time.
              Keep returning to the Word. Let its radical truth shape
              your heart, renew your mind, guide your steps, and transform
              you.
            </p>

            <p
              className="hero-text-in mt-6 max-w-[490px] text-[16px] font-semibold leading-[1.8] text-[#991313] sm:mt-7 sm:text-[18px]"
              style={{ animationDelay: "400ms" }}
            >
              Your journey of faithfulness is worth celebrating. </p><br />
              <p>BE THE NEXT WINNER FOR THE MONTH! </p>
            
          </div>
        </div>
      </section>
    );
  }

  const name = reader.name || "Machaira Reader";
  const days = Number(reader.monthly_streak || 0);

  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-gradient-to-br from-[#270307] via-[#6B0D13] to-[#1A0204] px-6 py-16 text-white sm:px-12 lg:px-20">
      <div className="lb-drift pointer-events-none absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-[#991313]/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-36 right-0 h-[480px] w-[480px] rounded-full bg-[#B99A59]/15 blur-[120px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] items-center gap-12 lg:grid-cols-[1.25fr_auto] lg:gap-16">
        <div className="lb-rise">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold tracking-[3.2px] text-[#E7C988]">
              MONTHLY CHAMPION
            </span>
            <span className="h-3.5 w-px bg-white/25" />
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-white/65">
              {month}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[66px]">
            {name}
          </h1>

          <div className="mt-6 flex flex-wrap items-baseline gap-4">
            <span className="text-6xl font-bold tracking-tight text-[#E7C988] sm:text-7xl">
              {days}
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-[2.4px] text-white">
                {days === 1 ? "CONSECUTIVE DAY" : "CONSECUTIVE DAYS"}
              </span>
              <span className="mt-1 text-xs text-white/65">
                Recorded during {month}
              </span>
            </div>
          </div>

          <div className="my-8 h-px w-full max-w-2xl bg-gradient-to-r from-[#B99A59] via-white/25 to-transparent" />

          <div className="max-w-2xl space-y-4 text-sm leading-8 text-white/85 sm:text-base sm:leading-8">
            <p>
              Consistency is built one day at a time.{" "}
              <strong className="font-semibold text-white">{name}</strong>{" "}
              achieved the leading consecutive reading streak in the
              Machaira community during {month}.
            </p>
            <p className="font-medium text-[#F5E0B3]">
              This recognition celebrates a commitment to engaging with
              Scripture. Your own consistency can put you among the
              readers recognised in a coming month.
            </p>
          </div>
        </div>

        <div
          className="lb-rise flex flex-col items-center lg:items-end"
          style={{ animationDelay: "120ms" }}
        >
          <div className="relative flex flex-col items-center">
            <Avatar reader={reader} size={228} variant="dark" />
            <span className="mt-5 text-[10px] font-bold uppercase tracking-[2.8px] text-[#E7C988]">
              Machaira Champion
            </span>
            <span className="mt-1 text-xs text-white/60">
              Recognised for consistency
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ------------------------------------------------------------------ */
/*  Podium                                                            */
/* ------------------------------------------------------------------ */

function Podium({ readers, valueKey, formatValue }) {
  const slots = [
    { reader: readers[1], rank: 2, height: 88 },
    { reader: readers[0], rank: 1, height: 122 },
    { reader: readers[2], rank: 3, height: 66 },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#3E070C] via-[#2B0408] to-[#1A0204] px-4 pt-10 text-white sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,154,89,.2),transparent_65%)]" />

      <div className="relative mx-auto flex max-w-[640px] items-end justify-center gap-3 sm:gap-7">
        {slots.map(({ reader, rank, height }) => {
          if (!reader) return <div key={rank} className="w-1/3" />;

          const medal = MEDALS[rank];
          const winner = rank === 1;

          return (
            <div
              key={reader.id}
              className="group flex w-1/3 max-w-[188px] flex-col items-center"
            >
              <div className="lb-rise flex w-full flex-col items-center text-center transition-transform duration-300 group-hover:-translate-y-1">
                {winner ? (
                  <Crown
                    size={26}
                    className="lb-crown mb-2 text-[#E7C988]"
                    fill="#B99A59"
                    strokeWidth={1.2}
                  />
                ) : (
                  <div className="mb-[26px]" />
                )}

                <Avatar
                  reader={reader}
                  size={winner ? 86 : 66}
                  variant="dark"
                />

                <strong className="mt-4 max-w-full truncate text-xs font-bold text-white sm:text-sm">
                  {reader.name || "Machaira Reader"}
                </strong>

                <span
                  className="mt-1 text-[11px] font-semibold sm:text-xs"
                  style={{ color: medal.color }}
                >
                  {formatValue(reader[valueKey])}
                </span>
              </div>

              <div
                className="relative mt-4 flex w-full items-start justify-center pt-3 text-2xl font-bold transition-all duration-300 group-hover:brightness-110 sm:text-3xl"
                style={{
                  height,
                  color: medal.color,
                  borderTop: `2px solid ${medal.color}`,
                  background: `linear-gradient(180deg, ${medal.color}30, ${medal.color}06)`,
                }}
              >
                {rank}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Standing Callout                                                  */
/* ------------------------------------------------------------------ */

function StandingBand({ me, above, valueKey, formatValue }) {
  let message;

  if (me.rank === 1) {
    message =
      "You command the lead. Keep your consistency going and maintain your position.";
  } else if (above) {
    const diff = Number(above[valueKey]) - Number(me[valueKey]);
    const aboveName = above.name || "the reader ahead";

    message =
      diff > 0
        ? `${
            valueKey === "score"
              ? `${diff.toFixed(3)} pts`
              : formatDays(diff)
          } separate you from passing ${aboveName}. Keep going.`
        : `Dead even with ${aboveName}. Your next reading could make the difference.`;
  } else {
    message = "Open today's Scripture and make your mark.";
  }

  return (
    <div className="lb-pop my-7 flex flex-col justify-between gap-4 border-y border-[#991313]/25 bg-[#FCF8F8] px-4 py-5 sm:flex-row sm:items-center sm:px-6">
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold uppercase tracking-[2px] text-[#991313]">
          {formatOrdinalRank(me.rank)}
        </span>

        <span className="h-4 w-px bg-[#991313]/25" />

        <p className="flex items-center gap-2 text-sm font-medium text-[#221919]">
          <TrendingUp size={16} className="shrink-0 text-[#991313]" />
          <span>{message}</span>
        </p>
      </div>

      <span className="text-xs font-bold tracking-[1.8px] text-[#991313]">
        {formatValue(me[valueKey]).toUpperCase()}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ranking Rows                                                      */
/* ------------------------------------------------------------------ */

function RankRow({ reader, index, max, valueKey, unit, isMe }) {
  const pct =
    max > 0
      ? Math.max(4, (Number(reader[valueKey]) / max) * 100)
      : 0;

  return (
    <div
      className={`lb-rise group relative flex items-center gap-3 px-3 py-4 transition-colors duration-200 sm:gap-5 sm:px-5 ${
        isMe ? "bg-[#FCF4F4]" : "hover:bg-[#FAF7F6]"
      }`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {isMe && (
        <span className="absolute inset-y-2 left-0 w-[3px] bg-[#991313]" />
      )}

      <span
        className={`w-7 shrink-0 text-center text-sm font-bold ${
          isMe ? "text-[#991313]" : "text-[#8A7C78]"
        }`}
      >
        {reader.rank}
      </span>

      <Avatar reader={reader} size={44} variant="light" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <strong className="truncate text-sm font-semibold text-[#221919] transition-colors group-hover:text-[#991313]">
            {reader.name || "Machaira Reader"}
          </strong>

          {isMe && (
            <span className="text-[9px] font-bold uppercase tracking-[1.8px] text-[#991313]">
              · YOU
            </span>
          )}
        </div>

        <div className="mt-2 h-[4px] overflow-hidden bg-[#EFE9E6]">
          <div
            className="lb-grow h-full bg-gradient-to-r from-[#991313] to-[#B99A59]"
            style={{
              width: `${pct}%`,
              animationDelay: `${index * 40 + 140}ms`,
            }}
          />
        </div>

        <p className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-[#7A6D68]">
          <Flame size={11} className="text-[#991313]" />
          {Number(reader.current_streak || 0)} day streak
        </p>
      </div>

      <div className="shrink-0 text-right">
        <strong className="block text-sm font-bold text-[#991313] sm:text-base">
          {valueKey === "score"
            ? formatPoints(reader[valueKey])
            : Number(reader[valueKey] || 0)}
        </strong>

        <span className="text-[9px] font-bold tracking-[1.6px] text-[#8E807B]">
          {unit}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Daily Standings                                                   */
/* ------------------------------------------------------------------ */

function DailyStandings({ dailyReaders, currentUserId }) {
  const valueKey = "score";
  const unit = "PTS";
  const formatValue = (value) => `${formatPoints(value)} pts`;

  const ranked = useMemo(
    () =>
      dailyReaders.map((reader, index) => ({
        ...reader,
        rank: index + 1,
      })),
    [dailyReaders]
  );

  const topThree = ranked.slice(0, 3);
  const nextTen = ranked.slice(3, 13);

  const me = ranked.find((reader) => reader.id === currentUserId);
  const above = me && me.rank > 1 ? ranked[me.rank - 2] : null;
  const max = ranked.length ? Number(ranked[0][valueKey]) : 0;

  return (
    <section id="daily-standings" className="lb-rise pt-4">
      {me && (
        <StandingBand
          me={me}
          above={above}
          valueKey={valueKey}
          formatValue={formatValue}
        />
      )}

      {ranked.length > 0 ? (
        <div className="mt-6">
          <div className="mb-7 flex items-center justify-between">
            <span className="text-[15px] font-bold tracking-[2.4px] text-[#8A7C78]">
              TOP THREE CONSISTENT READERS
            </span>
          </div>

          <Podium
            readers={topThree}
            valueKey={valueKey}
            formatValue={formatValue}
          />

          {nextTen.length > 0 && (
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between border-b border-[#E6DFDC] px-3 pb-2.5 sm:px-5">
                <span className="text-[10px] font-bold tracking-[2.4px] text-[#8A7C78]">
                  NEXT TEN READERS
                </span>

                <span className="text-[10px] font-bold tracking-wider text-[#991313]">
                  {nextTen.length} OF 10
                </span>
              </div>

              <div className="divide-y divide-[#EFE9E6]">
                {nextTen.map((reader, index) => (
                  <RankRow
                    key={reader.id}
                    reader={reader}
                    index={index}
                    max={max}
                    valueKey={valueKey}
                    unit={unit}
                    isMe={reader.id === currentUserId}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 border-y border-dashed border-[#DFD5D0] py-16 text-center">
          <Flame
            size={30}
            strokeWidth={1.4}
            className="mx-auto mb-3 text-[#991313]"
          />

          <h3 className="text-lg font-bold text-[#221919]">
            The daily altar awaits its first reader
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#6E625E]">
            Step into today's Scripture to begin building your reading
            consistency.
          </p>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Personal Streak Ring                                              */
/* ------------------------------------------------------------------ */

function StreakRing({ current, prev, next, size = 164 }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  const progress = next
    ? Math.min(1, Math.max(0, (current - prev) / (next - prev)))
    : 1;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 130 130" className="h-full w-full -rotate-90">
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="#EFE7E4"
          strokeWidth="7"
        />

        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke={BURGUNDY}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Flame
          size={22}
          className="lb-flame text-[#991313]"
          fill="#991313"
          strokeWidth={1.4}
        />

        <strong className="mt-1 text-4xl font-bold leading-none text-[#221919]">
          {current}
        </strong>

        <span className="mt-2 text-[9px] font-bold tracking-[1.8px] text-[#8A7C78]">
          DAY STREAK
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Weekly Check-ins                                                  */
/* ------------------------------------------------------------------ */

function WeeklyCheckins({ lastActiveDate, currentStreak }) {
  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = lastActiveDate
      ? new Date(`${lastActiveDate}T00:00:00`)
      : null;

    if (lastActive) lastActive.setHours(0, 0, 0, 0);

    const daysSinceLastActive = lastActive
      ? Math.floor((today - lastActive) / 86400000)
      : null;

    const streakIsLive =
      daysSinceLastActive !== null && daysSinceLastActive <= 1;

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const daysBeforeLastActive = lastActive
        ? Math.floor((lastActive - date) / 86400000)
        : null;

      const isActive =
        streakIsLive &&
        daysBeforeLastActive !== null &&
        daysBeforeLastActive >= 0 &&
        daysBeforeLastActive < currentStreak;

      days.push({
        dayName: date
          .toLocaleDateString("en-US", { weekday: "short" })
          .toUpperCase(),
        dateNum: date.getDate(),
        isActive,
      });
    }

    return days;
  }, [lastActiveDate, currentStreak]);

  return (
    <div className="border-t border-[#E6DFDC] pt-7">
      <h3 className="mt-1 text-xl font-bold text-[#221919]">
        Weekly check-ins
      </h3>

      <div className="mt-5 grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center gap-2 py-3.5 transition-transform duration-200 hover:-translate-y-0.5 ${
              day.isActive
                ? "bg-[#991313] text-white"
                : "border border-[#E6DFDC] bg-white text-[#7A6D68]"
            }`}
          >
            <span className="text-[9px] font-bold tracking-wider">
              {day.dayName}
            </span>

            <strong className="text-base">{day.dateNum}</strong>

            {day.isActive ? (
              <Flame
                size={13}
                fill="#E7C988"
                className="text-[#E7C988]"
              />
            ) : (
              <span className="h-[13px]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Personal Record                                                   */
/* ------------------------------------------------------------------ */

function PersonalRecord({ reader, dailyRank, monthlyRank }) {
  return (
    <div className="border-t border-[#E6DFDC] pt-7">
      <h3 className="mt-1 text-xl font-bold text-[#221919]">
        Points &amp; Rankings
      </h3>

      <div className="mt-5 grid grid-cols-2 gap-6 border-b border-[#EFE9E6] pb-5">
        <div>
          <span className="block text-[9px] font-bold tracking-[1.8px] text-[#991313]">
            DAILY POINTS
          </span>

          <strong className="mt-1 block text-2xl font-bold text-[#221919]">
            {formatPoints(reader?.score)}
          </strong>
        </div>

        <div>
          <span className="block text-[9px] font-bold tracking-[1.8px] text-[#8A7C78]">
            LONGEST STREAK
          </span>

          <strong className="mt-1 block text-2xl font-bold text-[#221919]">
            {Number(reader?.longest_streak || 0)}
          </strong>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-6">
        <div>
          <span className="block text-[9px] font-bold tracking-[1.8px] text-[#8A7C78]">
            DAILY RANK
          </span>

          <strong className="mt-1.5 block text-base font-bold text-[#991313]">
            {formatOrdinalRank(dailyRank)}
          </strong>
        </div>

        <div>
          <span className="block text-[9px] font-bold tracking-[1.8px] text-[#8A7C78]">
            PREVIOUS MONTH RANK
          </span>

          <strong className="mt-1.5 block text-base font-bold text-[#221919]">
            {formatOrdinalRank(monthlyRank)}
          </strong>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Player Current Streak Section                                     */
/* ------------------------------------------------------------------ */

function PlayerWatch({ reader, onRefresh, loading }) {
  const current = Number(reader?.current_streak || 0);

  const title = titleFor(current);

  const nextMilestone =
    TITLES.slice(1).find((item) => item.min > current) || null;

  const prevMilestone =
    [...TITLES].reverse().find((item) => item.min <= current)?.min ?? 0;

  const daysToNext = nextMilestone ? nextMilestone.min - current : 0;

  return (
    <div className="border-t border-[#E6DFDC] pt-8">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#221919] sm:text-3xl">
            Build your consistency
          </h2>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh rankings"
          className="grid h-10 w-10 place-items-center rounded-full border border-[#DFD5D0] bg-white text-[#991313] transition hover:border-[#991313] hover:bg-[#991313] hover:text-white disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "lb-spin" : ""}
          />
        </button>
      </div>

      <div className="grid items-center gap-8 md:grid-cols-[auto_1fr] md:gap-12">
        <div className="mx-auto md:mx-0">
          <StreakRing
            current={current}
            prev={prevMilestone}
            next={nextMilestone?.min}
          />
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold leading-tight text-[#221919] sm:text-3xl">
            {nextMilestone ? (
              <>
                {daysToNext} more{" "}
                {daysToNext === 1 ? "day" : "days"} to{" "}
                <span className="text-[#991313]">
                  {nextMilestone.name}
                </span>
              </>
            ) : (
              <>
                You have reached{" "}
                <span className="text-[#991313]">The Faithful</span>
              </>
            )}
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#6E625E] md:mx-0">
            {current > 0
              ? `You are currently on a ${formatDays(current)} reading streak. Keep your consistency going by completing each day's devotional. Your next milestone is ${nextMilestone?.name || "The Faithful"}.`
              : "Your next streak begins with today's devotional. Complete your reading and start building a consistent daily habit."}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 border-b-2 border-[#991313] pb-1.5 text-xs font-bold uppercase tracking-[1.6px] text-[#991313]">
            Current level: {title.name}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading State                                                     */
/* ------------------------------------------------------------------ */

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#FAF8F6] p-6 sm:p-12">
      <div className="mx-auto max-w-[1120px] space-y-8">
        <div className="lb-skeleton h-[78vh] w-full" />
        <div className="lb-skeleton h-48 w-full" />
        <div className="lb-skeleton h-64 w-full" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                         */
/* ------------------------------------------------------------------ */

export default function Leaderboard() {
  const [monthlyReaders, setMonthlyReaders] = useState([]);
  const [dailyReaders, setDailyReaders] = useState([]);
  const [currentReader, setCurrentReader] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeaderboards = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        { data: authData, error: authError },
        { data: monthlyData, error: monthlyError },
        { data: dailyData, error: dailyError },
      ] = await Promise.all([
        supabase.auth.getUser(),

        // Previous completed calendar month.
        supabase.rpc("get_previous_month_devotional_leaderboard"),

        // Existing overall streak/points leaderboard.
        supabase.rpc("enforce_streak_resets_and_get_leaderboard"),
      ]);

      if (authError) throw authError;
      if (monthlyError) throw monthlyError;
      if (dailyError) throw dailyError;

      const userId = authData?.user?.id || null;
      const allDailyReaders = Array.isArray(dailyData)
        ? dailyData
        : [];

      setCurrentUserId(userId);

      setCurrentReader(
        allDailyReaders.find((reader) => reader.id === userId) || null
      );

      const qualifiedMonthly = (
        Array.isArray(monthlyData) ? monthlyData : []
      )
        .filter((reader) => Number(reader.monthly_streak) > 0)
        .sort((a, b) => {
          const difference =
            Number(b.monthly_streak) - Number(a.monthly_streak);

          if (difference !== 0) return difference;

          return (
            new Date(a.reached_score_at || 0).getTime() -
            new Date(b.reached_score_at || 0).getTime()
          );
        });

      const qualifiedDaily = allDailyReaders
        .filter((reader) => Number(reader.score) > 0)
        .sort((a, b) => Number(b.score) - Number(a.score));

      setMonthlyReaders(qualifiedMonthly);
      setDailyReaders(qualifiedDaily);
    } catch (err) {
      console.error("Leaderboard loading error:", err);
      setError("We couldn't load the rankings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboards();
  }, [loadLeaderboards]);

  const dailyRank = useMemo(() => {
    const index = dailyReaders.findIndex(
      (reader) => reader.id === currentUserId
    );

    return index >= 0 ? index + 1 : null;
  }, [dailyReaders, currentUserId]);

  const monthlyRank = useMemo(() => {
    const index = monthlyReaders.findIndex(
      (reader) => reader.id === currentUserId
    );

    return index >= 0 ? index + 1 : null;
  }, [monthlyReaders, currentUserId]);

  const monthlyWinner = monthlyReaders[0] || null;

  return (
    <main className="min-h-screen w-full bg-[#FAF8F6] text-[#221919]">
      <style>{embeddedStyles}</style>

      {loading &&
      !currentReader &&
      !monthlyReaders.length &&
      !dailyReaders.length ? (
        <LoadingState />
      ) : error ? (
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-md border-t-2 border-[#991313] bg-white px-8 py-12 text-center">
            <Flame size={28} className="mx-auto mb-4 text-[#991313]" />

            <p className="text-sm font-medium text-[#221919]">
              {error}
            </p>

            <button
              type="button"
              onClick={loadLeaderboards}
              className="mt-6 bg-[#991313] px-6 py-3 text-xs font-bold uppercase tracking-[1.8px] text-white transition hover:bg-[#770D0D]"
            >
              Try again
            </button>
          </div>
        </div>
      ) : (
        <>
          <SovereignHero reader={monthlyWinner} />

          <div className="mx-auto max-w-[1120px] space-y-12 px-5 py-12 sm:px-8 sm:py-16">
            <DailyStandings
              dailyReaders={dailyReaders}
              currentUserId={currentUserId}
            />

            <PlayerWatch
              reader={currentReader}
              onRefresh={loadLeaderboards}
              loading={loading}
            />

            <div className="grid gap-10 md:grid-cols-2 md:gap-12">
              <WeeklyCheckins
                lastActiveDate={currentReader?.last_devotional_date}
                currentStreak={Number(
                  currentReader?.current_streak || 0
                )}
              />

              <PersonalRecord
                reader={currentReader}
                dailyRank={dailyRank}
                monthlyRank={monthlyRank}
              />
            </div>
          </div>
        </>
      )}
    </main>
  );
}
