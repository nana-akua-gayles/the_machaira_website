import { useEffect, useState } from "react";

import DevotionalHero from "./devotionalFeatures/DevotionalHero";
import DevotionalExperience from "./devotionalFeatures/DevotionalExperience";
import DevotionalRecentList from "./devotionalFeatures/DevotionalRecentList";
import DevotionalTopics from "./devotionalFeatures/DevotionalTopics";

import {
  getTodaysDevotional,
  getDevotionalByDate,
  getRecentDevotionals,
} from "../../lib/devotionalService";

function getTodayDate() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());

  const values = {};

  parts.forEach(({ type, value }) => {
    if (type !== "literal") {
      values[type] = value;
    }
  });

  return `${values.year}-${values.month}-${values.day}`;
}

function Devotional() {
  const [devotional, setDevotional] = useState(null);

  // Always start with today's calendar date.
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [recentDevotionals, setRecentDevotionals] = useState([]);

  useEffect(() => {
    async function loadTodaysDevotional() {
      try {
        setLoading(true);
        setError(null);

        const data = await getTodaysDevotional();

        setSelectedDate(getTodayDate());
        setDevotional(data);
      } catch (err) {
        console.error("DEVOTIONAL LOAD FAILED:", err);
        setError("Unable to load today's devotional.");
      } finally {
        setLoading(false);
      }
    }

    loadTodaysDevotional();
  }, []);

  useEffect(() => {
    async function loadRecentDevotionals() {
      try {
        // Fetch a couple extra so we can drop today's episode from
        // the list (it's already shown above) and still land on 6.
        const data = await getRecentDevotionals(4);
        setRecentDevotionals(data);
      } catch (err) {
        console.error("RECENT DEVOTIONALS LOAD FAILED:", err);
      }
    }

    loadRecentDevotionals();
  }, []);

  async function handleDateSelect(date) {
    try {
      setLoading(true);
      setError(null);

      setSelectedDate(date);

      const data = await getDevotionalByDate(date);
      setDevotional(data);
    } catch (err) {
      console.error("DATE DEVOTIONAL LOAD FAILED:", err);
      setError("Unable to load the devotional for this date.");
    } finally {
      setLoading(false);
    }
  }

  const recentToShow = recentDevotionals
    .filter((item) => item.id !== devotional?.id)
    .slice(0, 4);

  return (
    <main className="devotional-page bg-white">
      <section className="relative">
        <DevotionalHero
          devotional={devotional}
          loading={loading}
          error={error}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        <div className="pointer-events-none absolute right-8 top-16 z-20 lg:right-10">
          <div className="pointer-events-auto">
            <DevotionalExperience />
          </div>
        </div>
      </section>

      <DevotionalRecentList devotionals={recentToShow} />

      <DevotionalTopics />
    </main>
  );
}

export default Devotional;