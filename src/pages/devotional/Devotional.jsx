import { useEffect, useState } from "react";

import DevotionalHero from "./devotionalFeatures/DevotionalHero";
import DevotionalExperience from "./devotionalFeatures/DevotionalExperience";
import DevotionalTopics from "./devotionalFeatures/DevotionalTopics";

import {
  getTodaysDevotional,
  getDevotionalByDate,
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
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTodaysDevotional() {
      try {
        setLoading(true);
        setError(null);

        const data = await getTodaysDevotional();

        console.log("TODAY'S DEVOTIONAL:", data);

        setDevotional(data);

        // If today's devotional exists, use its actual date.
        if (data?.created_at) {
          const date = new Date(data.created_at)
            .toISOString()
            .split("T")[0];

          setSelectedDate(date);
        }
      } catch (err) {
        console.error("DEVOTIONAL LOAD FAILED:", err);
        setError("Unable to load today's devotional.");
      } finally {
        setLoading(false);
      }
    }

    loadTodaysDevotional();
  }, []);

  async function handleDateSelect(date) {
    try {
      setLoading(true);
      setError(null);

      console.log("SELECTED DATE:", date);

      const data = await getDevotionalByDate(date);

      console.log("DEVOTIONAL FOR SELECTED DATE:", data);

      setSelectedDate(date);
      setDevotional(data);
    } catch (err) {
      console.error("DATE DEVOTIONAL LOAD FAILED:", err);
      setError("Unable to load the devotional for this date.");
    } finally {
      setLoading(false);
    }
  }

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

      <DevotionalTopics />
    </main>
  );
}

export default Devotional;