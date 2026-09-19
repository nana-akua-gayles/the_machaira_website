import { Link } from "react-router-dom";

function DevotionalPrevNext({ previous, next }) {
  if (!previous && !next) {
    return null;
  }

  return (
    <div className="devotional-prev-next">
      {previous ? (
        <Link
          to={`/devotional/${previous.id}`}
          className="devotional-prev-next-item devotional-prev-next-prev"
        >
          <span className="devotional-prev-next-icon">‹</span>
          <div>
            <p className="devotional-prev-next-label">Previous Episode</p>
            <p className="devotional-prev-next-title">{previous.title}</p>
            <p className="devotional-prev-next-date">{previous.date}</p>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          to={`/devotional/${next.id}`}
          className="devotional-prev-next-item devotional-prev-next-next"
        >
          <div>
            <p className="devotional-prev-next-label">Next Episode</p>
            <p className="devotional-prev-next-title">{next.title}</p>
            <p className="devotional-prev-next-date">{next.date}</p>
          </div>
          <span className="devotional-prev-next-icon">›</span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

export default DevotionalPrevNext;