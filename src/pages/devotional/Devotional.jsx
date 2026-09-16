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

  // Always start with today's calendar date.
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

        /*
         * Keep today's date selected regardless of
         * whether today's devotional exists.
         */
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

  async function handleDateSelect(date) {
    try {
      setLoading(true);
      setError(null);

      console.log("SELECTED DATE:", date);

      /*
       * Change the calendar immediately.
       * This means the date card updates even if
       * there is no devotional for this date.
       */
      setSelectedDate(date);

      const data = await getDevotionalByDate(date);

      console.log("DEVOTIONAL FOR SELECTED DATE:", data);

      /*
       * data can legitimately be null.
       *
       * null means:
       * "There is no Machaira/devotional on this date."
       *
       * The UI will then show the recap experience.
       */
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