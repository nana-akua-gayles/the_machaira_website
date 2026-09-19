import { Link } from "react-router-dom";

function DevotionalSidebar({ deepDiver, prayer, bibleReading, declarations }) {
  const hasAnySection =
    (deepDiver && deepDiver.length > 0) ||
    prayer ||
    (bibleReading && (bibleReading.oneYear || bibleReading.twoYear)) ||
    (declarations && declarations.length > 0);

  return (
    <aside className="devotional-sidebar">
      {hasAnySection && (
        <div className="devotional-sidebar-card">
          {deepDiver && deepDiver.length > 0 && (
            <div className="devotional-sidebar-section">
              <div className="devotional-sidebar-heading">
                <h3>DIG DEEPER</h3>
              </div>

              <ul className="devotional-sidebar-list">
                {deepDiver.map((reference) => (
                  <li key={reference}>{reference}</li>
                ))}
              </ul>
            </div>
          )}

          {prayer && (
            <div className="devotional-sidebar-section">
              <div className="devotional-sidebar-heading">
                <h3>WE PRAY</h3>
              </div>

              <p
                className="devotional-sidebar-text"
                dangerouslySetInnerHTML={{ __html: prayer }}
              />
            </div>
          )}

          {bibleReading && (bibleReading.oneYear || bibleReading.twoYear) && (
            <div className="devotional-sidebar-section">
              <div className="devotional-sidebar-heading">
                <h3>
                  BIBLE READING
                  <span>IN THE YEAR {bibleReading.year}</span>
                </h3>
              </div>

              {bibleReading.oneYear && (
                <div className="devotional-sidebar-plan">
                  <span>1 YEAR PLAN</span>
                  <p>{bibleReading.oneYear}</p>
                </div>
              )}

              {bibleReading.twoYear && (
                <div className="devotional-sidebar-plan">
                  <span>2 YEARS PLAN</span>
                  <p>{bibleReading.twoYear}</p>
                </div>
              )}
            </div>
          )}

          {declarations && declarations.length > 0 && (
            <div className="devotional-sidebar-section">
              <div className="devotional-sidebar-heading">
                <h3>DECLARE THESE WORDS</h3>
              </div>

              <ul className="devotional-sidebar-declaration-list">
                {declarations.map((declaration, index) => (
                  <li
                    key={index}
                    dangerouslySetInnerHTML={{ __html: declaration }}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Join Our Community */}
      <div className="devotional-sidebar-promo devotional-sidebar-promo-community">
        <h4>Join Our Community</h4>
        <p>Discuss, connect and grow together in faith.</p>
        <Link to="/forum" className="devotional-sidebar-promo-button">
          Join Forum
        </Link>
      </div>

      {/* Listen */}
      <div className="devotional-sidebar-promo devotional-sidebar-promo-listen">
        <div className="devotional-sidebar-promo-icon">♪</div>
        <div>
          <h4>Prefer to listen?</h4>
          <p>Listen to today's devotional and be inspired on the go.</p>
        </div>
        <a
          href="#devotional-audio"
          className="devotional-sidebar-promo-button-light"
        >
          Listen Now
        </a>
      </div>
    </aside>
  );
}

export default DevotionalSidebar;